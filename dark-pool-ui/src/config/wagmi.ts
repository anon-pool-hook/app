import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { foundry } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Dark Pool DEX',
  projectId: 'YOUR_PROJECT_ID', // Get this from WalletConnect
  chains: [foundry],
  ssr: false,
});

// Contract addresses from deployment.json
export const CONTRACTS = {
  DARK_COW_HOOK: '0xe5148998c5469511dF5740F3eB01766f0945d088',
  POOL_MANAGER: '0xc351628EB244ec633d5f21fBD6621e1a683B1181',
  SWAP_ROUTER: '0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc',
  ORDER_SERVICE_MANAGER: '0x1291Be112d480055DaFd8a610b7d1e203891C274',
  TOKEN0: '0x162A433068F51e18b7d13932F27e66a3f99E6890',
  TOKEN1: '0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07',
  TOKEN2: '0x922D6956C99E12DFeB3224DEA977D0939758A1Fe',
} as const;

// Token information
export const TOKENS = {
  ETH: {
    address: CONTRACTS.TOKEN0,
    symbol: 'ETH',
    decimals: 18,
    name: 'Ethereum'
  },
  USDC: {
    address: CONTRACTS.TOKEN1,
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin'
  },
  DAI: {
    address: CONTRACTS.TOKEN2,
    symbol: 'DAI',
    decimals: 18,
    name: 'Dai Stablecoin'
  }
} as const;
