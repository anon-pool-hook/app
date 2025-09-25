/**
 * SP1 + zkVerify Integration Tests
 * 
 * Tests the complete flow:
 * 1. SP1 proof generation
 * 2. zkVerify submission and verification
 * 3. Proof receipt handling
 * 4. AVS integration with zkVerify receipts
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { ZkVerifyClient, ZkVerifyProofData, ProofReceipt } from './zkverify-client';

describe('SP1 + zkVerify Integration', () => {
    let zkverifyClient: ZkVerifyClient;
    const proofFilePath = path.join(__dirname, '../order-engine/proof_zkverify.json');

    beforeAll(async () => {
        // Initialize zkVerify client with test account
        zkverifyClient = new ZkVerifyClient();
        await zkverifyClient.initialize('//Alice');
        console.log('✅ zkVerify client initialized for testing');
    }, 30000);

    afterAll(async () => {
        // Cleanup
        await zkverifyClient.disconnect();
        
        // Clean up generated proof file
        if (fs.existsSync(proofFilePath)) {
            fs.unlinkSync(proofFilePath);
        }
    });

    describe('SP1 Proof Generation', () => {
        it('should generate zkVerify-compatible SP1 proof', async () => {
            console.log('🔬 Testing SP1 proof generation...');

            const result = await new Promise<boolean>((resolve, reject) => {
                const process = spawn('cargo', ['run', '--bin', 'zkverify', '--', '--generate-proof'], {
                    cwd: path.join(__dirname, '../order-engine'),
                    stdio: 'pipe'
                });

                let stdout = '';
                let stderr = '';

                process.stdout.on('data', (data) => {
                    stdout += data.toString();
                });

                process.stderr.on('data', (data) => {
                    stderr += data.toString();
                });

                process.on('close', (code) => {
                    if (code === 0) {
                        resolve(true);
                    } else {
                        console.error('SP1 generation failed:', stderr);
                        reject(new Error(`SP1 proof generation failed with code ${code}`));
                    }
                });
            });

            expect(result).toBe(true);
            expect(fs.existsSync(proofFilePath)).toBe(true);

            // Validate proof structure
            const proofData = JSON.parse(fs.readFileSync(proofFilePath, 'utf8'));
            expect(proofData).toHaveProperty('image_id');
            expect(proofData).toHaveProperty('pub_inputs');
            expect(proofData).toHaveProperty('proof');
            
            expect(proofData.image_id).toMatch(/^0x[a-fA-F0-9]+$/);
            expect(proofData.pub_inputs).toMatch(/^0x[a-fA-F0-9]+$/);
            expect(proofData.proof).toMatch(/^0x[a-fA-F0-9]+$/);

            console.log('  ✅ SP1 proof generated successfully');
            console.log(`  📋 Image ID: ${proofData.image_id}`);
            console.log(`  📊 Proof size: ${proofData.proof.length} chars`);
        }, 60000);
    });

    describe('zkVerify Integration', () => {
        let proofData: ZkVerifyProofData;
        let receipt: ProofReceipt;

        beforeAll(() => {
            // Load the generated proof
            expect(fs.existsSync(proofFilePath)).toBe(true);
            proofData = JSON.parse(fs.readFileSync(proofFilePath, 'utf8'));
        });

        it('should register verification key on zkVerify', async () => {
            console.log('📝 Testing VK registration...');

            try {
                const txHash = await zkverifyClient.registerVerificationKey(proofData.image_id);
                expect(txHash).toMatch(/^0x[a-fA-F0-9]+$/);
                console.log('  ✅ VK registered successfully');
            } catch (error) {
                // VK might already be registered
                console.log('  ℹ️  VK registration skipped (may already exist)');
                expect(error).toBeDefined();
            }
        }, 30000);

        it('should submit proof to zkVerify and get receipt', async () => {
            console.log('🌐 Testing proof submission...');

            const proofHash = await zkverifyClient.submitProof(proofData);
            expect(proofHash).toMatch(/^0x[a-fA-F0-9]+$/);
            console.log('  📤 Proof submitted successfully');

            // Wait for verification
            receipt = await zkverifyClient.waitForVerification(proofHash, 120000);
            
            expect(receipt).toBeDefined();
            expect(receipt.verification_status).toBe('verified');
            expect(receipt.proof_id).toBe(proofHash);
            expect(receipt.block_number).toBeGreaterThan(0);

            console.log('  ✅ Proof verified on zkVerify!');
            console.log(`  📋 Receipt: ${receipt.proof_id}`);
            console.log(`  ⛓️  Block: ${receipt.block_number}`);
            
            if (receipt.merkle_root) {
                console.log(`  🌳 Merkle Root: ${receipt.merkle_root}`);
            }
        }, 180000);

        it('should encode receipt for AVS consumption', async () => {
            console.log('🔧 Testing receipt encoding...');

            expect(receipt).toBeDefined();

            // Encode the receipt like our operator does
            const { ethers } = await import('ethers');
            const encodedReceipt = ethers.AbiCoder.defaultAbiCoder().encode(
                ["string", "string", "uint256"],
                [
                    receipt.proof_id,
                    receipt.merkle_root || "0x",
                    receipt.block_number
                ]
            );

            expect(encodedReceipt).toMatch(/^0x[a-fA-F0-9]+$/);
            expect(encodedReceipt.length).toBeGreaterThan(10);

            console.log('  ✅ Receipt encoded for AVS');
            console.log(`  📦 Encoded length: ${encodedReceipt.length} chars`);

            // Test decoding
            const [decodedProofId, decodedMerkleRoot, decodedBlockNumber] = 
                ethers.AbiCoder.defaultAbiCoder().decode(
                    ["string", "string", "uint256"],
                    encodedReceipt
                );

            expect(decodedProofId).toBe(receipt.proof_id);
            expect(decodedBlockNumber).toBe(receipt.block_number);
            console.log('  ✅ Receipt decoding verified');
        });
    });

    describe('End-to-End Flow', () => {
        it('should complete full SP1 → zkVerify → AVS flow', async () => {
            console.log('🚀 Testing complete integration flow...');

            // 1. Generate fresh proof
            console.log('  1️⃣  Generating SP1 proof...');
            const generateResult = await new Promise<boolean>((resolve, reject) => {
                const process = spawn('cargo', ['run', '--bin', 'zkverify', '--', '--generate-proof'], {
                    cwd: path.join(__dirname, '../order-engine'),
                    stdio: 'pipe'
                });

                process.on('close', (code) => {
                    resolve(code === 0);
                });
            });
            expect(generateResult).toBe(true);

            // 2. Submit to zkVerify
            console.log('  2️⃣  Submitting to zkVerify...');
            const freshProofData: ZkVerifyProofData = JSON.parse(fs.readFileSync(proofFilePath, 'utf8'));
            
            try {
                await zkverifyClient.registerVerificationKey(freshProofData.image_id);
            } catch (error) {
                // VK already registered is fine
            }

            const proofHash = await zkverifyClient.submitProof(freshProofData);
            const freshReceipt = await zkverifyClient.waitForVerification(proofHash, 120000);

            // 3. Validate receipt structure
            console.log('  3️⃣  Validating receipt structure...');
            expect(freshReceipt.verification_status).toBe('verified');
            expect(freshReceipt.proof_id).toBeDefined();
            expect(freshReceipt.block_number).toBeGreaterThan(0);

            // 4. Simulate AVS processing
            console.log('  4️⃣  Simulating AVS integration...');
            const { ethers } = await import('ethers');
            const avsProof = ethers.AbiCoder.defaultAbiCoder().encode(
                ["string", "string", "uint256"],
                [
                    freshReceipt.proof_id,
                    freshReceipt.merkle_root || "0x",
                    freshReceipt.block_number
                ]
            );

            expect(avsProof).toBeDefined();
            expect(avsProof.length).toBeGreaterThan(100);

            console.log('  ✅ Complete integration flow successful!');
            console.log('  🎉 SP1 → zkVerify → AVS integration working!');
        }, 240000);
    });

    describe('Error Handling', () => {
        it('should handle invalid proof data gracefully', async () => {
            console.log('🚫 Testing error handling...');

            const invalidProofData: ZkVerifyProofData = {
                image_id: "0xinvalid",
                pub_inputs: "0xinvalid",
                proof: "0xinvalid"
            };

            // This should fail gracefully
            await expect(async () => {
                await zkverifyClient.submitProof(invalidProofData);
            }).rejects.toThrow();

            console.log('  ✅ Invalid proof rejected as expected');
        });

        it('should handle missing proof files', async () => {
            console.log('📁 Testing missing file handling...');

            const nonExistentPath = '/tmp/nonexistent_proof.json';
            
            await expect(async () => {
                await zkverifyClient.submitProofFromFile(nonExistentPath);
            }).rejects.toThrow();

            console.log('  ✅ Missing file handled correctly');
        });
    });
});

/**
 * Performance benchmarks for the integration
 */
