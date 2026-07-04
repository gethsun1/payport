import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./lib/env.js";
import { sendError } from "./lib/http.js";
import { healthRoutes } from "./routes/health.js";
import { coreRoutes } from "./routes/core.js";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
      redact: [
        "req.headers.authorization",
        "req.headers.cookie",
        "body.privateKey",
        "body.SETTLEMENT_EXECUTOR_MAINNET_PRIVATE_KEY"
      ]
    }
  });

  await app.register(cors, {
    origin: env.FRONTEND_ORIGIN,
    credentials: true
  });

  app.setErrorHandler((error, _request, reply) => sendError(reply, error));

  await app.register(healthRoutes);
  await app.register(coreRoutes);

  return app;
}
