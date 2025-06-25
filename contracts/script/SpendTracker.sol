// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

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
