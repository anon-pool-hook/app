# 🌐 **Testnet Deployment Guide**

Complete guide for deploying the Dark Pool + SP1 + zkVerify system to testnets.

## 📋 **Testnet Overview**

### **zkVerify Testnet** 
- **RPC**: `wss://testnet-rpc.zkverify.io`
- **Purpose**: ZK proof verification
- **Tokens**: ACME (from faucet)
- **Explorer**: Available via zkVerify docs

### **EigenLayer Testnet (Holesky)**
- **RPC**: `https://ethereum-holesky-rpc.publicnode.com`
- **Chain ID**: 17000
- **Purpose**: AVS deployment
- **Tokens**: ETH (from faucet)

### **Ethereum Sepolia**
- **RPC**: `https://sepolia.infura.io/v3/your-key`
- **Chain ID**: 11155111  
- **Purpose**: Uniswap V4 hooks (if available)
- **Tokens**: ETH (from faucet)

---

## 🚀 **Step 1: Environment Setup**

### **1.1 Install Dependencies**
```bash
# Rust toolchain for SP1
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
rustup target add wasm32-unknown-unknown

# SP1 CLI
curl -L https://sp1.succinct.xyz | bash
sp1up

# Node.js dependencies  
npm install

# Foundry for contract deployment
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### **1.2 Configure Environment**
```bash
# Copy testnet configuration
cp testnet.config.json config.json

# Set environment variables
export SP1_PROVER=network  # Use SP1 Prover Network
export RUST_LOG=info
```

---

## 🔧 **Step 2: SP1 Proof Generation**

### **2.1 Generate zkVerify-Compatible Proof**
```bash
# Generate proof with prover network for speed
cd order-engine
SP1_PROVER=network cargo run --bin zkverify -- --generate-proof

# Verify proof locally first
cargo run --bin zkverify -- --verify-locally
```

### **2.2 Expected Output**
```
🔬 SP1 + zkVerify Integration
══════════════════════════
  🌐 Using SP1 Prover Network for faster proof generation
  ✅ SP1 client initialized
  📋 Program VK: [32, 45, 67, ...]
  📦 Test order created:
    Amount: 5 ETH → min 10,000 USDC
    Target Price: $2000
    Market Price: $2050 ✅
  🔄 Generating compressed SP1 proof...
  ✅ Compressed proof ready for zkVerify!
  📊 Proof details:
    Image ID: 0x1234abcd...
    Public values size: 128 bytes  
    Proof size: 245760 bytes
  💾 Saving zkVerify-compatible proof...
  ✅ Proof saved to proof_zkverify.json
```

---

## 🌐 **Step 3: zkVerify Testnet Deployment**

### **3.1 Get Testnet Tokens**
1. **Setup Talisman Wallet**
   - Install Talisman browser extension
   - Add zkVerify Testnet:
     - RPC: `wss://testnet-rpc.zkverify.io`
     - Name: `zkVerify Testnet`

