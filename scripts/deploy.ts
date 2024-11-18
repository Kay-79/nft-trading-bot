import { ethers } from "hardhat";
import { sleep } from "../src/utilsV2/common/sleep";

async function main() {
    const BidContract = await ethers.getContractFactory("Bid");
    console.log("=====Deploying BID=====");
    const BID = await BidContract.deploy();
    console.log("BID deployed to:", BID.target);
    console.log("=====Initializing BID=====");
    await sleep(10);
    await BID.initialize();
    console.log("BID initialized");
    console.log("=====Approving BID=====");
    await sleep(10);
    await BID.approve(
        "0x5555e5DC401AB6E86a240C7C3f3F86dE88E05Ee8",
        "0x221c5B1a293aAc1187ED3a7D7d2d9aD7fE1F3FB0"
    );
    console.log("BID approved");
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
