import { ethers } from "hardhat";
import { sleep } from "../src/utilsV2/common/sleep";
import { MP_ADDRESS, USDT_ADDRESS } from "../src/constants/constants";

async function main() {
    const BidContract = await ethers.getContractFactory("Bid");
    console.log("=====Deploying BID=====");
    const BID = await BidContract.deploy();
    console.log("BID deployed to:", BID.target);
    await sleep(10);
    console.log("=====Approving BID=====");
    await sleep(10);
    await BID.approve(MP_ADDRESS, USDT_ADDRESS);
    console.log("BID approved");
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
