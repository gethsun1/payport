import { HeroSection } from "@/components/landing/hero-section";
import { TrackComplianceCards } from "@/components/landing/track-compliance-cards";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-10 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-xl font-semibold">Buyer simplicity</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Buyers should not bridge, switch networks, manage gas, or install browser wallets. The current shell shows
            the checkout flow and honest pending states before Magic and Particle are connected.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-xl font-semibold">Merchant proof</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Merchants need a receipt they can trust. PayPort stores app-side payment evidence and records settlement
            proof through a simple Arbitrum contract.
          </p>
        </div>
      </section>
      <TrackComplianceCards />
    </>
  );
}
