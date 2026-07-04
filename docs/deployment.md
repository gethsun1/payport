# Deployment

## Railway API

1. Create a Railway PostgreSQL database.
2. Set backend variables from `docs/env.md`.
3. Build command: `npm run build --workspace @payport/api`
4. Start command: `npm run start --workspace @payport/api`
5. Run Prisma migrations against Railway PostgreSQL.
6. Confirm `GET /health`, `GET /health/db`, and `GET /health/arbitrum`.

## Vercel Frontend

The frontend lives in `apps/web`.

Expected configuration:

- Root directory: `apps/web`
- Build command: `npm run build --workspace @payport/web`
- Public env vars only.
- Magic domain allowlist includes the Vercel production URL.
- Google OAuth origins include the Vercel production URL.

Required public env for the current scaffold:

```bash
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_PAYPORT_NETWORK_MODE=
```

Magic and Particle variables are optional placeholders until Phases 4 and 5.

## Contracts

The Foundry project lives in `contracts`.

### Local Foundry Setup

Install Foundry from the official installer, then confirm:

```bash
forge --version
```

This contract has no external Solidity dependencies.

Current local verification status:

- Foundry v1.7.1 Windows x64 precompiled binaries are available under the user-local `.payport-tools` directory.
- `forge`, `cast`, and `anvil` version checks pass.
- `npm run contracts:build` passes.
- `npm run contracts:test` passes with 19 tests.
- `npm run contracts:export-abi` refreshes `packages/shared/src/abi/PayPortSettlement.json`.
- On-chain deployment and Etherscan verification are still pending.

### Build And Test

```bash
npm run contracts:build
npm run contracts:test
```

To export the ABI after a successful Foundry build:

```bash
npm run contracts:export-abi
```

The committed ABI lives at `packages/shared/src/abi/PayPortSettlement.json`.

### Deploy To Arbitrum Sepolia

Set:

```bash
ARBITRUM_SEPOLIA_RPC_URL=
ARBITRUM_SEPOLIA_PRIVATE_KEY=
SETTLEMENT_RECORDER_ADDRESS=
```

Run:

```bash
forge script contracts/script/DeployPayPortSettlement.s.sol:DeployPayPortSettlement --root contracts --rpc-url arbitrum_sepolia --broadcast
```

If `SETTLEMENT_RECORDER_ADDRESS` is omitted, the deployer is used as the recorder.

### Deploy To Arbitrum One

Set:

```bash
ARBITRUM_ONE_RPC_URL=
ARBITRUM_ONE_PRIVATE_KEY=
SETTLEMENT_RECORDER_ADDRESS=
```

Run:

```bash
forge script contracts/script/DeployPayPortSettlement.s.sol:DeployPayPortSettlement --root contracts --rpc-url arbitrum_one --broadcast
```

Use a fresh, low-balance deployer wallet.

### Verify With Etherscan V2

The constructor argument is the initial owner address encoded as ABI. Generate it with:

```bash
cast abi-encode "constructor(address)" <INITIAL_OWNER_ADDRESS>
```

For Arbitrum Sepolia:

```bash
forge verify-contract --chain arbitrum-sepolia <CONTRACT_ADDRESS> src/PayPortSettlement.sol:PayPortSettlement --verifier etherscan --etherscan-api-key $ETHERSCAN_API_KEY --constructor-args <ABI_ENCODED_CONSTRUCTOR_ARGS> --watch
```

For Arbitrum One:

```bash
forge verify-contract --chain arbitrum <CONTRACT_ADDRESS> src/PayPortSettlement.sol:PayPortSettlement --verifier etherscan --etherscan-api-key $ETHERSCAN_API_KEY --constructor-args <ABI_ENCODED_CONSTRUCTOR_ARGS> --watch
```

Foundry config also maps both Arbitrum chains to the Etherscan V2 endpoint using `ETHERSCAN_API_KEY`.

### Copy Addresses Into Env

After deployment, update Railway:

```bash
ARBITRUM_ONE_RPC_URL=
ARBITRUM_ONE_SETTLEMENT_CONTRACT_ADDRESS=
SETTLEMENT_EXECUTOR_MAINNET_PRIVATE_KEY=
```

Update Vercel:

```bash
NEXT_PUBLIC_ARBITRUM_ONE_SETTLEMENT_CONTRACT_ADDRESS=
NEXT_PUBLIC_ARBITRUM_SEPOLIA_SETTLEMENT_CONTRACT_ADDRESS=
```

Do not expose private keys through `NEXT_PUBLIC_*`.

### Deployment Records

Save public deployment metadata in `docs/deployments/README.md` or a chain-specific JSON file. Do not include secrets.
