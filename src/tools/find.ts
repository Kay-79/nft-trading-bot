process.on("unhandledRejection", (reason, promise) => {
    console.log("Custom Unhandled Rejection at:", promise, "reason:", reason);
});
import { getNewAutions } from "../utilsV2/find/getNewAuctions";
import { ranSleep } from "../utilsV2/common/sleep";
import { AuctionDto } from "../types/dtos/Auction.dto";
import { updateWaitBid } from "../utilsV2/find/utils";
import {
    CACHE_BNB_PRICE,
    CACHE_TIER_PRICE,
    CACHE_MBOX_PRICE,
    CACHE_REWARD_PER_1000_HASH,
    ENV,
    TIME_DELAY_NOTICE_STATUS_BOT,
    TIME_DELAY_SETUP_FIND
} from "../constants/constants";
import { setup } from "../utilsV2/find/setup";
import { SetupFind } from "../types/find/SetupFind";
import { noticeBotFind } from "../utilsV2/bid/handleNoticeBot";
import { LatestGet } from "@/types/find/LatestGet";
import { CacheFind } from "@/types/find/CacheFind";
import { AuctionGroupDto } from "@/types/dtos/AuctionGroup.dto";
import { delayTimeGet, modeBot } from "@/config/config";
import { checkProfitAuctions } from "@/utilsV2/find/checkProfitAuctions";
import { getNewAuctionGroups } from "@/utilsV2/find/getNewAuctionGroups";
import { checkProfitAuctionGroups } from "@/utilsV2/find/checkProfitAuctionGroups";

const findV2 = async () => {
    console.log("Starting findV2...", ENV);
    let latestNotice = new Date().getHours() - TIME_DELAY_NOTICE_STATUS_BOT;
    const latestGetData: LatestGet = {
        auction: 0,
        auctionGroup: 0,
        box: 0,
        mecBox: 0,
        gem: 0
    };
    const cacheIds: CacheFind = {
        auction: [],
        auctionGroup: [],
        box: [],
        mecBox: [],
        gem: []
    };
    let initSetup: SetupFind = await setup(
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
    console.log(`ModeBot: ${JSON.stringify(modeBot)}`);
    while (true) {
        //===========================SETUP===========================
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
        const now = new Date();
        const currentHour = now.getHours();
        if (Math.abs(currentHour - latestNotice) >= TIME_DELAY_NOTICE_STATUS_BOT) {
            latestNotice = await noticeBotFind(
                latestNotice,
                floorPrices || CACHE_TIER_PRICE,
                bnbPrice || CACHE_BNB_PRICE
            );
        }
        let newAuctions: AuctionDto[] = [];
        let newAuctionsBlock: AuctionGroupDto[] = [];
        //===========================AUCTION===========================
        if (
            (modeBot.auction?.normal || modeBot.auction?.pro || modeBot.auction?.bundle) &&
            Date.now() / 1000 - (latestGetData.auction ?? 0) > (delayTimeGet.auction ?? 0)
        ) {
            latestGetData.auction = Date.now() / 1000;
            await getNewAutions(cacheIds.auction || []).then(async ([auctions, auctionIds]) => {
                newAuctions = auctions;
                cacheIds.auction = auctionIds;
            });
            if (newAuctions.length !== 0) {
                const profitAuctions = await checkProfitAuctions(
                    newAuctions,
                    floorPrices,
                    bnbPrice,
                    mboxPrice,
                    rewardPer1000Hash
                );
                if (profitAuctions.length > 0) {
                    await updateWaitBid(profitAuctions);
                }
            }
        }
        if (
            (modeBot.auctionGroup?.bep721 || modeBot.auctionGroup?.crew) &&
            Date.now() / 1000 - (latestGetData.auctionGroup ?? 0) > (delayTimeGet.auctionGroup ?? 0)
        ) {
            await ranSleep(3, 7); // sleep 3-7s if auctionGroup
            latestGetData.auctionGroup = Date.now() / 1000;
            await getNewAuctionGroups(cacheIds.auctionGroup || []).then(
                async ([auctionGroups, auctionGroupIds]) => {
                    newAuctionsBlock = auctionGroups;
                    cacheIds.auctionGroup = auctionGroupIds;
                }
            );
            if (newAuctionsBlock.length !== 0) {
                const profitAuctionsBlock = await checkProfitAuctionGroups(
                    newAuctionsBlock,
                    floorPrices,
                    bnbPrice,
                    mboxPrice,
                    rewardPer1000Hash
                );
                if (profitAuctionsBlock.length > 0) {
                    await updateWaitBid(profitAuctionsBlock);
                }
            }
        }
        //===========================SETUP===========================
        if (Date.now() / 1000 - timeLastSetup > TIME_DELAY_SETUP_FIND) {
            initSetup = await setup(bnbPrice, floorPrices, mboxPrice, rewardPer1000Hash);
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
        await ranSleep(15, 30);
    }
};

findV2();
