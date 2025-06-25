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





