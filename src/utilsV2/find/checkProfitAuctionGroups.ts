import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionGroupDto } from "types/dtos/AuctionGroup.dto";
import { TierPrice } from "../../types/common/TierPrice";
import { getProfitableBidAuctionsBlockCrew, getProfitableBidAuctionsBlock721 } from "./utils";
import { BidType, BlockType } from "enum/enum";

export const checkProfitAuctionGroups = async (
    auctionGroups: AuctionGroupDto[],
    floorPrices: TierPrice,
    bnbPrice: number
): Promise<BidAuction[]> => {
    if (!auctionGroups || auctionGroups.length === 0) {
        return [];
    }
    let profitableBidAuctionGroups: BidAuction[] = [];
    let groupSingleAuctions: AuctionGroupDto[] = [];
    let groupBatchAuctions: AuctionGroupDto[] = [];
    for (let i = 0; i < auctionGroups.length; i++) {
        const auctionGroup = auctionGroups[i];
        if (auctionGroup.type === BlockType.BEP721) {
            groupSingleAuctions.push(auctionGroup);
        } else if (auctionGroup.type === BlockType.CREW) {
            groupBatchAuctions.push(auctionGroup);
        }
    }
    profitableBidAuctionGroups.push(
        ...(await getProfitableBidAuctionsBlock721(
            groupSingleAuctions,
            floorPrices,
            bnbPrice,
            BidType.GROUP
        ))
    );
    profitableBidAuctionGroups.push(
        ...(await getProfitableBidAuctionsBlockCrew(
            groupBatchAuctions,
            floorPrices,
            bnbPrice,
            BidType.GROUP
        ))
    );
    return profitableBidAuctionGroups;
};
