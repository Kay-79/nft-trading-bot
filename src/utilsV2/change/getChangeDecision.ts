import { ChangeDecision } from "@/types/change/ChangeDecision";
import { TierPrice } from "@/types/common/TierPrice";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { sleep } from "../common/sleep";
import { contracts } from "@/config/config";
import { getAuctionsByPrototype } from "./utils";
import { ethers } from "ethers";
import { shortenNumber } from "@/utils/shorten";
import { modeChange, priceDelta } from "@/config/changeConfig";

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
    if (!auction.prototype || !auction.nowPrice) {
        console.log("No prototype");
        return changeDecision;
    }
    if (!modeChange.normal) {
        console.log("Normal mode is disabled");
        return changeDecision;
    }
    if (!auction.uptime && floorPrices) {
        console.log("No uptime, maybe changed or bought");
    }
    await sleep(1);
    const auctionsSamePrototype = await getAuctionsByPrototype(auction.prototype);
    auctionsSamePrototype.sort((a, b) => (a.nowPrice ?? 0) - (b.nowPrice ?? 0));
    const auctionLowestPrice = auctionsSamePrototype[0];
    if (!auctionLowestPrice.auctor || !auctionLowestPrice.nowPrice) {
        console.log("No auctor");
        return changeDecision;
    }
    if (
        contracts.includes(auctionLowestPrice.auctor.toLowerCase()) ||
        contracts.includes(ethers.getAddress(auctionLowestPrice.auctor))
    ) {
        console.log("Lowest price is from your contract");
        return changeDecision;
    } else {
        changeDecision.shouldChange = true;
        changeDecision.newPrice = shortenNumber(auctionLowestPrice.nowPrice, 9, 3);
        if (changeDecision.newPrice < floorPrices[Math.floor(auction.prototype / 10 ** 4)]) {
            changeDecision.newPrice =
                floorPrices[Math.floor(auction.prototype / 10 ** 4)] - priceDelta;
        }
        if (changeDecision.newPrice >= auction.nowPrice) {
            changeDecision.shouldChange = false;
            console.log("Lowest price is higher than current price");
        }
        return changeDecision;
    }
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
