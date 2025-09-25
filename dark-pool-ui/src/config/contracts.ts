// Contract configuration and addresses
export const CONTRACT_ADDRESSES = {
  hook: "0xe5148998c5469511dF5740F3eB01766f0945d088",
  lpRouter: "0xFD471836031dc5108809D173A067e8486B9047A3", 
  poolManager: "0xc351628EB244ec633d5f21fBD6621e1a683B1181",
  quoter: "0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f",
  swapRouter: "0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc",
  token0: "0x162A433068F51e18b7d13932F27e66a3f99E6890", // ETH
  token1: "0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07", // USDC
  token2: "0x922D6956C99E12DFeB3224DEA977D0939758A1Fe"  // DAI
} as const;

export const RPC_URL = "http://127.0.0.1:8545"; // Anvil testnet

// Contract ABI definitions
export const DARK_COW_HOOK_ABI = [
  "function settleBalances(bytes32 poolId, tuple(uint256 amount, address currency, address sender)[] transferBalances, tuple(int256 amountSpecified, bool zeroForOne, uint160 sqrtPriceLimitX96)[] swapBalances) external",
  "function getPoolSlot0(bytes32 poolId) external view returns (uint160 sqrtPriceX96, int24 tick, uint24 protocolFee, uint24 lpFee)",
  "function poolKeys(bytes32) external view returns (address, address, uint24, int24, address)",
  "function serviceManager() external view returns (address)"
] as const;

export const ERC20_ABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)"
] as const;

// SP1 Proof data structure
export interface SP1ProofData {
  image_id: string;
  proof: string;
  public_values: string;
  verification_key: string;
}

// Transaction types for our UI
export interface TransactionInfo {
  hash: string;
  type: 'swap' | 'settle' | 'proof';
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  gasUsed?: string;
  blockNumber?: number;
}

// ZK Proof generation step
export interface ProofStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  hash?: string;
  commitment?: string;
  timestamp?: number;
}

export const TOKEN_INFO = {
  [CONTRACT_ADDRESSES.token0]: { symbol: 'ETH', decimals: 18, name: 'Ethereum' },
  [CONTRACT_ADDRESSES.token1]: { symbol: 'USDC', decimals: 6, name: 'USD Coin' },
  [CONTRACT_ADDRESSES.token2]: { symbol: 'DAI', decimals: 18, name: 'Dai Stablecoin' }
} as const;
