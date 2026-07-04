import Link from "next/link";
import { InvoiceTable } from "@/components/merchant/invoice-table";
import { MerchantStatsCards } from "@/components/merchant/merchant-stats-cards";
import { RecentSettlementsTable } from "@/components/merchant/recent-settlements-table";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/state";
import { apiClient } from "@/lib/api/client";

const demoMerchantId = "demo-merchant";

export const dynamic = "force-dynamic";

export default async function MerchantPage() {
  try {
    const invoices = await apiClient.listInvoices(demoMerchantId);
    return (
      <section className="mx-auto max-w-6xl space-y-5 px-4 py-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">Merchant overview</h1>
            <p className="mt-2 text-sm text-muted-foreground">Live backend data for demo merchant records.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/merchant/products">
              <Button variant="secondary">Products</Button>
            </Link>
            <Link href="/merchant/invoices">
              <Button>Invoices</Button>
            </Link>
          </div>
        </div>
        <MerchantStatsCards invoices={invoices} />
        <InvoiceTable invoices={invoices} />
        <RecentSettlementsTable invoices={invoices} />
      </section>
    );
  } catch (error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10">
        <ErrorState title="Merchant dashboard unavailable" message={error instanceof Error ? error.message : "API error"} />
      </section>
    );
  }
}
