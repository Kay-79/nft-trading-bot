import { ChangeDecision } from "@/types/change/ChangeDecision";
import { TierPrice } from "@/types/common/TierPrice";
import { AuctionDto } from "@/types/dtos/Auction.dto";

export const getChangeDecisionPro = (
    auction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    let changeDecision: ChangeDecision = {
        shouldChange: false,
        newPrice: 0
    };
    if (!auction.uptime) {
        return Promise.resolve(changeDecision);
    }
    if (Date.now()/1000 - auction.uptime){}
};

export const getChangeDecisionNormal = (
    auction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    let changeDecision: ChangeDecision = {
        shouldChange: false,
        newPrice: 0
    };
};

export const getChangeDecisionBundle = (
    auction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    let changeDecision: ChangeDecision = {
        shouldChange: false,
        newPrice: 0
    };
};
