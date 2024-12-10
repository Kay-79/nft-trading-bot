import { AuctionDto } from "../../types/dtos/Auction.dto";
import { TierPrice } from "../../types/common/TierPrice";
import { bidContract, profitPerTier } from "../../config/config";
import fs from "fs";
import {
    API_BNB_PRICE_COIGEKO,
    API_BNB_PRICE_MOBOX,
    API_MOBOX,
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
    floorPrices: TierPrice,
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
        minPrice: floorPrices,
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
    if (profitAuctions.length === 0) {
        return false;
    }
    if (profitAuctions.length >= 6) {
        return true;
    }
    return auction?.uptime !== profitAuctions[0]?.uptime;
};

export const isProfitable = (profit: number, minProfit: number): boolean => {
    return profit >= minProfit;
};

export const getProfitableBidAuctionsNormalVsPro = (
    normalVsProAuctions: AuctionDto[],
    floorPrices: TierPrice,
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
    const calculateAuctionMetrics = (
        auction: AuctionDto
    ): { profit: number; minProfit: number } => {
        const minValueType =
            type === AuctionType.PRO
                ? getMinValueType((auction.prototype ?? "").toString(), 1, floorPrices)
                : getMinValueType(auction.ids?.[0] ?? "", 1, floorPrices);

        const minValue = minValueType[0];
        const minProfit = minValueType[1];
        const profit = calculateProfit(minValue, fee, auction, bnbPrice);
        return { profit, minProfit };
    };
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
        const { profit, minProfit } = calculateAuctionMetrics(auction);
        if (isProfitable(profit, minProfit)) {
            profitableAuctions.push(auction);
            totalFee += fee;
            totalProfit += profit;
            totalMinProfit += minProfit;
            totalPrice += auction?.nowPrice;
            if (isBreakBatch(profitableAuctions, auction)) {
                profitableAuctions.pop();
                profitableBidAuctions.push(
                    setupBidAuction(
                        profitableAuctions,
                        totalProfit - profit,
                        totalMinProfit - minProfit,
                        floorPrices,
                        bnbPrice,
                        totalFee - fee,
                        type,
                        profitableAuctions.length,
                        totalPrice - auction?.nowPrice
                    )
                );
                profitableAuctions = [auction];
                totalProfit = profit;
                totalMinProfit = minProfit;
                totalFee = fee;
                totalPrice = auction?.nowPrice;
            }
        }
    }
    if (profitableAuctions.length === 0) {
        return profitableBidAuctions;
    }
    if (profitableAuctions.length > 0 && profitableAuctions.length <= 5) {
        profitableBidAuctions.push(
            setupBidAuction(
                profitableAuctions,
                totalProfit,
                totalMinProfit,
                floorPrices,
                bnbPrice,
                totalFee,
                type,
                profitableAuctions.length,
                totalPrice
            )
        );
    } else {
        console.log("Profitable auctions length is too long");
    }
    return profitableBidAuctions;
};

export const getProfitableBidAuctionsBundle = (
    bundleAuctions: AuctionDto[],
    floorPrices: TierPrice,
    bnbPrice: number
): BidAuction[] => {
    let profitableBidAuctions: BidAuction[] = [];
    for (let i = 0; i < bundleAuctions.length; i++) {
        const auction = bundleAuctions[i];
        let profit = 0;
        let minProfit = 0;
        let minValueAuction = 0;
        if (auction?.ids === undefined || auction?.amounts === undefined) {
            continue;
        }
        let amount = 0;
        for (let j = 0; j < (auction?.ids ?? []).length; j++) {
            const minValueType = getMinValueType(
                auction?.ids[j],
                Number(auction?.amounts[j]),
                floorPrices
            );
            minValueAuction += minValueType[0];
            minProfit += minValueType[1];
            amount += Number(auction?.amounts[j]);
        }
        if (auction?.nowPrice === undefined) {
            continue;
        }
        profit =
            minValueAuction * (1 - RATE_FEE_MARKET) -
            feeBundle(bnbPrice) -
            auction?.nowPrice * 10 ** -9;
        if (isProfitable(profit, minProfit)) {
            profitableBidAuctions.push(
                setupBidAuction(
                    [auction],
                    profit,
                    minProfit,
                    floorPrices,
                    bnbPrice,
                    feeBundle(bnbPrice),
                    AuctionType.BUNDLE,
                    amount,
                    auction?.nowPrice
                )
            );
        }
    }
    return profitableBidAuctions;
};

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
    let floorPrices = cacheTierPrice;
    const getPrice = async (
        prototype: number,
        amountCheck: number,
        cachePrice: number
    ): Promise<number> => {
        try {
            const res = await axios.get(`${API_MOBOX}/auction/search_v2/BNB`, {
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
            return cachePrice;
        }
        return floorPrices[prototype as keyof TierPrice] ?? cachePrice;
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
        floorPrices[tier as keyof TierPrice] = await getPrice(
            tier,
            amount,
            floorPrices[tier as keyof TierPrice] ?? 0
        );
    }
    floorPrices[6] ?? 0 > 1000 ? (floorPrices[6] = 900) : {};
    return floorPrices;
};
