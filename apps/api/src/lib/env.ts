import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:3000"),
  PAYPORT_API_SECRET: z.string().optional(),
  ARBITRUM_ONE_RPC_URL: z.string().optional(),
  SETTLEMENT_EXECUTOR_MAINNET_PRIVATE_KEY: z.string().optional(),
  ETHERSCAN_API_KEY: z.string().optional(),
  PARTICLE_PROJECT_ID: z.string().optional(),
  PARTICLE_CLIENT_KEY: z.string().optional(),
  PARTICLE_APP_UUID: z.string().optional(),
  ARBITRUM_ONE_SETTLEMENT_CONTRACT_ADDRESS: z.string().optional()
});

export const env = EnvSchema.parse(process.env);
export const apiVersion = "0.1.0";
