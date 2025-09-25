// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/// @title zkVerify Bridge Contract
/// @notice Verifies zkVerify proof receipts by checking Merkle roots published from zkVerify blockchain
/// @dev This contract acts as a bridge between zkVerify blockchain and Ethereum/other EVM chains
contract ZkVerifyBridge is Ownable, ReentrancyGuard, Pausable {
    
    /// @notice zkVerify proof receipt structure
    struct ZkVerifyReceipt {
        string proofId;         // Unique proof identifier from zkVerify
        string merkleRoot;      // Merkle root of aggregated proofs
        uint256 blockNumber;    // zkVerify block number
        uint256 timestamp;      // When the proof was verified
        bool verified;          // Whether the receipt is valid
    }
    
    /// @notice Stored Merkle roots from zkVerify blockchain
    mapping(string => ZkVerifyReceipt) public zkVerifyReceipts;
    
    /// @notice Valid Merkle roots published by zkVerify
    mapping(string => bool) public validMerkleRoots;
    
    /// @notice Authorized relayers who can publish zkVerify data
    mapping(address => bool) public authorizedRelayers;
    
    /// @notice zkVerify blockchain info
    string public zkVerifyRPC = "wss://testnet-rpc.zkverify.io";
    uint256 public zkVerifyChainId = 1; // zkVerify chain ID
    
    /// @notice Events
    event MerkleRootPublished(string indexed merkleRoot, uint256 zkVerifyBlock, address relayer);
    event ProofReceiptStored(string indexed proofId, string merkleRoot, uint256 zkVerifyBlock);
    event RelayerAdded(address indexed relayer);
    event RelayerRemoved(address indexed relayer);
    
    /// @notice Errors
    error UnauthorizedRelayer();
    error InvalidMerkleRoot();
    error ProofAlreadyExists();
    error ProofNotFound();
    error InvalidBlockNumber();
    error InvalidTimestamp();
    
    constructor() {
        // Add deployer as initial relayer
        authorizedRelayers[msg.sender] = true;
        emit RelayerAdded(msg.sender);
    }
    
    modifier onlyRelayer() {
        if (!authorizedRelayers[msg.sender]) revert UnauthorizedRelayer();
        _;
    }
    
    /// @notice Add authorized relayer
    /// @param relayer Address to authorize for publishing zkVerify data
    function addRelayer(address relayer) external onlyOwner {
        require(relayer != address(0), "Invalid relayer address");
        authorizedRelayers[relayer] = true;
        emit RelayerAdded(relayer);
    }
    
    /// @notice Remove authorized relayer
    /// @param relayer Address to remove authorization from
    function removeRelayer(address relayer) external onlyOwner {
        authorizedRelayers[relayer] = false;
        emit RelayerRemoved(relayer);
    }
    
    /// @notice Publish Merkle root from zkVerify blockchain
    /// @param merkleRoot The aggregated proof Merkle root from zkVerify
    /// @param zkVerifyBlock The zkVerify block number where proofs were aggregated
    function publishMerkleRoot(
        string calldata merkleRoot,
        uint256 zkVerifyBlock
    ) external onlyRelayer whenNotPaused {
        require(bytes(merkleRoot).length > 0, "Empty merkle root");
        require(zkVerifyBlock > 0, "Invalid block number");
        
        // Store the valid Merkle root
        validMerkleRoots[merkleRoot] = true;
        
        emit MerkleRootPublished(merkleRoot, zkVerifyBlock, msg.sender);
    }
    
    /// @notice Store zkVerify proof receipt
    /// @param proofId Unique identifier for the proof
    /// @param merkleRoot Merkle root containing this proof
    /// @param zkVerifyBlock Block number where proof was verified
    function storeProofReceipt(
        string calldata proofId,
        string calldata merkleRoot, 
        uint256 zkVerifyBlock
    ) external onlyRelayer whenNotPaused {
        require(bytes(proofId).length > 0, "Empty proof ID");
        require(bytes(merkleRoot).length > 0, "Empty merkle root");
        require(zkVerifyBlock > 0, "Invalid block number");
        
        // Check if proof already exists
        if (zkVerifyReceipts[proofId].verified) revert ProofAlreadyExists();
        
        // Verify the Merkle root was published
        if (!validMerkleRoots[merkleRoot]) revert InvalidMerkleRoot();
        
        // Store the receipt
        zkVerifyReceipts[proofId] = ZkVerifyReceipt({
            proofId: proofId,
            merkleRoot: merkleRoot,
            blockNumber: zkVerifyBlock,
            timestamp: block.timestamp,
            verified: true
        });
        
        emit ProofReceiptStored(proofId, merkleRoot, zkVerifyBlock);
    }
    
    /// @notice Verify zkVerify proof receipt
    /// @param proofId The proof identifier to verify
    /// @return bool True if proof receipt is valid and verified
    function verifyProofReceipt(string calldata proofId) 
        external 
        view 
        returns (bool) 
    {
        ZkVerifyReceipt memory receipt = zkVerifyReceipts[proofId];
        
        // Check if receipt exists and is verified
        if (!receipt.verified) return false;
        
        // Check if Merkle root is still valid
        if (!validMerkleRoots[receipt.merkleRoot]) return false;
        
        // Additional time-based validation (proofs shouldn't be too old)
        if (block.timestamp - receipt.timestamp > 7 days) return false;
        
        return true;
    }
    
    /// @notice Verify Merkle root exists and is valid
    /// @param merkleRoot The Merkle root to verify
    /// @param zkVerifyBlock The claimed zkVerify block number (for additional validation)
    /// @return bool True if Merkle root is valid
    function verifyMerkleRoot(
        string calldata merkleRoot,
        uint256 zkVerifyBlock
    ) external view returns (bool) {
        // Basic validation
        if (bytes(merkleRoot).length == 0) return false;
        if (zkVerifyBlock == 0) return false;
        
        // Check if Merkle root is valid
        return validMerkleRoots[merkleRoot];
    }
    
    /// @notice Get proof receipt details
    /// @param proofId The proof identifier
    /// @return receipt The complete proof receipt
    function getProofReceipt(string calldata proofId) 
        external 
        view 
        returns (ZkVerifyReceipt memory receipt) 
    {
        return zkVerifyReceipts[proofId];
    }
    
    /// @notice Batch verify multiple proof receipts
    /// @param proofIds Array of proof identifiers to verify
    /// @return results Array of verification results
    function batchVerifyProofReceipts(string[] calldata proofIds)
        external
        view
        returns (bool[] memory results)
    {
        results = new bool[](proofIds.length);
        
        for (uint i = 0; i < proofIds.length; i++) {
            ZkVerifyReceipt memory receipt = zkVerifyReceipts[proofIds[i]];
            results[i] = receipt.verified && 
                        validMerkleRoots[receipt.merkleRoot] &&
                        (block.timestamp - receipt.timestamp <= 7 days);
        }
    }
    
    /// @notice Emergency pause function
    function pause() external onlyOwner {
        _pause();
    }
    
    /// @notice Unpause function
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /// @notice Update zkVerify RPC endpoint (for reference)
    /// @param newRPC New zkVerify RPC endpoint
    function updateZkVerifyRPC(string calldata newRPC) external onlyOwner {
        zkVerifyRPC = newRPC;
    }
    
    /// @notice Clean up old proof receipts (for gas efficiency)
    /// @param proofIds Array of old proof IDs to remove
    function cleanupOldReceipts(string[] calldata proofIds) 
        external 
        onlyOwner 
    {
        for (uint i = 0; i < proofIds.length; i++) {
            ZkVerifyReceipt storage receipt = zkVerifyReceipts[proofIds[i]];
            
            // Only clean up receipts older than 30 days
            if (block.timestamp - receipt.timestamp > 30 days) {
                delete zkVerifyReceipts[proofIds[i]];
            }
        }
    }
    
    /// @notice Get contract info for debugging
    /// @return zkRPC The zkVerify RPC endpoint
    /// @return chainId The zkVerify chain ID
    /// @return relayerCount Number of authorized relayers
    function getContractInfo() 
        external 
        view 
        returns (
            string memory zkRPC,
            uint256 chainId, 
            uint256 relayerCount
        ) 
    {
        zkRPC = zkVerifyRPC;
        chainId = zkVerifyChainId;
        
        // Count authorized relayers (simple implementation)
        // In production, you might want to track this more efficiently
        relayerCount = 0;
        // This is a placeholder - in practice you'd maintain a count or array
    }
}

/// @title zkVerify Relayer Service
/// @notice Automated service to relay zkVerify data to this bridge contract
/// @dev This would typically be run off-chain, but we define the interface here
interface IZkVerifyRelayer {
    
    /// @notice Relay aggregated proofs from zkVerify to bridge
    /// @param merkleRoot The Merkle root to publish
    /// @param zkVerifyBlock The zkVerify block number
    /// @param proofs Array of individual proofs in this aggregation
    function relayAggregation(
        string calldata merkleRoot,
        uint256 zkVerifyBlock,
        string[] calldata proofs
    ) external;
    
    /// @notice Get latest zkVerify block processed
    /// @return blockNumber The latest processed zkVerify block
    function getLatestProcessedBlock() external view returns (uint256 blockNumber);
    
    /// @notice Check if relayer is synced with zkVerify
    /// @return synced Whether relayer is up to date
    function isSynced() external view returns (bool synced);
}
