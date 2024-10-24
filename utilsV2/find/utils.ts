import { AuctionDto } from "../../types/dtos/Auction.dto";
import { TierPrice } from "../../types/dtos/TierPrice.dto";
import { bidContract, profitPerTier } from "../../config/config";
import fs from "fs";
import {
    API_BNB_PRICE_COIGEKO,
    API_BNB_PRICE_MOBOX,
    GAS_PRICE_LIST,
    GAS_PRICES_BID,
    MP_ADDRESS,
    NORMAL_BUYER,
    PRO_BUYER,
    RATE_FEE_MARKET
} from "../../config/constans";
import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionType } from "../../config/enum";
import axios from "axios";

export const isProAuction = (auction: AuctionDto): boolean => {
    return auction.amounts?.length === 0;
};
export const isBundleAuction = (auction: AuctionDto): boolean => {
    return (auction.amounts?.length ?? 0) > 1 || Number(auction.amounts?.[0] ?? 0) > 1
        ? true
        : false;
};
export const isNormalAuction = (auction: AuctionDto): boolean => {
    return !isProAuction(auction) && !isBundleAuction(auction);
};

export const getMinValueType = (
    prototype: string,
    amount: number,
    minPrices: TierPrice
): number[] => {
    const prototypeIndex = Number(prototype.slice(0, 1));
    const minV = (minPrices[prototypeIndex as keyof TierPrice] ?? NaN) * amount;
    const minP = (profitPerTier[prototypeIndex as keyof TierPrice] ?? NaN) * amount;
    return [minV, minP];
};

export const getMinValueTypePro = (prototype: number, minPrices: TierPrice): number[] => {
    const prototypeIndex = Number(prototype.toString().slice(0, 1));
    const minV = minPrices[prototypeIndex as keyof TierPrice] ?? NaN;
    const minP = profitPerTier[prototypeIndex as keyof TierPrice] ?? NaN;
    return [minV, minP];
};

export const feeBundle = (bnbPrice: number): number => {
    return GAS_PRICES_BID.bundleAuction * bnbPrice * 10 ** -9;
};

export const feePro = (bnbPrice: number): number => {
    return GAS_PRICES_BID.proAuction * bnbPrice * 10 ** -9;
};

export const calculateProfit = (
    minValueAuction: number,
    fee: number,
    auction: AuctionDto,
    bnbPrice: number
): number => {
    if (!auction?.nowPrice) return -1;
    return (
        minValueAuction * (1 - RATE_FEE_MARKET) -
        (fee + auction?.nowPrice * 10 ** -9 + GAS_PRICE_LIST * bnbPrice * 10 ** -9)
    );
};

export const setupBidAuction = (
    auctions: AuctionDto[],
    profit: number,
    minProfit: number,
    priceMins: TierPrice,
    bnbPrice: number,
    totalFee: number,
    auctionType: string,
    amount: number,
    totalPrice: number
): BidAuction => {
    let buyer = "";
    let contractAddress = "";
    let fee = 0;
    switch (auctionType) {
        case AuctionType.NORMAL:
            buyer = NORMAL_BUYER;
            contractAddress = bidContract;
            fee = totalFee;
            break;
        case AuctionType.BUNDLE:
            buyer = NORMAL_BUYER;
            contractAddress = bidContract;
            fee = feeBundle(bnbPrice);
            break;
        case AuctionType.PRO:
            buyer = PRO_BUYER;
            contractAddress = MP_ADDRESS;
            fee = feePro(bnbPrice);
            break;
        default:
            break;
    }
    return {
        id: auctions[0]?.id,
        uptime: auctions[0]?.uptime,
        profit: profit,
        minProfit: minProfit,
        buyer: buyer,
        contractAddress: contractAddress,
        totalPrice: totalPrice,
        minPrice: priceMins,
        fee: fee,
        type: auctionType,
        amount: amount,
        auctions: auctions
    };
};

