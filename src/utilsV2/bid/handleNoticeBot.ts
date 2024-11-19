import axios from "axios";
import { API_TELEGRAM, CHATID_MOBOX, EXPLORER_URL } from "../../constants/constants";
import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionStatus, AuctionType } from "../../enum/enum";
import { bidContract } from "../../config/config";
import { shortenAddress } from "../common/utils";

const noticeBot = async (message: string) => {
    try {
        await axios.post(`https://api.telegram.org/${API_TELEGRAM}/sendMessage`, {
            chat_id: `@${CHATID_MOBOX}`,
            text: message,
            parse_mode: "Markdown"
        });
    } catch (error) {
        console.error("Error noticeBot", error);
        if (!API_TELEGRAM || !CHATID_MOBOX) {
            console.log("Please set API_TELEGRAM and CHATID_MOBOX in .env");
        }
    }
};

export const noticeProfitAuction = async (
    bidAuction: BidAuction,
    auctionStatus: AuctionStatus,
    txHash: string
) => {
    if (!bidAuction || !bidAuction.profit || !bidAuction.totalPrice || !bidAuction.auctions) {
        {
            console.log("Error noticeProfitAuction");
            return;
        }
    }
    const status = `Status: ${auctionStatus}`;
    const profit = `\nProfit: $${(bidAuction.profit ?? 0).toFixed(3)}`;
    const bidType = `\nType: ${bidAuction.type}`;
    const totalPrice = `\nTotal price: $${(bidAuction.totalPrice / 10 ** 9).toFixed(3)}`;
    const amounts = bidAuction.auctions.some(auction => auction.amounts?.length)
        ? `\nAmounts: ${bidAuction.auctions?.map(auction => auction.amounts).join(",")}`
        : "";
    const ids = bidAuction.auctions.some(auction => auction.ids?.length)
        ? `\nIds: ${bidAuction.auctions.map(auction => auction.ids).join(",")}`
        : "";
    const amount = bidAuction.type === AuctionType.PRO ? "\nAmount: 1" : "";
    const tokenId =
        bidAuction.type === AuctionType.PRO ? `\nTokenId: ${bidAuction.auctions[0].tokenId}` : "";
    const txInfo = txHash ? `\nTx info: [here](${EXPLORER_URL}${txHash})` : "";
    const message = `${status}${profit}${bidType}${totalPrice}${amounts}${amount}${ids}${tokenId}${txInfo}`;
    await noticeBot(message);
};

export const noticeBotBid = async (): Promise<number> => {
    const status = "Status: 🆗";
    const contract = `\nContract: ${shortenAddress(bidContract)}`;
    const message = `${status}${contract}`;
    await noticeBot(message);
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour;
};
