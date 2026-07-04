# Deployment

## Railway API

1. Create a Railway PostgreSQL database.
2. Set backend variables from `docs/env.md`.
3. Build command: `npm run build --workspace @payport/api`
4. Start command: `npm run start --workspace @payport/api`
5. Run Prisma migrations against Railway PostgreSQL.
6. Confirm `GET /health`, `GET /health/db`, and `GET /health/arbitrum`.

## Vercel Frontend

The frontend will be added in Phase 3 under `apps/web`.

Expected configuration:

- Root directory: `apps/web`
- Build command: `npm run build`
- Public env vars only.
- Magic domain allowlist includes the Vercel production URL.
- Google OAuth origins include the Vercel production URL.

## Contracts

The Foundry project will be added in Phase 2.

Expected flow:

1. Deploy to Arbitrum Sepolia for rehearsal.
2. Run contract tests.
3. Deploy to Arbitrum One for final proof.
4. Verify with `ETHERSCAN_API_KEY`.
5. Save deployment metadata under `docs/deployments/`.
