import { AuctionDto } from "../dtos/Auction.dto";
import { TierPrice } from "../dtos/TierPrice.dto";

export class BidAuction {
    id?: string;
    uptime?: number;
    profit?: number;
    minProfit?: number;
    buyer?: string;
    contractAddress?: string;
    totalPrice?: number;
    minPrice?: TierPrice;
    fee?: number;
    type?: string;
    amount?: number;
    auctions?: AuctionDto[];
}
