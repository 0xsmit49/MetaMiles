// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

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
