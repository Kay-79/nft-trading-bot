import { ethers } from "hardhat";
import { sleep } from "../src/utilsV2/common/sleep";

async function main() {
    const BidUpgradeableContract = await ethers.getContractFactory("BidUpgradeable");
    console.log("=====Deploying BID_UPGRADEABLE=====");
    const BID_UPGRADEABLE = await BidUpgradeableContract.deploy();
    console.log("BID_UPGRADEABLE deployed to:", BID_UPGRADEABLE.target);
    console.log("=====Initializing BID_UPGRADEABLE=====");
    await sleep(10);
    await BID_UPGRADEABLE.initialize();
    console.log("BID_UPGRADEABLE initialized");
    console.log("=====Approving BID_UPGRADEABLE=====");
    await sleep(10);
    await BID_UPGRADEABLE.approve(
        "0x5555e5DC401AB6E86a240C7C3f3F86dE88E05Ee8",
        "0x221c5B1a293aAc1187ED3a7D7d2d9aD7fE1F3FB0"
    );
    console.log("BID_UPGRADEABLE approved");
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
