# Judge Walkthrough

## 90-Second Script

PayPort makes the chain disappear for the buyer, while preserving proof for the merchant.

1. Open the PayPort landing page and click the checkout demo.
2. Log in with Magic email OTP.
3. Show that PayPort resolves an embedded wallet without MetaMask.
4. Show the checkout amount and readiness states.
5. Run the tiny-value Particle Universal Account payment in EIP-7702 mode.
6. Show the Particle transaction ID.
7. Show the Railway backend has recorded the payment attempt.
8. Show the Arbitrum One settlement transaction hash.
9. Open the receipt.
10. Open `/proof` and show the full evidence package.

## What To Emphasize

- Buyer never bridges or switches chains.
- Magic is the primary onboarding path.
- Particle Universal Accounts handle mainnet execution.
- Arbitrum One preserves merchant settlement evidence.
- Receipt unlocks only after real proof exists.
