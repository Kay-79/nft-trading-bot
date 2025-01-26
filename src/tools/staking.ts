import { PRO_BUYER } from "constants/constants";
import { getTokenPrice } from "utilsV2/coigeko/utils";
import { shortenNumber } from "utilsV2/common/utils";
import { stakingUtils } from "utilsV2/staking/utils";

const stakingProfit = async (address: string) => {
    const earned = await stakingUtils.earned(address);
    const userHashRate = await stakingUtils.userHashrate(address);
    const rewardRate = await stakingUtils.getRewardRate();
    const rewardPerPeriod = await stakingUtils.getRewardPerPeriod();
    const totalHashRate = await stakingUtils.getTotalHashRate();
    const totalRewardPerDay = (rewardPerPeriod * rewardRate) / 360;
    const rewardPerDayOfUser = (userHashRate * totalRewardPerDay) / totalHashRate;
    const mboxPrice = await getTokenPrice("mobox");
    console.log(`Stake info:
        User hash rate: \t\x1b[33m${shortenNumber(userHashRate, 0, 2)} H\x1b[0m
        Total hash rate: \t\x1b[33m${shortenNumber(totalHashRate, 0, 2)} H\x1b[0m
        Reward rate: \t\t\x1b[33m${shortenNumber(rewardRate, 0, 3)} %\x1b[0m
        Reward per period: \t\x1b[33m${shortenNumber(rewardPerPeriod, 0, 2)} MBOX\x1b[0m
        Total reward per day: \t\x1b[33m${shortenNumber(totalRewardPerDay, 0, 2)} MBOX\x1b[0m`);
    console.log(`MBOX price: \t\x1b[33m$${shortenNumber(mboxPrice, 0, 3)}\x1b[0m`);
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

stakingProfit(PRO_BUYER);
// stakingProfit("TEST_ADDRESS");
