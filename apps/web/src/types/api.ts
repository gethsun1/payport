export type Merchant = {
  id: string;
  displayName: string;
  settlementAddress: string;
  products?: Product[];
  invoices?: Invoice[];
};

export type Product = {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  priceUsd: string | number;
  unlockType: string;
  unlockValue?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Invoice = {
  id: string;
  merchantId: string;
  productId?: string | null;
  buyerUserId?: string | null;
  amountUsd: string | number;
  status: string;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  merchant?: Merchant;
  product?: Product | null;
  paymentAttempts?: PaymentAttempt[];
  settlements?: Settlement[];
  receipts?: Receipt[];
};

export type PaymentAttempt = {
  id: string;
  invoiceId: string;
  buyerAddress: string;
  uaAddress?: string | null;
  particleTransactionId?: string | null;
  rootHash?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Settlement = {
  id: string;
  invoiceId: string;
  paymentAttemptId: string;
  chainId: number;
  contractAddress: string;
  txHash: string;
  blockNumber?: string | null;
  eventName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Receipt = {
  id: string;
  invoiceId: string;
  paymentAttemptId: string;
  settlementId?: string | null;
  buyerAddress: string;
  merchantAddress: string;
  amountUsd: string | number;
  particleTransactionId?: string | null;
  settlementTxHash?: string | null;
  unlockStatus: string;
  createdAt: string;
  updatedAt: string;
  invoice?: Invoice;
  settlement?: Settlement | null;
  paymentAttempt?: PaymentAttempt;
};

export type HealthResponse = {
  ok: boolean;
  version?: string;
  environment?: string;
  networkMode?: string;
  [key: string]: unknown;
};
