import { CheckCircle2, CircleDashed } from "lucide-react";

const steps = [
  { label: "Invoice loaded", complete: true },
  { label: "Wallet login", complete: false },
  { label: "Universal Account ready", complete: false },
  { label: "Settlement proof", complete: false },
  { label: "Receipt unlocked", complete: false }
];

export function CheckoutProgress() {
  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <h2 className="text-base font-semibold">Checkout progress</h2>
      <div className="mt-4 space-y-3">
        {steps.map((step) => (
          <div key={step.label} className="flex items-center gap-3 text-sm">
            {step.complete ? (
              <CheckCircle2 className="h-4 w-4 text-accent" />
            ) : (
              <CircleDashed className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={step.complete ? "text-foreground" : "text-muted-foreground"}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
