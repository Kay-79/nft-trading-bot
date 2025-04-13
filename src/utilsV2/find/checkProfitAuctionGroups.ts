import { AuctionGroupDto } from "@/types/dtos/AuctionGroup.dto";
import { BidAuction } from "../../types/bid/BidAuction";
import { TierPrice } from "../../types/common/TierPrice";
import { getProfitableBidAuctionsBlock } from "./utils";
import { BidType } from "@/enum/enum";

export const checkProfitAuctionGroups = async (
    auctionGroups: AuctionGroupDto[],
    floorPrices: TierPrice,
    bnbPrice: number
): Promise<BidAuction[]> => {
    if (!auctionGroups || auctionGroups.length === 0) {
        return [];
    }
    const profitableBidAuctionGroups: BidAuction[] = [];
    profitableBidAuctionGroups.push(
        ...(await getProfitableBidAuctionsBlock(
            auctionGroups,
            floorPrices,
            bnbPrice,
            BidType.GROUP
        ))
    );
    return profitableBidAuctionGroups;
};
