import { noticeBotChange } from "@/utilsV2/bid/handleNoticeBot";
import {
    CACHE_BNB_PRICE,
    CACHE_TIER_PRICE,
    CACHE_MBOX_PRICE,
    CACHE_REWARD_PER_1000_HASH,
    ENV,
    TIME_DELAY_NOTICE_STATUS_BOT,
    TIME_DELAY_SETUP_CHANGE
} from "@/constants/constants";
import { setup } from "../utilsV2/find/setup";
import { SetupBot } from "@/types/common/SetupBot";
import { getAllMyAuctions } from "@/utilsV2/change/getAllMyAuctions";
import { sortVsFilterAuctions } from "@/utilsV2/change/sortVsFilterAuctions";
import { ranSleep } from "@/utilsV2/common/sleep";
import { isExistAuction } from "@/utilsV2/bid/utils";
import {
    getChangeDecisionNormal,
    getChangeDecisionPro,
    getChangeDecisionBundle
} from "@/utilsV2/change/getChangeDecision";
import { isBundleAuction, isProAuction } from "@/utilsV2/find/utils";
import { ChangeDecision } from "@/types/change/ChangeDecision";
import { changeAuction } from "@/utilsV2/change/changeAuction";

const change = async () => {
    console.log("Starting change...", ENV);
    let latestNotice = new Date().getHours() - TIME_DELAY_NOTICE_STATUS_BOT;
    let initSetup: SetupBot = await setup(
        CACHE_BNB_PRICE,
        CACHE_TIER_PRICE,
        CACHE_MBOX_PRICE,
        CACHE_REWARD_PER_1000_HASH
    );
    let {
        bnbPrice,
        isFrontRunNormal,
        isFrontRunPro,
        isFrontRunProHash,
        floorPrices,
        timeLastSetup,
        mboxPrice,
        rewardPer1000Hash
    } = initSetup;
    while (true) {
        const myAuctions = sortVsFilterAuctions(await getAllMyAuctions());
        for (const auction of myAuctions) {
            const now = new Date();
            const currentHour = now.getHours();
            if (Math.abs(currentHour - latestNotice) >= TIME_DELAY_NOTICE_STATUS_BOT) {
                latestNotice = await noticeBotChange();
            }
            if (timeLastSetup && Date.now() / 1000 - timeLastSetup > TIME_DELAY_SETUP_CHANGE) {
                if (bnbPrice && floorPrices && mboxPrice && rewardPer1000Hash) {
                    initSetup = await setup(bnbPrice, floorPrices, mboxPrice, rewardPer1000Hash);
                }
                ({
                    bnbPrice,
                    isFrontRunNormal,
                    isFrontRunPro,
                    isFrontRunProHash,
                    floorPrices,
                    timeLastSetup,
                    mboxPrice,
                    rewardPer1000Hash
                } = initSetup);
            }
            if (
                !bnbPrice ||
                !isFrontRunNormal ||
                !isFrontRunPro ||
                !isFrontRunProHash ||
                !floorPrices ||
                !timeLastSetup ||
                !mboxPrice ||
                !rewardPer1000Hash
            )
                continue;
            if (!(await isExistAuction(auction))) {
                console.log("Not exist, maybe changed or bought");
                continue;
            }
            let changeDecision: ChangeDecision;
            if (isProAuction(auction)) {
                changeDecision = await getChangeDecisionPro(auction, floorPrices);
            } else if (isBundleAuction(auction)) {
                changeDecision = await getChangeDecisionBundle(auction, floorPrices);
            } else {
                changeDecision = await getChangeDecisionNormal(auction, floorPrices);
            }
            if (changeDecision.shouldChange) {
                console.log(
                    `Change auction ${auction.prototype} from ${auction.nowPrice} to ${changeDecision.newPrice}`
                );
                await changeAuction(auction, changeDecision.newPrice);
            }
            await ranSleep(5 * 60, 10 * 60);
        }
        await ranSleep(20 * 60, 30 * 60);
    }
};

change();
