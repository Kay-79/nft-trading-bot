import { ethers } from "hardhat";
import { sleep } from "../src/utilsV2/common/sleep";
import { MP_ADDRESS, USDT_ADDRESS } from "../src/constants/constants";

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
    await BID_UPGRADEABLE.approve(MP_ADDRESS, USDT_ADDRESS);
    console.log("BID_UPGRADEABLE approved");
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
