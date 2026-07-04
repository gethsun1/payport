import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUsd, shortAddress } from "@/lib/format/money";
import type { Receipt } from "@/types/api";

export function ReceiptProofCard({ receipt }: { receipt: Receipt }) {
  const settlementPending = !receipt.settlementTxHash;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receipt proof</CardTitle>
        <p className="text-sm text-muted-foreground">
          {settlementPending ? "Settlement proof pending" : "Settlement evidence recorded"}
        </p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <ProofRow label="Amount" value={formatUsd(receipt.amountUsd)} />
        <ProofRow label="Buyer" value={shortAddress(receipt.buyerAddress)} />
        <ProofRow label="Merchant" value={shortAddress(receipt.merchantAddress)} />
        <ProofRow label="Particle transaction" value={receipt.particleTransactionId ?? "Pending"} />
        <ProofRow label="Arbitrum settlement tx" value={receipt.settlementTxHash ?? "Pending"} />
        <ProofRow label="Contract" value={receipt.settlement?.contractAddress ?? "Pending"} />
        <ProofRow label="Unlock status" value={receipt.unlockStatus} />
        {receipt.settlementTxHash ? (
          <a
            href={`https://arbiscan.io/tx/${receipt.settlementTxHash}`}
            className="inline-flex items-center gap-2 text-primary"
            target="_blank"
            rel="noreferrer"
          >
            Open settlement transaction
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ProofRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-between gap-1 rounded-md bg-slate-50 p-3 sm:flex-row">
      <span className="text-muted-foreground">{label}</span>
      <span className="break-all font-medium">{value}</span>
    </div>
  );
}
