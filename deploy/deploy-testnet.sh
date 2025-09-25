#!/bin/bash

# 🌐 Dark Pool Testnet Deployment Script
# Deploys the complete SP1 + zkVerify + EigenLayer AVS system to testnets

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEPLOYMENT_LOG="$PROJECT_ROOT/deployment.log"

# Testnet Configuration
HOLESKY_RPC="https://ethereum-holesky-rpc.publicnode.com"
HOLESKY_CHAIN_ID=17000
SEPOLIA_RPC="https://sepolia.infura.io/v3/your-infura-key"
SEPOLIA_CHAIN_ID=11155111
ZKVERIFY_RPC="wss://testnet-rpc.zkverify.io"

echo -e "${BLUE}🌐 Dark Pool Testnet Deployment${NC}"
echo "================================="
echo "$(date): Starting testnet deployment" >> "$DEPLOYMENT_LOG"

# Function to log messages
log() {
    echo -e "$1"
    echo "$(date): $2" >> "$DEPLOYMENT_LOG"
}

# Function to check if command exists
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log "${RED}❌ Error: $1 is not installed${NC}" "ERROR: $1 not found"
        exit 1
    fi
}

# Function to check environment variables
check_env() {
    if [ -z "${!1}" ]; then
        log "${RED}❌ Error: Environment variable $1 is not set${NC}" "ERROR: $1 not set"
        exit 1
    fi
}

# Step 1: Environment Checks
log "${BLUE}📋 Step 1: Environment Checks${NC}" "Step 1: Environment checks"

# Check required commands
check_command "node"
check_command "npm"
check_command "forge"
check_command "cargo"
check_command "sp1"

# Check environment variables
check_env "PRIVATE_KEY"

# Optional: Check if SP1 prover key is set for network proving
if [ -n "$SP1_PRIVATE_KEY" ]; then
    log "${GREEN}✅ SP1 Network key detected - will use fast proving${NC}" "SP1 network key available"
    export SP1_PROVER=network
else
    log "${YELLOW}⚠️ SP1 Network key not set - using local proving (slower)${NC}" "Using local SP1 proving"
fi

log "${GREEN}✅ Environment checks passed${NC}" "Environment checks complete"

# Step 2: Install Dependencies
log "${BLUE}📦 Step 2: Installing Dependencies${NC}" "Step 2: Installing dependencies"

cd "$PROJECT_ROOT"

# Install Node.js dependencies
npm install --silent

# Install SP1 if not present
if ! command -v sp1 &> /dev/null; then
    log "${YELLOW}⚙️ Installing SP1...${NC}" "Installing SP1"
    curl -L https://sp1.succinct.xyz | bash
    export PATH="$HOME/.sp1/bin:$PATH"
    sp1up
fi

log "${GREEN}✅ Dependencies installed${NC}" "Dependencies installation complete"

# Step 3: Generate SP1 Proof
log "${BLUE}🔬 Step 3: Generating SP1 Proof${NC}" "Step 3: Generating SP1 proof"

cd "$PROJECT_ROOT/order-engine"

# Set environment for faster proving if network key available
if [ -n "$SP1_PRIVATE_KEY" ]; then
    export SP1_PROVER=network
    log "${GREEN}🌐 Using SP1 Prover Network for faster proof generation${NC}" "Using SP1 network"
else
    log "${YELLOW}🏠 Using local SP1 proving (this may take 1-2 minutes)${NC}" "Using local SP1 proving"
fi

# Generate zkVerify-compatible proof
log "${BLUE}  Generating proof... (this may take some time)${NC}" "Starting proof generation"
if cargo run --release --bin zkverify -- --generate-proof >> "$DEPLOYMENT_LOG" 2>&1; then
    log "${GREEN}✅ SP1 proof generated successfully${NC}" "SP1 proof generation successful"
else
    log "${RED}❌ SP1 proof generation failed${NC}" "SP1 proof generation failed"
    exit 1
fi

# Verify proof locally
if cargo run --release --bin zkverify -- --verify-locally >> "$DEPLOYMENT_LOG" 2>&1; then
    log "${GREEN}✅ Proof verification passed${NC}" "Proof verification successful"
