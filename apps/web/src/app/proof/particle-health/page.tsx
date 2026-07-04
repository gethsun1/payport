import { Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ParticleHealthPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Particle Universal Accounts health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Particle UA integration is scheduled for Phase 5.</p>
          <p>Required public envs: `NEXT_PUBLIC_PARTICLE_PROJECT_ID`, `NEXT_PUBLIC_PARTICLE_CLIENT_KEY`, `NEXT_PUBLIC_PARTICLE_APP_UUID`.</p>
          <p>Final proof mode is mainnet-only and should use tiny-value proof wallets.</p>
        </CardContent>
      </Card>
    </section>
  );
}
