import type { FastifyInstance } from "fastify";
import { zeroAddress } from "viem";
import { apiVersion, env } from "../lib/env.js";
import { prisma } from "../lib/prisma.js";
import { getArbitrumClient, getSettlementContractAddress } from "../lib/arbitrum.js";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({
    ok: true,
    version: apiVersion,
    environment: env.NODE_ENV,
    networkMode: env.NODE_ENV === "production" ? "proof" : "development"
  }));

  app.get("/health/db", async () => {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, database: "reachable" };
  });

  app.get("/health/arbitrum", async () => {
    const client = getArbitrumClient();
    const contractAddress = getSettlementContractAddress();

    if (!client) {
      return {
        ok: false,
        rpc: "missing_config",
        contract: contractAddress ? "configured" : "missing_config"
      };
    }

    const blockNumber = await client.getBlockNumber();
    return {
      ok: true,
      chainId: await client.getChainId(),
      latestBlock: blockNumber.toString(),
      rpc: "reachable",
      contract: contractAddress && contractAddress !== zeroAddress ? "configured" : "missing_config"
    };
  });
}
