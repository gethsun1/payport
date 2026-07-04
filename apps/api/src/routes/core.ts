import type { FastifyInstance } from "fastify";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  CreateInvoiceSchema,
  CreateMerchantSchema,
  CreatePaymentAttemptSchema,
  CreateProductSchema,
  CreateReceiptSchema,
  CreateUserSchema,
  RecordSettlementSchema,
  UpdateInvoiceStatusSchema,
  UpdatePaymentAttemptSchema
} from "@payport/shared";
import { ApiError, parseBody, parseParams } from "../lib/http.js";
import { prisma } from "../lib/prisma.js";
import { safeJson } from "../lib/serialize.js";
import { getSettlementContractAddress } from "../lib/arbitrum.js";
import { env } from "../lib/env.js";

const IdParams = z.object({ id: z.string().min(1) });

export async function coreRoutes(app: FastifyInstance) {
  app.post("/api/users/upsert", async (request) => {
    const body = parseBody(CreateUserSchema, request.body);
    return prisma.user.upsert({
      where: { walletAddress: body.walletAddress },
      update: { email: body.email, authProvider: body.authProvider },
      create: body
    });
  });

  app.post("/api/merchants", async (request) => {
    const body = parseBody(CreateMerchantSchema, request.body);
    return prisma.merchant.create({ data: body });
  });

  app.get("/api/merchants/:id", async (request) => {
    const { id } = parseParams(IdParams, request.params);
    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: { products: true, invoices: { orderBy: { createdAt: "desc" }, take: 10 } }
    });
    if (!merchant) throw new ApiError(404, "merchant_not_found", "Merchant not found");
    return merchant;
  });

  app.post("/api/products", async (request) => {
    const body = parseBody(CreateProductSchema, request.body);
    return prisma.product.create({
      data: {
        merchantId: body.merchantId,
        name: body.name,
        description: body.description ?? "",
        priceUsd: body.priceUsd,
        unlockType: body.unlockType ?? "digital",
        unlockValue: body.unlockValue,
        active: body.active ?? true
      }
    });
  });

  app.get("/api/products", async (request) => {
    const query = z.object({ merchantId: z.string().optional() }).parse(request.query);
    return prisma.product.findMany({
      where: query.merchantId ? { merchantId: query.merchantId } : undefined,
      orderBy: { createdAt: "desc" }
    });
  });

  app.post("/api/invoices", async (request) => {
    const body = parseBody(CreateInvoiceSchema, request.body);
    return prisma.invoice.create({
      data: { ...body, status: "open" },
      include: { merchant: true, product: true }
    });
  });

  app.get("/api/invoices", async (request) => {
    const query = z.object({ merchantId: z.string().optional() }).parse(request.query);
    return safeJson(
      await prisma.invoice.findMany({
        where: query.merchantId ? { merchantId: query.merchantId } : undefined,
        include: {
          merchant: true,
          product: true,
          paymentAttempts: { orderBy: { createdAt: "desc" }, take: 3 },
          settlements: { orderBy: { createdAt: "desc" }, take: 3 },
          receipts: { orderBy: { createdAt: "desc" }, take: 3 }
        },
        orderBy: { createdAt: "desc" },
        take: 50
      })
    );
  });

  app.get("/api/invoices/:id", async (request) => {
    const { id } = parseParams(IdParams, request.params);
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { merchant: true, product: true, paymentAttempts: true, receipts: true }
    });
    if (!invoice) throw new ApiError(404, "invoice_not_found", "Invoice not found");
    return safeJson(invoice);
  });

  app.patch("/api/invoices/:id/status", async (request) => {
    const { id } = parseParams(IdParams, request.params);
    const body = parseBody(UpdateInvoiceStatusSchema, request.body);
    return prisma.invoice.update({ where: { id }, data: { status: body.status } });
  });

  app.post("/api/payment-attempts", async (request) => {
    const body = parseBody(CreatePaymentAttemptSchema, request.body);
    const invoice = await prisma.invoice.findUnique({ where: { id: body.invoiceId } });
    if (!invoice) throw new ApiError(404, "invoice_not_found", "Invoice not found");
    if (!["open", "payment_started"].includes(invoice.status)) {
      throw new ApiError(409, "invoice_not_payable", "Invoice is not open for payment");
    }

    const attempt = await prisma.paymentAttempt.create({
      data: {
        invoiceId: body.invoiceId,
        buyerAddress: body.buyerAddress,
        uaAddress: body.uaAddress,
        sourceAsset: body.sourceAsset,
        destinationChainId: body.destinationChainId ?? 42161,
        status: "created"
      }
    });
    await prisma.invoice.update({ where: { id: body.invoiceId }, data: { status: "payment_started" } });
    return attempt;
  });

  app.patch("/api/payment-attempts/:id", async (request) => {
    const { id } = parseParams(IdParams, request.params);
    const body = parseBody(UpdatePaymentAttemptSchema, request.body);
    const attempt = await prisma.paymentAttempt.update({
      where: { id },
      data: {
        ...body,
        userOpsJson:
          body.userOpsJson === undefined
            ? undefined
            : body.userOpsJson === null
              ? Prisma.JsonNull
              : (body.userOpsJson as Prisma.InputJsonValue)
      }
    });

    if (body.status === "confirmed") {
      await prisma.invoice.update({
        where: { id: attempt.invoiceId },
        data: { status: "payment_confirmed" }
      });
    }

    return safeJson(attempt);
  });

  app.post("/api/settlements/record", async (request) => {
    const body = parseBody(RecordSettlementSchema, request.body);
    const attempt = await prisma.paymentAttempt.findUnique({
      where: { id: body.paymentAttemptId },
      include: { invoice: { include: { merchant: true } } }
    });
    if (!attempt) throw new ApiError(404, "attempt_not_found", "Payment attempt not found");
    if (attempt.status !== "confirmed" || !attempt.particleTransactionId) {
      throw new ApiError(409, "payment_not_confirmed", "Settlement requires confirmed Particle payment proof");
    }

    const contractAddress = getSettlementContractAddress();
    if (!contractAddress || !env.SETTLEMENT_EXECUTOR_MAINNET_PRIVATE_KEY || !env.ARBITRUM_ONE_RPC_URL) {
      await prisma.invoice.update({
        where: { id: attempt.invoiceId },
        data: { status: "settlement_pending" }
      });
      throw new ApiError(503, "settlement_not_configured", "Arbitrum settlement writer is not configured");
    }

    throw new ApiError(501, "settlement_contract_pending", "Contract write will be enabled in Phase 6");
  });

  app.post("/api/receipts", async (request) => {
    const body = parseBody(CreateReceiptSchema, request.body);
    const attempt = await prisma.paymentAttempt.findUnique({
      where: { id: body.paymentAttemptId },
      include: { invoice: { include: { merchant: true } }, settlements: true }
    });
    if (!attempt || attempt.invoiceId !== body.invoiceId) {
      throw new ApiError(404, "attempt_not_found", "Matching payment attempt not found");
    }

    const settlement = attempt.settlements.find((item) => item.status === "recorded");
    if (attempt.status !== "confirmed" || !attempt.particleTransactionId || !settlement) {
      throw new ApiError(409, "proof_incomplete", "Receipt requires payment proof and settlement proof");
    }

    const receipt = await prisma.receipt.create({
      data: {
        invoiceId: attempt.invoiceId,
        paymentAttemptId: attempt.id,
        settlementId: settlement.id,
        buyerAddress: attempt.buyerAddress,
        merchantAddress: attempt.invoice.merchant.settlementAddress,
        amountUsd: attempt.invoice.amountUsd,
        particleTransactionId: attempt.particleTransactionId,
        settlementTxHash: settlement.txHash,
        unlockStatus: "unlocked"
      }
    });
    await prisma.invoice.update({ where: { id: attempt.invoiceId }, data: { status: "unlocked" } });
    return safeJson(receipt);
  });

  app.get("/api/receipts/:id", async (request) => {
    const { id } = parseParams(IdParams, request.params);
    const receipt = await prisma.receipt.findUnique({
      where: { id },
      include: { invoice: { include: { merchant: true, product: true } }, settlement: true, paymentAttempt: true }
    });
    if (!receipt) throw new ApiError(404, "receipt_not_found", "Receipt not found");
    return safeJson(receipt);
  });

  app.get("/api/proof/latest", async () => {
    const receipt = await prisma.receipt.findFirst({
      where: {
        particleTransactionId: { not: null },
        settlementTxHash: { not: null },
        unlockStatus: "unlocked"
      },
      orderBy: { createdAt: "desc" },
      include: { invoice: { include: { merchant: true, product: true } }, settlement: true, paymentAttempt: true }
    });

    return safeJson({
      ok: Boolean(receipt),
      networkMode: env.NODE_ENV === "production" ? "proof" : "development",
      latestReceipt: receipt,
      environment: {
        database: "configured",
        arbitrumRpc: env.ARBITRUM_ONE_RPC_URL ? "configured" : "missing_config",
        settlementContract: getSettlementContractAddress() ? "configured" : "missing_config",
        particleServerConfig: env.PARTICLE_PROJECT_ID && env.PARTICLE_CLIENT_KEY && env.PARTICLE_APP_UUID ? "configured" : "missing_config",
        magic: "frontend_only"
      }
    });
  });

  app.post("/api/jobs/retry-settlement", async () => {
    const pending = await prisma.paymentAttempt.findMany({
      where: {
        status: "confirmed",
        particleTransactionId: { not: null },
        settlements: { none: { status: "recorded" } }
      },
      orderBy: { updatedAt: "asc" },
      take: 25
    });

    return {
      ok: true,
      retryableCount: pending.length,
      note: "Phase 1 reports retryable records. Phase 6 will perform Arbitrum writes."
    };
  });
}
