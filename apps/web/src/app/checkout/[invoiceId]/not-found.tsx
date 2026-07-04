import Link from "next/link";
import { EmptyState } from "@/components/ui/state";
import { Button } from "@/components/ui/button";

export default function CheckoutNotFound() {
  return (
    <section className="mx-auto max-w-3xl space-y-4 px-4 py-10">
      <EmptyState title="Invoice not found" message="This checkout link does not match an open PayPort invoice." />
      <Link href="/">
        <Button variant="secondary">Return home</Button>
      </Link>
    </section>
  );
}
