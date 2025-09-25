/**
 * zkVerify Client Integration for Dark Pool
 * 
 * This client handles:
 * - Submitting SP1 proofs to zkVerify blockchain
 * - Registering verification keys
 * - Getting proof receipts
 * - Monitoring proof verification status
 */

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { u8aToHex } from '@polkadot/util';
import fs from 'fs';
import path from 'path';

// zkVerify testnet endpoint (official)
const ZKVERIFY_TESTNET_RPC = 'wss://testnet-rpc.zkverify.io';

// Types for our proof data
export interface ZkVerifyProofData {
    image_id: string;     // SP1 verification key hash
    pub_inputs: string;   // Public values from SP1 proof
    proof: string;        // Compressed SP1 proof bytes
}

export interface ProofReceipt {
    proof_id: string;
    verification_status: 'verified' | 'failed' | 'pending';
    block_hash: string;
    block_number: number;
    attestation_id?: string;
    merkle_root?: string;
}

export class ZkVerifyClient {
    private api: ApiPromise | null = null;
    private keyring: Keyring;
    private account: KeyringPair | null = null;

    constructor() {
        this.keyring = new Keyring({ type: 'sr25519' });
    }

    /**
     * Initialize connection to zkVerify blockchain
     */
    async initialize(seedPhrase?: string): Promise<void> {
        console.log('🔗 Connecting to zkVerify testnet...');
        
        const provider = new WsProvider(ZKVERIFY_TESTNET_RPC);
        this.api = await ApiPromise.create({ provider });
        
        await this.api.isReady;
        console.log('  ✅ Connected to zkVerify blockchain');
        
        // Setup account for transactions
        if (seedPhrase) {
            this.account = this.keyring.addFromUri(seedPhrase);
            console.log(`  👤 Account: ${this.account.address}`);
        }
        
        // Get chain info
        const [chain, nodeName, nodeVersion] = await Promise.all([
            this.api.rpc.system.chain(),
            this.api.rpc.system.name(),
            this.api.rpc.system.version()
        ]);
        
        console.log(`  🌐 Chain: ${chain}`);
        console.log(`  ⚙️  Node: ${nodeName} v${nodeVersion}`);
    }

    /**
     * Register SP1 verification key with zkVerify
     */
    async registerVerificationKey(imageId: string): Promise<string> {
        if (!this.api || !this.account) {
            throw new Error('zkVerify client not initialized');
        }

        console.log('📝 Registering SP1 verification key...');
        console.log(`  Image ID: ${imageId}`);

        try {
            // Create registerVk extrinsic for SP1
            const registerVkTx = this.api.tx.sp1Verifier.registerVk(imageId);
            
            // Sign and submit
            const hash = await registerVkTx.signAndSend(this.account);
            console.log(`  📤 Registration submitted: ${hash.toHex()}`);
            
            return hash.toHex();
        } catch (error) {
            console.error('❌ VK registration failed:', error);
            throw error;
        }
    }

    /**
     * Submit SP1 proof to zkVerify for verification
     */
    async submitProof(proofData: ZkVerifyProofData): Promise<string> {
        if (!this.api || !this.account) {
            throw new Error('zkVerify client not initialized');
        }

        console.log('🔬 Submitting SP1 proof to zkVerify...');
        console.log(`  Image ID: ${proofData.image_id}`);
        console.log(`  Proof size: ${proofData.proof.length} chars`);
        console.log(`  Public inputs: ${proofData.pub_inputs.length} chars`);

        try {
            // Create submitProof extrinsic for SP1
            const submitProofTx = this.api.tx.sp1Verifier.submitProof(
                proofData.image_id,
                proofData.proof,
                proofData.pub_inputs
            );
            
            // Sign and submit with promise-based approach
            return new Promise((resolve, reject) => {
                submitProofTx.signAndSend(this.account!, ({ status, events }) => {
                    if (status.isInBlock) {
                        console.log(`  ⛓️  Proof in block: ${status.asInBlock.toHex()}`);
                    } else if (status.isFinalized) {
                        console.log(`  ✅ Proof finalized: ${status.asFinalized.toHex()}`);
                        
                        // Check for verification events
                        events.forEach(({ event }) => {
                            if (event.section === 'sp1Verifier') {
                                console.log(`  📋 Event: ${event.section}.${event.method}`);
                                console.log(`    Data: ${event.data.toString()}`);
                            }
                        });
                        
                        console.log(`  📤 Proof submitted and finalized successfully`);
                        resolve(status.asFinalized.toHex());
                    }
                }).catch((error) => {
                    console.error('❌ Transaction failed:', error);
                    reject(error);
                });
            });
            
        } catch (error) {
            console.error('❌ Proof submission failed:', error);
            throw error;
        }
    }

