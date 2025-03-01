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
            console.log(auction);
            // check and change auction
        }
    }
};

change();
