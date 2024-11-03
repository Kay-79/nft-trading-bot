import { TIME_DELAY_BLOCK_BID } from "../../config/constans";
import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionDto } from "../../types/dtos/Auction.dto";
import web3 from "../../providers/web3Instance";

export const bidAuction = async (bidAuction: BidAuction) => {
    if (!bidAuction) return;
    if (!bidAuction.profit || !bidAuction.uptime) return;
    const nowTime = Date.now() / 1000;
    if (bidAuction.profit < 0 || nowTime - bidAuction.uptime > TIME_DELAY_BLOCK_BID) return;
    if (!bidAuction.contractAddress || !bidAuction.buyer) return;
    const nonce = await web3.eth.getTransactionCount(bidAuction.buyer);
    const tx = {
        from: bidAuction.buyer,
        gas: 1000000,
        gasPrice: 0,
        nonce: 0,
        to: bidAuction.contractAddress,
        value: 0,
        data: ""
    };
};
