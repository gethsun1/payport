# Final Proof Plan

The final proof must be a tiny-value mainnet execution.

1. Create fresh low-balance wallets:
   - `PAYPORT_MAINNET_PROOF_BUYER`
   - `PAYPORT_MAINNET_PROOF_MERCHANT`
   - `PAYPORT_MAINNET_SETTLEMENT_EXECUTOR`
   - `PAYPORT_MAINNET_DEPLOYER`
2. Deploy `PayPortSettlement` to Arbitrum One.
3. Configure Railway with the Arbitrum RPC, settlement contract, and executor key.
4. Configure Vercel with Magic and Particle public variables.
5. Open a PayPort checkout invoice.
6. Log in with Magic email OTP.
7. Resolve the Magic wallet.
8. Initialize Particle UA in EIP-7702 proof mode.
9. Execute a tiny-value mainnet payment.
10. Store the Particle transaction ID on the payment attempt.
11. Record settlement evidence on Arbitrum One.
12. Create the receipt.
13. Open `/proof` and capture:
    - Magic wallet address
    - Particle UA address
    - Particle transaction ID
    - Arbitrum One contract address
    - Settlement transaction hash
    - Latest receipt
    - Environment health
