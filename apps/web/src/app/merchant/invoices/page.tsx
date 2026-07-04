import { CreateInvoiceForm } from "@/components/merchant/create-invoice-form";
import { InvoiceTable } from "@/components/merchant/invoice-table";
import { ErrorState } from "@/components/ui/state";
import { apiClient } from "@/lib/api/client";

const demoMerchantId = "demo-merchant";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  try {
    const [invoices, products] = await Promise.all([
      apiClient.listInvoices(demoMerchantId),
      apiClient.listProducts(demoMerchantId)
    ]);
    return (
      <section className="mx-auto max-w-6xl space-y-5 px-4 py-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">Invoices</h1>
          <p className="mt-2 text-sm text-muted-foreground">Generate checkout links without simulating payment status.</p>
        </div>
        <CreateInvoiceForm merchantId={demoMerchantId} products={products} />
        <InvoiceTable invoices={invoices} />
      </section>
    );
  } catch (error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10">
        <ErrorState title="Invoices unavailable" message={error instanceof Error ? error.message : "API error"} />
      </section>
    );
  }
}
