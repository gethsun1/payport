import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/state";
import { shortAddress } from "@/lib/format/money";
import type { Invoice, Settlement } from "@/types/api";

export function RecentSettlementsTable({ invoices }: { invoices: Invoice[] }) {
  const settlements = invoices.flatMap((invoice) =>
    (invoice.settlements ?? []).map((settlement) => ({ ...settlement, invoiceId: invoice.id }))
  );

  if (settlements.length === 0) {
    return <EmptyState title="No settlement proofs yet" message="Real settlement records will appear after Phase 6." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent settlement proofs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {settlements.map((settlement: Settlement) => (
          <div key={settlement.id} className="rounded-md bg-slate-50 p-3 text-sm">
            <div className="font-medium">{settlement.invoiceId}</div>
            <div className="mt-1 text-muted-foreground">{shortAddress(settlement.txHash)}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
