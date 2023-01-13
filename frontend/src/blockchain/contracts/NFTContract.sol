// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTContract is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _poolIds;
    Counters.Counter private _farmIds;
    uint256 public constant DEFAULT_FRACTIONS_COUNT = 10_000;
    uint256 public constant MINIMUM_INITIAL_LIQUIDITY = 20;
    address private admin;

    constructor() ERC721("Nftee", "NTE") {
        admin = msg.sender;
    }

    modifier _onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    modifier _isValidTokenId(uint256 tokenId) {
        require(tokenId <= _tokenIds.current(), "Invalid token Id");
        _;
    }
    modifier _isValidFarmId(uint256 farmId) {
        require(farmId <= _farmIds.current(), "Invalid farm id");
        _;
    }
    struct NFTLiquidityPoolData {
        uint256 tokenId;
        uint256 poolId;
        bool exists;
        uint256 nft_fractions;
        uint256 token_liq;
    }

    // Pool id => NFTLiquidityPoolData
    mapping(uint256 => NFTLiquidityPoolData) public pool_data;
    // tokenId => poolId
    mapping(uint256 => uint256) public tokenToPoolMap;
    // address => tokenId => fractions held
    mapping(address => mapping(uint256 => uint256)) public fractionBalances;

    function lastTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }

    function mint(string calldata _tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        emit MintingEvent(newItemId, msg.sender);
        return newItemId;
    }

    function createPool(uint256 tokenId, uint256 authorCutPercent)
        public
        payable
        _isValidTokenId(tokenId)
    {
        require(authorCutPercent <= 100, "Cannot claim more than 100%");
        require(
            msg.value > MINIMUM_INITIAL_LIQUIDITY,
            "No initial liquidity provided"
        );
        require(msg.sender == ownerOf(tokenId), "Only owner can list an asset");
        // require(_isApprovedOrOwner(address(this), tokenId), "Contract is not an owner or approved address");
        transferFrom(msg.sender, address(this), tokenId);
        _poolIds.increment();
        uint256 currentPoolId = _poolIds.current();
        uint256 authorCut = (DEFAULT_FRACTIONS_COUNT * authorCutPercent) / 100;
        pool_data[currentPoolId] = NFTLiquidityPoolData({
            tokenId: tokenId,
            poolId: currentPoolId,
            exists: true,
            nft_fractions: DEFAULT_FRACTIONS_COUNT - authorCut,
            token_liq: msg.value
        });
        tokenToPoolMap[tokenId] = currentPoolId;
        fractionBalances[msg.sender][tokenId] = authorCut;
        // TODO: Emit relevant event
    }

    function swap(uint256 poolId, uint256 fractionCount) public payable {
        require(
            !(msg.value > 0 && fractionCount > 0),
            "Invalid call. Cannot decide which side"
        );
        uint256 POOL_CONST = pool_data[poolId].nft_fractions *
            pool_data[poolId].token_liq;
        NFTLiquidityPoolData memory pData = pool_data[poolId];
        if (msg.value > 0) {
            // Swap FROM MATIC to Fractions
            uint256 fractions = pData.nft_fractions -
                (POOL_CONST / (pData.token_liq + msg.value));
            pool_data[poolId].nft_fractions -= fractions;
            pool_data[poolId].token_liq += msg.value;
            fractionBalances[msg.sender][pData.tokenId] += fractions;
        } else {
            // Swap TO MATIC from Fractions
            require(
                fractionBalances[msg.sender][pool_data[poolId].tokenId] >=
                    fractionCount,
                "Not enough fractions in balance"
            );
            uint256 tokens = pData.token_liq -
                (POOL_CONST / (pData.nft_fractions + fractionCount));
            pool_data[poolId].token_liq -= tokens;
            payable(msg.sender).transfer(tokens);
            pool_data[poolId].nft_fractions += fractionCount;
            fractionBalances[msg.sender][pData.tokenId] -= fractionCount;
        }
    }

    event MintingEvent(uint256 indexed tokenId, address indexed owner);


}
