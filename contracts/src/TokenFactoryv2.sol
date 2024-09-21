// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Token.sol";
import "hardhat/console.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";
import "@prb/math/contracts/PRBMathUD60x18.sol"; // For fixed-point arithmetic
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract TokenFactory is ReentrancyGuard {
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

    uint256 constant MEMETOKEN_CREATION_PLATFORM_FEE = 0.0001 ether;
    uint256 constant MEMECOIN_FUNDING_DEADLINE_DURATION = 10 days;

    address constant UNISWAP_V2_FACTORY_ADDRESS = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
        //0xc9cAE05d068Ee58e55b39369b3098Eb275F1De57; // changed w the Punchswap TESTNET fork
    address constant UNISWAP_V2_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
       // 0x9b344b27784FeE1C214Ee274273811034A208eCe; // changed w the Punchswap TESTNET fork

    uint256 constant DECIMALS = 10**18;
    uint256 constant MAX_SUPPLY = 1000000 * DECIMALS;
    uint256 constant INIT_SUPPLY = (20 * MAX_SUPPLY) / 100;
    uint256 constant TOKENS_FOR_SALE = MAX_SUPPLY - INIT_SUPPLY; // 800,000 tokens available for sale

    uint256 public constant INITIAL_PRICE = 30000000000000; // Initial price in wei (P0), 3.00 * 10^13
    uint256 public constant K = 81250101; // Gradual price increase, Growth rate (k), scaled to avoid precision loss (0.01 * 10^18)

    address public owner;

    constructor() {
        owner = msg.sender; // Set the deployer as the owner
    }

    // Optimized function to calculate the cost in wei for purchasing `tokensToBuy` starting from `currentSupply`
    function calculateCost(uint256 currentSupply, uint256 tokensToBuy) public pure returns (uint256) {
        // Sum of token prices: totalCost = tokensToBuy * INITIAL_PRICE + K * (tokensToBuy * currentSupply + (tokensToBuy * (tokensToBuy - 1)) / 2)
        uint256 linearIncrease = (tokensToBuy * (tokensToBuy - 1)) / 2;
        uint256 totalCost = (tokensToBuy * INITIAL_PRICE) + K * ((tokensToBuy * currentSupply) + linearIncrease);

        return totalCost;
    }

    function createMemeToken(
        string memory name, 
        string memory symbol, 
        string memory imageUrl, 
        string memory description
    ) 
        public payable returns(address) 
    {
        require(msg.value >= MEMETOKEN_CREATION_PLATFORM_FEE, "Fee not paid for meme token creation");

        // Transfer platform fee to the owner
        payable(owner).transfer(MEMETOKEN_CREATION_PLATFORM_FEE);

        // Deploy the new meme token
        Token ct = new Token(name, symbol, INIT_SUPPLY);
        address memeTokenAddress = address(ct);

        // Store the newly created token's information
        memeToken memory newlyCreatedToken = memeToken(name, symbol, description, imageUrl, 0, memeTokenAddress, msg.sender);
        memeTokenAddresses.push(memeTokenAddress);
        addressToMemeTokenMapping[memeTokenAddress] = newlyCreatedToken;
        
        return memeTokenAddress;
    }


    function getTotalSupply(address memeTokenAddress) public view returns (uint256) {
        Token memeTokenCt = Token(memeTokenAddress);
        return memeTokenCt.totalSupply();
    }

    function getMarketCap(address memeTokenAddress) public view returns (uint256) {
        memeToken storage listedToken = addressToMemeTokenMapping[memeTokenAddress];
        return listedToken.fundingRaised;
    }

    function getRemainingSupply(address memeTokenAddress) public view returns (uint256) {
        Token memeTokenCt = Token(memeTokenAddress);
        uint256 currentSupply = memeTokenCt.totalSupply();
        return MAX_SUPPLY - currentSupply;
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

    function buyMemeToken(address memeTokenAddress, uint256 tokenQty) public payable nonReentrant returns (uint256) {
        require(addressToMemeTokenMapping[memeTokenAddress].tokenAddress != address(0), "Token is not listed");

        memeToken storage listedToken = addressToMemeTokenMapping[memeTokenAddress];
        Token memeTokenCt = Token(memeTokenAddress);

        uint256 currentSupply = memeTokenCt.totalSupply();
        uint256 available_qty = MAX_SUPPLY - currentSupply;
        uint256 tokenQty_scaled = tokenQty * DECIMALS;

        // Ensure the requested token amount does not exceed the available supply
        if (tokenQty_scaled > available_qty) {
            // Adjust tokenQty_scaled and tokenQty to the maximum available tokens
            tokenQty_scaled = available_qty;
            tokenQty = available_qty / DECIMALS; // Adjust the token quantity based on available supply
        }

        // Calculate the cost for the requested token amount
        uint256 requiredEth = calculateCost(currentSupply / DECIMALS, tokenQty);

        // Ensure the user has sent enough ETH
        require(msg.value >= requiredEth, "Incorrect value of ETH sent");

        // Refund any excess ETH sent beyond the required cost
        if (msg.value > requiredEth) {
            payable(msg.sender).transfer(msg.value - requiredEth);
        }

        listedToken.fundingRaised += msg.value;

        // Mint the available tokens for the buyer
        memeTokenCt.mint(tokenQty_scaled, msg.sender);

        // Check if all tokens have been sold (i.e., totalSupply == MAX_SUPPLY)
        if (memeTokenCt.totalSupply() == MAX_SUPPLY) {
            _createLiquidityIfAllTokensSold(memeTokenAddress, listedToken);  // Trigger liquidity adding when all tokens are sold
        }

        return 1;
    }

    function sellMemeToken(address memeTokenAddress, uint256 tokenQty) public nonReentrant returns (uint256) {
    require(addressToMemeTokenMapping[memeTokenAddress].tokenAddress != address(0), "Token is not listed");

    memeToken storage listedToken = addressToMemeTokenMapping[memeTokenAddress];
    Token memeTokenCt = Token(memeTokenAddress);

    uint256 tokenQty_scaled = tokenQty * DECIMALS;
    uint256 currentSupply = memeTokenCt.totalSupply();

    // Ensure the seller has enough tokens to sell
    require(memeTokenCt.balanceOf(msg.sender) >= tokenQty_scaled, "Insufficient token balance");

    // Calculate the ETH refund based on the quantity of tokens being sold
    uint256 ethToRefund = calculateRefund(currentSupply / DECIMALS, tokenQty);

    // Ensure the contract has enough ETH to refund the seller
    require(address(this).balance >= ethToRefund, "Contract has insufficient ETH");

    // Burn the tokens being sold
    memeTokenCt.burn(tokenQty_scaled);

    // Transfer ETH to the seller
    payable(msg.sender).transfer(ethToRefund);

    // Update the amount of funding raised by subtracting the refunded amount
    listedToken.fundingRaised -= ethToRefund;

    return ethToRefund;
}


function calculateRefund(uint256 currentSupply, uint256 tokensToSell) public pure returns (uint256) {
    uint256 linearDecrease = (tokensToSell * (tokensToSell - 1)) / 2;
    uint256 totalBeforeK = tokensToSell * INITIAL_PRICE;
    
    uint256 kComponent = K * ((tokensToSell * currentSupply) - linearDecrease);
    
    // Ensure kComponent is not greater than totalBeforeK to avoid underflow
    require(totalBeforeK >= kComponent, "Underflow in refund calculation");
    
    uint256 totalRefund = totalBeforeK - kComponent;

    return totalRefund*9;
}


    function _createLiquidityIfAllTokensSold(address memeTokenAddress, memeToken storage listedToken) internal {
        Token memeTokenCt = Token(memeTokenAddress);
        uint256 currentSupply = memeTokenCt.totalSupply();

        // If the total supply matches the maximum supply, proceed with liquidity addition
        if (currentSupply == MAX_SUPPLY) {
            uint256 ethAmount = listedToken.fundingRaised;
            uint256 tokenAmount = INIT_SUPPLY; // Use the initial supply for liquidity provision

            // Create the liquidity pool and provide liquidity
            address pool = _createLiquidityPool(memeTokenAddress);
            uint256 liquidity = _provideLiquidity(memeTokenAddress, tokenAmount, ethAmount);
            
            // Burn the liquidity pool tokens if necessary
            _burnLpTokens(pool, liquidity);
        }
    }


    function _createLiquidityPool(address memeTokenAddress)
        internal
        returns (address)
    {
        IUniswapV2Factory factory = IUniswapV2Factory(
            UNISWAP_V2_FACTORY_ADDRESS
        );
        IUniswapV2Router01 router = IUniswapV2Router01(
            UNISWAP_V2_ROUTER_ADDRESS
        );
        address pair = factory.createPair(memeTokenAddress, router.WETH());
        
        console.log("Liquidity Pool Address:", pair);

        return pair;
    }

    function _provideLiquidity(
        address memeTokenAddress,
        uint256 tokenAmount,
        uint256 ethAmount
    ) internal returns (uint256) {
        Token memeTokenCt = Token(memeTokenAddress);
        
        // Approve the Uniswap Router to use the tokenAmount
        memeTokenCt.approve(UNISWAP_V2_ROUTER_ADDRESS, tokenAmount);
        
        IUniswapV2Router01 router = IUniswapV2Router01(UNISWAP_V2_ROUTER_ADDRESS);

        // Add liquidity to Uniswap V2 using tokenAmount and ethAmount
        (uint256 amountToken, uint256 amountETH, uint256 liquidity) = router.addLiquidityETH{
            value: ethAmount
        }(
            memeTokenAddress, // The meme token address
            tokenAmount, // The number of tokens to add
            tokenAmount, // The minimum token amount (using the full amount)
            ethAmount, // The amount of ETH raised
            address(this), // The owner of the liquidity
            block.timestamp
        );
        
        return liquidity;
    }

    function _burnLpTokens(address pool, uint256 liquidity)
        internal
        returns (uint256)
    {
        IUniswapV2Pair uniswapv2pairct = IUniswapV2Pair(pool);
        uniswapv2pairct.transfer(address(0), liquidity);
        console.log("Uni v2 tokens burnt");
        return 1;
    }
}

