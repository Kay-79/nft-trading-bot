import { getMboxPriceAndRewardDelay1Hour } from "@/AI/utils";
import { PRO_BUYER } from "@/constants/constants";
import { shortenNumber } from "@/utilsV2/common/utils";
import { stakingUtils } from "@/utilsV2/staking/utils";

const staking = async (address: string) => {
    const data = await getMboxPriceAndRewardDelay1Hour();
    const mboxPrice = data.mboxPrice;
    const rewardPer1000Hash = data.reward;
    const earned = await stakingUtils.earned(address);
    const userHashRate = await stakingUtils.userHashrate(address);
    const rewardPerDayOfUser = (userHashRate * rewardPer1000Hash) / 1000;
    console.log(
        `Stake info: ${address}\nReward 1000H/day: \t\x1b[33m${shortenNumber(
            rewardPer1000Hash,
            0,
            4
        )} MBOX\x1b[0m`
    );
    console.log(`User hashrate: \t\t\x1b[33m${shortenNumber(userHashRate, 0, 3)} H/s\x1b[0m`);
    console.log(`MBOX price: \t\t\x1b[33m$${shortenNumber(mboxPrice, 0, 5)}\x1b[0m`);
    console.log(
        `Total reward:\t\x1b[32m${shortenNumber(earned, 0, 3)} MBOX ~ $${shortenNumber(
            earned * mboxPrice,
            0,
            3
        )}\x1b[0m`
    );
    console.log(
        `Reward per day:\t\x1b[32m${shortenNumber(
            rewardPerDayOfUser,
            0,
            3
        )} MBOX ~ $${shortenNumber(rewardPerDayOfUser * mboxPrice, 0, 3)}\x1b[0m`
    );
};

staking(PRO_BUYER);
// staking("TEST_ADDRESS");
