// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "./Token.sol";

contract TokenFactory {
    uint constant public DECIMALS = 10**18;
    uint constant public MAX_SUPPLY = 10**9 * DECIMALS;
    uint constant public initialSupply = MAX_SUPPLY*20/100;
    uint constant public k = 23437500;
    uint constant public offset = 9375*10**13;
    uint constant public SCALING_FACTOR = 10**30;
    uint constant public FUNDING_GOAL = 150000 ether;


    mapping(address => bool) public tokens;
    mapping(address => uint) public colletral; // amount of Flow recieved for buying tokens
    mapping(address => mapping(address => uint)) public balances;

    event TokenCreated(address tokenAddress, string name, string symbol);

    function createToken(string memory name, string memory symbol) external returns (address) {
        Token token = new Token(name, symbol, initialSupply);
        tokens[address(token)] = true;
        return address(token);
        //emit TokenCreated(address(token), name, symbol);
    }

    function buy(address tokenAddress, uint256 amount) external payable {
        require(tokens[tokenAddress], "Token does not exist");
        Token token = Token(tokenAddress);
        uint availableSupply = MAX_SUPPLY - initialSupply - token.totalSupply();
        require(availableSupply >= amount, "Not enough tokens available");
        uint requiredFlow = calculateRequiredFlow(tokenAddress, amount);
        require(msg.value >= requiredFlow, "Not enough FLOW");
        colletral[tokenAddress] += requiredFlow;
        balances[tokenAddress][msg.sender] += amount;
        token.mint(address(this), amount);
        if (colletral[tokenAddress] >= FUNDING_GOAL) {
        }
    }

    function calculateRequiredFlow(address tokenAddress, uint256 amount) public returns (uint) {
        // amount FLOW = (b-a) * (f(a) + f(b)) / 2
        Token token = Token(tokenAddress);
        uint b = token.totalSupply() - initialSupply + amount;
        uint a = token.totalSupply() - initialSupply;
        uint fa = k*a + offset;
        uint fb = k*b + offset;
        return (b-a)*(fa+fb)/(2*SCALING_FACTOR);
    }

    function _createLiquiditynPool(address tokenAddress) external {
        Token token = Token(tokenAddress);
    }


}
