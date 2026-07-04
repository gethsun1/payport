# PayPort Architecture

PayPort has three proof surfaces: the buyer checkout, the Railway backend, and the Arbitrum One settlement contract.

## Data Flow

1. Buyer opens a checkout link in the Next.js app.
2. Buyer authenticates with Magic email OTP or Google.
3. Frontend resolves the embedded wallet address.
4. Frontend initializes Particle Universal Account in EIP-7702 mode.
5. Frontend creates a payment attempt in the Fastify API.
6. Frontend prepares, authorizes, signs, and broadcasts the Particle UA transaction.
7. Frontend updates the payment attempt with Particle evidence.
8. Backend verifies the attempt is confirmed before settlement.
9. Backend writes settlement evidence to Arbitrum One with a server-only key.
10. Backend creates a receipt only after payment proof and settlement proof exist.
11. `/proof` displays the latest complete evidence package.

## Services

- `apps/web`: Next.js frontend, starting in Phase 3.
- `apps/api`: Fastify API with Prisma and viem.
- `packages/shared`: Shared zod schemas, constants, and types.
- `contracts`: Foundry project, starting in Phase 2.

## Proof Rule

No route should claim a payment or receipt is successful unless both conditions are true:

- Particle transaction evidence exists.
- Arbitrum settlement evidence exists.
