import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const rows = [
  ["Magic wallet", "Pending Phase 4"],
  ["Particle UA address", "Pending Phase 5"],
  ["Particle transaction ID", "Pending Phase 5"],
  ["Arbitrum One contract", "Configure after deployment"],
  ["Settlement tx hash", "Pending Phase 6"]
];

export function ProofPlaceholderGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Final proof package</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col justify-between gap-1 rounded-md bg-slate-50 p-3 text-sm sm:flex-row">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
