"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api/client";
import { ProductFormSchema } from "@/lib/validators/forms";

export function CreateProductForm({ merchantId }: { merchantId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setMessage(null);
    const parsed = ProductFormSchema.safeParse({
      merchantId,
      name: formData.get("name"),
      description: formData.get("description") || "",
      priceUsd: formData.get("priceUsd"),
      unlockType: formData.get("unlockType") || "digital",
      unlockValue: formData.get("unlockValue") || null
    });

    if (!parsed.success) {
      setPending(false);
      setMessage(parsed.error.issues[0]?.message ?? "Invalid product data.");
      return;
    }

    try {
      await apiClient.createProduct(parsed.data);
      router.refresh();
      setMessage("Product created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create product.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create product</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="grid gap-3 md:grid-cols-2">
          <input name="name" placeholder="Product name" className="rounded-md border border-border px-3 py-2" />
          <input name="priceUsd" placeholder="Price USD" className="rounded-md border border-border px-3 py-2" />
          <input name="unlockType" placeholder="Unlock type" className="rounded-md border border-border px-3 py-2" />
          <input name="unlockValue" placeholder="Unlock value" className="rounded-md border border-border px-3 py-2" />
          <textarea
            name="description"
            placeholder="Description"
            className="min-h-24 rounded-md border border-border px-3 py-2 md:col-span-2"
          />
          <div className="flex items-center gap-3 md:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create product"}
            </Button>
            {message ? <span className="text-sm text-muted-foreground">{message}</span> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
