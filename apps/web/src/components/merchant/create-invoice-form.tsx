"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publicEnv } from "@/lib/config/env";
import { apiClient } from "@/lib/api/client";
import { InvoiceFormSchema } from "@/lib/validators/forms";
import type { Invoice, Product } from "@/types/api";

export function CreateInvoiceForm({ merchantId, products }: { merchantId: string; products: Product[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [checkoutLink, setCheckoutLink] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setMessage(null);
    const productId = formData.get("productId")?.toString() || null;
    const parsed = InvoiceFormSchema.safeParse({
      merchantId,
      productId,
      amountUsd: formData.get("amountUsd")
    });

    if (!parsed.success) {
      setPending(false);
      setMessage(parsed.error.issues[0]?.message ?? "Invalid invoice data.");
      return;
    }

    try {
      const invoice: Invoice = await apiClient.createInvoice(parsed.data);
      setCheckoutLink(`${publicEnv.NEXT_PUBLIC_APP_URL}/checkout/${invoice.id}`);
      router.refresh();
      setMessage("Invoice created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create invoice.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="grid gap-3 md:grid-cols-3">
          <select name="productId" className="rounded-md border border-border px-3 py-2">
            <option value="">Custom invoice</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <input name="amountUsd" placeholder="Amount USD" className="rounded-md border border-border px-3 py-2" />
          <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create invoice"}
          </Button>
        </form>
        {message ? <p className="mt-3 text-sm text-muted-foreground">{message}</p> : null}
        {checkoutLink ? (
          <p className="mt-3 break-all text-sm">
            Checkout link:{" "}
            <Link href={checkoutLink} className="text-primary">
              {checkoutLink}
            </Link>
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
