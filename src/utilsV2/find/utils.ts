import { AuctionDto } from "../../types/dtos/Auction.dto";
import { TierPrice } from "../../types/dtos/TierPrice.dto";
import { bidContract, profitPerTier } from "../../config/config";
import fs from "fs";
import {
    API_BNB_PRICE_COIGEKO,
    API_BNB_PRICE_MOBOX,
    API_DOMAIN,
    GAS_PRICE_LIST,
    GAS_PRICES_BID,
    MIN_GAS_PRICE,
    MIN_TIME_GET_PRICE,
    MP_ADDRESS,
    NORMAL_BUYER,
    PRO_BUYER,
    RATE_FEE_MARKET,
    WAIT_BID_PATH
} from "../../constants/constants";
import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionType } from "../../enum/enum";
import axios from "axios";
import { noticeBotDetectProfit } from "../bid/handleNoticeBot";

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
    auctionType: AuctionType,
    amount: number,
    totalPrice: number
): BidAuction => {
    let buyer = "";
    let contractAddress = "";
    let fee = 0;
    let maxGasPrice = MIN_GAS_PRICE;
    switch (auctionType) {
        case AuctionType.NORMAL:
            buyer = NORMAL_BUYER ?? "";
            contractAddress = bidContract;
            fee = totalFee;
            break;
        case AuctionType.BUNDLE:
            buyer = NORMAL_BUYER ?? "";
            contractAddress = bidContract;
            fee = feeBundle(bnbPrice);
            break;
        case AuctionType.PRO:
            buyer = PRO_BUYER ?? "";
            contractAddress = MP_ADDRESS ?? "";
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
        minGasPrice: MIN_GAS_PRICE,
        maxGasPrice: maxGasPrice,
        auctions: auctions
    };
};

export const updateWaitBid = async (profitableAuctions: BidAuction[]) => {
    if (!profitableAuctions || profitableAuctions.length == 0) {
        return;
    }
    let waitBid: BidAuction[] = [];
    try {
        waitBid = JSON.parse(fs.readFileSync(WAIT_BID_PATH, "utf8")).data;
    } catch (error) {
        waitBid = [];
    }
    if (!waitBid) {
        waitBid = [];
    }
    waitBid.push(...profitableAuctions);
    waitBid.sort((a, b) => (a.uptime ?? 0) - (b.uptime ?? 0));
    fs.writeFileSync(WAIT_BID_PATH, JSON.stringify({ data: waitBid }));
    await noticeBotDetectProfit(profitableAuctions);
};

export const isBreakBatch = (profitAuctions: AuctionDto[], auction: AuctionDto): boolean => {
    if (profitAuctions.length > 5) {
        return true;
    }
    if (profitAuctions.length === 0) {
        return false;
    }
    return auction?.uptime !== profitAuctions[0]?.uptime;
};

export const isProfitable = (profit: number, minProfit: number): boolean => {
    return profit >= minProfit;
};

export const getProfitableBidAuctionsNormalVsPro = (
    normalVsProAuctions: AuctionDto[],
    priceMins: TierPrice,
    bnbPrice: number,
    type: AuctionType
): BidAuction[] => {
    normalVsProAuctions.sort((a, b) => (a.uptime ?? 0) - (b.uptime ?? 0));
    let profitableAuctions: AuctionDto[] = [];
    let profitableBidAuctions: BidAuction[] = [];
    let totalProfit = 0;
    let totalMinProfit = 0;
    let totalFee = 0;
    let totalPrice = 0;
    const fee = type === AuctionType.PRO ? feePro(bnbPrice) : feePro(bnbPrice);
    for (let i = 0; i < normalVsProAuctions.length; i++) {
        const auction = normalVsProAuctions[i];
        if (!auction?.nowPrice) {
            continue;
        }
        if (
            (type === AuctionType.NORMAL && isProAuction(auction)) ||
            (type === AuctionType.PRO && !isProAuction(auction))
        ) {
            continue;
        }
        let profit = 0;
        let minProfit = 0;
        let minValueAuction = 0;
        if (type === AuctionType.PRO) {
            const minValueType = getMinValueType(
                (auction?.prototype ?? "").toString(),
                1,
                priceMins
            );
            minValueAuction += minValueType[0];
            minProfit += minValueType[1];
        } else {
            const minValueType = getMinValueType(auction?.ids?.[0] ?? "", 1, priceMins);
            minValueAuction += minValueType[0];
            minProfit += minValueType[1];
        }
        profit = calculateProfit(minValueAuction, fee, auction, bnbPrice);
        profitableAuctions.push(auction);
        totalFee += fee;
        totalProfit += profit;
        totalMinProfit += minProfit;
        totalPrice += auction?.nowPrice;
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
            }
        } else {
            profitableAuctions = profitableAuctions.filter(a => a !== auction);
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

/**
 * @param {number} cacheBnbPrice - A fallback BNB price value that will be used if both API calls fail.
 * @returns {Promise<number>} The current BNB price in USD as retrieved from the APIs or, in case of failure, the provided cached price.
 */
export const getBnbPrice = async (cacheBnbPrice: number): Promise<number> => {
    let bnbPrice = cacheBnbPrice;
    try {
        const res = await axios.get(API_BNB_PRICE_COIGEKO);
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

export const getTierPrice = async (cacheTierPrice: TierPrice): Promise<TierPrice> => {
    let priceMins = cacheTierPrice;
    const getPrice = async (prototype: number, amountCheck: number): Promise<number> => {
        try {
            const res = await axios.get(`${API_DOMAIN}/auction/search_v2/BNB`, {
                params: {
                    page: 1,
                    limit: amountCheck,
                    vType: prototype,
                    sort: "price"
                }
            });
            const lists: AuctionDto[] = res.data.list;
            if (lists.length > 0) {
                let sumPrice = 0;
                let amount = 0;
                for (let i = 0; i < lists.length; i++) {
                    const auction = lists[i];
                    if (
                        !auction?.uptime ||
                        !auction?.nowPrice ||
                        Date.now() / 1000 - auction?.uptime < MIN_TIME_GET_PRICE
                    ) {
                        continue;
                    }
                    sumPrice += auction.nowPrice / 10 ** 9;
                    amount++;
                }
                return sumPrice / amount;
            }
        } catch (error) {
            console.log(error);
        }
        return priceMins[prototype as keyof TierPrice] ?? 0;
    };

    const priceConfigs = [
        { tier: 1, amount: 15 },
        { tier: 2, amount: 15 },
        { tier: 3, amount: 15 },
        { tier: 4, amount: 8 },
        { tier: 5, amount: 5 },
        { tier: 6, amount: 3 }
    ];

    for (const { tier, amount } of priceConfigs) {
        priceMins[tier as keyof TierPrice] = await getPrice(tier, amount);
    }

    return priceMins;
};
