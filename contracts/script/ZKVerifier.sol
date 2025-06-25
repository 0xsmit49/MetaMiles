// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ZKVerifier - Verifies zero-knowledge proofs for spending thresholds
 * @notice Validates ZK-SNARK proofs without revealing transaction details
 */
contract ZKVerifier is Ownable {
    struct ProofData {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
        uint256[] publicSignals;
    }
    
    struct VerificationKey {
        uint256[2] alpha;
        uint256[2][2] beta;
        uint256[2][2] gamma;
        uint256[2][2] delta;
        uint256[][] ic;
    }
    
    mapping(address => mapping(bytes32 => bool)) public verifiedProofs;
    mapping(bytes32 => uint256) public spendingThresholds;
    
    MetaMilesCore public immutable metaMilesCore;
    SoulboundNFT public soulboundNFT;
    
    VerificationKey public verificationKey;
    
    event ProofVerified(address indexed user, bytes32 indexed proofType, uint256 tier);
    event ThresholdUpdated(bytes32 indexed proofType, uint256 threshold);
    
    constructor(address _metaMilesCore) {
        metaMilesCore = MetaMilesCore(_metaMilesCore);
        
        // Initialize spending thresholds
        spendingThresholds[keccak256("BRONZE")] = 100 * 1e18; // $100
        spendingThresholds[keccak256("SILVER")] = 500 * 1e18; // $500
        spendingThresholds[keccak256("GOLD")] = 1000 * 1e18; // $1000
    }
    
    /**
     * @notice Verify a ZK-SNARK proof for spending threshold
     * @param _proofType Type of proof (BRONZE, SILVER, GOLD)
     * @param _proof The ZK-SNARK proof
     */
    function verifySpendingProof(
        bytes32 _proofType,
        ProofData calldata _proof
    ) external {
        require(metaMilesCore.userProfiles(msg.sender).isVerified, "User not verified");
        require(!verifiedProofs[msg.sender][_proofType], "Proof already verified");
        
        // Verify the ZK-SNARK proof
        bool isValid = _verifyProof(_proof);
        require(isValid, "Invalid proof");
        
        // Mark proof as verified
        verifiedProofs[msg.sender][_proofType] = true;
        
        // Determine tier based on proof type
        uint256 tier = _getTierFromProofType(_proofType);
        
        // Mint or update Soulbound NFT
        if (address(soulboundNFT) != address(0)) {
            soulboundNFT.updateUserTier(msg.sender, tier);
        }
        
        emit ProofVerified(msg.sender, _proofType, tier);
    }
    
    /**
     * @notice Internal function to verify ZK-SNARK proof
     */
    function _verifyProof(ProofData calldata _proof) internal view returns (bool) {
        // Simplified verification - in production, use a proper ZK-SNARK verifier
        // This would typically use a Groth16 or PLONK verifier
        
        // For now, we'll do basic validation
        require(_proof.publicSignals.length > 0, "No public signals");
        require(_proof.a[0] != 0 || _proof.a[1] != 0, "Invalid proof point A");
        
        // In a real implementation, this would verify the cryptographic proof
        // against the verification key and public signals
        return true;
    }
    
    /**
     * @notice Get tier number from proof type
     */
    function _getTierFromProofType(bytes32 _proofType) internal pure returns (uint256) {
        if (_proofType == keccak256("BRONZE")) return 1;
        if (_proofType == keccak256("SILVER")) return 2;
        if (_proofType == keccak256("GOLD")) return 3;
        return 0;
    }
    
    /**
     * @notice Set Soulbound NFT contract address
     */
    function setSoulboundNFT(address _soulboundNFT) external onlyOwner {
        soulboundNFT = SoulboundNFT(_soulboundNFT);
    }
    
    /**
     * @notice Update spending threshold for a tier
     */
    function updateSpendingThreshold(bytes32 _proofType, uint256 _threshold) external onlyOwner {
        spendingThresholds[_proofType] = _threshold;
        emit ThresholdUpdated(_proofType, _threshold);
    }
    
    /**
     * @notice Check if user has verified proof for a specific type
     */
    function hasVerifiedProof(address _user, bytes32 _proofType) external view returns (bool) {
        return verifiedProofs[_user][_proofType];
    }
}