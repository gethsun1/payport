import { Database, KeyRound, Network, WalletCards } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cards = [
  {
    title: "Particle Universal Accounts",
    description: "Mainnet proof path planned for Phase 5 with EIP-7702 authorization handling.",
    icon: Network
  },
  {
    title: "Magic embedded onboarding",
    description: "Email and Google wallet onboarding is scheduled for Phase 4.",
    icon: KeyRound
  },
  {
    title: "Arbitrum settlement proof",
    description: "Foundry settlement contract records invoice evidence without custody.",
    icon: WalletCards
  },
  {
    title: "Railway backend",
    description: "Fastify and Prisma preserve payment attempts, settlement records, and receipts.",
    icon: Database
  }
];

export function TrackComplianceCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader>
                <div className="mb-2 grid h-10 w-10 place-items-center rounded-md bg-slate-100 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
