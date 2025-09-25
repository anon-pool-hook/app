#!/bin/bash

# 🔬 Live SP1 Proof Generation for zkVerify
# This script generates REAL SP1 proofs for zkVerify testnet

set -e

echo "🔬 ======================================================"
echo "         LIVE SP1 PROOF GENERATION"  
echo "         zkVerify Hackathon - Real Zero-Knowledge Proofs"
echo "======================================================"

# Source environment
if [ -f "testnet-config.env" ]; then
    source testnet-config.env
    echo "✅ Environment loaded"
else
    echo "⚠️  Using default SP1 configuration"
fi

# Set SP1 prover mode
if [ "$SP1_PROVER" = "network" ]; then
    echo "🌐 Using SP1 Network Prover (fastest - 30-60 seconds)"
    if [ -z "$SP1_PRIVATE_KEY" ]; then
        echo "❌ SP1_PRIVATE_KEY required for network prover!"
        echo "💡 Get key from: https://succinct.xyz/"
        echo "💡 Falling back to local prover..."
        export SP1_PROVER=local
    fi
else
    echo "🏠 Using local SP1 prover (slower - 2-5 minutes)"  
    export SP1_PROVER=local
fi

# Check Rust environment
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust not found! Install from: https://rustup.rs/"
    exit 1
fi

echo "🦀 Rust environment ready"

# Navigate to order engine
cd order-engine

echo ""
echo "🔬 GENERATING REAL SP1 PROOF FOR zkVerify..."
echo "============================================="

echo "📋 Proof will validate:"
echo "  • Order commitments are well-formed (Pedersen commitments)"
echo "  • Nullifiers prevent double-spending (unique per order)"
echo "  • Balance sufficiency without revealing amounts"
echo "  • Merkle tree inclusion proofs for privacy"
echo ""

echo "⚡ Starting SP1 proof generation..."
echo "   🎯 Target format: SHRINK (zkVerify compatible)"
echo "   🔐 Privacy level: MAXIMUM (no sensitive data revealed)"

# Generate the proof with timeout
if timeout 300 cargo run --release --bin zkverify -- --generate-proof; then
    echo ""
    echo "✅ SP1 PROOF GENERATED SUCCESSFULLY!"
    echo "===================================="
    
    # Check if proof file exists
    if [ -f "proof_zkverify.json" ]; then
        echo "📊 Proof File Details:"
        ls -lh proof_zkverify.json
        
        echo ""
        echo "📋 Proof Contents (first 200 chars):"
        head -c 200 proof_zkverify.json
        echo "..."
        
        echo ""
        echo "✅ Proof ready for zkVerify testnet submission!"
        echo "   📁 File: order-engine/proof_zkverify.json"
        echo "   🌐 Next: Submit to zkVerify using zkverify-client"
        
    else
        echo "❌ Proof file not generated!"
        exit 1
    fi
    
else
    echo ""
    echo "❌ SP1 proof generation failed or timed out!"
    echo "============================================="
    echo ""
    echo "💡 Troubleshooting:"
    echo "   • Check network connectivity for SP1 network prover"
    echo "   • Verify SP1_PRIVATE_KEY is set correctly"
    echo "   • Try local prover: export SP1_PROVER=local"
    echo "   • Increase timeout for complex proofs"
    echo ""
    echo "💡 For hackathon demo:"
    echo "   • Use existing cached proof if available"
    echo "   • Show proof generation process conceptually"
    echo "   • Emphasize the cryptographic commitments"
    exit 1
fi

echo ""
echo "🎯 READY FOR zkVerify TESTNET SUBMISSION!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Submit proof: npm run zkverify:demo"
echo "2. Verify on zkVerify explorer"
echo "3. Use receipt for AVS response"
echo ""
echo "🎊 Zero-knowledge privacy achieved! 🔐"
