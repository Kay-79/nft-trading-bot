import { ChangeDecision } from "@/types/change/ChangeDecision";
import { TierPrice } from "@/types/common/TierPrice";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { sleep } from "../common/sleep";
import { contracts } from "@/config/config";
import { getAuctionsByPrototype } from "./utils";
import { ethers } from "ethers";
import { shortenNumber } from "@/utils/shorten";
import {
    minTimeListedMyAuctionToChange,
    minTimeListedOtherAuctionToChange,
    modeChange,
    priceDelta,
    priceDeltaMin,
    priceThreshold
} from "@/config/changeConfig";
import { isExistAuction } from "../bid/utils";

export const getChangeDecisionPro = async (
    auction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    const changeDecision: ChangeDecision = {
        shouldChange: false,
        newPrice: 0
    };
    if (!modeChange.pro) {
        console.log("Pro mode is disabled");
        return changeDecision;
    }
    if (!auction.uptime && floorPrices) {
        console.log("No uptime, maybe changed or bought");
    }
    await sleep(1);
    return changeDecision;
};

export const getChangeDecisionNormal = async (
    auction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    const changeDecision: ChangeDecision = {
        shouldChange: false,
        newPrice: 0
    };

    if (!auction.prototype || !auction.nowPrice || !auction.uptime) {
        console.log("No prototype");
        return changeDecision;
    }

    if (!modeChange.normal) {
        console.log("Normal mode is disabled");
        return changeDecision;
    }

    if (!auction.uptime && floorPrices) {
        console.log("No uptime, maybe changed or bought");
        return changeDecision;
    }

    const auctionsSamePrototype = await getAuctionsByPrototype(auction.prototype);
    const auctionLowestPrice = auctionsSamePrototype
        .filter(a => a.nowPrice)
        .sort((a, b) => (a.nowPrice ?? 0) - (b.nowPrice ?? 0))[0];
    if (!(await isExistAuction(auctionLowestPrice))) {
        console.log("No lowest price");
        return changeDecision;
    }
    if (!auctionLowestPrice?.auctor || !auctionLowestPrice.nowPrice || !auctionLowestPrice.uptime) {
        console.log("No lowest price");
        return changeDecision;
    }

    if (Date.now() / 1000 - auction.uptime < minTimeListedMyAuctionToChange) {
        console.log("Require minTimeListedMyAuctionToChange");
        return changeDecision;
    }

    if (Date.now() / 1000 - auctionLowestPrice.uptime < minTimeListedOtherAuctionToChange) {
        console.log("Require minTimeListedOtherAuctionToChange");
        return changeDecision;
    }

    if (
        contracts.includes(auctionLowestPrice.auctor.toLowerCase()) ||
        contracts.includes(ethers.getAddress(auctionLowestPrice.auctor))
    ) {
        console.log("Lowest price is from your contract");
        return changeDecision;
    }

    changeDecision.shouldChange = true;
    changeDecision.newPrice = shortenNumber(
        auctionLowestPrice.nowPrice - priceDelta * 10 ** 9,
        9,
        3
    );

    const floorPrice = floorPrices[Math.floor(auction.prototype / 10 ** 4)];
    console.log("Floor price", floorPrice);
    if (
        changeDecision.newPrice < floorPrice ||
        Math.abs(changeDecision.newPrice - floorPrice) < priceThreshold
    ) {
        console.log("New price is lower than floor price");
        changeDecision.newPrice = shortenNumber(floorPrice - priceDeltaMin, 0, 3);
    }

    if (changeDecision.newPrice >= shortenNumber(auction.nowPrice, 9, 3)) {
        changeDecision.shouldChange = false;
        console.log("Lowest price is higher than current price");
    }

    return changeDecision;
};

export const getChangeDecisionBundle = async (
    auction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    const changeDecision: ChangeDecision = {
        shouldChange: false,
        newPrice: 0
    };
    if (!modeChange.bundle) {
        console.log("Bundle mode is disabled");
        return changeDecision;
    }
    if (!auction.uptime && floorPrices) {
        console.log("No uptime, maybe changed or bought");
    }
    await sleep(1);
    return changeDecision;
};
