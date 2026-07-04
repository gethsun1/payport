import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUsd } from "@/lib/format/money";
import type { Invoice } from "@/types/api";

export function InvoiceSummaryCard({ invoice }: { invoice: Invoice }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{invoice.product?.name ?? "PayPort invoice"}</CardTitle>
        <p className="text-sm text-muted-foreground">{invoice.merchant?.displayName ?? "Merchant pending"}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <span className="text-sm text-muted-foreground">Amount</span>
          <span className="text-3xl font-semibold">{formatUsd(invoice.amountUsd)}</span>
        </div>
        <div className="rounded-md bg-slate-50 p-3 text-sm text-muted-foreground">
          Status: <span className="font-medium text-foreground">{invoice.status}</span>
        </div>
        {invoice.product?.description ? (
          <p className="text-sm leading-6 text-muted-foreground">{invoice.product.description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
