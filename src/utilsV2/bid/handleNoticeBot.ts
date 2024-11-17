import axios from "axios";
import { API_TELEGRAM, CHATID_MOBOX } from "../../constants/constants";
import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionStatus } from "../../enum/enum";

const noticeBot = async (message: string) => {
    try {
        await axios.post(`https://api.telegram.org/${API_TELEGRAM}/sendMessage`, {
            chat_id: `@${CHATID_MOBOX}`,
            text: message
        });
    } catch (error) {
        if (!API_TELEGRAM || !CHATID_MOBOX) {
            console.log("Please set API_TELEGRAM and CHATID_MOBOX in .env");
        }
    }
};

export const noticeProfitAuction = async (bidAuction: BidAuction, auctionStatus: AuctionStatus) => {
    if (!bidAuction || !bidAuction.profit || !bidAuction.totalPrice || !bidAuction.auctions) {
        return;
    }
    const status = `Status: ${auctionStatus}`;
    const profit = `Profit: $${(bidAuction.profit ?? 0).toFixed(3)}`;
    const totalPrice = `Total price: $${(bidAuction.totalPrice / 10 ** 9).toFixed(3)}`;
    const amounts = `Amount: ${bidAuction.auctions?.map(auction => auction.amounts).join(", ")}`;
    const ids = `Ids: ${bidAuction.auctions?.map(auction => auction.ids).join(", ")}`;
    const message = `${status}\n${profit}\n${totalPrice}\n${amounts}\n${ids}`;
    await noticeBot(message);
};
    