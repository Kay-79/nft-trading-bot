process.on("unhandledRejection", (reason, promise) => {
    console.error("Custom Unhandled Rejection at:", promise, "reason:", reason);
});
import { noticeBotChange } from "@/utilsV2/bid/handleNoticeBot";
import {
    CACHE_BNB_PRICE,
    CACHE_TIER_PRICE,
    // CACHE_MBOX_PRICE,
    // CACHE_REWARD_PER_1000_HASH,
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
import { isBundleAuction, isNormalAuction, isProAuction } from "@/utilsV2/find/utils";
import { ChangeDecision } from "@/types/change/ChangeDecision";
import { changeAuction } from "@/utilsV2/change/changeAuction";
import { shortenNumber } from "@/utils/shorten";
import { modeChange } from "@/config/changeConfig";

const change = async () => {
    console.log("Starting change...", ENV);
    let latestNotice = new Date().getHours() - TIME_DELAY_NOTICE_STATUS_BOT;
    let initSetup: SetupBot = await setup(CACHE_BNB_PRICE, CACHE_TIER_PRICE);
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
    let hasNotified = false;
    while (true) {
        const myAuctions = sortVsFilterAuctions(await getAllMyAuctions());
        for (const myAuction of myAuctions) {
            console.log(`### Auction ${myAuction.prototype} ###`);
            const now = new Date();
            const currentHour = now.getHours();
            if (currentHour === 17 && !hasNotified) {
                latestNotice = await noticeBotChange();
                hasNotified = true;
                console.log("Notice bot change", latestNotice);
            } else if (currentHour !== 17) {
                hasNotified = false;
            }
            if (timeLastSetup && Date.now() / 1000 - timeLastSetup > TIME_DELAY_SETUP_CHANGE) {
                if (bnbPrice && floorPrices) {
                    initSetup = await setup(bnbPrice, floorPrices);
                }
                ({
                    bnbPrice,
                    isFrontRunNormal,
                    isFrontRunPro,
                    isFrontRunProHash,
                    floorPrices,
                    timeLastSetup
                } = initSetup);
            }
            if (
                !bnbPrice ||
                !isFrontRunNormal ||
                !isFrontRunPro ||
                !isFrontRunProHash ||
                !floorPrices ||
                !timeLastSetup 
            ) {
                console.log("Setup failed, waiting for next loop...");
                continue;
            }
            if (!myAuction.nowPrice) {
                console.log("No now price, maybe changed or bought");
                continue;
            }
            if (!(await isExistAuction(myAuction))) {
                console.log("Not exist, maybe changed or bought");
                await ranSleep(5, 10);
                continue;
            }
            const changeDecision: ChangeDecision =
                isProAuction(myAuction) && modeChange.pro
                    ? await getChangeDecisionPro(myAuction, floorPrices)
                    : isBundleAuction(myAuction) && modeChange.bundle
                    ? await getChangeDecisionBundle(myAuction, floorPrices)
                    : isNormalAuction(myAuction) && modeChange.normal
                    ? await getChangeDecisionNormal(myAuction, floorPrices)
                    : { shouldChange: false, newPrice: 0 };

            if (changeDecision.shouldChange && changeDecision.newPrice) {
                await changeAuction(myAuction, changeDecision.newPrice);
                await ranSleep(5 * 60, 10 * 60);
            } else {
                console.log(
                    `No need to change myAuction ${myAuction.prototype}, price: ${shortenNumber(
                        myAuction.nowPrice,
                        9,
                        3
                    )}`
                );
            }
            await ranSleep(15, 30);
        }
    }
};

change();
