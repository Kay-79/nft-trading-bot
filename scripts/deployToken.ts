import { ethers } from "hardhat";
import { sleep } from "../src/utilsV2/common/sleep";
import { NORMAL_BUYER, PRO_BUYER } from "../src/constants/constants";

async function main() {
    const BidContract = await ethers.getContractFactory("MyToken");
    console.log("=====Deploying TOKEN=====");
    const TOKEN = await BidContract.deploy();
    console.log("TOKEN deployed to:", TOKEN.target);
    (await TOKEN.transfer(NORMAL_BUYER, PRO_BUYER, ((79797979 / 2) * 10 ** 9).toFixed(0))) +
        "000000000";
    await sleep(10);
    console.log("=====Transfer TOKEN to PRO_BUYER=====");
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