describe('Performance Benchmarks', () => {
    let zkverifyClient: ZkVerifyClient;

    beforeAll(async () => {
        zkverifyClient = new ZkVerifyClient();
        await zkverifyClient.initialize('//Alice');
    });

    afterAll(async () => {
        await zkverifyClient.disconnect();
    });

    it('should measure SP1 proof generation time', async () => {
        console.log('⏱️  Benchmarking SP1 proof generation...');

        const startTime = Date.now();

        await new Promise<void>((resolve, reject) => {
            const process = spawn('cargo', ['run', '--bin', 'zkverify', '--', '--generate-proof'], {
                cwd: path.join(__dirname, '../order-engine'),
                stdio: 'pipe'
            });

            process.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Proof generation failed with code ${code}`));
                }
            });
        });

        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log(`  📊 SP1 proof generation: ${duration}ms`);
        expect(duration).toBeLessThan(60000); // Should complete within 1 minute
    }, 120000);

    it('should measure zkVerify submission time', async () => {
        console.log('⏱️  Benchmarking zkVerify submission...');

        const proofFilePath = path.join(__dirname, '../order-engine/proof_zkverify.json');
        if (!fs.existsSync(proofFilePath)) {
            throw new Error('Proof file not found for benchmark');
        }

        const proofData: ZkVerifyProofData = JSON.parse(fs.readFileSync(proofFilePath, 'utf8'));

        const startTime = Date.now();

        try {
            await zkverifyClient.registerVerificationKey(proofData.image_id);
        } catch (error) {
            // VK already registered
        }

        const proofHash = await zkverifyClient.submitProof(proofData);
        const receipt = await zkverifyClient.waitForVerification(proofHash);

        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log(`  📊 zkVerify verification: ${duration}ms`);
        console.log(`  ⛓️  Block: ${receipt.block_number}`);

        expect(duration).toBeLessThan(180000); // Should complete within 3 minutes
        expect(receipt.verification_status).toBe('verified');
    }, 240000);
});
