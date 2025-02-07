import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionGroupDto } from "types/dtos/AuctionGroup.dto";
import { TierPrice } from "../../types/common/TierPrice";
import { getProfitableBidAuctionsBlock } from "./utils";
import { BidType } from "enum/enum";

export const checkProfitAuctionGroups = async (
    auctionGroups: AuctionGroupDto[],
    floorPrices: TierPrice,
    bnbPrice: number,
    mboxPrice: number,
    rewardPer1000Hash: number
): Promise<BidAuction[]> => {
    if (!auctionGroups || auctionGroups.length === 0) {
        return [];
    }
    let profitableBidAuctionGroups: BidAuction[] = [];
    profitableBidAuctionGroups.push(
        ...(await getProfitableBidAuctionsBlock(
            auctionGroups,
            floorPrices,
            bnbPrice,
            BidType.GROUP,
            mboxPrice,
            rewardPer1000Hash
        ))
    );
    return profitableBidAuctionGroups;
};
