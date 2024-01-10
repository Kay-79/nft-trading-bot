// SPDX-License-Identifier: None
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Wallet is OwnableUpgradeable {
    function initialize() public initializer {
        __Ownable_init();
    }

    receive() external payable {}

    function balance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw(
        uint256 amount,
        address payable destAddr
    ) public onlyOwner {
        uint256 myBalance = address(this).balance;
        require(amount <= myBalance, "Balance is low");
        destAddr.transfer(amount);
    }

    function balanceToken(IERC20 token) public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function transferToken(
        IERC20 token,
        address to,
        uint256 amount
    ) public onlyOwner {
        uint256 erc20balance = token.balanceOf(address(this));
        require(amount <= erc20balance, "Balance is low");
        token.transfer(to, amount);
    }
}