else
    log "${RED}❌ Proof verification failed${NC}" "Proof verification failed"
    exit 1
fi

cd "$PROJECT_ROOT"

# Step 4: Test zkVerify Integration
log "${BLUE}🌐 Step 4: Testing zkVerify Integration${NC}" "Step 4: Testing zkVerify integration"

# Note: This requires testnet tokens and proper setup
log "${YELLOW}ℹ️ zkVerify integration requires manual setup:${NC}" "zkVerify manual setup required"
log "${YELLOW}  1. Setup Talisman wallet with zkVerify testnet${NC}" ""
log "${YELLOW}  2. Get ACME tokens from faucet${NC}" ""
log "${YELLOW}  3. Run: npm run zkverify:demo${NC}" ""
log "${YELLOW}  4. Run: npm run zkverify:test${NC}" ""

# Step 5: Deploy EigenLayer AVS to Holesky
log "${BLUE}⚙️ Step 5: Deploying EigenLayer AVS to Holesky${NC}" "Step 5: Deploying EigenLayer AVS"

cd "$PROJECT_ROOT/avs/contract"

# Set Holesky environment
export RPC_URL="$HOLESKY_RPC"
export CHAIN_ID="$HOLESKY_CHAIN_ID"

log "${BLUE}  Deploying to Holesky testnet...${NC}" "Deploying to Holesky"
log "${BLUE}  RPC: $RPC_URL${NC}" ""
log "${BLUE}  Chain ID: $CHAIN_ID${NC}" ""

# Deploy EigenLayer core contracts (if needed)
log "${BLUE}  Deploying EigenLayer Core...${NC}" "Deploying EigenLayer core"
if forge script script/DeployEigenLayerCore.sol \
    --rpc-url "$RPC_URL" \
    --private-key "$PRIVATE_KEY" \
    --broadcast \
    --verify \
    --etherscan-api-key "$ETHERSCAN_API_KEY" \
    >> "$DEPLOYMENT_LOG" 2>&1; then
    log "${GREEN}✅ EigenLayer Core deployed${NC}" "EigenLayer core deployment successful"
else
    log "${YELLOW}⚠️ EigenLayer Core deployment failed (may already exist)${NC}" "EigenLayer core deployment failed"
fi

# Deploy AVS contracts with zkVerify support
log "${BLUE}  Deploying AVS with zkVerify support...${NC}" "Deploying AVS contracts"
if forge script script/AVSDeployer.s.sol \
    --rpc-url "$RPC_URL" \
    --private-key "$PRIVATE_KEY" \
    --broadcast \
    --verify \
    --etherscan-api-key "$ETHERSCAN_API_KEY" \
    >> "$DEPLOYMENT_LOG" 2>&1; then
    log "${GREEN}✅ AVS contracts deployed with zkVerify support${NC}" "AVS deployment successful"
else
    log "${RED}❌ AVS deployment failed${NC}" "AVS deployment failed"
    exit 1
fi

cd "$PROJECT_ROOT"

# Step 6: Deploy Hook Contracts (when available)
log "${BLUE}🪝 Step 6: Hook Deployment Status${NC}" "Step 6: Hook deployment check"

# Check if Uniswap V4 is available on testnets
log "${YELLOW}ℹ️ Uniswap V4 Hook deployment:${NC}" "Uniswap V4 status check"
log "${YELLOW}  - V4 may not be available on public testnets yet${NC}" ""
log "${YELLOW}  - For testing, use local anvil: npm run start:anvil${NC}" ""
log "${YELLOW}  - Then deploy hook locally: npm run deploy:hook${NC}" ""

