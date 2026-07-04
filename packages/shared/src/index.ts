import { z } from "zod";

export const NETWORK_MODES = ["development", "proof"] as const;
export const INVOICE_STATUSES = [
  "draft",
  "open",
  "payment_started",
  "payment_confirmed",
  "settlement_pending",
  "settlement_recorded",
  "unlocked",
  "failed",
  "expired"
] as const;
export const PAYMENT_STATUSES = [
  "created",
  "ua_ready",
  "balance_resolved",
  "transaction_prepared",
  "authorization_requested",
  "signed",
  "broadcast",
  "confirmed",
  "failed"
] as const;

export const NetworkModeSchema = z.enum(NETWORK_MODES);
export const InvoiceStatusSchema = z.enum(INVOICE_STATUSES);
export const PaymentStatusSchema = z.enum(PAYMENT_STATUSES);

export const AddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Expected EVM address");
export const HexSchema = z.string().regex(/^0x[a-fA-F0-9]+$/, "Expected hex string");
export const PositiveUsdSchema = z.coerce.number().positive().max(100_000);

export const CreateUserSchema = z.object({
  email: z.string().email().optional().nullable(),
  authProvider: z.string().min(1).max(64),
  walletAddress: AddressSchema
});

export const CreateMerchantSchema = z.object({
  displayName: z.string().min(1).max(120),
  settlementAddress: AddressSchema
});

export const CreateProductSchema = z.object({
  merchantId: z.string().min(1),
  name: z.string().min(1).max(160),
  description: z.string().max(1000).optional().default(""),
  priceUsd: PositiveUsdSchema,
  unlockType: z.string().min(1).max(64).default("digital"),
  unlockValue: z.string().max(1000).optional().nullable(),
  active: z.boolean().optional().default(true)
});

export const CreateInvoiceSchema = z.object({
  merchantId: z.string().min(1),
  productId: z.string().min(1).optional().nullable(),
  buyerUserId: z.string().min(1).optional().nullable(),
  amountUsd: PositiveUsdSchema,
  expiresAt: z.coerce.date().optional().nullable()
});

export const UpdateInvoiceStatusSchema = z.object({
  status: InvoiceStatusSchema
});

export const CreatePaymentAttemptSchema = z.object({
  invoiceId: z.string().min(1),
  buyerAddress: AddressSchema,
  uaAddress: AddressSchema.optional().nullable(),
  sourceAsset: z.string().max(128).optional().nullable(),
  destinationChainId: z.coerce.number().int().positive().default(42161)
});

export const UpdatePaymentAttemptSchema = z.object({
  uaAddress: AddressSchema.optional().nullable(),
  sourceAsset: z.string().max(128).optional().nullable(),
  particleTransactionId: z.string().max(256).optional().nullable(),
  rootHash: HexSchema.optional().nullable(),
  userOpsJson: z.unknown().optional().nullable(),
  authorizationCount: z.coerce.number().int().nonnegative().optional().nullable(),
  status: PaymentStatusSchema.optional(),
  errorMessage: z.string().max(2000).optional().nullable()
});

export const CreateReceiptSchema = z.object({
  invoiceId: z.string().min(1),
  paymentAttemptId: z.string().min(1)
});

export const RecordSettlementSchema = z.object({
  paymentAttemptId: z.string().min(1)
});

export type NetworkMode = z.infer<typeof NetworkModeSchema>;
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
