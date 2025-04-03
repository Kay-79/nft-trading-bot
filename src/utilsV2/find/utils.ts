import { AuctionDto } from "../../types/dtos/Auction.dto";
import { TierPrice } from "../../types/common/TierPrice";
import {
    bidContract,
    bidContractPro,
    profitBlock,
    profitPerTier,
    profitProAI
} from "../../config/config";
import fs from "fs";
import path from "path";
import {
    API_BNB_PRICE_COIGEKO,
    API_BNB_PRICE_MOBOX,
    API_MOBOX,
    GAS_LIMIT_LIST,
    GAS_ESTIMATE_PRICES_BID,
    MIN_GAS_PRICE_NORMAL,
    MIN_GAS_PRICE_PRO,
    MIN_TIME_GET_PRICE,
    // MP_ADDRESS,
    NORMAL_BUYER,
    PRO_BUYER,
    RATE_FEE_MARKET,
    WAIT_BID_PATH,
    // MP_BLOCK_ADDRESS,
    ENV,
    API_AI_PRICE_PREDICT
    // MP_ADDRESS
} from "../../constants/constants";
import { BidAuction } from "../../types/bid/BidAuction";
import { BidType, BlockType, Environment } from "../../enum/enum";
import axios from "axios";
import { noticeBotDetectProfit } from "../bid/handleNoticeBot";
import { AuctionGroupDto } from "@/types/dtos/AuctionGroup.dto";
import { sleep } from "../common/sleep";

export const isProAuction = (auction: AuctionDto): boolean => {
    return auction.amounts?.length === 0;
};
export const isBundleAuction = (auction: AuctionDto): boolean => {
    return (auction.amounts?.length ?? 0) > 1 || Number(auction.amounts?.[0] ?? 0) > 1
        ? true
        : false;
};
export const isNormalAuction = (auction: AuctionDto): boolean => {
    return auction.amounts?.length === 1 && Number(auction.amounts?.[0]) === 1;
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
    return GAS_ESTIMATE_PRICES_BID.bundleAuction * bnbPrice * 10 ** -9 * MIN_GAS_PRICE_NORMAL;
};

export const feePro = (bnbPrice: number): number => {
    return GAS_ESTIMATE_PRICES_BID.proAuction * bnbPrice * 10 ** -9 * MIN_GAS_PRICE_PRO;
};

export const feeNormal = (bnbPrice: number): number => {
    return GAS_ESTIMATE_PRICES_BID.proAuction * bnbPrice * 10 ** -9 * MIN_GAS_PRICE_NORMAL;
};

export const feeBlock = (amount: number, bnbPrice: number): number => {
    return GAS_ESTIMATE_PRICES_BID.auctionGroup.default * bnbPrice * 10 ** -9 * MIN_GAS_PRICE_PRO;
};

