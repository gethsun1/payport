import { createPublicClient, http, getAddress, type Hex } from "viem";
import { arbitrum } from "viem/chains";
import { env } from "./env.js";

export const settlementAbi = [
  {
    type: "function",
    name: "getSettlement",
    stateMutability: "view",
    inputs: [{ name: "invoiceId", type: "string" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "invoiceId", type: "string" },
          { name: "buyer", type: "address" },
          { name: "merchant", type: "address" },
          { name: "amountUsdCents", type: "uint256" },
          { name: "particleTxRef", type: "bytes32" },
          { name: "particleTransactionId", type: "string" },
          { name: "settled", type: "bool" },
          { name: "settledAt", type: "uint256" }
        ]
      }
    ]
  }
] as const;

export function getArbitrumClient() {
  if (!env.ARBITRUM_ONE_RPC_URL) return null;
  return createPublicClient({
    chain: arbitrum,
    transport: http(env.ARBITRUM_ONE_RPC_URL)
  });
}

export function getSettlementContractAddress() {
  if (!env.ARBITRUM_ONE_SETTLEMENT_CONTRACT_ADDRESS) return null;
  return getAddress(env.ARBITRUM_ONE_SETTLEMENT_CONTRACT_ADDRESS) as Hex;
}
