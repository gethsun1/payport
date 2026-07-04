import { FileText, ReceiptText, ShieldCheck, WalletCards } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Invoice } from "@/types/api";

export function MerchantStatsCards({ invoices }: { invoices: Invoice[] }) {
  const paymentAttempts = invoices.reduce((sum, invoice) => sum + (invoice.paymentAttempts?.length ?? 0), 0);
  const settlements = invoices.reduce((sum, invoice) => sum + (invoice.settlements?.length ?? 0), 0);
  const receipts = invoices.reduce((sum, invoice) => sum + (invoice.receipts?.length ?? 0), 0);

  const cards = [
    { label: "Total invoices", value: invoices.length, icon: FileText },
    { label: "Payment attempts", value: paymentAttempts, icon: WalletCards },
    { label: "Settlements", value: settlements, icon: ShieldCheck },
    { label: "Receipts", value: receipts, icon: ReceiptText }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold">{card.value}</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-md bg-slate-100 text-primary">
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
