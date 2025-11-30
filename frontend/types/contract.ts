export interface TelopayPayment {
  payer: `0x${string}`;
  amount: bigint;
  isEth: boolean;
  timestamp: bigint;
  processed: boolean;
}

export interface PaymentLimits {
  minEth: bigint;
  maxEth: bigint;
  minUsdc: bigint;
  maxUsdc: bigint;
}

export interface ContractBalance {
  ethBalance: bigint;
  usdcBalance: bigint;
}

export interface TransactionData {
  hash: `0x${string}`;
  status: 'pending' | 'success' | 'error';
}

export interface PaymentFormData {
  token: 'ETH' | 'USDC';
  amount: string;
}

export interface ContractAddresses {
  telopay: `0x${string}`;
  usdcMainnet: `0x${string}`;
  usdcSepolia: `0x${string}`;
}