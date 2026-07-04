import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const navItems = [
  { href: "/checkout/demo-invoice", label: "Checkout" },
  { href: "/merchant", label: "Merchant" },
  { href: "/proof", label: "Proof" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-white/86 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </span>
          PayPort
        </Link>
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 hover:bg-slate-100 hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
