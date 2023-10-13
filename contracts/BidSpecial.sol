// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Factory {
    // Returns the address of the newly deployed contract
    function deploy(bytes32 _salt) public payable returns (address) {
        // This syntax is a newer way to invoke create2 without assembly, you just need to pass salt
        // https://docs.soliditylang.org/en/latest/control-structures.html#salted-contract-creations-create2
        return address(new Bid{salt: _salt}());
    }
}

// This is the older way of doing it using assembly
contract FactoryAssembly {
    event Deployed(address addr, uint salt);

    // 1. Get bytecode of contract to be deployed
    // NOTE: _owner and _foo are arguments of the Bid's constructor
    function getBytecode() public pure returns (bytes memory) {
        bytes memory bytecode = type(Bid).creationCode;

        return abi.encodePacked(bytecode);
    }

    // 2. Compute the address of the contract to be deployed
    // NOTE: _salt is a random number used to create an address
    function getAddress(
        bytes memory bytecode,
        uint _salt
    ) public view returns (address) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                _salt,
                keccak256(bytecode)
            )
        );

        // NOTE: cast last 20 bytes of hash to address
        return address(uint160(uint(hash)));
    }

    // 3. Deploy the contract
    // NOTE:
    // Check the event log Deployed which contains the address of the deployed Bid.
    // The address in the log should equal the address computed from above.
    function deploy(bytes memory bytecode, uint _salt) public payable {
        address addr;

        /*
        NOTE: How to call create2

        create2(v, p, n, s)
        create new contract with code at memory p to p + n
        and send v wei
        and return the new address
        where new address = first 20 bytes of keccak256(0xff + address(this) + s + keccak256(mem[p…(p+n)))
              s = big-endian 256-bit value
        */
        assembly {
            addr := create2(
                callvalue(), // wei sent with current call
                // Actual code starts after skipping the first 32 bytes
                add(bytecode, 0x20),
                mload(bytecode), // Load the size of code contained in the first 32 bytes
                _salt // Salt from function arguments
            )

            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }

        emit Deployed(addr, _salt);
    }
}

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Bid is OwnableUpgradeable {
    address public addressMP = 0xcB0CffC2B12739D4BE791b8aF7fbf49bc1d6a8c2;
    uint256 public amountUnList;
    address public changer = 0x11119D51e2Ff85D5353ABf499Fe63bE3344c0000;

    modifier onlyChanger() {
        require(
            msg.sender == changer,
            "Only the contract changer can call this function."
        );
        _;
    }

    function initialize() public initializer {
        __Ownable_init();
    }

    receive() external payable {}

    function setChanger(address newChanger_) public onlyOwner {
        changer = address(newChanger_);
    }

    function setMP(address newMP_) public onlyOwner {
        addressMP = address(newMP_);
    }

    function changeAmountUnList(uint256 newAmount) public onlyOwner {
        amountUnList = newAmount;
    }

    function withdraw(
        uint256 amount,
        address payable destAddr
    ) public onlyOwner {
        destAddr.transfer(amount);
    }

    function transferERC20(
        IERC20 token,
        address to,
        uint256 amount
    ) public onlyOwner {
        uint256 erc20balance = token.balanceOf(address(this));
        require(amount <= erc20balance, "Balance is low");
        token.transfer(to, amount);
    }

    function approve(
        address spender,
        address token
    ) external payable onlyOwner {
        (bool success, ) = token.call{gas: gasleft(), value: msg.value}(
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
        uint256 price_,
        uint256 amount_ //must have to count momo
    ) external payable onlyOwner {
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
