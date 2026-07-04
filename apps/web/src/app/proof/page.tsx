import settlementAbi from "@payport/shared/abi/PayPortSettlement.json";
import Link from "next/link";
import { HealthCheckCard } from "@/components/proof/health-check-card";
import { ProofPlaceholderGrid } from "@/components/proof/proof-placeholder-grid";
import { ProofStatusGrid } from "@/components/proof/proof-status-grid";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/client";
import { publicEnv } from "@/lib/config/env";

export const dynamic = "force-dynamic";

export default async function ProofPage() {
  const [health, dbHealth] = await Promise.allSettled([apiClient.getHealth(), apiClient.getDbHealth()]);
  const contractVerified = false;
  const abiPresent = Array.isArray(settlementAbi) && settlementAbi.length > 0;

  return (
    <section className="mx-auto max-w-6xl space-y-5 px-4 py-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">Judge proof dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Current mode: {publicEnv.NEXT_PUBLIC_PAYPORT_NETWORK_MODE}. Later phases will attach real Magic, Particle,
            and settlement evidence.
          </p>
        </div>
        <Link href="/proof/backend-health">
          <Button variant="secondary">Backend health</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <HealthCheckCard
          title="API"
          ok={health.status === "fulfilled" && Boolean(health.value.ok)}
          detail={health.status === "fulfilled" ? `Environment ${health.value.environment ?? "unknown"}` : health.reason.message}
        />
        <HealthCheckCard
          title="Database"
          ok={dbHealth.status === "fulfilled" && Boolean(dbHealth.value.ok)}
          detail={dbHealth.status === "fulfilled" ? "Database health endpoint responded." : dbHealth.reason.message}
        />
        <HealthCheckCard
          title="Contract ABI"
          ok={abiPresent}
          detail={abiPresent ? `${settlementAbi.length} ABI entries available to the app.` : "ABI missing."}
        />
      </div>
      <ProofPlaceholderGrid />
      <ProofStatusGrid contractVerified={contractVerified} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/proof/magic-health">
          <Button variant="secondary" className="w-full">
            Magic health
          </Button>
        </Link>
        <Link href="/proof/particle-health">
          <Button variant="secondary" className="w-full">
            Particle health
          </Button>
        </Link>
      </div>
    </section>
  );
}
