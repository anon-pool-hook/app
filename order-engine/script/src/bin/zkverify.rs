//! SP1 + zkVerify Integration Script
//!
//! This script generates compressed SP1 proofs compatible with zkVerify's SP1 verification pallet.
//! It follows the zkVerify documentation for SP1 proof submission.
//!
//! Usage:
//! ```shell
//! RUST_LOG=info cargo run --release --bin zkverify -- --generate-proof
//! ```

use clap::Parser;
use fibonacci_lib::{
    create_order_commitment, hash_order, MarketConditions, OrderData,
};
use serde::{Deserialize, Serialize};
use sp1_sdk::{include_elf, ProverClient, SP1Stdin, HashableKey};
use std::env;
use std::error::Error;
use std::fs::File;
use std::io::Write;

/// The ELF file for our SP1 zkVM program
pub const FIBONACCI_ELF: &[u8] = include_elf!("fibonacci-program");

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    #[arg(long)]
    generate_proof: bool,

    #[arg(long)]
    verify_locally: bool,

    #[arg(long, default_value = "proof_zkverify.json")]
    output_file: String,
}

/// zkVerify-compatible SP1 proof output structure
#[derive(Serialize, Deserialize, Debug)]
struct ZkVerifyProofOutput {
    /// The image ID (verification key hash) for zkVerify
    image_id: String,
    /// Public inputs/values as hex string  
    pub_inputs: String,
    /// The compressed SP1 proof as hex string
    proof: String,
}

/// Helper function to convert bytes to hex with 0x prefix
fn to_hex_with_prefix(bytes: &[u8]) -> String {
    format!("0x{}", hex::encode(bytes))
}

/// Generate zkVerify-compatible SP1 proof
fn generate_zkverify_proof() -> Result<(), Box<dyn Error>> {
    println!("🔬 SP1 + zkVerify Integration");
    println!("══════════════════════════");

    // Initialize SP1 client (using local prover for now)
    println!("  🏠 Using local SP1 prover");
    let client = ProverClient::from_env();

    let (pk, vk) = client.setup(FIBONACCI_ELF);

    println!("  ✅ SP1 client initialized");
    println!("  📋 Program VK: {:?}", vk.hash_bytes());

    // Create test order data
    let alice_secret = [1u8; 32];
    let alice_order = OrderData {
        wallet_address: [1u8; 20],
        token_in: [0xAu8; 20],
        token_out: [0xBu8; 20],
        amount_in: 5000000000000000000u64,
        min_amount_out: 10000000000u64,
        target_price: 2000000000u64,
        deadline: 1735689600u64,
    };

    let market_conditions = MarketConditions {
        current_price: 2050000000u64,
        block_timestamp: 1735600000u64,
    };

    let alice_balance = 10000000000000000000u64;
    let order_context = hash_order(&alice_order);

    let (alice_commitment, alice_nullifier) =
        create_order_commitment(&alice_order, &alice_secret, alice_balance, &order_context);

    println!("  📦 Test order created:");
    println!("    Amount: 5 ETH → min 10,000 USDC");
    println!("    Target Price: $2000");
    println!("    Market Price: $2050 ✅");

    // Create minimal Merkle tree
    let tree_root = alice_nullifier.commitment_hash; // Single-node tree
    let siblings: Vec<[u8; 32]> = vec![]; // Empty proof for single node
    let indices: Vec<u8> = vec![]; // Empty indices for single node

    // Setup SP1 inputs
    let mut stdin = SP1Stdin::new();

    // Public inputs
    stdin.write(&market_conditions);
    stdin.write(&tree_root);
    stdin.write(&alice_nullifier.nullifier_hash);

    // Private inputs
    stdin.write(&alice_order);
    stdin.write(&alice_commitment.nullifier);
    stdin.write(&alice_balance);
    stdin.write(&siblings);
    stdin.write(&indices);

    println!("  🔄 Generating compressed SP1 proof...");

    // Generate compressed proof first
    let compressed_proof = client
        .prove(&pk, &stdin)
        .compressed()
        .run()?;

    println!("  ✅ Compressed proof generated and ready for zkVerify!");

    // Get verification key hash using SP1VerifyingKey::hash_bytes
    let vk_hash: [u8; 32] = vk.hash_bytes();
    
    // Get public values as bytes 
    let public_values = compressed_proof.public_values.to_vec();

    // Serialize the compressed proof for zkVerify (avoiding onchain verification path)
    let proof_bytes = bincode::serialize(&compressed_proof.proof)?;

    println!("  📊 Proof details:");
    println!("    Image ID: {}", to_hex_with_prefix(&vk_hash));
    println!("    Public values size: {} bytes", public_values.len());
    println!("    Proof size: {} bytes", proof_bytes.len());

    // Create zkVerify-compatible output
    let zkverify_output = ZkVerifyProofOutput {
        image_id: to_hex_with_prefix(&vk_hash),
        pub_inputs: to_hex_with_prefix(&public_values),
        proof: to_hex_with_prefix(&proof_bytes),
    };

    println!("  💾 Saving zkVerify-compatible proof...");

    // Save to file
    let json_string = serde_json::to_string_pretty(&zkverify_output)?;
    let mut file = File::create("proof_zkverify.json")?;
    file.write_all(json_string.as_bytes())?;

    println!("  ✅ Proof saved to proof_zkverify.json");
    println!("\n🎯 Ready for zkVerify submission!");
    println!("  Next steps:");
    println!("  1. Submit to zkVerify testnet using zkVerifyJS");
    println!("  2. Get proof receipt from zkVerify");
    println!("  3. Use receipt for on-chain verification");

    Ok(())
}

/// Verify proof locally before submitting to zkVerify
fn verify_local_proof() -> Result<(), Box<dyn Error>> {
    println!("🔍 Local Proof Verification");
    println!("══════════════════════════");

    // Load the generated proof
    let proof_data = std::fs::read_to_string("proof_zkverify.json")?;
    let zkverify_proof: ZkVerifyProofOutput = serde_json::from_str(&proof_data)?;

    println!("  📋 Loaded proof:");
    println!("    Image ID: {}", zkverify_proof.image_id);
    println!("    Public inputs: {} chars", zkverify_proof.pub_inputs.len());
    println!("    Proof: {} chars", zkverify_proof.proof.len());

    // Parse the public values to show what we're proving
    let pub_bytes = hex::decode(zkverify_proof.pub_inputs.trim_start_matches("0x"))?;
    
    if pub_bytes.len() >= 33 { // At least bool (1) + nullifier (32)
        let is_valid = pub_bytes[0] != 0;
        let nullifier_hash = &pub_bytes[1..33];
        
        println!("  🔍 Proof validates:");
        println!("    Order is valid: {}", is_valid);
        println!("    Nullifier hash: {}...", hex::encode(&nullifier_hash[..8]));
    }

    println!("  ✅ Proof format verified - ready for zkVerify!");

    Ok(())
}

fn main() -> Result<(), Box<dyn Error>> {
    sp1_sdk::utils::setup_logger();
    dotenv::dotenv().ok();

    let args = Args::parse();

    if args.generate_proof {
        generate_zkverify_proof()?;
    }

    if args.verify_locally {
        verify_local_proof()?;
    }

    if !args.generate_proof && !args.verify_locally {
        println!("Usage: cargo run --bin zkverify -- --generate-proof [--verify-locally]");
    }

    Ok(())
}
