// Web3 utilities for contract interaction
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, DARK_COW_HOOK_ABI, ERC20_ABI, RPC_URL, TransactionInfo, SP1ProofData, ProofStep } from '../config/contracts';

declare global {
  interface Window {
    ethereum?: any;
  }
}

class Web3Service {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Signer | null = null;
  private hookContract: ethers.Contract | null = null;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
  }

  async connectWallet(): Promise<{ address: string; ensName?: string }> {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await provider.getSigner();
      
      const address = await this.signer.getAddress();
      let ensName: string | undefined;
      
      try {
        ensName = await provider.lookupAddress(address) || undefined;
      } catch (e) {
        // ENS lookup failed, ignore
      }

      // Initialize hook contract
      this.hookContract = new ethers.Contract(
        CONTRACT_ADDRESSES.hook,
        DARK_COW_HOOK_ABI,
        this.signer
      );

      return { address, ensName };
    } catch (error: any) {
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    const token = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
    const balance = await token.balanceOf(userAddress);
    const decimals = await token.decimals();
    return ethers.formatUnits(balance, decimals);
  }

  async getPoolInfo(poolId: string): Promise<{
    sqrtPriceX96: string;
    tick: number;
    protocolFee: number;
    lpFee: number;
  }> {
    if (!this.hookContract) throw new Error('Contract not initialized');
    
    const [sqrtPriceX96, tick, protocolFee, lpFee] = await this.hookContract.getPoolSlot0(poolId);
    
    return {
      sqrtPriceX96: sqrtPriceX96.toString(),
      tick: Number(tick),
      protocolFee: Number(protocolFee),
      lpFee: Number(lpFee)
    };
  }

  async simulateSwap(
    fromToken: string,
    toToken: string,
    amount: string,
    isPrivate: boolean
  ): Promise<{
    estimatedGas: string;
    estimatedOutput: string;
    priceImpact: string;
    route: string[];
  }> {
    // Simulate the swap to get estimates
    // This would integrate with the quoter contract
    return {
      estimatedGas: '180000',
      estimatedOutput: (parseFloat(amount) * 2000).toFixed(6), // Mock: ETH -> USDC
      priceImpact: '0.15',
      route: [fromToken, toToken]
    };
  }

  async generateZKProof(orderData: any): Promise<{
    steps: ProofStep[];
    finalProof: SP1ProofData | null;
  }> {
    const steps: ProofStep[] = [
      {
        id: 'commitment',
        name: 'Creating Order Commitment',
        status: 'processing',
        timestamp: Date.now()
      },
      {
        id: 'nullifier',
        name: 'Computing Nullifier Hash',
        status: 'pending'
      },
      {
        id: 'merkle',
        name: 'Building Merkle Proof',
        status: 'pending'
      },
      {
        id: 'sp1',
        name: 'Generating SP1 ZK Proof',
        status: 'pending'
      },
      {
        id: 'zkverify',
        name: 'Submitting to zkVerify',
        status: 'pending'
      }
    ];

    // Mock SP1 proof generation with realistic steps
    return new Promise((resolve) => {
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          steps[currentStep].status = 'completed';
          steps[currentStep].timestamp = Date.now();
          steps[currentStep].hash = '0x' + Math.random().toString(16).substr(2, 64);
          
          if (steps[currentStep].id === 'commitment') {
            steps[currentStep].commitment = '0x' + Math.random().toString(16).substr(2, 64);
          }
          
          currentStep++;
          if (currentStep < steps.length) {
            steps[currentStep].status = 'processing';
            steps[currentStep].timestamp = Date.now();
          }
        } else {
          clearInterval(interval);
          
          const finalProof: SP1ProofData = {
            image_id: "0x489488062640ecd6170176b93aabbb1330828c70280a90216b7adf520fc8d6e3",
            proof: "0x" + Array.from({length: 64}, () => Math.random().toString(16).charAt(Math.floor(Math.random() * 16))).join(''),
            public_values: "0x" + Array.from({length: 32}, () => Math.random().toString(16).charAt(Math.floor(Math.random() * 16))).join(''),
            verification_key: "0x" + Array.from({length: 64}, () => Math.random().toString(16).charAt(Math.floor(Math.random() * 16))).join('')
          };
          
          resolve({ steps, finalProof });
        }
      }, 2000);
    });
  }

  async executePrivateSwap(
    fromToken: string,
    toToken: string, 
    amount: string,
    minReceive: string,
    zkProof: SP1ProofData
  ): Promise<TransactionInfo> {
    if (!this.signer || !this.hookContract) {
      throw new Error('Wallet not connected');
    }

    try {
      // This would call the actual hook contract
      // For now, we'll simulate a transaction
      const tx = {
        to: CONTRACT_ADDRESSES.hook,
        value: ethers.parseEther(amount),
        data: '0x' // Would be the encoded function call
      };

      // Simulate sending transaction
      const txResponse = await this.signer.sendTransaction(tx);
      
      return {
        hash: txResponse.hash,
        type: 'swap',
        status: 'pending',
        timestamp: Date.now()
      };
    } catch (error: any) {
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }

  async getTransaction(hash: string): Promise<TransactionInfo | null> {
    try {
      const tx = await this.provider.getTransaction(hash);
      const receipt = await this.provider.getTransactionReceipt(hash);
      
      if (!tx) return null;

      return {
        hash,
        type: 'swap', // Would determine based on method called
        status: receipt ? 'confirmed' : 'pending',
        timestamp: Date.now(),
        gasUsed: receipt?.gasUsed?.toString(),
        blockNumber: receipt?.blockNumber
      };
    } catch (error) {
      return null;
    }
  }

  formatAddress(address: string, ensName?: string): string {
    if (ensName) return ensName;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  formatAmount(amount: string, symbol: string): string {
    const num = parseFloat(amount);
    if (num === 0) return '0';
    if (num < 0.0001) return `< 0.0001 ${symbol}`;
    if (num < 1) return `${num.toFixed(4)} ${symbol}`;
    return `${num.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${symbol}`;
  }
}

export const web3Service = new Web3Service();
export default web3Service;
