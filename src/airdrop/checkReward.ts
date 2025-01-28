import { fullNodeProvider } from "providers/fullNodeProvider";
import { Airdrop, readAccountsComplete } from "./hunt";
import { erc20Provider } from "providers/erc20Provider";
import { console } from "inspector";
import { ethers } from "ethers";
import { abiERC20 } from "abi/abiERC20";
import { stakingUtils } from "utilsV2/staking/utils";

const checkReward = async () => {
    const erc20Provider = new ethers.Contract(
        "0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377",
        abiERC20,
        fullNodeProvider
    );
    const addressesCheck: Airdrop[] = readAccountsComplete();
    console.log(`Total complete accounts:`, addressesCheck.length);
    for (let j = 0; j < addressesCheck.length; j++) {
        const previewMomo = await stakingUtils.previewMysteryBox
        
    }
};

checkReward();