export const setupBidAuction = ({
    auctions,
    auctionGroup,
    profit,
    minProfit,
    floorPrices,
    totalFee,
    bidType,
    amount,
    totalPrice,
    pricePrediction
}: {
    auctions: AuctionDto[];
    auctionGroup?: AuctionGroupDto;
    profit: number;
    minProfit: number;
    floorPrices: TierPrice;
    totalFee: number;
    bidType: BidType;
    amount: number;
    totalPrice: number;
    pricePrediction: number;
}): BidAuction => {
    let buyer = "";
    let contractAddress = "";
    let minGasPrice = 0;
    let maxGasPrice = 0;
    let uptime = 0;
    let id = "";
    switch (bidType) {
        case BidType.NORMAL:
            buyer = NORMAL_BUYER;
            contractAddress = bidContract;
            minGasPrice = MIN_GAS_PRICE_NORMAL;
            maxGasPrice = MIN_GAS_PRICE_NORMAL;
            uptime = auctions[0]?.uptime ?? 0;
            id = auctions[0]?.id ?? "";
            break;
        case BidType.BUNDLE:
            buyer = NORMAL_BUYER;
            contractAddress = bidContract;
            minGasPrice = MIN_GAS_PRICE_NORMAL;
            maxGasPrice = MIN_GAS_PRICE_NORMAL;
            uptime = auctions[0]?.uptime ?? 0;
            id = auctions[0]?.id ?? "";
            break;
        case BidType.PRO:
            buyer = PRO_BUYER;
            contractAddress = bidContractPro;
            minGasPrice = MIN_GAS_PRICE_PRO;
            maxGasPrice = MIN_GAS_PRICE_PRO;
            uptime = auctions[0]?.uptime ?? 0;
            id = auctions[0]?.id ?? "";
            break;
        case BidType.GROUP:
            buyer = PRO_BUYER;
            contractAddress = bidContractPro;
            minGasPrice = MIN_GAS_PRICE_PRO;
            maxGasPrice = MIN_GAS_PRICE_PRO;
            uptime = (auctionGroup?.uptime ?? 0) + 8 * 60;
            id = (auctionGroup?.auctor ?? "") + (auctionGroup?.orderId ?? "");
            break;
        case BidType.BOX:
            break;
        case BidType.MECBOX:
            break;
        case BidType.GEM:
            break;
        default:
            break;
    }
    return {
        id: id,
        uptime: uptime,
        profit: profit,
        minProfit: minProfit,
        buyer: buyer,
        contractAddress: contractAddress,
        totalPrice: totalPrice,
        pricePrediction: pricePrediction,
        minPrice: floorPrices,
        fee: totalFee,
        type: bidType,
        amount: amount,
        minGasPrice: minGasPrice,
        maxGasPrice: maxGasPrice,
        auctions: auctions,
        auctionGroup: auctionGroup
    };
};

