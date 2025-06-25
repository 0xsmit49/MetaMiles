// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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
