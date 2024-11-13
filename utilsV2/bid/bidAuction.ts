import { TIME_DELAY_BLOCK_BID } from "../../config/constans";
import { contractProvider } from "../../providers/contractProvider";
import { ethersProvider } from "../../providers/ethersProvider";
import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionDto } from "../../types/dtos/Auction.dto";

export const bidAuction = async (bidAuction: BidAuction) => {
    console.log("Start bidAuction");
    if (
        !bidAuction ||
        !bidAuction.profit ||
        !bidAuction.uptime ||
        !bidAuction.buyer ||
        !bidAuction.auctions ||
        !bidAuction.contractAddress
    )
        return;
    const nowTime = Date.now() / 1000;
    console.log("Now time:", nowTime);
    if (bidAuction.profit < 0 || nowTime - bidAuction.uptime > TIME_DELAY_BLOCK_BID) return;
    if (!bidAuction.contractAddress || !bidAuction.buyer) return;
    const nonce = await ethersProvider.getTransactionCount(bidAuction?.buyer);
    console.log("Nonce:", nonce);
    console.log(bidAuction.auctions.map((auction: AuctionDto) => auction.auctor).join(","));
    let txData = "";
    if (bidAuction.auctions.length === 1)
        txData = contractProvider.interface.encodeFunctionData(
            "bid(address,uint256,uint256,uint256)",
            [
                bidAuction.auctions[0].auctor,
                bidAuction.auctions[0].index,
                bidAuction.auctions[0].uptime,
                bidAuction.auctions[0].nowPrice
            ]
        );
    else
        txData = contractProvider.interface.encodeFunctionData(
            "bid(address,uint256,uint256,uint256)",
            [
                bidAuction.auctions.map((auction: AuctionDto) => auction.auctor),
                bidAuction.auctions.map((auction: AuctionDto) => auction.index),
                bidAuction.auctions.map((auction: AuctionDto) => auction.uptime),
                bidAuction.auctions.map((auction: AuctionDto) => auction.nowPrice)
            ]
        );
    console.log("txData:", txData);
    const txParams = {
        from: bidAuction.buyer,
        gas: 1000000,
        gasPrice: 0,
        nonce: nonce,
        to: bidAuction.contractAddress,
        value: 0,
        data: txData
    };
    console.log("txParams:", txParams);
};
