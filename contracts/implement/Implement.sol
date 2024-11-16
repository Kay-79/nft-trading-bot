// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Bid is OwnableUpgradeable {
    address public addressMP = 0xcB0CffC2B12739D4BE791b8aF7fbf49bc1d6a8c2;
    address public addressMomo = 0x3bD6a582698ECCf6822dB08141818A1a8512c68D;
    address public changer = 0x11119D51e2Ff85D5353ABf499Fe63bE3344c0000;

    modifier onlyChanger() {
        require(msg.sender == changer, "Only the contract changer can call this function.");
        _;
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
    }

    receive() external payable {}

    function setChanger(address newChanger_) public onlyOwner {
        changer = address(newChanger_);
    }

    function setMP(address newMP_) public onlyOwner {
        addressMP = address(newMP_);
    }

    function withdraw(address payable destAddr) public onlyOwner {
        uint256 balance = address(this).balance;
        destAddr.transfer(balance);
    }

    function transferERC20(IERC20 token, address to, uint256 amount) public onlyOwner {
        uint256 erc20balance = token.balanceOf(address(this));
        require(amount <= erc20balance, "Balance is low");
        token.transfer(to, amount);
    }

    function approve(address spender, address token) external payable onlyOwner {
        (bool success, ) = token.call{ gas: gasleft(), value: msg.value }(
            abi.encodeWithSignature(
                "approve(address,uint256)",
                spender,
                115792089237316195423570985008687907853269984665640564039457584007913129639935
            )
        );
        if (!success) {
            revert("No approved");
        }
    }

    function bid(
        address auctor_,
        uint256 index_,
        uint256 startTime_,
        uint256 price_
    ) external payable onlyOwner {
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

    function bid(
        address[] memory auctors_,
        uint256[] memory indexs_,
        uint256[] memory startTimes_,
        uint256[] memory prices_,
        bool ignoreSold
    ) external payable onlyOwner {
        (bool success, bytes memory returnData) = addressMP.call{
            gas: gasleft(),
            value: msg.value
        }(
            abi.encodeWithSignature(
                "bid(address[],uint256[],uint256[],uint256[],bool)",
                auctors_,
                indexs_,
                startTimes_,
                prices_,
                ignoreSold
            )
        );
        if (!success) {
            revert(string(returnData));
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
        (bool success, bytes memory returnData) = addressMP.call{
            gas: gasleft(),
            value: msg.value
        }(abi.encodeWithSignature("cancelAuction(uint256)", index_));
        if (!success) {
            revert(string(returnData));
        }
    }

    function getReward() external payable onlyOwner {
        (bool success, bytes memory returnData) = addressMomo.call{
            gas: gasleft(),
            value: msg.value
        }(abi.encodeWithSignature("getReward()"));
        if (!success) {
            revert(string(returnData));
        }
    }

    function execute(
        address _target,
        uint256 _value,
        bytes calldata _data
    ) external payable onlyOwner {
        (bool success, bytes memory returnData) = _target.call{ gas: gasleft(), value: _value }(
            _data
        );
        if (!success) {
            revert(string(returnData));
        }
    }
}
