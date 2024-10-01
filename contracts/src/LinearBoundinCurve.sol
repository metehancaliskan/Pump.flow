// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Token.sol";
import "@prb/math/contracts/PRBMathUD60x18.sol"; // For fixed-point arithmetic
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract TokenFactory is ReentrancyGuard {

    using PRBMathUD60x18 for uint256; // Using PRBMath for fixed-point arithmetic

    struct memeToken {
        string name;
        string symbol;
        string description;
        string tokenImageUrl;
        uint256 fundingRaised;
        address tokenAddress;
        address creatorAddress;
    }

    address[] public memeTokenAddresses;

    mapping(address => memeToken) public addressToMemeTokenMapping;

    address constant PLATFORM_OWNER_ADDRESS = 0x3822B2D5f2B1B193eDB70cA5F7460F9C574cC060;

    uint256 constant MEMETOKEN_CREATION_PLATFORM_FEE = 1 ether;
    uint256 constant DECIMALS = 10**18;
    uint256 constant MAX_SUPPLY = 1000000000 * DECIMALS;
    uint256 public SLOPE = 100;  
    uint256 public constant BASEPRICE = 0.01 ether;

    address public owner;

    constructor() {
        owner = msg.sender; // Set the deployer as the owner
    }



    // Baslangicta para koyma ve ona gore cuzdana aktarma isini ekle
    function createMemeToken(
        string memory name, 
        string memory symbol, 
        string memory imageUrl, 
        string memory description,
        uint256 fundingRaised) public payable returns(address) {
        require(msg.value >= MEMETOKEN_CREATION_PLATFORM_FEE, "Fee not paid for meme token creation");

        // Transfer platform fee to the owner
        payable(PLATFORM_OWNER_ADDRESS).transfer(MEMETOKEN_CREATION_PLATFORM_FEE);

        // Deploy the new meme token
        Token newMemeToken = new Token(name, symbol, MAX_SUPPLY);
        address memeTokenAddress = address(newMemeToken);

        memeToken memory newlyCreatedToken = memeToken(name, symbol, description, imageUrl, fundingRaised, memeTokenAddress, msg.sender);
        memeTokenAddresses.push(memeTokenAddress);
        addressToMemeTokenMapping[memeTokenAddress] = newlyCreatedToken;
        
        return memeTokenAddress;
    }

    // Calculate the total cost for 'n' tokens using bonding curve integration
    // numToken 10**18 ile yazilmali degistirebiliriz
    function calculateTotalCost(address memeTokenAddress, uint256 numTokens) public view returns (uint256) {
        Token MemeToken = Token(memeTokenAddress);
        uint256 currentSupply = MAX_SUPPLY - MemeToken.balanceOf(address(this));

        // Starting price: P(currentSupply) = a * currentSupply + b
        uint256 startPrice = currentSupply/SLOPE + BASEPRICE;

        // Ending price: P(currentSupply + numTokens) = a * (currentSupply + numTokens) + b
        uint256 endPrice = (currentSupply + numTokens)/SLOPE + BASEPRICE;

        // Total cost is the area under the curve: (startPrice + endPrice) * numTokens / 2
        uint256 totalCost = (startPrice + endPrice).mul(numTokens).div(2);
        return totalCost/DECIMALS;
    }

    // Bonding curve price: P(S) = a * S + b
    function currentPrice(address memeTokenAddress) public view returns (uint256) {
        Token MemeToken = Token(memeTokenAddress);
        uint256 supply = MAX_SUPPLY - MemeToken.balanceOf(address(this));
        uint256 price = supply/SLOPE + BASEPRICE;
        return price;
    }

    // Buy tokens with bonding curve pricing
    function buyTokens(address memeTokenAddress, uint256 numTokens) public payable nonReentrant {
        Token MemeToken = Token(memeTokenAddress);
        uint256 currentSupply = MAX_SUPPLY - MemeToken.balanceOf(address(this));

        // Calculate total cost using bonding curve
        uint256 totalCost = calculateTotalCost(memeTokenAddress, numTokens);
        require(msg.value >= totalCost, "Insufficient funds to buy tokens");

        // Ensure that the total supply after minting does not exceed the maximum
        require(currentSupply + numTokens <= MAX_SUPPLY, "Exceeds max supply");

        // Mint tokens to the buyer
        MemeToken.transfer(msg.sender, numTokens);

        // Update funding raised in the struct
        addressToMemeTokenMapping[memeTokenAddress].fundingRaised += totalCost;

        // Refund excess funds if any
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
    }

    function getRemainingTokensInLaunchpad(address memeTokenAddress) public view returns (uint256) {
        // Ensure that the provided address is valid
        require(memeTokenAddress != address(0), "Invalid meme token address");

        // Create an interface to interact with the meme token contract
        Token MemeToken = Token(memeTokenAddress);

        // Get the balance of tokens held by the launchpad contract
        uint256 remainingTokens = MemeToken.balanceOf(address(this));

        return remainingTokens;
    }

    function getMarketCap(address memeTokenAddress) public view returns (uint256) {
        memeToken storage listedToken = addressToMemeTokenMapping[memeTokenAddress];
        return listedToken.fundingRaised;
    }

    function getAllMemeTokens() public view returns (memeToken[] memory) {
        memeToken[] memory allTokens = new memeToken[](
            memeTokenAddresses.length
        );
        for (uint256 i = 0; i < memeTokenAddresses.length; i++) {
            allTokens[i] = addressToMemeTokenMapping[memeTokenAddresses[i]];
        }
        return allTokens;
    }


}

