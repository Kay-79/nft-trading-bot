import { AuctionDto } from "../../types/dtos/Auction.dto";
import { TierPrice } from "../../types/dtos/TierPrice.dto";
import { bidContract, profitPerTier } from "../../config/config";
import fs from "fs";
import { GAS_PRICES, MP_ADDRESS, NORMAL_BUYER, PRO_BUYER } from "../../config/constans";
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
    auctionType: string
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
        nowPrice: auctions[0]?.nowPrice,
        minPrice: priceMins,
        fee: fee,
        type: auctionType,
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
    for (let i = 0; i < normalAuctions.length; i++) {
        const auction = normalAuctions[i];
        let profit = 0;
        let minProfit = 0;
        let minValueAuction = 0;
        if (auction?.ids === undefined || auction?.amounts === undefined) {
            continue;
        }
        minValueAuction += getMinValueType(auction?.ids[0], 1, priceMins)[0];
        minProfit += getMinValueType(auction?.ids[0], 1, priceMins)[1];
        if (auction?.nowPrice === undefined) {
            continue;
        }
        totalFee += feePro(bnbPrice);
        profit = minValueAuction * 0.95 - feePro(bnbPrice) - auction?.nowPrice * 10 ** -9;
        totalProfit += profit;
        totalMinProfit += minProfit;
        if (profit >= minProfit) {
            if (
                profitableAuctions.length < 6 && profitableAuctions.length > 0
                    ? auction?.uptime === profitableAuctions[0]?.uptime
                    : true
            ) {
                profitableAuctions.push(auction);
            } else {
                profitableBidAuctions.push(
                    setupBidAuction(
                        profitableAuctions,
                        totalProfit,
                        totalMinProfit,
                        priceMins,
                        bnbPrice,
                        totalFee,
                        AuctionType.NORMAL
                    )
                );
                profitableAuctions = [auction];
                totalProfit = profit;
                totalMinProfit = minProfit;
                totalFee = feePro(bnbPrice);
            }
        }
    }
    profitableBidAuctions.push(
        setupBidAuction(
            profitableAuctions,
            totalProfit,
            totalMinProfit,
            priceMins,
            bnbPrice,
            totalFee,
            AuctionType.NORMAL
        )
    );
    console.log("profitableBidAuctions", profitableAuctions);
    return profitableBidAuctions;
};
