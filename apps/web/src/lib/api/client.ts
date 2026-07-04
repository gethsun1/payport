import { publicEnv } from "@/lib/config/env";
import type { HealthResponse, Invoice, Product, Receipt } from "@/types/api";
import type { z } from "zod";
import type { InvoiceFormSchema, ProductFormSchema } from "@/lib/validators/forms";

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
  }
}

type RequestOptions = RequestInit & { timeoutMs?: number };

async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 8000);

  try {
    const response = await fetch(`${publicEnv.NEXT_PUBLIC_API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        ...options.headers
      },
      cache: "no-store"
    });

    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const error =
        payload && typeof payload === "object" && "error" in payload && payload.error && typeof payload.error === "object"
          ? (payload.error as { code?: string; message?: string })
          : null;
      throw new ApiClientError(
        response.status,
        error?.code ?? "api_error",
        error?.message ?? `Request failed with status ${response.status}`
      );
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiClientError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError(408, "request_timeout", "The API request timed out.");
    }
    throw new ApiClientError(0, "network_error", error instanceof Error ? error.message : "Network error");
  } finally {
    clearTimeout(timeout);
  }
}

function jsonPost<T>(path: string, body: unknown) {
  return apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export const apiClient = {
  getHealth: () => apiFetch<HealthResponse>("/health"),
  getDbHealth: () => apiFetch<HealthResponse>("/health/db"),
  getArbitrumHealth: () => apiFetch<HealthResponse>("/health/arbitrum"),
  getInvoice: (invoiceId: string) => apiFetch<Invoice>(`/api/invoices/${invoiceId}`),
  listInvoices: (merchantId?: string) =>
    apiFetch<Invoice[]>(`/api/invoices${merchantId ? `?merchantId=${encodeURIComponent(merchantId)}` : ""}`),
  createInvoice: (data: z.infer<typeof InvoiceFormSchema>) => jsonPost<Invoice>("/api/invoices", data),
  listProducts: (merchantId?: string) =>
    apiFetch<Product[]>(`/api/products${merchantId ? `?merchantId=${encodeURIComponent(merchantId)}` : ""}`),
  createProduct: (data: z.infer<typeof ProductFormSchema>) => jsonPost<Product>("/api/products", data),
  getReceipt: (receiptId: string) => apiFetch<Receipt>(`/api/receipts/${receiptId}`),
  getLatestProof: () => apiFetch<HealthResponse>("/api/proof/latest")
};