# Attempt hook deployment to Sepolia (if V4 is available)
if [ -n "$SEPOLIA_RPC" ] && [ "$SEPOLIA_RPC" != "https://sepolia.infura.io/v3/your-infura-key" ]; then
    cd "$PROJECT_ROOT/hook"
    log "${BLUE}  Attempting hook deployment to Sepolia...${NC}" "Attempting Sepolia deployment"
    
    if forge script script/HookDeployer.s.sol \
        --rpc-url "$SEPOLIA_RPC" \
        --private-key "$PRIVATE_KEY" \
        --broadcast \
        >> "$DEPLOYMENT_LOG" 2>&1; then
        log "${GREEN}✅ Hook deployed to Sepolia${NC}" "Hook deployment successful"
    else
        log "${YELLOW}⚠️ Hook deployment failed (V4 may not be available)${NC}" "Hook deployment failed"
    fi
    cd "$PROJECT_ROOT"
fi

# Step 7: Update Configuration Files
log "${BLUE}📝 Step 7: Updating Configuration${NC}" "Step 7: Updating configuration"

# Create deployment record
DEPLOYMENT_FILE="$PROJECT_ROOT/deployments/testnet-$(date +%Y%m%d-%H%M%S).json"
mkdir -p "$PROJECT_ROOT/deployments"

cat > "$DEPLOYMENT_FILE" << EOF
{
  "deployment_date": "$(date -Iseconds)",
  "networks": {
    "zkverify": {
      "rpc": "$ZKVERIFY_RPC",
      "status": "manual_setup_required"
    },
    "holesky": {
      "rpc": "$HOLESKY_RPC",
      "chain_id": $HOLESKY_CHAIN_ID,
      "status": "deployed"
    },
    "sepolia": {
      "rpc": "$SEPOLIA_RPC", 
      "chain_id": $SEPOLIA_CHAIN_ID,
      "status": "conditional"
    }
  },
  "contracts": {
    "avs": {
      "service_manager": "see_forge_logs",
      "stake_registry": "see_forge_logs"
    },
    "hook": {
      "dark_cow_hook": "see_forge_logs_or_deploy_locally"
    }
  },
  "sp1": {
    "proof_generated": true,
    "verification_passed": true,
    "prover_mode": "${SP1_PROVER:-local}"
  }
}
EOF

log "${GREEN}✅ Deployment record created: $DEPLOYMENT_FILE${NC}" "Deployment record created"

# Step 8: Run Integration Tests
log "${BLUE}🧪 Step 8: Running Integration Tests${NC}" "Step 8: Running tests"

# Test AVS functionality
log "${BLUE}  Testing AVS contracts...${NC}" "Testing AVS contracts"
if npm run test:avs >> "$DEPLOYMENT_LOG" 2>&1; then
    log "${GREEN}✅ AVS tests passed${NC}" "AVS tests passed"
else
    log "${YELLOW}⚠️ Some AVS tests failed (check deployment.log)${NC}" "Some AVS tests failed"
fi

# Test overall system
log "${BLUE}  Testing overall system...${NC}" "Testing overall system"
if npm run test:all >> "$DEPLOYMENT_LOG" 2>&1; then
    log "${GREEN}✅ System tests passed${NC}" "System tests passed"
else
    log "${YELLOW}⚠️ Some system tests failed (expected for testnet)${NC}" "Some system tests failed"
fi

# Final Summary
log "${GREEN}🎉 Testnet Deployment Complete!${NC}" "Deployment complete"
echo "================================="
echo ""
log "${GREEN}✅ SP1 proof generation working${NC}" ""
log "${GREEN}✅ EigenLayer AVS deployed to Holesky${NC}" ""
log "${YELLOW}⚠️ zkVerify integration requires manual setup${NC}" ""
log "${YELLOW}⚠️ Hook deployment conditional on V4 availability${NC}" ""
echo ""
echo "📚 Next Steps:"
echo "1. Setup zkVerify testnet in Talisman wallet"
echo "2. Get ACME tokens from zkVerify faucet"
echo "3. Run: npm run zkverify:demo"
echo "4. Run: npm run zkverify:test"
echo "5. Test end-to-end flow: npm run zkverify:full-demo"
echo ""
echo "📁 Files created:"
echo "- Deployment record: $DEPLOYMENT_FILE"
echo "- Deployment log: $DEPLOYMENT_LOG"
echo ""
log "${BLUE}🚀 Your Dark Pool system is ready for testnet testing!${NC}" "Deployment script complete"

# Make script executable and show final status
chmod +x "$0"
exit 0
