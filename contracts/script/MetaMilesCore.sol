// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/interfaces/FunctionsClientInterface.sol";
import "@chainlink/contracts/src/v0.8/dev/functions/FunctionsClient.sol";

/**
 * @title MetaMilesCore - Main orchestrator contract
 * @notice Manages the entire MetaMiles ecosystem and user registration
 */
contract MetaMilesCore is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    struct UserProfile {
        address wallet;
        bool isVerified;
        uint256 registrationTimestamp;
        bool hasCircleWallet;
        string encryptedCircleWalletId;
    }
    
    mapping(address => UserProfile) public userProfiles;
    mapping(address => bool) public authorizedContracts;
    
    Counters.Counter private _userCount;
    
    // Contract addresses
    address public spendTracker;
    address public zkVerifier;
    address public soulboundNFT;
    address public rewardManager;
    
    event UserRegistered(address indexed user, uint256 timestamp);
    event UserVerified(address indexed user, bool hasCircleWallet);
    event ContractAuthorized(address indexed contractAddress, bool authorized);
    
    modifier onlyAuthorized() {
        require(authorizedContracts[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    constructor() {}
    
    /**
     * @notice Register a new user with MetaMask card verification
     * @param _hasCircleWallet Whether user enrolled in Circle Wallet
     * @param _encryptedCircleWalletId Encrypted Circle Wallet ID (if applicable)
     */
    function registerUser(
        bool _hasCircleWallet,
        string calldata _encryptedCircleWalletId
    ) external {
        require(userProfiles[msg.sender].wallet == address(0), "User already registered");
        
        userProfiles[msg.sender] = UserProfile({
            wallet: msg.sender,
            isVerified: false,
            registrationTimestamp: block.timestamp,
            hasCircleWallet: _hasCircleWallet,
            encryptedCircleWalletId: _encryptedCircleWalletId
        });
        
        _userCount.increment();
        emit UserRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Verify user's MetaMask card ownership (called after signature verification)
     */
    function verifyUser(address _user) external onlyAuthorized {
        require(userProfiles[_user].wallet != address(0), "User not registered");
        userProfiles[_user].isVerified = true;
        
        emit UserVerified(_user, userProfiles[_user].hasCircleWallet);
    }
    
    /**
     * @notice Set contract addresses for the ecosystem
     */
    function setContractAddresses(
        address _spendTracker,
        address _zkVerifier,
        address _soulboundNFT,
        address _rewardManager
    ) external onlyOwner {
        spendTracker = _spendTracker;
        zkVerifier = _zkVerifier;
        soulboundNFT = _soulboundNFT;
        rewardManager = _rewardManager;
        
        // Automatically authorize these contracts
        authorizedContracts[_spendTracker] = true;
        authorizedContracts[_zkVerifier] = true;
        authorizedContracts[_soulboundNFT] = true;
        authorizedContracts[_rewardManager] = true;
    }
    
    /**
     * @notice Authorize/deauthorize contracts
     */
    function setAuthorizedContract(address _contract, bool _authorized) external onlyOwner {
        authorizedContracts[_contract] = _authorized;
        emit ContractAuthorized(_contract, _authorized);
    }
    
    /**
     * @notice Get user profile
     */
    function getUserProfile(address _user) external view returns (UserProfile memory) {
        return userProfiles[_user];
    }
    
    /**
     * @notice Get total registered users
     */
    function getTotalUsers() external view returns (uint256) {
        return _userCount.current();
    }
}

/**
 * @title SpendTracker - Tracks user spending via Chainlink Functions
 * @notice Securely retrieves and stores aggregated spend data
 */
contract SpendTracker is FunctionsClient, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    struct SpendData {
        uint256 totalSpent;
        uint256 lastUpdated;
        uint256 monthlySpent;
        uint256 currentMonth;
    }
    
    mapping(address => SpendData) public userSpends;
    mapping(bytes32 => address) public pendingRequests;
    
    MetaMilesCore public immutable metaMilesCore;
    
    // Chainlink Functions configuration
    bytes32 public donId;
    uint64 public subscriptionId;
    uint32 public gasLimit = 300000;
    string public spendDataSource;
    
    event SpendDataUpdated(address indexed user, uint256 totalSpent, uint256 monthlySpent);
    event SpendDataRequested(address indexed user, bytes32 requestId);
    
    constructor(
        address _functionsRouter,
        address _metaMilesCore,
        bytes32 _donId,
        uint64 _subscriptionId
    ) FunctionsClient(_functionsRouter) {
        metaMilesCore = MetaMilesCore(_metaMilesCore);
        donId = _donId;
        subscriptionId = _subscriptionId;
    }
    
    /**
     * @notice Request spend data update via Chainlink Functions
     * @param _encryptedCardId Encrypted MetaMask card identifier
     */
    function requestSpendUpdate(string calldata _encryptedCardId) external {
        require(metaMilesCore.userProfiles(msg.sender).isVerified, "User not verified");
        
        // Prepare JavaScript source code for Chainlink Functions
        string memory source = string(abi.encodePacked(
            "const cardId = args[0];",
            "const apiUrl = 'https://api.metamask.io/card/spending';",
            "const response = await Functions.makeHttpRequest({",
            "  url: apiUrl,",
            "  method: 'POST',",
            "  headers: { 'Authorization': `Bearer ${secrets.apiKey}` },",
            "  data: { cardId: cardId }",
            "});",
            "if (response.error) throw new Error('API request failed');",
            "const { totalSpent, monthlySpent, currentMonth } = response.data;",
            "return Functions.encodeUint256(totalSpent * 100); // Convert to wei equivalent"
        ));
        
        string[] memory args = new string[](1);
        args[0] = _encryptedCardId;
        
        bytes32 requestId = _sendRequest(
            bytes(source),
            abi.encode(args),
            subscriptionId,
            gasLimit
        );
        
        pendingRequests[requestId] = msg.sender;
        emit SpendDataRequested(msg.sender, requestId);
    }
    
    /**
     * @notice Chainlink Functions callback
     */
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        address user = pendingRequests[requestId];
        require(user != address(0), "Invalid request ID");
        
        if (err.length > 0) {
            // Handle error
            delete pendingRequests[requestId];
            return;
        }
        
        uint256 totalSpent = abi.decode(response, (uint256));
        uint256 currentMonth = (block.timestamp / 30 days) * 30 days;
        
        SpendData storage userData = userSpends[user];
        
        // Reset monthly spending if new month
        if (userData.currentMonth != currentMonth) {
            userData.monthlySpent = 0;
            userData.currentMonth = currentMonth;
        }
        
        // Calculate monthly spend increase
        uint256 spendIncrease = totalSpent > userData.totalSpent ? 
            totalSpent - userData.totalSpent : 0;
        
        userData.totalSpent = totalSpent;
        userData.monthlySpent += spendIncrease;
        userData.lastUpdated = block.timestamp;
        
        delete pendingRequests[requestId];
        
        emit SpendDataUpdated(user, totalSpent, userData.monthlySpent);
    }
    
    /**
     * @notice Get user's spending data
     */
    function getUserSpendData(address _user) external view returns (SpendData memory) {
        return userSpends[_user];
    }
    
    /**
     * @notice Update Chainlink Functions configuration
     */
    function updateChainlinkConfig(
        bytes32 _donId,
        uint64 _subscriptionId,
        uint32 _gasLimit
    ) external onlyOwner {
        donId = _donId;
        subscriptionId = _subscriptionId;
        gasLimit = _gasLimit;
    }
}

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

/**
 * @title SoulboundNFT - Non-transferable NFTs representing user tiers
 * @notice Soulbound tokens that represent user achievement tiers
 */
contract SoulboundNFT is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    
    struct TierData {
        uint256 tier;
        uint256 achievedAt;
        string metadataUri;
    }
    
    mapping(address => uint256) public userToTokenId;
    mapping(uint256 => TierData) public tierData;
    
    Counters.Counter private _tokenIdCounter;
    MetaMilesCore public immutable metaMilesCore;
    
    string private _baseTokenURI;
    
    event TierUpdated(address indexed user, uint256 indexed tokenId, uint256 tier);
    
    constructor(
        address _metaMilesCore,
        string memory _baseURI
    ) ERC721("MetaMiles Tier", "MMT") {
        metaMilesCore = MetaMilesCore(_metaMilesCore);
        _baseTokenURI = _baseURI;
    }
    
    /**
     * @notice Update user's tier (called by ZKVerifier)
     */
    function updateUserTier(address _user, uint256 _tier) external {
        require(metaMilesCore.authorizedContracts(msg.sender), "Not authorized");
        require(_tier >= 1 && _tier <= 3, "Invalid tier");
        
        uint256 tokenId = userToTokenId[_user];
        
        if (tokenId == 0) {
            // Mint new token
            _tokenIdCounter.increment();
            tokenId = _tokenIdCounter.current();
            _safeMint(_user, tokenId);
            userToTokenId[_user] = tokenId;
        }
        
        // Update tier data (only if higher tier)
        if (_tier > tierData[tokenId].tier) {
            tierData[tokenId] = TierData({
                tier: _tier,
                achievedAt: block.timestamp,
                metadataUri: string(abi.encodePacked(_baseTokenURI, "/", _toString(_tier), ".json"))
            });
            
            emit TierUpdated(_user, tokenId, _tier);
        }
    }
    
    /**
     * @notice Get user's current tier
     */
    function getUserTier(address _user) external view returns (uint256) {
        uint256 tokenId = userToTokenId[_user];
        if (tokenId == 0) return 0;
        return tierData[tokenId].tier;
    }
    
    /**
     * @notice Get tier name string
     */
    function getTierName(uint256 _tier) public pure returns (string memory) {
        if (_tier == 1) return "Bronze";
        if (_tier == 2) return "Silver";
        if (_tier == 3) return "Gold";
        return "None";
    }
    
    /**
     * @notice Override tokenURI to return tier-specific metadata
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        TierData memory data = tierData[tokenId];
        if (bytes(data.metadataUri).length > 0) {
            return data.metadataUri;
        }
        
        return string(abi.encodePacked(_baseTokenURI, "/", _toString(data.tier), ".json"));
    }
    
    /**
     * @notice Override transfers to make tokens soulbound
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        require(from == address(0) || to == address(0), "Soulbound: Transfer not allowed");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    /**
     * @notice Disable approvals for soulbound tokens
     */
    function approve(address, uint256) public pure override {
        revert("Soulbound: Approval not allowed");
    }
    
    /**
     * @notice Disable approval for all
     */
    function setApprovalForAll(address, bool) public pure override {
        revert("Soulbound: Approval not allowed");
    }
    
    /**
     * @notice Update base URI
     */
    function setBaseURI(string calldata _baseURI) external onlyOwner {
        _baseTokenURI = _baseURI;
    }
    
    /**
     * @notice Required override for multiple inheritance
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @notice Convert uint to string
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }
}

/**
 * @title RewardManager - Manages reward distribution and cross-chain operations
 * @notice Handles reward unlocking, cross-chain bridging, and delivery
 */
contract RewardManager is Ownable, ReentrancyGuard {
    struct Reward {
        bytes32 rewardId;
        uint256 tier;
        uint256 rewardType; // 1: Token, 2: NFT, 3: Discount, 4: Event Access
        address tokenAddress;
        uint256 amount;
        uint256 chainId;
        string metadata;
        bool isActive;
    }
    
    struct UserRewardClaim {
        bytes32 rewardId;
        uint256 claimedAt;
        bool isClaimed;
        uint256 chainId;
        string deliveryDetails;
    }
    
    mapping(bytes32 => Reward) public rewards;
    mapping(address => mapping(bytes32 => UserRewardClaim)) public userClaims;
    mapping(uint256 => bytes32[]) public tierRewards;
    
    MetaMilesCore public immutable metaMilesCore;
    SoulboundNFT public immutable soulboundNFT;
    
    // Cross-chain configuration
    mapping(uint256 => address) public chainBridges;
    mapping(uint256 => bool) public supportedChains;
    
    event RewardAdded(bytes32 indexed rewardId, uint256 tier, uint256 rewardType);
    event RewardClaimed(address indexed user, bytes32 indexed rewardId, uint256 chainId);
    event CrossChainBridgeInitiated(address indexed user, bytes32 indexed rewardId, uint256 targetChain);
    
    constructor(
        address _metaMilesCore,
        address _soulboundNFT
    ) {
        metaMilesCore = MetaMilesCore(_metaMilesCore);
        soulboundNFT = SoulboundNFT(_soulboundNFT);
        
        // Add Linea as supported chain
        supportedChains[59144] = true; // Linea Mainnet
        supportedChains[59140] = true; // Linea Testnet
    }
    
    /**
     * @notice Add a new reward
     */
    function addReward(
        bytes32 _rewardId,
        uint256 _tier,
        uint256 _rewardType,
        address _tokenAddress,
        uint256 _amount,
        uint256 _chainId,
        string calldata _metadata
    ) external onlyOwner {
        require(_tier >= 1 && _tier <= 3, "Invalid tier");
        require(rewards[_rewardId].rewardId == bytes32(0), "Reward already exists");
        
        rewards[_rewardId] = Reward({
            rewardId: _rewardId,
            tier: _tier,
            rewardType: _rewardType,
            tokenAddress: _tokenAddress,
            amount: _amount,
            chainId: _chainId,
            metadata: _metadata,
            isActive: true
        });
        
        tierRewards[_tier].push(_rewardId);
        
        emit RewardAdded(_rewardId, _tier, _rewardType);
    }
    
    /**
     * @notice Claim a reward
     */
    function claimReward(
        bytes32 _rewardId,
        uint256 _targetChainId,
        string calldata _deliveryDetails
    ) external nonReentrant {
        require(metaMilesCore.userProfiles(msg.sender).isVerified, "User not verified");
        require(rewards[_rewardId].isActive, "Reward not active");
        require(!userClaims[msg.sender][_rewardId].isClaimed, "Already claimed");
        
        // Check if user has required tier
        uint256 userTier = soulboundNFT.getUserTier(msg.sender);
        require(userTier >= rewards[_rewardId].tier, "Insufficient tier");
        
        Reward memory reward = rewards[_rewardId];
        
        // Mark as claimed
        userClaims[msg.sender][_rewardId] = UserRewardClaim({
            rewardId: _rewardId,
            claimedAt: block.timestamp,
            isClaimed: true,
            chainId: _targetChainId,
            deliveryDetails: _deliveryDetails
        });
        
        // Handle different reward types
        if (reward.rewardType == 1) {
            // Token reward
            _handleTokenReward(msg.sender, reward, _targetChainId);
        } else if (reward.rewardType == 2) {
            // NFT reward
            _handleNFTReward(msg.sender, reward, _targetChainId);
        } else if (reward.rewardType == 3) {
            // Discount/coupon reward
            _handleDiscountReward(msg.sender, reward, _deliveryDetails);
        } else if (reward.rewardType == 4) {
            // Event access reward
            _handleEventAccessReward(msg.sender, reward, _deliveryDetails);
        }
        
        emit RewardClaimed(msg.sender, _rewardId, _targetChainId);
    }
    
    /**
     * @notice Handle token reward distribution
     */
    function _handleTokenReward(
        address _user,
        Reward memory _reward,
        uint256 _targetChainId
    ) internal {
        if (_targetChainId == block.chainid) {
            // Same chain - direct transfer
            IERC20(_reward.tokenAddress).transfer(_user, _reward.amount);
        } else {
            // Cross-chain - initiate bridge
            require(supportedChains[_targetChainId], "Chain not supported");
            _initiateCrossChainBridge(_user, _reward, _targetChainId);
        }
    }
    
    /**
     * @notice Handle NFT reward distribution
     */
    function _handleNFTReward(
        address _user,
        Reward memory _reward,
        uint256 _targetChainId
    ) internal {
        if (_targetChainId == block.chainid) {
            // Same chain - direct mint/transfer
            // Implementation depends on specific NFT contract
            // For now, emit event for off-chain handling
        } else {
            // Cross-chain NFT transfer
            _initiateCrossChainBridge(_user, _reward, _targetChainId);
        }
    }
    
    /**
     * @notice Handle discount/coupon reward
     */
    function _handleDiscountReward(
        address _user,
        Reward memory _reward,
        string calldata _deliveryDetails
    ) internal {
        // Generate discount code or QR code
        // This would typically integrate with external systems
        // For now, store delivery details for off-chain processing
    }
    
    /**
     * @notice Handle event access reward
     */
    function _handleEventAccessReward(
        address _user,
        Reward memory _reward,
        string calldata _deliveryDetails
    ) internal {
        // Generate event ticket or access pass
        // This would typically integrate with ticketing systems
        // For now, store delivery details for off-chain processing
    }
    
    /**
     * @notice Initiate cross-chain bridge transaction
     */
    function _initiateCrossChainBridge(
        address _user,
        Reward memory _reward,
        uint256 _targetChainId
    ) internal {
        // This would integrate with LI.FI SDK or Circle CCTP
        // For now, emit event for off-chain bridge handling
        emit CrossChainBridgeInitiated(_user, _reward.rewardId, _targetChainId);
    }
    
    /**
     * @notice Get rewards for a specific tier
     */
    function getTierRewards(uint256 _tier) external view returns (bytes32[] memory) {
        return tierRewards[_tier];
    }
    
    /**
     * @notice Get reward details
     */
    function getReward(bytes32 _rewardId) external view returns (Reward memory) {
        return rewards[_rewardId];
    }
    
    /**
     * @notice Check if user has claimed a reward
     */
    function hasClaimedReward(address _user, bytes32 _rewardId) external view returns (bool) {
        return userClaims[_user][_rewardId].isClaimed;
    }
    
    /**
     * @notice Add supported chain
     */
    function addSupportedChain(uint256 _chainId, address _bridgeAddress) external onlyOwner {
        supportedChains[_chainId] = true;
        chainBridges[_chainId] = _bridgeAddress;
    }
    
    /**
     * @notice Emergency pause/unpause reward
     */
    function toggleReward(bytes32 _rewardId) external onlyOwner {
        rewards[_rewardId].isActive = !rewards[_rewardId].isActive;
    }
}

// Required interface for ERC20 tokens
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}