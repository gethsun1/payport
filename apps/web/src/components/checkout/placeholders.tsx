import { LockKeyhole, Network, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    icon: LockKeyhole,
    title: "Authentication pending",
    message: "Magic email/Google login will be connected in Phase 4."
  },
  {
    icon: Wallet,
    title: "Payment pending",
    message: "Particle Universal Account payment will be connected in Phase 5."
  },
  {
    icon: Network,
    title: "Settlement pending",
    message: "Arbitrum settlement recording will be connected in Phase 6."
  }
];

export function CheckoutPlaceholderAuth() {
  return <PlaceholderCard index={0} />;
}

export function CheckoutPlaceholderPayment() {
  return <PlaceholderCard index={1} />;
}

export function CheckoutPlaceholderSettlement() {
  return <PlaceholderCard index={2} />;
}

function PlaceholderCard({ index }: { index: number }) {
  const item = items[index] ?? items[0]!;
  const Icon = item.icon;
  return (
    <Card>
      <CardContent className="flex gap-3 p-5">
        <div className="grid h-10 w-10 flex-none place-items-center rounded-md bg-slate-100 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">{item.title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
