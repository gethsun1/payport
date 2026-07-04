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

- `apps/web`: Next.js frontend shell with landing, checkout, merchant, receipt, and proof routes.
- `apps/api`: Fastify API with Prisma and viem.
- `packages/shared`: Shared zod schemas, constants, and types.
- `contracts`: Foundry project for the Arbitrum settlement evidence contract.

## Frontend Routes

- `/`: landing page and track compliance summary.
- `/checkout/[invoiceId]`: real invoice fetch with Magic, Particle, and settlement placeholders.
- `/receipt/[receiptId]`: receipt proof display without fake settlement success.
- `/merchant`: merchant overview from backend invoice data.
- `/merchant/products`: list and create products.
- `/merchant/invoices`: list and create invoices with checkout links.
- `/proof`: judge proof dashboard.
- `/proof/backend-health`: Fastify, database, and Arbitrum health checks.
- `/proof/magic-health`: Phase 4 placeholder.
- `/proof/particle-health`: Phase 5 placeholder.

## Settlement Contract

`PayPortSettlement` is an evidence layer, not an escrow. Authorized recorders register invoices and record settlements after PayPort has confirmed Particle payment evidence offchain/app-side.

The contract emits:

- `InvoiceRegistered`
- `SettlementRecorded`
- `ProductUnlocked`

Records are keyed by `keccak256(bytes(invoiceId))`, while retaining the original string invoice ID for judge-friendly proof display.

## Proof Rule

No route should claim a payment or receipt is successful unless both conditions are true:

- Particle transaction evidence exists.
- Arbitrum settlement evidence exists.

The Phase 3 frontend follows this rule by showing placeholders and pending states only.
