import type { FastifyReply } from "fastify";
import { ZodError, type ZodSchema } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
  }
}

export function parseBody<T>(schema: ZodSchema<T>, body: unknown): T {
  return schema.parse(body);
}

export function parseParams<T>(schema: ZodSchema<T>, params: unknown): T {
  return schema.parse(params);
}

export function sendError(reply: FastifyReply, error: unknown) {
  if (error instanceof ApiError) {
    return reply.status(error.statusCode).send({
      error: { code: error.code, message: error.message }
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: {
        code: "validation_error",
        message: "Request validation failed",
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      }
    });
  }

  console.error(error);
  return reply.status(500).send({
    error: { code: "internal_error", message: "Unexpected server error" }
  });
}
