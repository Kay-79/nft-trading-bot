import axios from "axios";
import {
    API_TELEGRAM,
    CHANGER,
    CHATID_MOBOX,
    ENV,
    EXPLORER_URL,
    NORMAL_BUYER,
    PRO_BUYER,
    TIME_ENABLE_BID
} from "../../constants/constants";
import { BidAuction } from "../../types/bid/BidAuction";
import { BidStatus, BidType, Environment } from "../../enum/enum";
import { bidContract } from "../../config/config";
import { shortenAddress, shortenNumber } from "../common/utils";
import { TierPrice } from "../../types/common/TierPrice";
import { ethersProvider } from "../../providers/ethersProvider";
import { erc20Provider } from "../../providers/erc20Provider";

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
    const profit = `\nMin profit: 💵${shortenNumber(bidAuction.profit ?? 0, 0, 2)}`;
    const bidType = `\nType: ${
        bidAuction.type === BidType.BUNDLE
            ? BidType.BUNDLE
            : bidAuction.amount === 1
            ? bidAuction.type
            : `BATCH ${bidAuction.type}`
    }`;
    const totalPrice = `\nTotal price: 💵${shortenNumber(bidAuction.totalPrice, 9, 3)}`;
    const amounts = bidAuction.auctions.some(auction => auction.amounts?.length)
        ? `\nAmounts: ${bidAuction.auctions?.map(auction => auction.amounts).join(", ")}`
        : "";
    const ids = bidAuction.auctions.some(auction => auction.ids?.length)
        ? `\nIds: ${bidAuction.auctions.map(auction => auction.ids).join(", ")}`
        : "";
    const amount = bidAuction.type === BidType.PRO ? `\nAmount: ${bidAuction.amount}` : "";
    const tokenId =
        bidAuction.type === BidType.PRO ? `\nTokenId: ${bidAuction.auctions[0].tokenId}` : "";
    const txInfo = txHash ? `\nTx info: [here](${EXPLORER_URL}${txHash})` : "";
    const message = `${status}${profit}${bidType}${totalPrice}${amounts}${amount}${ids}${tokenId}${txInfo}`;
    await noticeBot(message);
};

export const noticeBotBid = async (latestNotice: number): Promise<number> => {
    if (ENV === Environment.TESTNET) return latestNotice;
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
    if (ENV === Environment.TESTNET) return latestNotice;
    const budgetNormal = (await erc20Provider.balanceOf(bidContract)) ?? 0;
    const budgetPro = (await erc20Provider.balanceOf(PRO_BUYER)) ?? 0;
    const feeBidder = (await ethersProvider.getBalance(NORMAL_BUYER ?? "")) ?? 0;
    const feePro = (await ethersProvider.getBalance(PRO_BUYER ?? "")) ?? 0;
    const feeChange = (await ethersProvider.getBalance(CHANGER ?? "")) ?? 0;
    const status = "Status: 🔎";
    const floorPrices = minPrice
        ? `\nFloor: $${Object.entries(minPrice)
              .map(([key, value]) => `${shortenNumber(Number(value), 0, 1)}`)
              .join(", $")}`
        : "";
    const bnbNow = `\nBNB: $${shortenNumber(bnbPrice, 0, 2)}`;
    const budgetNormalMess = `\nBudget normal: 💵${shortenNumber(Number(budgetNormal), 18, 2)}`;
    const budgetProMess = `\nBudget pro: 💵${shortenNumber(Number(budgetPro), 18, 2)}`;
    const feeBidderMess = `\nFee bidder: ${shortenNumber(Number(feeBidder), 18, 4)} BNB`;
    const feeProMess = `\nFee pro: ${shortenNumber(Number(feePro), 18, 4)} BNB`;
    const feeChangeMess = `\nFee change: ${shortenNumber(Number(feeChange), 18, 4)} BNB`;
    const message = `${status}${floorPrices}${bnbNow}${budgetNormalMess}${budgetProMess}${feeBidderMess}${feeProMess}${feeChangeMess}`;
    try {
        await noticeBot(message);
    } catch (error) {
        return latestNotice;
    }
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour - (currentHour % 4);
};

export const noticeBotDetectProfit = async (bidAuctions: BidAuction[]) => {
    if (!bidAuctions.length) return;
    const status = "Detected: 💰";
    const profits = `\nMin profit: 💵${bidAuctions
        .map(bidAuction => shortenNumber(bidAuction.profit ?? 0, 0, 2))
        .join(", 💵")}`;
    const types = `\nType: ${bidAuctions
        .map(bidAuction =>
            bidAuction.type === BidType.BUNDLE
                ? BidType.BUNDLE
                : bidAuction.amount === 1
                ? bidAuction.type
                : `BATCH ${bidAuction.type}`
        )
        .join(", ")}`;
    const amounts = `\nAmount: ${bidAuctions.map(bidAuction => bidAuction.amount).join(", ")}`;
    const prices = `\nPrice: $${bidAuctions
        .map(bidAuction => shortenNumber(bidAuction.totalPrice ?? 0, 9, 3))
        .join(", $")}`;
    const pricePredictions = `\nPrediction: $${bidAuctions
        .map(bidAuction => shortenNumber(bidAuction.pricePrediction ?? 0, 9, 3))
        .join(", $")}`;
    const floorPrices = bidAuctions[0].minPrice
        ? `\nFloor: $${Object.entries(bidAuctions[0]?.minPrice)
              .map(([key, value]) => `${shortenNumber(Number(value), 0, 1)}`)
              .join(", $")}`
        : "";
    const message = `${status}${profits}${types}${amounts}${prices}${pricePredictions}${floorPrices}`;
    await noticeBot(message);
};

export const noticeBotInsufficient = async (bidAuctions: BidAuction[]) => {
    if (!bidAuctions.length) return;
    const status = "Insufficient fund: 😭";
    const profits = `\nMin profit: 💵${bidAuctions
        .map(bidAuction => shortenNumber(bidAuction.profit ?? 0, 0, 3))
        .join(", 💵")}`;
    const types = `\nType: ${bidAuctions
        .map(bidAuction =>
            bidAuction.type === BidType.BUNDLE
                ? BidType.BUNDLE
                : bidAuction.amount === 1
                ? bidAuction.type
                : `BATCH ${bidAuction.type}`
        )
        .join(", ")}`;
    const prices = `\nPrice: $${bidAuctions
        .map(bidAuction => shortenNumber(bidAuction.totalPrice ?? 0, 9, 3))
        .join(", $")}`;
    const pricePredictions = `\nPrediction: $${bidAuctions
        .map(bidAuction => shortenNumber(bidAuction.pricePrediction ?? 0, 9, 3))
        .join(", $")}`;
    const message = `${status}${profits}${types}${prices}${pricePredictions}`;
    await noticeBot(message);
};

export const noticeErrorBid = async (errBidAuction: BidAuction) => {
    const status = "Error: 📛";
    const profit = `\nMin profit: 💵${shortenNumber(errBidAuction.profit ?? 0, 0, 3)}`;
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
    const profit = `\nMin profit: 💵${shortenNumber(bidAuction.profit ?? 0, 0, 3)}`;
    const auctor =
        bidAuction.auctions && bidAuction.auctions.length > 0
            ? `\nAuctor: ${shortenAddress(bidAuction.auctions[0].auctor ?? "")}`
            : "";
    const message = `${status}${profit}${auctor}`;
    await noticeBot(message);
};
