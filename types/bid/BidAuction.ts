import { AuctionDto } from "../dtos/Auction.dto";

export class BidAuction {
    id?: string; //type_seller_nowPrice_uptime
    uptime?: number;
    profit?: number;
    minProfit?: number;
    buyer?: string;
    nowPrice?: number;
    isBatch?: boolean;
    auctions?: AuctionDto[];
}
