import { ethers } from "hardhat";
import { sleep } from "../src/utilsV2/common/sleep";
import { NORMAL_BUYER, USDT_ADDRESS } from "../src/constants/constants";

async function main() {
    const BidContract = await ethers.getContractFactory("MyToken");
    console.log("=====Deploying TOKEN=====");
    const TOKEN = await BidContract.deploy();
    console.log("TOKEN deployed to:", TOKEN.target);
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
