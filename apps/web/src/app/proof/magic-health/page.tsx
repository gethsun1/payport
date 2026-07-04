import { KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MagicHealthPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            Magic health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Magic integration is scheduled for Phase 4.</p>
          <p>Required public env: `NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY`.</p>
          <p>Email OTP comes first; Google login follows once OAuth origins are configured.</p>
        </CardContent>
      </Card>
    </section>
  );
}
