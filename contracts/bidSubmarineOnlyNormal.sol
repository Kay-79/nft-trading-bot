// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract bidSubmarineOnlyNormal {
    address private addressBUSD;
    address private addressMP;
    address public owner;
    address public macOs;
    address public changer;
    uint256 public balance;
    uint256 public amountUnList;
    uint256 public timeCache;

    constructor() payable {
        addressBUSD = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;
        macOs = 0x55555D4de8df0c455C2Ff368253388FE669a8888;
        addressMP = 0xcB0CffC2B12739D4BE791b8aF7fbf49bc1d6a8c2;
        owner = 0x77775a358050DE851b06603864FbD380637C7777;
        changer = 0x11119D51e2Ff85D5353ABf499Fe63bE3344c0000;
        (bool success, ) = addressBUSD.call{gas: gasleft(), value: msg.value}(
            abi.encodeWithSignature(
                "approve(address,uint256)",
                addressMP,
                115792089237316195423570985008687907853269984665640564039457584007913129639935
            )
        );
        if (!success) {
            revert("No approved");
        }
    }

    receive() external payable {
        balance += msg.value;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function."
        );
        _;
    }

    modifier onlyMac() {
        require(
            msg.sender == macOs,
            "Only the contract max can call this function."
        );
        _;
    }

    modifier onlyChanger() {
        require(
            msg.sender == changer,
            "Only the contract changer can call this function."
        );
        _;
    }

    function changeOwner(address newOwner_) public onlyOwner {
        owner = address(newOwner_);
    }

    function reset() public onlyChanger {
        timeCache = 0;
    }

    function changeAmountUnList(uint256 newAmount) public onlyOwner {
        amountUnList = newAmount;
    }

    function setChanger(address newChanger_) public onlyOwner {
        changer = address(newChanger_);
    }

    function withdraw(uint256 amount, address payable destAddr) public onlyMac {
        require(amount <= balance, "Insufficient funds");
        destAddr.transfer(amount);
        balance -= amount;
    }

    function transferERC20(
        IERC20 token,
        address to,
        uint256 amount
    ) public onlyMac {
        uint256 erc20balance = token.balanceOf(address(this));
        require(amount <= erc20balance, "Balance is low");
        token.transfer(to, amount);
    }

    function bid(
        address auctor_,
        uint256 index_,
        uint256 startTime_,
        uint256 price_,
        uint256 amount_ //must have to count momo
    ) external payable onlyOwner {
        if (startTime_ != timeCache) {
            timeCache = startTime_;
        } else {
            amountUnList += amount_;
            (bool success, bytes memory returnData) = addressMP.call{
                gas: gasleft(),
                value: msg.value
            }(
                abi.encodeWithSignature(
                    "bid(address,uint256,uint256,uint256)",
                    auctor_,
                    index_,
                    startTime_,
                    price_
                )
            );
            if (!success) {
                revert(string(returnData));
            }
        }
    }

    function changePrice(
        uint256 index_,
        uint256 startPrice_,
        uint256 endPrice_,
        uint256 duration_
    ) external payable onlyChanger {
        (bool success, bytes memory returnData) = addressMP.call{
            gas: gasleft(),
            value: msg.value
        }(
            abi.encodeWithSignature(
                "changePrice(uint256,uint256,uint256,uint256)",
                index_,
                startPrice_,
                endPrice_,
                duration_
            )
        );
        if (!success) {
            revert(string(returnData));
        }
    }

    function createAuctionBatch(
        uint256 suggestIndex_,
        uint256[] memory tokenIds_,
        uint256[] memory prices721_,
        uint256[] memory ids_,
        uint256[] memory prices1155_
    ) external payable onlyChanger {
        amountUnList -= (ids_.length + prices721_.length);
        (bool success, bytes memory returnData) = addressMP.call{
            gas: gasleft(),
            value: msg.value
        }(
            abi.encodeWithSignature(
                "createAuctionBatch(uint256,uint256[],uint256[],uint256[],uint256[])",
                suggestIndex_,
                tokenIds_,
                prices721_,
                ids_,
                prices1155_
            )
        );
        if (!success) {
            revert(string(returnData));
        }
    }

    function cancelAuction(uint256 index_) external payable onlyChanger {
        amountUnList += 1; //add
        (bool success, bytes memory returnData) = addressMP.call{
            gas: gasleft(),
            value: msg.value
        }(abi.encodeWithSignature("cancelAuction(uint256)", index_));
        if (!success) {
            revert(string(returnData));
        }
    }
}
