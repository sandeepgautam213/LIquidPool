// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC_20 is ERC20 {
    constructor(uint256 initialSupply, string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply*(10 ** decimals()));
    }

    function decimals() public pure override returns (uint8) {
        return 2;
    }

    function mint(address _address, uint amount) public {
        _mint(_address, amount*(10 ** decimals()));
    }
}