import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "error" },
    { emit: "event", level: "warn" }
  ]
});

prisma.$on("error", (event) => {
  console.error("prisma_error", event.message);
});

prisma.$on("warn", (event) => {
  console.warn("prisma_warn", event.message);
});
