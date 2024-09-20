// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "./Token.sol";

contract TokenFactory {
    uint256 constant public DECIMALS = 10**18;
    uint256 constant public MAX_SUPPLY = 10**9 * DECIMALS;
    uint256 constant public initialSupply = MAX_SUPPLY*20/100;


    mapping(address => bool) public tokens;

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
    }

}
