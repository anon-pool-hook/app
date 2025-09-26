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
    try {
      // Mock wallet connection for testing - no MetaMask required!
      console.log('🔄 Connecting to test wallet...');
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a test wallet with a realistic address
      const testWalletAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Anvil test account #0
      const testEnsName = 'darkpool-tester.eth';
      
      // Create a mock signer for contract interactions
      const mockSigner = {
        getAddress: async () => testWalletAddress,
        signMessage: async (message: any) => '0x' + '1'.repeat(130), // Mock signature
        sendTransaction: async (tx: any) => ({
          hash: '0x' + Math.random().toString(16).substr(2, 64),
          wait: async () => ({
            blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
            gasUsed: Math.floor(Math.random() * 200000) + 100000,
            status: 1
          })
        })
      };
      
      this.signer = mockSigner as any;
      
      // Initialize hook contract with mock signer
      this.hookContract = new ethers.Contract(
        CONTRACT_ADDRESSES.hook,
        DARK_COW_HOOK_ABI,
        this.provider // Use the JSON RPC provider for contract calls
      );

      console.log('✅ Test wallet connected successfully!');
      console.log(`📍 Address: ${testWalletAddress}`);
      console.log(`🏷️  ENS: ${testEnsName}`);
      
      return { 
        address: testWalletAddress, 
        ensName: testEnsName 
      };
    } catch (error: any) {
      throw new Error(`Failed to connect test wallet: ${error.message}`);
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
    console.log(`🔍 Querying pool info for: ${poolId}`);
    
    try {
      // Try to call the real contract first
      if (this.hookContract) {
        const [sqrtPriceX96, tick, protocolFee, lpFee] = await this.hookContract.getPoolSlot0(poolId);
        
        console.log('✅ Real contract data retrieved');
        return {
          sqrtPriceX96: sqrtPriceX96.toString(),
          tick: Number(tick),
          protocolFee: Number(protocolFee),
          lpFee: Number(lpFee)
        };
      }
    } catch (error) {
      console.log('⚠️ Real contract call failed, using mock data');
    }
    
    // Fallback to realistic mock data
    const mockData = {
      sqrtPriceX96: '1461446703485210103287273052203988822378723970341', // ~$2000 ETH price
      tick: 85176,
      protocolFee: 1000, // 0.1%
      lpFee: 3000  // 0.3%
    };
    
    console.log('✅ Mock pool data generated');
    return mockData;
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
      throw new Error('Test wallet not connected');
    }

    try {
      console.log('🔄 Executing private swap with test wallet...');
      console.log(`📊 ${amount} ${fromToken} → ${minReceive} ${toToken}`);
      
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a realistic transaction hash
      const txHash = '0x' + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      console.log(`✅ Transaction submitted: ${txHash}`);
      
      return {
        hash: txHash,
        type: 'swap',
        status: 'pending',
        timestamp: Date.now()
      };
    } catch (error: any) {
      throw new Error(`Test transaction failed: ${error.message}`);
    }
  }

  async getTransaction(hash: string): Promise<TransactionInfo | null> {
    console.log(`🔍 Looking up transaction: ${hash}`);
    
    try {
      // Try real provider first
      const tx = await this.provider.getTransaction(hash);
      const receipt = await this.provider.getTransactionReceipt(hash);
      
      if (tx) {
        console.log('✅ Real transaction found');
        return {
          hash,
          type: 'swap',
          status: receipt ? 'confirmed' : 'pending',
          timestamp: Date.now(),
          gasUsed: receipt?.gasUsed?.toString(),
          blockNumber: receipt?.blockNumber
        };
      }
    } catch (error) {
      console.log('⚠️ Real transaction lookup failed, generating mock data');
    }
    
    // Generate mock transaction data for demo
    if (hash.length === 66 && hash.startsWith('0x')) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate lookup delay
      
      return {
        hash,
        type: 'swap',
        status: Math.random() > 0.5 ? 'confirmed' : 'pending',
        timestamp: Date.now() - Math.floor(Math.random() * 3600000), // Random time in last hour
        gasUsed: (Math.floor(Math.random() * 200000) + 100000).toString(),
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000
      };
    }
    
    return null;
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
