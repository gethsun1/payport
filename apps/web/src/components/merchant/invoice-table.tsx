import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/state";
import { formatUsd } from "@/lib/format/money";
import type { Invoice } from "@/types/api";

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return <EmptyState title="No invoices yet" message="Create an invoice to generate a checkout link." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent invoices</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-muted-foreground">
            <tr>
              <th className="py-2 font-medium">Invoice</th>
              <th className="py-2 font-medium">Product</th>
              <th className="py-2 font-medium">Amount</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium">Checkout</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="py-3 font-medium">{invoice.id}</td>
                <td className="py-3">{invoice.product?.name ?? "Custom invoice"}</td>
                <td className="py-3">{formatUsd(invoice.amountUsd)}</td>
                <td className="py-3">{invoice.status}</td>
                <td className="py-3">
                  <Link href={`/checkout/${invoice.id}`} className="text-primary">
                    Open checkout
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
