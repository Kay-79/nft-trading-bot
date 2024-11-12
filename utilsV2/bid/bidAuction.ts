import { TIME_DELAY_BLOCK_BID } from "../../config/constans";
import { ethersProvider } from "../../providers/ethersProvider";
import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionDto } from "../../types/dtos/Auction.dto";

export const bidAuction = async (bidAuction: BidAuction) => {
    if (
        !bidAuction ||
        !bidAuction.profit ||
        !bidAuction.uptime ||
        !bidAuction.buyer ||
        !bidAuction.contractAddress
    )
        return;
    const nowTime = Date.now() / 1000;
    if (bidAuction.profit < 0 || nowTime - bidAuction.uptime > TIME_DELAY_BLOCK_BID) return;
    if (!bidAuction.contractAddress || !bidAuction.buyer) return;
    const nonce = await ethersProvider.getTransactionCount(bidAuction?.buyer);
    console.log("Nonce:", nonce);
    const tx = {
        from: bidAuction.buyer,
        gas: 1000000,
        gasPrice: 0,
        nonce: nonce,
        to: bidAuction.contractAddress,
        value: 0,
        data: ""
    };
};
