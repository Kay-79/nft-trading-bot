// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract SubmarineProxy is TransparentUpgradeableProxy {
    constructor(
        address logic,
        address admin
    ) TransparentUpgradeableProxy(logic, admin, "") {}
}