import axios from "axios";
import { API_TELEGRAM, CHATID_MOBOX, EXPLORER_URL } from "../../constants/constants";
import { BidAuction } from "../../types/bid/BidAuction";
import { BidStatus, AuctionType } from "../../enum/enum";
import { bidContract } from "../../config/config";
import { shortenAddress } from "../common/utils";
import { sleep } from "../common/sleep";
import { TierPrice } from "../../types/common/TierPrice";

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
    auctionStatus: BidStatus,
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

export const noticeBotBid = async (latestNotice: number): Promise<number> => {
    const status = "Status: 🛒";
    const contract = `\nContract: ${shortenAddress(bidContract)}`;
    const message = `${status}${contract}`;
    try {
        await noticeBot(message);
    } catch (error) {
        return latestNotice;
    }
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour - (currentHour % 4);
};

export const noticeBotFind = async (latestNotice: number, minPrice: TierPrice): Promise<number> => {
    const status = "Status: 🔎";
    const floorPrices = minPrice
        ? `\nFloor: ${Object.entries(minPrice)
              .map(([key, value]) => `${Number(value).toFixed(2)}`)
              .join(",")}`
        : "";
    const message = `${status}${floorPrices}`;
    await sleep(10);
    try {
        await noticeBot(message);
    } catch (error) {
        return latestNotice;
    }
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour - (currentHour % 4);
};

export const noticeBotDetectProfit = async (profitableAuctions: BidAuction[]) => {
    if (!profitableAuctions.length) return;
    const status = "Detected: 💰";
    const profit = `\nProfit: $${profitableAuctions
        .map(auction => auction.profit?.toFixed(3))
        .join(", $")}`;
    const floorPrices = profitableAuctions[0].minPrice
        ? `\nFloor: ${Object.entries(profitableAuctions[0]?.minPrice)
              .map(([key, value]) => `${Number(value).toFixed(2)}`)
              .join(",")}`
        : "";
    const message = `${status}${profit}${floorPrices}`;
    await noticeBot(message);
};

export const noticeErrorBid = async (errBidAuction: BidAuction) => {
    const status = "Error: 📛";
    const profit = `\nProfit: ${errBidAuction.profit?.toFixed(3)}`;
    const time = `\nTime: ${errBidAuction.uptime}`;
    const nowTime = `\nNow: ${Math.round(Date.now() / 1000).toFixed()}`;
    const message = `${status}${profit}${time}${nowTime}`;
    await noticeBot(message);
};
