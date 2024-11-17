import axios from "axios";
import { API_TELEGRAM, CHATID_MOBOX, EXPLORER_URL } from "../../constants/constants";
import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionStatus } from "../../enum/enum";

export const noticeBot = async (message: string) => {
    try {
        await axios.post(`https://api.telegram.org/${API_TELEGRAM}/sendMessage`, {
            chat_id: `@${CHATID_MOBOX}`,
            text: message,
            parse_mode: "MarkdownV2"
        });
    } catch (error) {
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
        return;
    }
    const status = `Status: ${auctionStatus}`;
    const profit = `\nProfit: $${(bidAuction.profit ?? 0).toFixed(3)}`;
    const totalPrice = `\nTotal price: $${(bidAuction.totalPrice / 10 ** 9).toFixed(3)}`;
    const amounts = `\nAmount: ${bidAuction.auctions?.map(auction => auction.amounts).join(", ")}`;
    const ids = `\nIds: ${bidAuction.auctions?.map(auction => auction.ids).join(", ")}`;
    const txInfo = txHash ? `\nTx info: [here](${EXPLORER_URL}${txHash})` : "";
    const message = `${status}${profit}${totalPrice}${amounts}${ids}${txInfo}`;
    await noticeBot(message);
};
