// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    address public owner;

    constructor(string memory name, string memory symbol, uint initialMintValue) ERC20(name, symbol) {
        _mint(msg.sender, initialMintValue);
        owner = msg.sender;
    }

    /**
     * @notice Mints new tokens and sends them to the specified receiver.
     * @dev Only the owner of the contract can call this function.
     * @param mintQty The amount of tokens to mint.
     * @param receiver The address that will receive the minted tokens.
     * @return Returns 1 to indicate success.
     */
    function mint(uint mintQty, address receiver) external returns(uint){
        require(msg.sender == owner, "Mint can only be called by the owner");
        _mint(receiver, mintQty);
        return 1;
    }

    /**
     * @notice Burns a specified amount of tokens from the caller's account.
     * @param burnQty The amount of tokens to burn.
     * @return Returns 1 to indicate success.
     */
    function burn(uint burnQty) external returns(uint) {
        _burn(msg.sender, burnQty);
        return 1;
    }

    /**
     * @notice Burns a specified amount of tokens from a specified address.
     * @dev Only the owner of the contract can call this function.
     * @param burnQty The amount of tokens to burn.
     * @param account The address from which tokens will be burned.
     * @return Returns 1 to indicate success.
     */
    function burnFrom(uint burnQty, address account) external returns(uint) {
        require(msg.sender == owner, "Burn from can only be called by the owner");
        _burn(account, burnQty);
        return 1;
    }
}
