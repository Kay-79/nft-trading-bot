import { ethers } from "hardhat";
import { sleep } from "../src/utilsV2/common/sleep";

async function main() {
    const MyContract = await ethers.getContractFactory("Bid");
    const BID = await MyContract.deploy();
    console.log("BID deployed to:", BID.target);
    console.log("=====Initializing BID=====");
    await sleep(10);
    await BID.initialize();
    console.log("BID initialized");
    console.log("=====Approving BID=====");
    await sleep(10);
    await BID.approve(
        "0xcB0CffC2B12739D4BE791b8aF7fbf49bc1d6a8c2",
        "0x55d398326f99059fF775485246999027B3197955"
    );
    console.log("BID approved");
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
