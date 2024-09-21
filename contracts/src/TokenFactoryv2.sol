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
    uint256 constant MEMECOIN_FUNDING_GOAL = 50 ether;

    address constant UNISWAP_V2_FACTORY_ADDRESS =
        0xc9cAE05d068Ee58e55b39369b3098Eb275F1De57; // changed w the Punchswap TESTNET fork
    address constant UNISWAP_V2_ROUTER_ADDRESS =
        0x9b344b27784FeE1C214Ee274273811034A208eCe; // changed w the Punchswap TESTNET fork

    uint256 constant DECIMALS = 10**18;
    uint256 constant MAX_SUPPLY = 1000000 * DECIMALS;
    uint256 constant INIT_SUPPLY = (20 * MAX_SUPPLY) / 100;

    uint256 public constant INITIAL_PRICE = 30000000000000; // Initial price in wei (P0), 3.00 * 10^13
    uint256 public constant K = 81250101; // Gradual price increase, Growth rate (k), scaled to avoid precision loss (0.01 * 10^18)

    address public owner;

    constructor() {
        owner = msg.sender; // Set the deployer as the owner
    }

    // // Function to calculate the cost in wei for purchasing `tokensToBuy` starting from `currentSupply`
    // function calculateCost(uint256 currentSupply, uint256 tokensToBuy)
    //     public
    //     pure
    //     returns (uint256)
    // {
    //     // Calculate the exponent parts scaled to avoid precision loss
    //     uint256 exponent1 = (K * (currentSupply + tokensToBuy)) / 10**18;
    //     uint256 exponent2 = (K * currentSupply) / 10**18;

    //     // Calculate e^(kx) using the exp function
    //     uint256 exp1 = exp(exponent1);
    //     uint256 exp2 = exp(exponent2);

    //     // Cost formula: (P0 / k) * (e^(k * (currentSupply + tokensToBuy)) - e^(k * currentSupply))
    //     // We use (P0 * 10^18) / k to keep the division safe from zero
    //     uint256 cost = (INITIAL_PRICE * 10**18 * (exp1 - exp2)) / K; // Adjust for k scaling without dividing by zero
    //     return cost;
    // }

    // // Function to calculate the cost in wei for purchasing `tokensToBuy` starting from `currentSupply`
    // function calculateCost(uint256 currentSupply, uint256 tokensToBuy)
    //     public pure returns (uint256)
    // {
    //     // Calculate the exponent parts scaled to avoid precision loss
    //     uint256 exponent1 = (K * (currentSupply + tokensToBuy)) / 10**18;
    //     uint256 exponent2 = (K * currentSupply) / 10**18;

    //     // Calculate e^(kx) using the exp function
    //     uint256 exp1 = exp(exponent1);
    //     uint256 exp2 = exp(exponent2);

    //     // Cost formula: (P0 / k) * (e^(k * (currentSupply + tokensToBuy)) - e^(k * currentSupply))
    //     uint256 cost = (INITIAL_PRICE * 10**18 * (exp1 - exp2)) / K;
    //     return cost;
    // }

    // LINEAR

    // Function to calculate the cost in wei for purchasing `tokensToBuy` starting from `currentSupply`
    // function calculateCost(uint256 currentSupply, uint256 tokensToBuy) public pure returns (uint256) {
    //     uint256 totalCost = 0;
        
    //     // Linear bonding curve: Price = INITIAL_PRICE + k * currentSupply
    //     for (uint256 i = 0; i < tokensToBuy; i++) {
    //         uint256 priceForNextToken = INITIAL_PRICE + (K * (currentSupply + i));
    //         totalCost += priceForNextToken;
    //     }

    //     return totalCost;
    // }

    // Optimized function to calculate the cost in wei for purchasing `tokensToBuy` starting from `currentSupply`
    function calculateCost(uint256 currentSupply, uint256 tokensToBuy) public pure returns (uint256) {
        // Sum of token prices: totalCost = tokensToBuy * INITIAL_PRICE + K * (tokensToBuy * currentSupply + (tokensToBuy * (tokensToBuy - 1)) / 2)
        uint256 linearIncrease = (tokensToBuy * (tokensToBuy - 1)) / 2;
        uint256 totalCost = (tokensToBuy * INITIAL_PRICE) + K * ((tokensToBuy * currentSupply) + linearIncrease);

        return totalCost;
    }



    // // Improved helper function to calculate e^x for larger x using a Taylor series approximation
    // function exp(uint256 x) internal pure returns (uint256) {
    //     uint256 sum = 10**18;  // Start with 1 * 10^18 for precision
    //     uint256 term = 10**18;  // Initial term = 1 * 10^18
    //     uint256 xPower = x;  // Initial power of x

    //     for (uint256 i = 1; i <= 20; i++) {  // Increase iterations for better accuracy
    //         term = (term * xPower) / (i * 10**18);  // x^i / i!
    //         sum += term;

    //         // Prevent overflow and unnecessary calculations
    //         if (term < 1) break;
    //     }

    //     return sum;
    // }

    using PRBMathUD60x18 for uint256;

    function exp(uint256 x) internal pure returns (uint256) {
        // PRBMathUD60x18 provides an exponential function with fixed-point precision
        return PRBMathUD60x18.exp(x);
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


    function getAllMemeTokens() public view returns (memeToken[] memory) {
        memeToken[] memory allTokens = new memeToken[](
            memeTokenAddresses.length
        );
        for (uint256 i = 0; i < memeTokenAddresses.length; i++) {
            allTokens[i] = addressToMemeTokenMapping[memeTokenAddresses[i]];
        }
        return allTokens;
    }

    // function buyMemeToken(address memeTokenAddress, uint256 tokenQty)
    //     public payable nonReentrant returns (uint256)
    // {
    //     require(addressToMemeTokenMapping[memeTokenAddress].tokenAddress != address(0), "Token is not listed");

    //     memeToken storage listedToken = addressToMemeTokenMapping[memeTokenAddress];
    //     Token memeTokenCt = Token(memeTokenAddress);

    //     require(listedToken.fundingRaised < MEMECOIN_FUNDING_GOAL, "Funding goal reached");

    //     uint256 currentSupply = memeTokenCt.totalSupply();
    //     uint256 available_qty = MAX_SUPPLY - currentSupply;
    //     uint256 scaled_available_qty = available_qty / DECIMALS;
    //     uint256 tokenQty_scaled = tokenQty * DECIMALS;

    //     require(tokenQty <= scaled_available_qty, "Not enough available supply");

    //     uint256 currentSupplyScaled = (currentSupply - INIT_SUPPLY) / DECIMALS;
    //     uint256 requiredEth = calculateCost(currentSupplyScaled, tokenQty);

    //     require(msg.value >= requiredEth, "Incorrect value of ETH sent");

    //     // Increment the funding amount
    //     listedToken.fundingRaised += requiredEth;

    //     // Refund any excess ETH sent
    //     if (msg.value > requiredEth) {
    //         payable(msg.sender).transfer(msg.value - requiredEth);
    //     }

    //     // if (listedToken.fundingRaised >= MEMECOIN_FUNDING_GOAL) {
    //     //     address pool = _createLiquidityPool(memeTokenAddress);
    //     //     uint256 tokenAmount = INIT_SUPPLY;
    //     //     uint256 ethAmount = listedToken.fundingRaised;
    //     //     uint256 liquidity = _provideLiquidity(memeTokenAddress, tokenAmount, ethAmount);
    //     //     _burnLpTokens(pool, liquidity);
    //     // } CHANGE IT TO THE NEW STRUCTURE

    //     if (listedToken.fundingRaised >= MEMECOIN_FUNDING_GOAL) {
    //         // Current total supply
    //         uint256 currentSupply = memeTokenCt.totalSupply();

    //         // Calculate how many tokens can be minted for the raised ETH amount
    //         uint256 ethAmount = listedToken.fundingRaised;
            
    //         // Use bonding curve to calculate the price of one token at current supply
    //         uint256 tokenPrice = calculateCost(currentSupply / DECIMALS, 1);
            
    //         // Calculate how many tokens should be provided for the total ETH raised
    //         uint256 tokenAmount = (ethAmount * 10**18) / tokenPrice; // Token amount corresponding to the ETH raised

    //         // Create the liquidity pool and provide liquidity
    //         address pool = _createLiquidityPool(memeTokenAddress);
    //         uint256 liquidity = _provideLiquidity(memeTokenAddress, tokenAmount, ethAmount);
    //         _burnLpTokens(pool, liquidity);
    //     }

    //     memeTokenCt.mint(tokenQty_scaled, msg.sender);

    //     return 1;
    // }

    function _createLiquidityIfGoalReached(address memeTokenAddress, memeToken storage listedToken) internal {
        if (listedToken.fundingRaised >= MEMECOIN_FUNDING_GOAL) {
            Token memeTokenCt = Token(memeTokenAddress);
            uint256 currentSupply = memeTokenCt.totalSupply();

            // Calculate how many tokens can be minted for the raised ETH amount
            uint256 ethAmount = listedToken.fundingRaised;
            
            // Use bonding curve to calculate the price of one token at current supply
            uint256 tokenPrice = calculateCost(currentSupply / DECIMALS, 1);
            
            // Calculate how many tokens should be provided for the total ETH raised
            uint256 tokenAmount = (ethAmount * 10**18) / tokenPrice; // Token amount corresponding to the ETH raised

            // Create the liquidity pool and provide liquidity
            address pool = _createLiquidityPool(memeTokenAddress);
            uint256 liquidity = _provideLiquidity(memeTokenAddress, tokenAmount, ethAmount);
            _burnLpTokens(pool, liquidity);
        }
    }


    // function buyMemeToken(address memeTokenAddress, uint256 tokenQty)
    //     public payable nonReentrant returns (uint256)
    // {
    //     require(addressToMemeTokenMapping[memeTokenAddress].tokenAddress != address(0), "Token is not listed");

    //     memeToken storage listedToken = addressToMemeTokenMapping[memeTokenAddress];
    //     Token memeTokenCt = Token(memeTokenAddress);

    //     require(listedToken.fundingRaised < MEMECOIN_FUNDING_GOAL, "Funding goal reached");

    //     uint256 currentSupply = memeTokenCt.totalSupply();
    //     uint256 available_qty = MAX_SUPPLY - currentSupply;
    //     uint256 scaled_available_qty = available_qty / DECIMALS;
    //     uint256 tokenQty_scaled = tokenQty * DECIMALS;

    //     require(tokenQty <= scaled_available_qty, "Not enough available supply");

    //     uint256 currentSupplyScaled = (currentSupply - INIT_SUPPLY) / DECIMALS;
    //     uint256 requiredEth = calculateCost(currentSupplyScaled, tokenQty);

    //     require(msg.value >= requiredEth, "Incorrect value of ETH sent");

    //     // Increment the funding amount
    //     listedToken.fundingRaised += requiredEth;

    //     // Refund any excess ETH sent
    //     if (msg.value > requiredEth) {
    //         payable(msg.sender).transfer(msg.value - requiredEth);
    //     }

    //     // Call the helper function to create liquidity if funding goal is reached
    //     _createLiquidityIfGoalReached(memeTokenAddress, listedToken);

    //     // Mint tokens for the buyer
    //     memeTokenCt.mint(tokenQty_scaled, msg.sender);

    //     return 1;
    // }

    // function buyMemeToken(address memeTokenAddress, uint256 tokenQty) public payable nonReentrant returns (uint256) {
    //     require(addressToMemeTokenMapping[memeTokenAddress].tokenAddress != address(0), "Token is not listed");

    //     memeToken storage listedToken = addressToMemeTokenMapping[memeTokenAddress];
    //     Token memeTokenCt = Token(memeTokenAddress);

    //     uint256 currentSupply = memeTokenCt.totalSupply();
    //     uint256 available_qty = MAX_SUPPLY - currentSupply;
    //     uint256 tokenQty_scaled = tokenQty * DECIMALS;

    //     // Ensure the requested token amount does not exceed the available supply
    //     require(tokenQty_scaled <= available_qty, "Not enough available supply");

    //     // Calculate the cost for the requested token amount
    //     uint256 requiredEth = calculateCost(currentSupply / DECIMALS, tokenQty);

    //     // If funding goal is exceeded, adjust token amount and refund excess ETH
    //     if (listedToken.fundingRaised + requiredEth > MEMECOIN_FUNDING_GOAL) {
    //         // Calculate how many tokens can be bought before reaching the funding goal
    //         uint256 maxAvailableEth = MEMECOIN_FUNDING_GOAL - listedToken.fundingRaised;
    //         uint256 maxTokenQty = 0;

    //         for (uint256 i = 0; i < tokenQty; i++) {
    //             uint256 tokenPrice = calculateCost(currentSupply / DECIMALS, i + 1);
    //             if (maxAvailableEth >= tokenPrice) {
    //                 maxAvailableEth -= tokenPrice;
    //                 maxTokenQty++;
    //             } else {
    //                 break;
    //             }
    //         }

    //         // Recalculate ETH required for max token quantity
    //         uint256 ethRequiredForMaxQty = calculateCost(currentSupply / DECIMALS, maxTokenQty);

    //         // Mint only the max tokens
    //         uint256 tokenQtyToMint = maxTokenQty * DECIMALS;
    //         memeTokenCt.mint(tokenQtyToMint, msg.sender);

    //         // Refund any excess ETH
    //         if (msg.value > requiredEth) {
    //             payable(msg.sender).transfer(msg.value - requiredEth); // Refund excess ETH
    //         }

    //         // Update the fundingRaised
    //         listedToken.fundingRaised += ethRequiredForMaxQty;

    //         // Move to liquidity addition if funding goal is reached
    //         _createLiquidityIfGoalReached(memeTokenAddress, listedToken);

    //         return 1;
    //     }

    //     // If funding goal is not reached, proceed as usual
    //     require(msg.value >= requiredEth, "Incorrect value of ETH sent");

    //     // Increment the funding amount
    //     listedToken.fundingRaised += requiredEth;

    //     // Refund any excess ETH sent
    //     if (msg.value > requiredEth) {
    //         payable(msg.sender).transfer(msg.value - requiredEth);
    //     }

    //     // Call the helper function to create liquidity if funding goal is reached
    //     _createLiquidityIfGoalReached(memeTokenAddress, listedToken);

    //     // Mint tokens for the buyer
    //     memeTokenCt.mint(tokenQty_scaled, msg.sender);

    //     return 1;
    // }

    function buyMemeToken(address memeTokenAddress, uint256 tokenQty) public payable nonReentrant returns (uint256) {
        require(addressToMemeTokenMapping[memeTokenAddress].tokenAddress != address(0), "Token is not listed");

        memeToken storage listedToken = addressToMemeTokenMapping[memeTokenAddress];
        Token memeTokenCt = Token(memeTokenAddress);

        uint256 currentSupply = memeTokenCt.totalSupply();
        uint256 available_qty = MAX_SUPPLY - currentSupply;
        uint256 tokenQty_scaled = tokenQty * DECIMALS;

        // Ensure the requested token amount does not exceed the available supply
        require(tokenQty_scaled <= available_qty, "Not enough available supply");

        // Calculate the cost for the requested token amount
        uint256 requiredEth = calculateCost(currentSupply / DECIMALS, tokenQty);

        // If the funding goal is exceeded by this purchase, adjust the token quantity and refund excess ETH
        if (listedToken.fundingRaised + requiredEth > MEMECOIN_FUNDING_GOAL) {
            // Calculate how much ETH is left before reaching the funding goal
            uint256 remainingEth = MEMECOIN_FUNDING_GOAL - listedToken.fundingRaised;

            // Now calculate how many tokens can be bought with the remaining ETH
            uint256 maxTokenQty = 0;
            uint256 remainingEthForMaxTokens = remainingEth;
            
            for (uint256 i = 0; i < tokenQty; i++) {
                uint256 tokenPrice = calculateCost(currentSupply / DECIMALS, i + 1);
                if (remainingEthForMaxTokens >= tokenPrice) {
                    remainingEthForMaxTokens -= tokenPrice;
                    maxTokenQty++;
                } else {
                    break;
                }
            }

            // Calculate the final ETH required for the maximum number of tokens that can be bought
            uint256 ethRequiredForMaxQty = calculateCost(currentSupply / DECIMALS, maxTokenQty);

            // Mint the maximum amount of tokens allowed before reaching the funding goal
            uint256 tokenQtyToMint = maxTokenQty * DECIMALS;
            memeTokenCt.mint(tokenQtyToMint, msg.sender);

            // Refund the excess ETH (sent more than required for max tokens)
            if (msg.value > ethRequiredForMaxQty) {
                payable(msg.sender).transfer(msg.value - ethRequiredForMaxQty);
            }

            // Update the fundingRaised to reflect the actual ETH used
            listedToken.fundingRaised += ethRequiredForMaxQty;

            // Trigger liquidity provision if the funding goal is reached
            _createLiquidityIfGoalReached(memeTokenAddress, listedToken);

            return 1;
        }

        // If the funding goal is not reached, proceed as usual
        require(msg.value >= requiredEth, "Incorrect value of ETH sent");

        // Increment the funding amount
        listedToken.fundingRaised += requiredEth;

        // Refund any excess ETH sent
        if (msg.value > requiredEth) {
            payable(msg.sender).transfer(msg.value - requiredEth);
        }

        // Call the helper function to create liquidity if the funding goal is reached
        _createLiquidityIfGoalReached(memeTokenAddress, listedToken);

        // Mint tokens for the buyer
        memeTokenCt.mint(tokenQty_scaled, msg.sender);

        return 1;
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
        uint256 flowAmount
    ) internal returns (uint256) {
        Token memeTokenCt = Token(memeTokenAddress);
        
        // Approve the Uniswap Router to use the tokenAmount
        memeTokenCt.approve(UNISWAP_V2_ROUTER_ADDRESS, tokenAmount);
        
        IUniswapV2Router01 router = IUniswapV2Router01(UNISWAP_V2_ROUTER_ADDRESS);

        // Add liquidity to Uniswap V2 using tokenAmount and ethAmount
        (uint256 amountToken, uint256 amountFlow, uint256 liquidity) = router.addLiquidityETH{
            value: flowAmount
        }(
            memeTokenAddress, // The meme token address
            tokenAmount, // The number of tokens to add
            tokenAmount, // The minimum token amount (using the full amount)
            flowAmount, // The amount of ETH raised
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
