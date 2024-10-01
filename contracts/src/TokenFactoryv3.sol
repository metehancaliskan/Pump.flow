// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PunchSwapV2Router02.sol";
import "./PunchSwapV2Factory.sol";

contract LinearBondingCurve is Ownable {
    IERC20 public token;
    address public dexRouter; // PunchSwapV2Router02 contract
    address public dexFactory; // PunchSwapV2Factory contract
    address public WFLOW; // WFLOW (wrapped Flow) token address

    uint public totalTokensSold; // Tracks the total amount of tokens sold
    uint public maxTokensForSale; // Max tokens for sale via the bonding curve
    uint public startPrice; // Starting price per token
    uint public priceIncrement; // Price increment per token sold

    bool public curveActive; // Indicates if the bonding curve is active

    event TokensPurchased(address buyer, uint amount, uint price);
    event LiquidityAdded(address pairAddress);

    constructor(
        address _token, 
        address _dexRouter, 
        address _dexFactory, 
        address _WFLOW,
        uint _startPrice,
        uint _priceIncrement,
        uint _maxTokensForSale
    ) {
        token = IERC20(_token);
        dexRouter = _dexRouter;
        dexFactory = _dexFactory;
        WFLOW = _WFLOW;
        startPrice = _startPrice;
        priceIncrement = _priceIncrement;
        maxTokensForSale = _maxTokensForSale;
        curveActive = true;
    }

    /**
     * @notice Purchase tokens with Flow (or WFLOW) using the linear bonding curve.
     */
    function purchaseTokens() external payable {
        require(curveActive, "Bonding curve not active");
        require(totalTokensSold < maxTokensForSale, "Sold out");

        uint tokensToBuy = _getTokensAmount(msg.value);
        require(tokensToBuy <= (maxTokensForSale - totalTokensSold), "Not enough tokens left");

        totalTokensSold += tokensToBuy;
        uint currentPrice = _getCurrentPrice();

        // Transfer the purchased tokens to the buyer
        require(token.transfer(msg.sender, tokensToBuy), "Token transfer failed");

        emit TokensPurchased(msg.sender, tokensToBuy, currentPrice);
    }

    /**
     * @notice Get the current price for purchasing tokens.
     */
    function _getCurrentPrice() internal view returns (uint) {
        return startPrice + (priceIncrement * totalTokensSold);
    }

    /**
     * @notice Calculate the amount of tokens to receive for a given Flow amount.
     * This is based on a linear price increase as more tokens are sold.
     */
    function _getTokensAmount(uint amountInFlow) internal view returns (uint) {
        uint currentPrice = _getCurrentPrice();
        return amountInFlow / currentPrice;
    }

    /**
     * @notice Add liquidity to the PunchSwap DEX when the bonding curve ends.
     */
    function addLiquidityToDEX(uint tokenAmount, uint flowAmount) external onlyOwner {
        require(!curveActive, "Bonding curve is still active");
        
        token.approve(dexRouter, tokenAmount);

        IPunchSwapV2Router02(dexRouter).addLiquidityETH{value: flowAmount}(
            address(token),
            tokenAmount,
            0, // Slippage is unavoidable
            0, // Slippage is unavoidable
            owner(),
            block.timestamp
        );

        address pair = IPunchSwapV2Factory(dexFactory).getPair(address(token), WFLOW);
        emit LiquidityAdded(pair);
    }

    /**
     * @notice End the bonding curve and prepare for liquidity addition.
     */
    function endBondingCurve() external onlyOwner {
        curveActive = false;
    }

    receive() external payable {}
}
