import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const merchant = await prisma.merchant.upsert({
    where: { id: "demo-merchant" },
    update: {},
    create: {
      id: "demo-merchant",
      displayName: "PayPort Demo Merchant",
      settlementAddress: "0x0000000000000000000000000000000000000001"
    }
  });

  const product = await prisma.product.upsert({
    where: { id: "demo-product" },
    update: {},
    create: {
      id: "demo-product",
      merchantId: merchant.id,
      name: "Hackathon Proof Pass",
      description: "Tiny-value checkout used to prove PayPort end to end.",
      priceUsd: "0.10",
      unlockType: "demo",
      unlockValue: "PayPort proof content",
      active: true
    }
  });

  await prisma.invoice.upsert({
    where: { id: "demo-invoice" },
    update: {},
    create: {
      id: "demo-invoice",
      merchantId: merchant.id,
      productId: product.id,
      amountUsd: "0.10",
      status: "open"
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
