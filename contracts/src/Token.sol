// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    address public owner;
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens with 18 decimals

    constructor(string memory name, string memory symbol, uint initialMintValue) ERC20(name, symbol) {
        require(initialMintValue <= MAX_SUPPLY, "Initial mint exceeds max supply");
        _mint(msg.sender, initialMintValue);
        owner = msg.sender;
    }

    /**
     * @notice Mints new tokens and sends them to the specified receiver.
     * @dev Only the owner of the contract can call this function. 
     * It ensures that the total supply does not exceed the max supply.
     * @param mintQty The amount of tokens to mint.
     * @param receiver The address that will receive the minted tokens.
     * @return Returns 1 to indicate success.
     */
    function mint(uint mintQty, address receiver) external returns(uint) {
        require(msg.sender == owner, "Mint can only be called by the owner");
        require(totalSupply() + mintQty <= MAX_SUPPLY, "Mint would exceed max supply");

        _mint(receiver, mintQty);
        return 1;
    }
}
