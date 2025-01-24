import { BidAuction } from "types/bid/BidAuction";
import { AuctionDto } from "types/dtos/Auction.dto";

export interface Check {
    address: string;
    isContract: boolean;
    listings: AuctionDto[];
    bids: BidAuction[];

}