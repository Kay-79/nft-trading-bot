import { AuctionDto } from "../../types/dtos/Auction.dto";
import { TierPrice } from "../../types/dtos/TierPrice.dto";
import { config } from "../../config/config";
import fs from "fs";

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
    const minP = (config.profirPerTier[prototypeIndex as keyof TierPrice] ?? NaN) * amount;
    return [minV, minP];
};

export const feeBundle = (bnbPrice: number): number => {
    return config.gasPrices.bundleAuction * bnbPrice * 10 ** -9;
};

export const saveAuctionsProfit = (auctions: AuctionDto[]) => {
    //read cache auctionsProfit in waitbid.json
    let auctionsProfit: AuctionDto[] = JSON.parse(fs.readFileSync("waitBid.json", "utf8")).data;
    if (!auctionsProfit) {
        auctionsProfit = [];
    }
    auctionsProfit.push(...auctions);
    //sort by uptime
    fs.writeFileSync("waitBid.json", JSON.stringify({ data: auctionsProfit }));
};
