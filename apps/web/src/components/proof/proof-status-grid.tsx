import { CheckCircle2, CircleDashed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProofStatusGrid({ contractVerified }: { contractVerified: boolean }) {
  const items = [
    { label: "Backend scaffold complete", done: true },
    { label: "Contract implemented", done: true },
    { label: contractVerified ? "Contract build/test verified" : "Contract build/test pending", done: contractVerified },
    { label: "Frontend scaffold complete", done: true },
    { label: "Magic pending", done: false },
    { label: "Particle pending", done: false },
    { label: "Arbitrum settlement writer pending", done: false }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track checklist</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 rounded-md bg-slate-50 p-3 text-sm">
            {item.done ? (
              <CheckCircle2 className="h-4 w-4 text-accent" />
            ) : (
              <CircleDashed className="h-4 w-4 text-muted-foreground" />
            )}
            {item.label}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
