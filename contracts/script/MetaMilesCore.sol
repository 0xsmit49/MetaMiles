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