    /**
     * Get proof verification status and receipt
     */
    async getProofReceipt(proofHash: string): Promise<ProofReceipt | null> {
        if (!this.api) {
            throw new Error('zkVerify client not initialized');
        }

        try {
            // Query proof verification status
            const proofInfo = await this.api.query.sp1Verifier.proofs(proofHash);
            
            if (proofInfo.isEmpty) {
                return null;
            }

            // Parse proof information
            const proof = proofInfo.toJSON() as any;
            
            return {
                proof_id: proofHash,
                verification_status: proof.status || 'pending',
                block_hash: proof.blockHash || '',
                block_number: proof.blockNumber || 0,
                attestation_id: proof.attestationId,
                merkle_root: proof.merkleRoot
            };
            
        } catch (error) {
            console.error('❌ Failed to get proof receipt:', error);
            return null;
        }
    }

    /**
     * Monitor proof until verification is complete
     */
    async waitForVerification(proofHash: string, timeoutMs: number = 60000): Promise<ProofReceipt> {
        console.log('⏳ Waiting for proof verification...');
        
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeoutMs) {
            const receipt = await this.getProofReceipt(proofHash);
            
            if (receipt && receipt.verification_status !== 'pending') {
                if (receipt.verification_status === 'verified') {
                    console.log('  ✅ Proof verified successfully!');
                    return receipt;
                } else {
                    throw new Error(`Proof verification failed: ${receipt.verification_status}`);
                }
            }
            
            // Wait 2 seconds before checking again
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        throw new Error('Proof verification timeout');
    }

    /**
     * Load SP1 proof from file and submit to zkVerify
     */
    async submitProofFromFile(filePath: string): Promise<ProofReceipt> {
        console.log(`📁 Loading proof from: ${filePath}`);
        
        if (!fs.existsSync(filePath)) {
            throw new Error(`Proof file not found: ${filePath}`);
        }
        
        const proofJson = fs.readFileSync(filePath, 'utf8');
        const proofData: ZkVerifyProofData = JSON.parse(proofJson);
        
        console.log('  ✅ Proof loaded from file');
        
        // First, register the verification key if needed
        try {
            await this.registerVerificationKey(proofData.image_id);
            console.log('  ✅ Verification key registered');
        } catch (error) {
            console.log('  ℹ️  VK already registered or registration failed');
        }
        
        // Submit the proof
        const proofHash = await this.submitProof(proofData);
        
        // Wait for verification
        const receipt = await this.waitForVerification(proofHash);
        
        return receipt;
    }

    /**
     * Disconnect from zkVerify
     */
    async disconnect(): Promise<void> {
        if (this.api) {
            await this.api.disconnect();
            this.api = null;
            console.log('🔌 Disconnected from zkVerify');
        }
    }
}

/**
 * Demo function showing complete SP1 + zkVerify flow
 */
export async function demonstrateZkVerifyIntegration(): Promise<void> {
    console.log('🚀 SP1 + zkVerify Integration Demo');
    console.log('═══════════════════════════════════');
    
    const client = new ZkVerifyClient();
    
    try {
        // Initialize with test account
        await client.initialize('//Alice'); // Test account
        
        // Submit proof from the generated file
        const proofPath = path.join(__dirname, '../order-engine/proof_zkverify.json');
        
        if (fs.existsSync(proofPath)) {
            const receipt = await client.submitProofFromFile(proofPath);
            
            console.log('🎉 zkVerify Integration Successful!');
            console.log(`  Proof ID: ${receipt.proof_id}`);
            console.log(`  Status: ${receipt.verification_status}`);
            console.log(`  Block: ${receipt.block_number}`);
            
            if (receipt.merkle_root) {
                console.log(`  Merkle Root: ${receipt.merkle_root}`);
                console.log('  💡 This Merkle root can be used for on-chain verification!');
            }
        } else {
            console.log('⚠️  Proof file not found. Generate it first:');
            console.log('    cd order-engine && cargo run --bin zkverify -- --generate-proof');
        }
        
    } catch (error) {
        console.error('❌ Demo failed:', error);
    } finally {
        await client.disconnect();
    }
}

// The types and class are already exported above with their declarations