export const updateWaitBid = async (profitableAuctions: BidAuction[]) => {
    if (!profitableAuctions || profitableAuctions.length == 0) {
        return;
    }
    let waitBid: BidAuction[] = [];
    try {
        waitBid = JSON.parse(fs.readFileSync(WAIT_BID_PATH, "utf8")).data;
    } catch {
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
    if (profitAuctions.length > 6) {
        return true;
    }
    return auction?.uptime !== profitAuctions[0]?.uptime;
};

export const isProfitable = (profit: number, minProfit: number): boolean => {
    if (ENV === Environment.TESTNET) {
        return true;
    }
    return profit >= minProfit;
};

export const getPriceFromAI = async (
    auction: AuctionDto,
    mboxPrice: number,
    rewardPer1000Hash: number
): Promise<number> => {
    if (!auction.tokenId || !auction.prototype) return 0;
    if (auction.prototype >= 6 * 10 ** 4) return 0;
    const input = [
        auction.hashrate,
        auction.lvHashrate,
        Math.floor(auction.prototype / 10 ** 4),
        auction.level,
        Date.now() / 1000,
        mboxPrice,
        rewardPer1000Hash
    ];
    try {
        const response = await axios.post(API_AI_PRICE_PREDICT, {
            input: input
        });
        // console.log(input);
        // console.log(`Price prediction ONE: ${response.data.prediction[0][0]}`);
        return response.data.prediction[0][0];
    } catch {
        console.log("Error get price from AI");
        return 0;
    }
};

export const getPriceBlockFromAI = async (
    auctionGroup: AuctionGroupDto,
    mboxPrice: number,
    rewardPer1000Hash: number
): Promise<number> => {
    if (!auctionGroup.tokens) return 0;
    const inputs: number[][] = [];
    auctionGroup.tokens.forEach(token => {
        const input = [
            token.hashrate,
            token.lvHashrate,
            token.prototype !== undefined ? Math.floor(token.prototype / 10 ** 4) : undefined,
            token.level,
            Date.now() / 1000,
            mboxPrice,
            rewardPer1000Hash
        ].filter(value => value !== undefined) as number[];
        inputs.push(input);
    });
    let totalPredict = 0;
    try {
        for (const input of inputs) {
            const response = await axios.post(API_AI_PRICE_PREDICT, {
                input: input
            });
            // console.log(input);
            // console.log(`Price prediction ALL: ${response.data.prediction[0][0]}`);
            totalPredict += response.data.prediction[0][0];
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return 0;
    }
    return totalPredict;
};

export const getProfitableBidAuctionsNormalVsPro = async (
    auctions: AuctionDto[],
    floorPrices: TierPrice,
    bnbPrice: number,
    type: BidType,
    mboxPrice: number,
    rewardPer1000Hash: number
): Promise<BidAuction[]> => {
    auctions.sort((a, b) => (a.uptime ?? 0) - (b.uptime ?? 0));
    let profitableAuctions: AuctionDto[] = [];
    const profitableBidAuctions: BidAuction[] = [];
    let totalProfit = 0;
    let totalMinProfit = 0;
    let totalFee = 0;
    let totalPrice = 0;
    let totalPricePrediction = 0;
    const fee = type === BidType.PRO ? feePro(bnbPrice) : feeNormal(bnbPrice);
    const calculateAuctionMetrics = (
        auction: AuctionDto
    ): { profit: number; minProfit: number } => {
        const calculateProfit = (
            minValueAuction: number,
            fee: number,
            auction: AuctionDto,
            bnbPrice: number
        ): number => {
            if (!auction?.nowPrice) return -1;
            return (
                minValueAuction * (1 - RATE_FEE_MARKET) -
                (fee + auction?.nowPrice * 10 ** -9 + GAS_LIMIT_LIST * bnbPrice * 10 ** -9)
            );
        };
        const minValueType =
            type === BidType.PRO
                ? getMinValueType((auction.prototype ?? "").toString(), 1, floorPrices)
                : getMinValueType(auction.ids?.[0] ?? "", 1, floorPrices);

        const minValue = minValueType[0];
        const minProfit = minValueType[1];
        const profit = calculateProfit(minValue, fee, auction, bnbPrice);
        return { profit, minProfit };
    };
    const calculateAuctionMetricsAI = async (
        auction: AuctionDto
    ): Promise<{ profit: number; minProfit: number; pricePrediction: number }> => {
        const calculateProfitPro = (
            minValueAuction: number,
            fee: number,
            auction: AuctionDto,
            bnbPrice: number
        ): number => {
            if (!auction?.nowPrice) return -1;
            return (
                minValueAuction * profitProAI.percent * (1 - RATE_FEE_MARKET) -
                (fee + auction?.nowPrice * 10 ** -9 + GAS_LIMIT_LIST * bnbPrice * 10 ** -9)
            );
        };
        const minValue = await getPriceFromAI(auction, mboxPrice, rewardPer1000Hash);
        const minProfit = profitProAI.min;
        const profit = calculateProfitPro(minValue, fee, auction, bnbPrice);
        return { profit, minProfit, pricePrediction: minValue };
    };
    for (let i = 0; i < auctions.length; i++) {
        const auction = auctions[i];
        if (!auction?.nowPrice) {
            continue;
        }
        if (
            (type === BidType.NORMAL && isProAuction(auction)) ||
            (type === BidType.PRO && !isProAuction(auction))
        ) {
            console.log("Type is not valid");
            continue;
        }
        const { profit, minProfit } = calculateAuctionMetrics(auction);
        if (isProfitable(profit, minProfit)) {
            // floor method
            profitableAuctions.push(auction);
            totalFee += fee;
            totalProfit += profit;
            totalMinProfit += minProfit;
            totalPrice += auction?.nowPrice;
            totalPricePrediction += 0;
            if (isBreakBatch(profitableAuctions, auction)) {
                profitableAuctions.pop();
                profitableBidAuctions.push(
                    setupBidAuction({
                        auctions: profitableAuctions,
                        profit: totalProfit - profit,
                        minProfit: totalMinProfit - minProfit,
                        floorPrices: floorPrices,
                        totalFee: totalFee - fee,
                        bidType: type,
                        amount: profitableAuctions.length,
                        totalPrice: totalPrice - auction?.nowPrice,
                        pricePrediction: totalPricePrediction - 0
                    })
                );
                profitableAuctions = [auction];
                totalProfit = profit;
                totalMinProfit = minProfit;
                totalFee = fee;
                totalPrice = auction?.nowPrice;
                totalPricePrediction = 0;
            }
        } else {
            // console.log("Check profit again with AI");
            // AI method (check profit again)
            if (type !== BidType.PRO) continue;
            const { profit, minProfit, pricePrediction } = await calculateAuctionMetricsAI(auction);
            // console.log(profit, minProfit, pricePrediction);
            if (isProfitable(profit, minProfit)) {
                profitableAuctions.push(auction);
                totalFee += fee;
                totalProfit += profit;
                totalMinProfit += minProfit;
                totalPrice += auction?.nowPrice;
                totalPricePrediction += pricePrediction;
                if (isBreakBatch(profitableAuctions, auction)) {
                    profitableAuctions.pop();
                    profitableBidAuctions.push(
                        setupBidAuction({
                            auctions: profitableAuctions,
                            profit: totalProfit - profit,
                            minProfit: totalMinProfit - minProfit,
                            floorPrices: floorPrices,
                            totalFee: totalFee - fee,
                            bidType: type,
                            amount: profitableAuctions.length,
                            totalPrice: totalPrice - auction?.nowPrice,
                            pricePrediction: totalPricePrediction - pricePrediction
                        })
                    );
                    profitableAuctions = [auction];
                    totalProfit = profit;
                    totalMinProfit = minProfit;
                    totalFee = fee;
                    totalPrice = auction?.nowPrice;
                    totalPricePrediction = pricePrediction;
                }
            }
        }
    }
    if (profitableAuctions.length === 0) {
        return profitableBidAuctions;
    }
    if (profitableAuctions.length >= 1 && profitableAuctions.length <= 6) {
        profitableBidAuctions.push(
            setupBidAuction({
                auctions: profitableAuctions,
                profit: totalProfit,
                minProfit: totalMinProfit,
                floorPrices: floorPrices,
                totalFee: totalFee,
                bidType: type,
                amount: profitableAuctions.length,
                totalPrice: totalPrice,
                pricePrediction: totalPricePrediction
            })
        );
    } else {
        console.log("Profitable auctions length is not valid");
    }
    return profitableBidAuctions;
};

export const getProfitableBidAuctionsBundle = (
    bundleAuctions: AuctionDto[],
    floorPrices: TierPrice,
    bnbPrice: number
): BidAuction[] => {
    const profitableBidAuctions: BidAuction[] = [];
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
        // Bundle method
        if (isProfitable(profit, minProfit)) {
            profitableBidAuctions.push(
                setupBidAuction({
                    auctions: [auction],
                    profit: profit,
                    minProfit: minProfit,
                    floorPrices: floorPrices,
                    totalFee: feeBundle(bnbPrice),
                    bidType: BidType.BUNDLE,
                    amount: amount,
                    totalPrice: auction?.nowPrice,
                    pricePrediction: 0
                })
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
    const floorPrices = cacheTierPrice;
    const filePath = path.join(__dirname, "tierPrices.json");
    const fileExists = fs.existsSync(filePath);
    if (fileExists) {
        const fileStats = fs.statSync(filePath);
        const fileAge = Date.now() - fileStats.mtimeMs;
        if (fileAge < 5 * 60 * 1000) {
            try {
                const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
                console.log("Tier prices loaded from JSON file");
                return data;
            } catch (error) {
                console.log("Error reading tier prices from JSON file:", error);
            }
        }
    }

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
                if (amount === 0) {
                    return cachePrice;
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
        await sleep(3);
        floorPrices[tier as keyof TierPrice] = await getPrice(
            tier,
            amount,
            floorPrices[tier as keyof TierPrice] ?? 0
        );
    }
    if ((floorPrices[6] ?? 0) > 1000) {
        floorPrices[6] = 900;
    }

    try {
        fs.writeFileSync(filePath, JSON.stringify(floorPrices));
    } catch (error) {
        console.log("Error writing tier prices to JSON file:", error);
    }

    return floorPrices;
};

export const getProfitableBidAuctionsBlock = async (
    auctionGroups: AuctionGroupDto[],
    floorPrices: TierPrice,
    bnbPrice: number,
    type: BidType,
    mboxPrice: number,
    rewardPer1000Hash: number
): Promise<BidAuction[]> => {
    if (type !== BidType.GROUP) {
        console.log("Type is not group");
        return [];
    }
    auctionGroups.sort((a, b) => (a.uptime ?? 0) - (b.uptime ?? 0));
    const profitableBidAuctions: BidAuction[] = [];
    for (let i = 0; i < auctionGroups.length; i++) {
        const auctionGroup = auctionGroups[i];
        if (!auctionGroup.tokens || auctionGroup.tokens.length === 0 || !auctionGroup.price) {
            continue;
        }
        const totalFee = feeBlock(auctionGroup.tokens.length, bnbPrice);
        const calculateAuctionMetricsBlockAI = async (
            auctionGroup: AuctionGroupDto
        ): Promise<{ profit: number; minProfit: number; pricePrediction: number }> => {
            const calculateProfitBlock = (
                minValueAuctionGroup: number,
                crewPrice: number,
                fee: number,
                auctionGroup: AuctionGroupDto,
                bnbPrice: number
            ): number => {
                if (!auctionGroup?.price || !auctionGroup.tokens) return -1;
                return (
                    (minValueAuctionGroup * profitBlock.percent + crewPrice) *
                        (1 - RATE_FEE_MARKET) -
                    (fee +
                        auctionGroup?.price * 10 ** -9 +
                        auctionGroup.tokens?.length * GAS_LIMIT_LIST * bnbPrice * 10 ** -9)
                );
            };
            const minValue = await getPriceBlockFromAI(auctionGroup, mboxPrice, rewardPer1000Hash);
            let crewPrice = 0;
            if (auctionGroup.type === BlockType.CREW) {
                crewPrice += floorPrices[1] ?? 0;
                crewPrice += floorPrices[2] ?? 0;
                crewPrice += floorPrices[3] ?? 0;
                if (auctionGroup.tokens) {
                    crewPrice *= auctionGroup.tokens.length;
                }
            }
            const minProfit = profitBlock.min;
            const profit = calculateProfitBlock(
                minValue,
                crewPrice,
                totalFee,
                auctionGroup,
                bnbPrice
            );
            return { profit, minProfit, pricePrediction: minValue + crewPrice };
        };
        const { profit, minProfit, pricePrediction } = await calculateAuctionMetricsBlockAI(
            auctionGroup
        );
        const totalProfit = profit;
        const totalMinProfit = minProfit;
        const totalPricePrediction = pricePrediction;
        const totalPrice = auctionGroup.price;
        // console.log(profit, minProfit, pricePrediction);
        // Block method
        if (isProfitable(totalProfit, totalMinProfit)) {
            profitableBidAuctions.push(
                setupBidAuction({
                    auctions: [],
                    auctionGroup: auctionGroup,
                    profit: totalProfit,
                    minProfit: totalMinProfit,
                    floorPrices: floorPrices,
                    totalFee: totalFee,
                    bidType: type,
                    amount: auctionGroup.tokens.length,
                    totalPrice: totalPrice,
                    pricePrediction: totalPricePrediction
                })
            );
        }
    }
    return profitableBidAuctions;
};
