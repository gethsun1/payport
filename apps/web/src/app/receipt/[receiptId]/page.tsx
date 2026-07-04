import { ReceiptProofCard } from "@/components/receipt/receipt-proof-card";
import { ErrorState } from "@/components/ui/state";
import { apiClient } from "@/lib/api/client";

export const dynamic = "force-dynamic";

export default async function ReceiptPage({ params }: { params: { receiptId: string } }) {
  try {
    const receipt = await apiClient.getReceipt(params.receiptId);
    return (
      <section className="mx-auto max-w-4xl px-4 py-8">
        <ReceiptProofCard receipt={receipt} />
      </section>
    );
  } catch (error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10">
        <ErrorState
          title="Receipt unavailable"
          message={error instanceof Error ? error.message : "The backend could not load this receipt."}
        />
      </section>
    );
  }
}
