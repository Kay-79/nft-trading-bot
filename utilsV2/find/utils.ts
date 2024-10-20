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

export const feeBundle = (bnbPrice: number): number => {
    return GAS_PRICES.bundleAuction * bnbPrice * 10 ** -9;
};

export const setupBidAuction = (
    auction: AuctionDto,
    profit: number,
    minProfit: number,
    priceMins: TierPrice,
    bnbPrice: number,
    auctionType: string
): BidAuction => {
    let buyer = "";
    let contractAddress = "";
    switch (auctionType) {
        case AuctionType.NORMAL:
            buyer = NORMAL_BUYER;
            contractAddress = bidContract;
            break;
        case AuctionType.BUNDLE:
            buyer = NORMAL_BUYER;
            contractAddress = bidContract;
            break;
        case AuctionType.PRO:
            buyer = PRO_BUYER;
            contractAddress = MP_ADDRESS;
            break;
        default:
            break;
    }
    return {
        id: auction?.id,
        uptime: auction?.uptime,
        profit: profit,
        minProfit: minProfit,
        buyer: buyer,
        contractAddress: contractAddress,
        nowPrice: auction?.nowPrice,
        minPrice: priceMins,
        fee: feeBundle(bnbPrice),
        auctions: [auction]
    };
};

export const updateWaitBid = async (profitableAuctions: BidAuction[]) => {
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
