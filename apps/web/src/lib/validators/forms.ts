import { CreateInvoiceSchema, CreateProductSchema } from "@payport/shared";

export const ProductFormSchema = CreateProductSchema.pick({
  merchantId: true,
  name: true,
  description: true,
  priceUsd: true,
  unlockType: true,
  unlockValue: true
});

export const InvoiceFormSchema = CreateInvoiceSchema.pick({
  merchantId: true,
  productId: true,
  amountUsd: true
});
