# PayPort Deployments

This directory tracks public deployment metadata only. Do not include private keys, seed phrases, or full secret environment snapshots.

## Arbitrum Sepolia Rehearsal

- Contract: `PayPortSettlement`
- Chain ID: `421614`
- Contract address: `TBD`
- Deployment transaction hash: `TBD`
- Verification link: `TBD`
- Deployment date: `TBD`
- Deployer wallet: `TBD`
- Recorder wallet: `TBD`

## Arbitrum One Final Proof

- Contract: `PayPortSettlement`
- Chain ID: `42161`
- Contract address: `TBD`
- Deployment transaction hash: `TBD`
- Verification link: `TBD`
- Deployment date: `TBD`
- Deployer wallet: `TBD`
- Recorder wallet: `TBD`

## Notes

- Use `ETHERSCAN_API_KEY` for verification on both chains.
- Copy the final Arbitrum One address into Railway and Vercel env variables after deployment.
- Keep proof wallets fresh and low-balance.
- Local verification status: `forge build`, `forge test`, and ABI refresh pass with Foundry v1.7.1 Windows x64 precompiled binaries. Public chain deployments are still pending.
