import { notFound } from "next/navigation";
import { CheckoutProgress } from "@/components/checkout/checkout-progress";
import { InvoiceSummaryCard } from "@/components/checkout/invoice-summary-card";
import {
  CheckoutPlaceholderAuth,
  CheckoutPlaceholderPayment,
  CheckoutPlaceholderSettlement
} from "@/components/checkout/placeholders";
import { ErrorState } from "@/components/ui/state";
import { ApiClientError, apiClient } from "@/lib/api/client";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }: { params: { invoiceId: string } }) {
  try {
    const invoice = await apiClient.getInvoice(params.invoiceId);
    return (
      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <InvoiceSummaryCard invoice={invoice} />
          <CheckoutProgress />
        </div>
        <div className="space-y-4">
          <CheckoutPlaceholderAuth />
          <CheckoutPlaceholderPayment />
          <CheckoutPlaceholderSettlement />
        </div>
      </section>
    );
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) notFound();
    return (
      <section className="mx-auto max-w-3xl px-4 py-10">
        <ErrorState
          title="Checkout is unavailable"
          message={error instanceof Error ? error.message : "The backend could not load this invoice."}
        />
      </section>
    );
  }
}
