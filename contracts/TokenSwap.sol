// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC20.sol";

contract TokenSwap{
    ERC_20 public RBNT;
    ERC_20 public SANDY;

    uint public reserveRBNT;
    uint public  reserveSANDY;

    constructor(ERC_20 _rbnt, ERC_20 _sandy) {
        RBNT = _rbnt;
        SANDY = _sandy;
        // RBNT.mint(address(this), reserveRBNT);
        // sandy.mint(address(this), reservesandy);
    }

    function exchange(uint _amount) external returns(uint amountOut){
        require(_amount > 0 && _amount <= RBNT.balanceOf(msg.sender), "Insufficient balance");
        // RBNT.approve(address(this), _amount);
        RBNT.transferFrom(msg.sender, address(this), _amount);

        uint amountInWithFee = (_amount * 997) / 1000;
        amountOut = (reserveSANDY * amountInWithFee) / (reserveRBNT + amountInWithFee);

        SANDY.transfer(msg.sender, amountOut);
        _updateReserve(RBNT.balanceOf(address(this)), SANDY.balanceOf(address(this)));
    }

    function _updateReserve(uint256 _reserve0, uint256 _reserve1) private {
        reserveRBNT = _reserve0;
        reserveSANDY = _reserve1;
    }

    function addLiquidity(uint _amount0, uint _amount1) external {
        // RBNT.approve(address(this), _amount0);
        // SANDY.approve(address(this), _amount1);
        RBNT.transferFrom(msg.sender, address(this), _amount0);
        SANDY.transferFrom(msg.sender, address(this), _amount1);
        _updateReserve(RBNT.balanceOf(address(this)), SANDY.balanceOf(address(this)));
    }

    function checkBalance(address _address) external view returns(uint _rbnt, uint _sandy) {
        _rbnt = RBNT.balanceOf(_address);
        _sandy = SANDY.balanceOf(_address);
    }

    function getBalance() external view returns(uint){
        return RBNT.balanceOf(msg.sender);
    }
}