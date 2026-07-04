import { CreateProductForm } from "@/components/merchant/create-product-form";
import { ProductTable } from "@/components/merchant/product-table";
import { ErrorState } from "@/components/ui/state";
import { apiClient } from "@/lib/api/client";

const demoMerchantId = "demo-merchant";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  try {
    const products = await apiClient.listProducts(demoMerchantId);
    return (
      <section className="mx-auto max-w-6xl space-y-5 px-4 py-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">Products</h1>
          <p className="mt-2 text-sm text-muted-foreground">Create products for PayPort checkout links.</p>
        </div>
        <CreateProductForm merchantId={demoMerchantId} />
        <ProductTable products={products} />
      </section>
    );
  } catch (error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10">
        <ErrorState title="Products unavailable" message={error instanceof Error ? error.message : "API error"} />
      </section>
    );
  }
}
