import { HealthCheckCard } from "@/components/proof/health-check-card";
import { apiClient } from "@/lib/api/client";

export const dynamic = "force-dynamic";

async function measure<T>(fn: () => Promise<T>) {
  const start = Date.now();
  try {
    const data = await fn();
    return { ok: true, data, latencyMs: Date.now() - start };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unknown error", latencyMs: Date.now() - start };
  }
}

export default async function BackendHealthPage() {
  const [api, db, arbitrum] = await Promise.all([
    measure(apiClient.getHealth),
    measure(apiClient.getDbHealth),
    measure(apiClient.getArbitrumHealth)
  ]);

  return (
    <section className="mx-auto max-w-5xl space-y-5 px-4 py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Backend health</h1>
        <p className="mt-2 text-sm text-muted-foreground">Safe health checks only. No secrets are exposed.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <HealthCheckCard
          title="API"
          ok={api.ok}
          latencyMs={api.latencyMs}
          detail={api.ok ? "API reachable." : (api.error ?? "API request failed.")}
        />
        <HealthCheckCard
          title="Database"
          ok={db.ok}
          latencyMs={db.latencyMs}
          detail={db.ok ? "Database reachable." : (db.error ?? "Database request failed.")}
        />
        <HealthCheckCard
          title="Arbitrum"
          ok={arbitrum.ok}
          latencyMs={arbitrum.latencyMs}
          detail={arbitrum.ok ? "RPC health endpoint responded." : (arbitrum.error ?? "Arbitrum request failed.")}
        />
      </div>
    </section>
  );
}
