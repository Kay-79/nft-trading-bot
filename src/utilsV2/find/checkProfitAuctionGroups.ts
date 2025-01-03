import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionDto } from "../../types/dtos/Auction.dto";
import { TierPrice } from "../../types/common/TierPrice";
import {
    isBundleAuction,
    isProAuction,
    getProfitableBidAuctionsNormalVsPro,
    getProfitableBidAuctionsBundle
} from "./utils";
import { BidType } from "enum/enum";
import { AuctionGroupDto } from "types/dtos/AuctionGroup.dto";

export const checkProfitAuctionGroups = async (
    auctionGroups: AuctionGroupDto[],
    floorPrices: TierPrice,
    bnbPrice: number
): Promise<BidAuction[]> => {
    if (!auctionGroups || auctionGroups.length === 0) {
        return [];
    }
    let profitableBidAuctionGroups: BidAuction[] = [];
    let normalAuctions: AuctionDto[] = [];
    let proAuctions: AuctionDto[] = [];
    let bundleAuctions: AuctionDto[] = [];
    for (let i = 0; i < auctionGroups.length; i++) {
        const auctionGroup = auctionGroups[i];
        if (isProAuction(auctionGroup)) {
            proAuctions.push(auctionGroup);
        } else if (isBundleAuction(auctionGroup)) {
            bundleAuctions.push(auctionGroup);
        } else {
            normalAuctions.push(auctionGroup);
        }
    }
    profitableBidAuctionGroups.push(
        ...(await getProfitableBidAuctionsNormalVsPro(
            normalAuctions,
            floorPrices,
            bnbPrice,
            BidType.NORMAL
        ))
    );
    profitableBidAuctionGroups.push(
        ...(await getProfitableBidAuctionsNormalVsPro(
            proAuctions,
            floorPrices,
            bnbPrice,
            BidType.PRO
        ))
    );
    profitableBidAuctionGroups.push(
        ...getProfitableBidAuctionsBundle(bundleAuctions, floorPrices, bnbPrice)
    );
    return profitableBidAuctionGroups;
};