export const updateWaitBid = async (profitableAuctions: BidAuction[]) => {
    if (!profitableAuctions || profitableAuctions.length == 0) {
        return;
    }
    let waitBid: BidAuction[] = [];
    try {
        waitBid = JSON.parse(fs.readFileSync("waitBid.json", "utf8")).data;
    } catch (error) {
        waitBid = [];
    }
    if (!waitBid) {
        waitBid = [];
    }
    waitBid.push(...profitableAuctions);
    waitBid.sort((a, b) => (a.uptime ?? 0) - (b.uptime ?? 0));
    fs.writeFileSync("waitBid.json", JSON.stringify({ data: waitBid }));
};

export const isBreakBatch = (auctions: AuctionDto[], auction: AuctionDto): boolean => {
    if (auctions.length > 5) {
        return true;
    }
    if (auctions.length === 0) {
        return false;
    }
    return auction?.uptime !== auctions[0]?.uptime;
};

export const isProfitable = (profit: number, minProfit: number): boolean => {
    return profit >= minProfit;
};

export const getProfitableBidAuctionsNormalVsPro = (
    normalAuctions: AuctionDto[],
    priceMins: TierPrice,
    bnbPrice: number,
    type: AuctionType
): BidAuction[] => {
    normalAuctions.sort((a, b) => (a.uptime ?? 0) - (b.uptime ?? 0));
    let profitableAuctions: AuctionDto[] = [];
    let profitableBidAuctions: BidAuction[] = [];
    let totalProfit = 0;
    let totalMinProfit = 0;
    let totalFee = 0;
    let totalPrice = 0;
    const fee = type === AuctionType.PRO ? feePro(bnbPrice) : feePro(bnbPrice);
    for (let i = 0; i < normalAuctions.length; i++) {
        const auction = normalAuctions[i];
        let profit = 0;
        let minProfit = 0;
        let minValueAuction = 0;
        if (!auction?.ids || !auction?.nowPrice || !auction?.prototype) {
            continue;
        }
        if (type === AuctionType.PRO) {
            minValueAuction += getMinValueType(auction?.prototype.toString(), 1, priceMins)[0];
            minProfit += getMinValueType(auction?.prototype.toString(), 1, priceMins)[1];
        } else {
            minValueAuction += getMinValueType(auction?.ids[0], 1, priceMins)[0];
            minProfit += getMinValueType(auction?.ids[0], 1, priceMins)[1];
        }
        profit = calculateProfit(minValueAuction, fee, auction, bnbPrice);
        if (isProfitable(profit, minProfit)) {
            if (isBreakBatch(profitableAuctions, auction)) {
                profitableBidAuctions.push(
                    setupBidAuction(
                        profitableAuctions,
                        totalProfit,
                        totalMinProfit,
                        priceMins,
                        bnbPrice,
                        totalFee,
                        type,
                        profitableAuctions.length,
                        totalPrice
                    )
                );
                profitableAuctions = [auction];
                totalProfit = profit;
                totalMinProfit = minProfit;
                totalFee = fee;
                totalPrice = auction?.nowPrice;
            } else {
                profitableAuctions.push(auction);
                totalFee += fee;
                totalProfit += profit;
                totalMinProfit += minProfit;
                totalPrice += auction?.nowPrice;
            }
        } else {
            totalProfit -= profit;
            totalMinProfit -= minProfit;
            totalFee -= fee;
            totalPrice -= auction?.nowPrice;
        }
    }
    if (profitableAuctions.length > 0) {
        profitableBidAuctions.push(
            setupBidAuction(
                profitableAuctions,
                totalProfit,
                totalMinProfit,
                priceMins,
                bnbPrice,
                totalFee,
                type,
                profitableAuctions.length,
                totalPrice
            )
        );
    }
    return profitableBidAuctions;
};

export const getBnbPrice = async (cacheBnbPrice: number): Promise<number> => {
    let bnbPrice = cacheBnbPrice;
    try {
        const res = await axios.get(
            API_BNB_PRICE_COIGEKO
        );
        bnbPrice = res.data.binancecoin.usd;
        return bnbPrice;
    } catch (error) {
        console.log(error);
    }
    try {
        const res = await axios.get(API_BNB_PRICE_MOBOX);
        bnbPrice = res.data.data.bnb.price;
        return bnbPrice;
    } catch (error) {
        console.log(error);
    }
    console.warn("Warning: Apis not work!");
    return bnbPrice;
};