2. **Request ACME Tokens**
   - Copy your wallet address
   - Fill out [Test Token Faucet Request](https://docs.zkverify.io/incentivizedtestnet/getting_started)
   - Wait up to 24 hours for tokens

### **3.2 Submit Proofs to zkVerify**
```bash
# Run zkVerify integration demo
npm run zkverify:demo

# Or run the enhanced operator
npm run zkverify:operator
```

### **3.3 Expected zkVerify Flow**
```
🌐 Connecting to zkVerify testnet...
  ✅ Connected to zkVerify blockchain
  🌐 Chain: zkVerify Testnet
  ⚙️  Node: zkv-relay v1.0.0

📝 Registering SP1 verification key...
  Image ID: 0x1234abcd...
  📤 Registration submitted: 0xabcd1234...

🔬 Submitting SP1 proof to zkVerify...
  Image ID: 0x1234abcd...
  Proof size: 491520 chars
  Public inputs: 256 chars
  📤 Proof submitted: 0x5678efgh...
  
⏳ Waiting for proof verification...
  ✅ Proof verified successfully!
  📋 Receipt: 0x5678efgh...
  ⛓️  Block: 12345
  🌳 Merkle Root: 0x9876dcba...
```

---

## ⚙️ **Step 4: EigenLayer AVS Deployment**

### **4.1 Holesky Testnet Setup**
```bash
# Set Holesky RPC
export RPC_URL=https://ethereum-holesky-rpc.publicnode.com
export CHAIN_ID=17000

# Get Holesky ETH from faucet
# Visit: https://holesky-faucet.pk910.de/
```

### **4.2 Deploy Core EigenLayer Contracts**
```bash
# Deploy EigenLayer core (if not exists)
cd avs/contract
forge script script/DeployEigenLayerCore.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### **4.3 Deploy Updated AVS Contracts**
```bash
# Deploy AVS with zkVerify support
forge script script/AVSDeployer.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify

# Update deployment.json with new addresses
```

---

## 🪝 **Step 5: Uniswap V4 Hook Deployment**

### **5.1 Check V4 Availability**
```bash
# Note: Uniswap V4 may not be on testnets yet
# Check official Uniswap documentation for testnet availability
```

### **5.2 Deploy Hook (When Available)**
```bash
cd hook
forge script script/HookDeployer.s.sol \
  --rpc-url $SEPOLIA_RPC \
  --private-key $PRIVATE_KEY \
  --broadcast
```

### **5.3 Alternative: Local Testing**
```bash
# For now, test with local Anvil + V4 contracts
npm run start:anvil
npm run deploy:hook
```

---

## 🧪 **Step 6: Integration Testing**

### **6.1 Run Complete Integration Tests**
```bash
# Test SP1 + zkVerify integration
npm run zkverify:test

# Test AVS functionality  
npm run test:avs

# Run full system test
npm run test:all
```

### **6.2 Test Complete Flow**
```bash
# 1. Generate SP1 proof
npm run sp1:generate-proof

# 2. Submit to zkVerify
npm run zkverify:demo

# 3. Test operator with zkVerify receipts
npm run zkverify:operator

# 4. Verify AVS integration
npm run test:avs
```

---

## 📊 **Step 7: Performance Optimization**

### **7.1 SP1 Prover Network**
```bash
# Set up SP1 Network key for faster proofs
export SP1_PRIVATE_KEY=your-network-key
export SP1_PROVER=network

# Test performance improvement
time npm run sp1:generate-proof
```

### **7.2 Expected Performance**
- **Local SP1 Proving**: 60-120 seconds
- **SP1 Network Proving**: 10-30 seconds  
- **zkVerify Verification**: 10-30 seconds
- **Total Latency**: 30-90 seconds per order

---

## ⛓️ **Step 8: On-Chain Verification**

### **8.1 Deploy zkVerify Bridge Contracts**
```bash
# Deploy contracts to verify zkVerify Merkle roots on Ethereum
forge create src/ZkVerifyBridge.sol:ZkVerifyBridge \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --constructor-args 0xZKVERIFY_MERKLE_CONTRACT
```

### **8.2 Update Service Manager**
```solidity
// Add actual zkVerify verification
function verifyZkVerifyProof(bytes memory zkProofData, address operator) 
    public view returns (bool) {
    ZkVerifyReceipt memory receipt = decodeZkVerifyReceipt(zkProofData);
    
    // Verify Merkle root exists in zkVerify bridge contract
    return zkVerifyBridge.verifyMerkleRoot(
        receipt.merkleRoot,
        receipt.blockNumber
    );
}
```

---

## 📚 **Step 9: Monitoring & Analytics**

### **9.1 Setup Monitoring**
```bash
# Monitor zkVerify proof submissions
npm run monitor:zkverify

# Monitor AVS operator performance  
npm run monitor:avs

# Track system metrics
npm run analytics:performance
```

### **9.2 Key Metrics**
- Proof generation time
- zkVerify verification latency
- Gas costs for settlements
- Order matching success rate
- MEV protection effectiveness

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **SP1 Proof Generation Fails**
```bash
# Check SP1 installation
sp1 --version

# Update SP1
sp1up

# Check environment
echo $SP1_PROVER
echo $SP1_PRIVATE_KEY
```

#### **zkVerify Connection Issues**  
```bash
# Test connection
curl -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"system_health","params":[],"id":1}' \
  wss://testnet-rpc.zkverify.io

# Check ACME balance
# (via Talisman wallet)
```

#### **AVS Deployment Fails**
```bash
# Check network and gas
forge script script/AVSDeployer.s.sol \
  --rpc-url $RPC_URL \
  --gas-estimate-multiplier 150

# Verify contract addresses
cat deployment.json
```

---

## ✅ **Deployment Checklist**

### **Pre-Deployment**
- [ ] Rust and SP1 installed
- [ ] Node.js dependencies installed  
- [ ] Foundry installed
- [ ] Environment variables set
- [ ] Testnet tokens obtained

### **SP1 + zkVerify**
- [ ] SP1 proof generated successfully
- [ ] Proof format compatible with zkVerify
- [ ] zkVerify testnet connection works
- [ ] Proof submitted and verified

### **EigenLayer AVS**
- [ ] Core contracts deployed  
- [ ] AVS contracts deployed with zkVerify support
- [ ] Operator registered successfully
- [ ] Task creation and response working

### **System Integration**
- [ ] End-to-end proof flow working
- [ ] Performance meets requirements
- [ ] Security validations passing
- [ ] Monitoring setup complete

### **Documentation**
- [ ] Deployment addresses recorded
- [ ] Configuration documented
- [ ] Testing results documented
- [ ] Issues and resolutions logged

---

## 🎯 **Next Steps**

1. **Mainnet Preparation**
   - Security audit smart contracts
   - Stress test with high proof volumes
   - Optimize gas usage

2. **Feature Enhancements**
   - Implement proper zkVerify Merkle root verification
   - Add cross-chain settlement support
   - Integrate with more DEXs

3. **Production Monitoring**
   - Setup alerting and monitoring
   - Implement automated proof generation
   - Add operator incentive mechanisms

---

**🎉 Your Dark Pool system is now deployed across multiple testnets with privacy-preserving SP1 + zkVerify integration!** 🚀
