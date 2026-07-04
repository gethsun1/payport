"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-6"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          Particle UA proof path, Magic onboarding, Arbitrum evidence
        </div>
        <div className="space-y-4">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
            Cross-chain checkout without cross-chain confusion
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            PayPort gives buyers a familiar checkout and gives merchants durable settlement proof on Arbitrum. The final
            proof mode uses tiny-value mainnet transactions, fresh proof wallets, and no fake success states.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/checkout/demo-invoice">
            <Button>
              Open demo checkout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/proof">
            <Button variant="secondary">View judge proof</Button>
          </Link>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="overflow-hidden rounded-lg border border-border bg-white shadow-soft"
      >
        <Image
          src="/payport.png"
          alt="PayPort product cover"
          width={1200}
          height={800}
          priority
          className="h-auto w-full object-cover"
        />
      </motion.div>
    </section>
  );
}
