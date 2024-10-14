// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Token.sol";
import "@prb/math/contracts/PRBMathUD60x18.sol"; // For fixed-point arithmetic
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFactory is ReentrancyGuard, Ownable {

    using PRBMathUD60x18 for uint256; // Using PRBMath for fixed-point arithmetic

    struct memeToken {
        string name;
        string symbol;
        string description;
        string tokenImageUrl;
        uint256 fundingRaised;
        address tokenAddress;
        address creatorAddress;
        uint256 feePercentage;
        bool isTwitterAuthVerified;
        bool reachedBoundingCurve;
    }

    address[] public memeTokenAddresses;
    mapping(address => memeToken) public addressToMemeTokenMapping;

    address public  PLATFORM_OWNER_ADDRESS = 0x3822B2D5f2B1B193eDB70cA5F7460F9C574cC060;

    uint256 public MEMETOKEN_CREATION_PLATFORM_FEE = 1 ether;
    uint256 public AMOUNT_REACHING_BOUNDING_CURVE = 135 ether;
    uint256 constant DECIMALS = 10**18;
    uint256 constant MAX_SUPPLY = 1000000000 * DECIMALS;
    uint256 public SLOPE = 60980000000000000;  
    uint256 public BASEPRICE = 0.00001 ether;

    uint256 public TEST_Variable = 0;

    // Events
    event MemeTokenCreated(address indexed tokenAddress, string name, string symbol, uint256 fundingRaised, address creator, bool isTwitterAuthVerified);
    event TokensPurchased(address indexed buyer, address indexed memeTokenAddress, uint256 totalCost, uint256 numTokens);
    event TokensSold(address indexed seller, address indexed memeTokenAddress, uint256 numTokens, uint256 refund);
    event FeeUpdated(uint256 newFee);
    event SlopeUpdated(uint256 newSlope);
    event BasePriceUpdated(uint256 newBasePrice);
    event PlatformOwnerChanged(address indexed oldOwner, address indexed newOwner);
    event FeePercentageUpdated(address indexed memeTokenAddress, uint256 newFeePercentage);
    event TestVariableIncremented(uint256 newValue);
    event BoundingCurveThresholdUpdated(uint256 newAmountReachingBoundingCurve);
    event EtherTransferred(address indexed to, uint256 amount);

    constructor() Ownable(msg.sender) {}

        /**
     * @notice Allows users to create a new meme token.
     * @dev Deploys a new meme token and mints tokens to the creator based on the bonding curve.
     * @param name Name of the meme token.
     * @param symbol Symbol of the meme token.
     * @param imageUrl URL of the token's image.
     * @param description Description of the token.
     * @param fundingRaised Initial amount of funding raised by the creator.
     * @param isTwitterAuthVerified Whether the creator's Twitter is verified.
     * @return The address of the newly created meme token.
     */
    function createMemeToken(
        string memory name, 
        string memory symbol, 
        string memory imageUrl, 
        string memory description,
        uint256 fundingRaised,
        bool isTwitterAuthVerified
    ) public payable returns(address) {
        require(msg.value >= (MEMETOKEN_CREATION_PLATFORM_FEE + fundingRaised), "Fee not paid for meme token creation");

        // Transfer platform fee to the owner
        payable(PLATFORM_OWNER_ADDRESS).transfer(MEMETOKEN_CREATION_PLATFORM_FEE);

        // Deploy the new meme token
        Token newMemeToken = new Token(name, symbol, MAX_SUPPLY);
        address memeTokenAddress = address(newMemeToken);

        // Mint tokens to the creator if funding is raised
        if (fundingRaised > 0) {
            uint256 numTokens = calculateTokensFromFlowAmount(memeTokenAddress, fundingRaised);
            uint256 currentSupply = MAX_SUPPLY - newMemeToken.balanceOf(address(this));
            require(currentSupply + numTokens <= MAX_SUPPLY, "Exceeds max supply");
            newMemeToken.transfer(msg.sender, numTokens);
        }

        // Record the new meme token
        memeToken memory newlyCreatedToken = memeToken(
            name, 
            symbol, 
            description, 
            imageUrl, 
            fundingRaised, 
            memeTokenAddress, 
            msg.sender, 
            10, 
            isTwitterAuthVerified, 
            false  // Initially, the bounding curve is not reached
        );
        
        memeTokenAddresses.push(memeTokenAddress);
        addressToMemeTokenMapping[memeTokenAddress] = newlyCreatedToken;

        // Emit event
        emit MemeTokenCreated(memeTokenAddress, name, symbol, fundingRaised, msg.sender, isTwitterAuthVerified);

        return memeTokenAddress;
    }

    /**
     * @notice Calculate the total cost for 'n' tokens using the bonding curve formula.
     * @param memeTokenAddress Address of the meme token.
     * @param numTokens The number of tokens to calculate the cost for.
     * @return The total Ether cost for the specified number of tokens.
     */
    function calculateTotalCostFromTokenAmount(address memeTokenAddress, uint256 numTokens) public view returns (uint256) {
        Token MemeToken = Token(memeTokenAddress);
        uint256 currentSupply = MAX_SUPPLY - MemeToken.balanceOf(address(this));

        // Calculate starting and ending prices based on bonding curve
        uint256 startPrice = currentSupply / SLOPE + BASEPRICE;
        uint256 endPrice = (currentSupply + numTokens) / SLOPE + BASEPRICE;

        // Total cost is the area under the curve
        uint256 totalCost = (startPrice + endPrice).mul(numTokens).div(2);
        return totalCost / DECIMALS;
    }

    /**
     * @notice Calculate the Ether refund for selling a given number of tokens.
     * @param memeTokenAddress Address of the meme token.
     * @param numTokens The number of tokens to sell.
     * @return The total Ether refund for selling the specified number of tokens.
     */
    function calculateSellReturn(address memeTokenAddress, uint256 numTokens) public view returns (uint256) {
        Token MemeToken = Token(memeTokenAddress);
        uint256 currentSupply = MAX_SUPPLY - MemeToken.balanceOf(address(this));

        // Calculate starting and ending prices based on bonding curve
        uint256 startPrice = currentSupply / SLOPE + BASEPRICE;
        uint256 endPrice = (currentSupply - numTokens) / SLOPE + BASEPRICE;

        // Total refund is the area under the curve
        uint256 totalRefund = (startPrice + endPrice).mul(numTokens).div(2);
        return totalRefund / DECIMALS;
    }

    /**
     * @notice Calculate the number of tokens that can be purchased with a given amount of Ether.
     * @param memeTokenAddress Address of the meme token.
     * @param totalCost The total Ether available to spend.
     * @return The number of tokens that can be bought with the provided Ether.
     */
    function calculateTokensFromFlowAmount(address memeTokenAddress, uint256 totalCost) public view returns (uint256) {
        Token MemeToken = Token(memeTokenAddress);
        uint256 currentSupply = MAX_SUPPLY - MemeToken.balanceOf(address(this));

        uint256 B = currentSupply + SLOPE * BASEPRICE;
        uint256 numTokens = (sqrt(B**2 + 2 * SLOPE * totalCost * DECIMALS) - B);

        return numTokens;
    }

    /**
     * @notice Buy tokens using Ether, with bonding curve pricing.
     * @param memeTokenAddress Address of the meme token.
     * @param totalCost The total amount of Ether being used to buy tokens.
     */
    function buyTokens(address memeTokenAddress, uint256 totalCost) public payable nonReentrant {
        Token MemeToken = Token(memeTokenAddress);
        require(!addressToMemeTokenMapping[memeTokenAddress].reachedBoundingCurve, "Token has reached bounding curve, trade on DEX");
        uint256 currentSupply = MAX_SUPPLY - MemeToken.balanceOf(address(this));

        uint256 tokenFeePercentage = addressToMemeTokenMapping[memeTokenAddress].feePercentage;
        uint256 tokenTradingFee = totalCost * tokenFeePercentage / 1000;
        uint256 totalCostWithoutFee = totalCost - tokenTradingFee;

        uint256 numTokens = calculateTokensFromFlowAmount(memeTokenAddress, totalCostWithoutFee);
        uint256 finalCost = calculateTotalCostFromTokenAmount(memeTokenAddress, numTokens);

        require(currentSupply + numTokens <= MAX_SUPPLY, "Exceeds max supply");
        require(msg.value >= finalCost + tokenTradingFee, "Insufficient funds to buy tokens");

        payable(PLATFORM_OWNER_ADDRESS).transfer(tokenTradingFee);
        MemeToken.transfer(msg.sender, numTokens);

        addressToMemeTokenMapping[memeTokenAddress].fundingRaised += finalCost;

        if (addressToMemeTokenMapping[memeTokenAddress].fundingRaised >= AMOUNT_REACHING_BOUNDING_CURVE) {
            // When collected fund was sent to DEX, get Fee
            incrementTestVariable();
            addressToMemeTokenMapping[memeTokenAddress].reachedBoundingCurve = true;
        }

        // Emit event
        emit TokensPurchased(msg.sender, memeTokenAddress, totalCost, numTokens);
    }

    /**
     * @notice Sell tokens and receive Ether in return, with bonding curve pricing.
     * @param memeTokenAddress Address of the meme token.
     * @param numTokens The number of tokens to sell.
     */
    function sellTokens(address memeTokenAddress, uint256 numTokens) public payable nonReentrant {
        Token MemeToken = Token(memeTokenAddress);
        require(!addressToMemeTokenMapping[memeTokenAddress].reachedBoundingCurve, "Token has reached bounding curve, trade on DEX");
        require(MemeToken.balanceOf(msg.sender) >= numTokens, "Insufficient tokens to sell");
        
        uint256 currentSupply = MAX_SUPPLY - MemeToken.balanceOf(address(this));
        require(currentSupply >= numTokens, "Exceeds available supply");

        uint256 tokenFeePercentage = addressToMemeTokenMapping[memeTokenAddress].feePercentage;
        uint256 refundAmount = calculateSellReturn(memeTokenAddress, numTokens);
        uint256 tokenTradingFee = refundAmount * tokenFeePercentage / 1000;

        uint256 refundAfterFee = refundAmount - tokenTradingFee;
        require(address(this).balance >= refundAfterFee, "Insufficient contract balance");

        MemeToken.transferFrom(msg.sender, address(this), numTokens);
        addressToMemeTokenMapping[memeTokenAddress].fundingRaised -= refundAfterFee;

        payable(PLATFORM_OWNER_ADDRESS).transfer(tokenTradingFee);
        payable(msg.sender).transfer(refundAfterFee);

        // Emit event
        emit TokensSold(msg.sender, memeTokenAddress, numTokens, refundAfterFee);
    }

    /**
     * @notice Retrieve the remaining tokens in the launchpad for a given meme token.
     * @param memeTokenAddress The address of the meme token.
     * @return The remaining tokens in the launchpad.
     */
    function getRemainingTokensInLaunchpad(address memeTokenAddress) public view returns (uint256) {
        require(memeTokenAddress != address(0), "Invalid meme token address");
        Token MemeToken = Token(memeTokenAddress);
        return MemeToken.balanceOf(address(this));
    }

    /**
     * @notice Retrieve the market cap (total funding raised) for a meme token.
     * @param memeTokenAddress The address of the meme token.
     * @return The total funding raised for the meme token.
     */
    function getCollectedFund(address memeTokenAddress) public view returns (uint256) {
        memeToken storage listedToken = addressToMemeTokenMapping[memeTokenAddress];
        return listedToken.fundingRaised;
    }

    /**
     * @notice Retrieve all meme tokens created through the platform.
     * @return An array of all meme tokens.
     */
    function getAllMemeTokens() public view returns (memeToken[] memory) {
        memeToken[] memory allTokens = new memeToken[](memeTokenAddresses.length);
        for (uint256 i = 0; i < memeTokenAddresses.length; i++) {
            allTokens[i] = addressToMemeTokenMapping[memeTokenAddresses[i]];
        }
        return allTokens;
    }

    /**
     * @notice Update the slope of the bonding curve.
     * @param newSlope The new slope value to be used for the bonding curve.
     */
    function updateSlope(uint256 newSlope) external onlyOwner {
        require(newSlope > 0, "Slope must be positive");
        SLOPE = newSlope;
        emit SlopeUpdated(newSlope);
    }

    /**
     * @notice Update the dynamic amount required to reach the bounding curve.
     * @param newAmountReachingBoundingCurve The new amount required to reach the bounding curve.
     */
    function updateBoundingCurveThreshold(uint256 newAmountReachingBoundingCurve) external onlyOwner {
        require(newAmountReachingBoundingCurve > 0, "Amount must be positive");
        AMOUNT_REACHING_BOUNDING_CURVE = newAmountReachingBoundingCurve;
        emit BoundingCurveThresholdUpdated(newAmountReachingBoundingCurve);
    }

    /**
     * @notice Update the platform fee for creating a meme token.
     * @param newFee The new platform fee.
     */
    function updateFee(uint256 newFee) external onlyOwner {
        require(newFee > 0, "Fee must be positive");
        MEMETOKEN_CREATION_PLATFORM_FEE = newFee;
        emit FeeUpdated(newFee);
    }

    /**
     * @notice Update the base price for the bonding curve.
     * @param newBasePrice The new base price to be used for token pricing.
     */
    function updateBasePrice(uint256 newBasePrice) external onlyOwner {
        require(newBasePrice > 0, "Base price must be positive");
        BASEPRICE = newBasePrice;
        emit BasePriceUpdated(newBasePrice);
    }

    /**
     * @notice Change the platform owner address.
     * @param newPlatformOwnerAddress The new platform owner address.
     */
    function changePlatformOwnerAddress(address newPlatformOwnerAddress) public onlyOwner {
        require(newPlatformOwnerAddress != address(0), "Invalid address");
        PLATFORM_OWNER_ADDRESS = newPlatformOwnerAddress;
        emit PlatformOwnerChanged(PLATFORM_OWNER_ADDRESS, newPlatformOwnerAddress);
    }

    /**
     * @notice Set the fee percentage for a meme token.
     * @param memeTokenAddress The address of the meme token.
     * @param newFeePercentage The new fee percentage.
     */
    function setFeePercentage(address memeTokenAddress, uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage >= 0 && newFeePercentage <= 100, "Invalid fee percentage");
        addressToMemeTokenMapping[memeTokenAddress].feePercentage = newFeePercentage;
        emit FeePercentageUpdated(memeTokenAddress, newFeePercentage);
    }

    /**
     * @notice Retrieve the total balance of the contract.
     * @return The total Ether balance of the contract.
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Internal function to increment a test variable.
     */
    function incrementTestVariable() internal {
        TEST_Variable += 1;
        emit TestVariableIncremented(TEST_Variable);
    }

    /**
     * @notice Internal helper function to compute the square root of a number.
     * @param y The input number.
     * @return z The square root of the input number.
     */
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
