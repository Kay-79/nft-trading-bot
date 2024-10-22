import { AuctionDto } from "../../types/dtos/Auction.dto";
import { TierPrice } from "../../types/dtos/TierPrice.dto";
import { bidContract, profitPerTier } from "../../config/config";
import fs from "fs";
import {
    GAS_PRICES,
    MP_ADDRESS,
    NORMAL_BUYER,
    PRO_BUYER,
    RATE_FEE_MARKET
} from "../../config/constans";
import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionType } from "../../config/enum";

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
    return GAS_PRICES.bundleAuction * bnbPrice * 10 ** -9;
};

export const feePro = (bnbPrice: number): number => {
    return GAS_PRICES.proAuction * bnbPrice * 10 ** -9;
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
    let waitBid = [];
    try {
        waitBid = JSON.parse(fs.readFileSync("waitBid.json", "utf8")).data;
    } catch (error) {
        waitBid = [];
    }
    if (!waitBid) {
        waitBid = [];
    }
    waitBid.push(...profitableAuctions);
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

export const getProfitableBidAuctionsNormal = (
    normalAuctions: AuctionDto[],
    priceMins: TierPrice,
    bnbPrice: number
): BidAuction[] => {
    normalAuctions.sort((a, b) => (a.uptime ?? 0) - (b.uptime ?? 0));
    let profitableAuctions: AuctionDto[] = [];
    let profitableBidAuctions: BidAuction[] = [];
    let totalProfit = 0;
    let totalMinProfit = 0;
    let totalFee = 0;
    let totalPrice = 0;
    for (let i = 0; i < normalAuctions.length; i++) {
        const auction = normalAuctions[i];
        let profit = 0;
        let minProfit = 0;
        let minValueAuction = 0;
        if (!auction?.ids || !auction?.nowPrice) {
            continue;
        }
        minValueAuction += getMinValueType(auction?.ids[0], 1, priceMins)[0];
        minProfit += getMinValueType(auction?.ids[0], 1, priceMins)[1];
        profit =
            minValueAuction * (1 - RATE_FEE_MARKET) -
            feePro(bnbPrice) -
            auction?.nowPrice * 10 ** -9;
        /*console.log(
            `minValueAuction: ${minValueAuction}, minProfit: ${minProfit}, profit: ${profit}, fee: ${feePro(
                bnbPrice
            )}`
        ); */
        if (isProfitable(profit, minProfit)) {
            // cant use total
            if (isBreakBatch(profitableAuctions, auction)) {
                profitableBidAuctions.push(
                    setupBidAuction(
                        profitableAuctions,
                        totalProfit,
                        totalMinProfit,
                        priceMins,
                        bnbPrice,
                        totalFee,
                        AuctionType.NORMAL,
                        profitableAuctions.length,
                        totalPrice
                    )
                );
                profitableAuctions = [auction];
                totalProfit = profit;
                totalMinProfit = minProfit;
                totalFee = feePro(bnbPrice);
                totalPrice = auction?.nowPrice;
            } else {
                profitableAuctions.push(auction);
                totalFee += feePro(bnbPrice);
                totalProfit += profit;
                totalMinProfit += minProfit;
                totalPrice += auction?.nowPrice;
            }
        } else {
            totalProfit -= profit;
            totalMinProfit -= minProfit;
            totalFee -= feePro(bnbPrice);
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
                AuctionType.NORMAL,
                profitableAuctions.length,
                totalPrice
            )
        );
    }
    return profitableBidAuctions;
};

export const getProfitableBidAuctionsPro = (
    proAuctions: AuctionDto[],
    priceMins: TierPrice,
    bnbPrice: number
): BidAuction[] => {
    proAuctions.sort((a, b) => (a.uptime ?? 0) - (b.uptime ?? 0));
    let profitableAuctions: AuctionDto[] = [];
    let profitableBidAuctions: BidAuction[] = [];
    let totalProfit = 0;
    let totalMinProfit = 0;
    let totalFee = 0;
    let totalPrice = 0;
    for (let i = 0; i < proAuctions.length; i++) {
        const auction = proAuctions[i];
        let profit = 0;
        let minProfit = 0;
        let minValueAuction = 0;
        if (!auction?.prototype || !auction?.nowPrice) {
            continue;
        }
        minValueAuction += getMinValueType(auction?.prototype.toString(), 1, priceMins)[0];
        minProfit += getMinValueType(auction?.prototype.toString(), 1, priceMins)[1];
        profit =
            minValueAuction * (1 - RATE_FEE_MARKET) -
            feePro(bnbPrice) -
            auction?.nowPrice * 10 ** -9;
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
                        AuctionType.PRO,
                        profitableAuctions.length,
                        totalPrice
                    )
                );
                profitableAuctions = [auction];
                totalProfit = profit;
                totalMinProfit = minProfit;
                totalFee = feePro(bnbPrice);
                totalPrice = auction?.nowPrice;
            } else {
                profitableAuctions.push(auction);
                totalFee += feePro(bnbPrice);
                totalProfit += profit;
                totalMinProfit += minProfit;
                totalPrice += auction?.nowPrice;
            }
        } else {
            totalProfit -= profit;
            totalMinProfit -= minProfit;
            totalFee -= feePro(bnbPrice);
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
                AuctionType.PRO,
                profitableAuctions.length,
                totalPrice
            )
        );
    }
    return profitableBidAuctions;
};
