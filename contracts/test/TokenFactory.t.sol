// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {TokenFactory} from "../src/TokenFactory.sol";
import {Token} from "../src/Token.sol";

contract TokenFactoryTest is Test {
    TokenFactory public factory;

    function setUp() public {
        factory = new TokenFactory();
    }

    function test_CreateToken() public {
        address tokenAddress = factory.createToken("TestToken", "TT");
        Token token = Token(tokenAddress);
        assertEq(token.balanceOf(address(factory)), factory.initialSupply());
        assertEq(token.totalSupply(), factory.initialSupply());
        assertEq(factory.tokens(tokenAddress), true);
    }

    function test_calculateRequiredFlow() public {
        address tokenAddress = factory.createToken("TestToken", "TT");
        Token token = Token(tokenAddress);
        uint totalBuyableSupply = factory.MAX_SUPPLY() - factory.initialSupply();
        uint requiredFlow = factory.calculateRequiredFlow(tokenAddress, totalBuyableSupply);
        assertEq(requiredFlow, 150000*10**18);
    }

}
