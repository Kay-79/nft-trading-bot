import { TIME_DELAY_BLOCK_BID } from "../../config/constans";
import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionDto } from "../../types/dtos/Auction.dto";

export const frontRunBidAuction = async (bidAuction: BidAuction) => {
    if (!bidAuction) return;
    if (!bidAuction.profit || !bidAuction.uptime) return;
    const nowTime = Date.now() / 1000;
    if (bidAuction.profit < 0 || nowTime - bidAuction.uptime > TIME_DELAY_BLOCK_BID) return;
    // Comming soon
};
