// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TokenFactory} from "../src/TokenFactory.sol";

contract CounterScript is Script {
    TokenFactory public factory;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        factory = new TokenFactory();

        vm.stopBroadcast();
    }
}
