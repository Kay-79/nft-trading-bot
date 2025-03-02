import { TierPrice } from "@/types/common/TierPrice";
import { AuctionDto } from "@/types/dtos/Auction.dto";

interface returnValue {
    shouldChange: boolean;
    newPrice: number;
}

// export const getPriceChangeDecisionPro = (
//     auction: AuctionDto,
//     floorPrices: TierPrice
// ): Promise<returnValue> => {};

export const getPriceChangeDecisionNormal = (
    auction: AuctionDto,
    floorPrices: TierPrice
): Promise<returnValue> => {
    let returnValue: returnValue = {
        shouldChange: false,
        newPrice: 0
    };
    if (auction && floorPrices) {
        return await returnValue;
    }
    return Promise.resolve(false);
};

// export const getPriceChangeDecisionBundle = (
//     auction: AuctionDto,
//     floorPrices: TierPrice
// ): Promise<returnValue> => {
//     // comming soon
//     if (auction && floorPrices) {
//         return Promise.resolve(true);
//     }
//     return Promise.resolve(false);
// };
