import axios from "axios";
import {
    API_TELEGRAM,
    CHATID_MOBOX,
    EXPLORER_URL,
    TIME_ENABLE_BID
} from "../../constants/constants";
import { BidAuction } from "../../types/bid/BidAuction";
import { BidStatus, AuctionType } from "../../enum/enum";
import { bidContract } from "../../config/config";
import { shortenAddress, shortenNumber } from "../common/utils";
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
    const profit = `\nMin profit: $${shortenNumber(bidAuction.profit ?? 0, 0, 3)}`;
    const bidType = `\nType: ${bidAuction.type}`;
    const totalPrice = `\nTotal price: $${shortenNumber(bidAuction.totalPrice, 9, 3)}`;
    const amounts = bidAuction.auctions.some(auction => auction.amounts?.length)
        ? `\nAmounts: ${bidAuction.auctions?.map(auction => auction.amounts).join(", ")}`
        : "";
    const ids = bidAuction.auctions.some(auction => auction.ids?.length)
        ? `\nIds: ${bidAuction.auctions.map(auction => auction.ids).join(", ")}`
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

export const noticeBotFind = async (
    latestNotice: number,
    minPrice: TierPrice,
    bnbPrice: number
): Promise<number> => {
    const status = "Status: 🔎";
    const floorPrices = minPrice
        ? `\nFloor: ${Object.entries(minPrice)
              .map(([key, value]) => `${shortenNumber(Number(value), 0, 2)}`)
              .join(", ")}`
        : "";
    const bnbNow = `\nBNB: $${shortenNumber(bnbPrice, 0, 2)}`;
    const budgetNormal = `\nBudget normal: $${shortenNumber(0, 0, 2)}`;
    const budgetPro = `\nBudget pro: $${shortenNumber(0, 0, 2)}`;
    const feeNormal = `\nFee normal: $${shortenNumber(0, 0, 2)}`;
    const feePro = `\nFee pro: $${shortenNumber(0, 0, 2)}`;
    const message = `${status}${floorPrices}${bnbNow}${budgetNormal}${budgetPro}${feeNormal}${feePro}`;
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

export const noticeBotDetectProfit = async (profitableBidAuctions: BidAuction[]) => {
    if (!profitableBidAuctions.length) return;
    const status = "Detected: 💰";
    const profit = `\nMin profit: $${profitableBidAuctions
        .map(bidAuction => shortenNumber(bidAuction.profit ?? 0, 0, 3))
        .join(", $")}`;
    const floorPrices = profitableBidAuctions[0].minPrice
        ? `\nFloor: ${Object.entries(profitableBidAuctions[0]?.minPrice)
              .map(([key, value]) => `${shortenNumber(Number(value), 0, 2)}`)
              .join(", ")}`
        : "";
    const message = `${status}${profit}${floorPrices}`;
    await noticeBot(message);
};

export const noticeErrorBid = async (errBidAuction: BidAuction) => {
    const status = "Error: 📛";
    const profit = `\nMin profit: ${shortenNumber(errBidAuction.profit ?? 0, 0, 3)}`;
    const time = `\nTime: ${errBidAuction.uptime}`;
    const nowTime = `\nNow: ${shortenNumber(Math.round(Date.now() / 1000), 0, 0)}`;
    const overTime = `\nOver: ${
        Math.round(Date.now() / 1000) - (errBidAuction.uptime ?? 0 + TIME_ENABLE_BID)
    }s`;
    const message = `${status}${profit}${time}${nowTime}${overTime}`;
    await noticeBot(message);
};

export const noticeBotCancel = async (bidAuction: BidAuction) => {
    const status = "Canceled: 🚫";
    const profit = `\nMin profit: ${shortenNumber(bidAuction.profit ?? 0, 0, 3)}`;
    const auctor =
        bidAuction.auctions && bidAuction.auctions.length > 0
            ? `\nAuctor: ${shortenAddress(bidAuction.auctions[0].auctor ?? "")}`
            : "";
    const message = `${status}${profit}${auctor}`;
    await noticeBot(message);
};
