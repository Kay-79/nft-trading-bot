import { ChangeDecision } from "@/types/change/ChangeDecision";
import { TierPrice } from "@/types/common/TierPrice";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { sleep } from "../common/sleep";
import { modeChange } from "@/config/config";

export const getChangeDecisionPro = async (
    auction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    const changeDecision: ChangeDecision = {
        shouldChange: false,
        newPrice: 999
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
        newPrice: 999
    };
    if (!modeChange.normal) {
        console.log("Normal mode is disabled");
        return changeDecision;
    }
    if (!auction.uptime && floorPrices) {
        console.log("No uptime, maybe changed or bought");
    }
    await sleep(1);
    return changeDecision;
};

export const getChangeDecisionBundle = async (
    auction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    const changeDecision: ChangeDecision = {
        shouldChange: false,
        newPrice: 999
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
