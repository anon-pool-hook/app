export interface TradeData {
  type: 'buy' | 'sell';
  fromToken: string;
  toToken: string;
  amount: string;
  minReceive: string;
  slippage: string;
  isPrivate: boolean;
  timestamp: number;
  userAddress?: string;
}

export interface OrderData {
  id: string;
  address: string;
  side: 'buy' | 'sell';
  token: string;
  price: number;
  timestamp: number;
  status: 'pending' | 'filled' | 'cancelled';
  isPrivate: boolean;
}

export interface ZKProofData {
  commitment: string;
  nullifierHash: string;
  proof: string;
  publicValues: {
    isValid: boolean;
    nullifierHash: string;
    walletAddress: string;
    amountIn: bigint;
    minAmountOut: bigint;
  };
}

export interface ContractAddresses {
  DARK_COW_HOOK: `0x${string}`;
  POOL_MANAGER: `0x${string}`;
  SWAP_ROUTER: `0x${string}`;
  ORDER_SERVICE_MANAGER: `0x${string}`;
  TOKEN0: `0x${string}`;
  TOKEN1: `0x${string}`;
  TOKEN2: `0x${string}`;
}

export interface TokenInfo {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  name: string;
}
