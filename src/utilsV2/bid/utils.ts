import fs from "fs";
import { Transaction } from "ethereumjs-tx";
import { BidAuction } from "@/types/bid/BidAuction";
import {
    GAS_LIMIT_BID,
    GAS_LIMIT_BID_BLOCK,
    NORMAL_BUYER,
    PRIVATE_KEY_BID,
    PRIVATE_KEY_BID_PRO,
    PRO_BUYER,
    TIME_DISABLE_BID,
    TIME_ENABLE_BID_AUCTION,
    WAIT_BID_PATH
} from "@/constants/constants";
import { RawTransaction } from "@/types/transaction/Transaction";
import { AuctionGroupStatus, AuctionStatus, BidType, FunctionFragment } from "@/enum/enum";
import { bidProvider } from "@/providers/bidProvider";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { ethersProvider } from "@/providers/ethersProvider";
import { sleep } from "../common/sleep";
import { noticeBotCancel, noticeBotInsufficient, noticeErrorBid } from "./handleNoticeBot";
import { chainInfor } from "./normalBidAuction";
import { mpUtils } from "../mp/utils";
import { AuctionGroupDto } from "@/types/dtos/AuctionGroup.dto";
import { mpBlockUtils } from "../mpBlock/utils";
import { bidContract } from "@/config/config";
import { erc20Provider } from "@/providers/erc20Provider";

export const getBidAuctions = async (): Promise<BidAuction[]> => {
    try {
        const bidAuctions = JSON.parse(fs.readFileSync(WAIT_BID_PATH, "utf8")).data;
        return bidAuctions;
    } catch {
        return [];
    }
};

export const saveBidAuctions = async (bidAuctions: BidAuction[]) => {
    if (!bidAuctions) {
        return;
    }
    try {
        fs.writeFileSync(WAIT_BID_PATH, JSON.stringify({ data: bidAuctions }));
    } catch (error) {
        console.error("Error saving bid auctions:", error);
    }
};

export const getRawTx = (bidAuction: BidAuction, txData: string, nonce: number): RawTransaction => {
    if (!bidAuction.buyer || !bidAuction.minGasPrice || !bidAuction.contractAddress) {
        return {} as RawTransaction;
    }
    let gasLimit = 0;
    switch (bidAuction.type) {
        case BidType.NORMAL:
        case BidType.BUNDLE:
            gasLimit = GAS_LIMIT_BID;
            break;
        case BidType.PRO:
            gasLimit = GAS_LIMIT_BID;
            break;
        case BidType.GROUP:
            gasLimit = GAS_LIMIT_BID_BLOCK;
            break;
        case BidType.BOX:
            gasLimit = 0;
            break;
        case BidType.MECBOX:
            gasLimit = 0;
            break;
        case BidType.GEM:
            gasLimit = 0;
            break;
        default:
            gasLimit = 0;
    }
    const txParams = {
        from: bidAuction.buyer,
        gas: "0x" + Math.round(gasLimit).toString(16),
        gasPrice: "0x" + Math.round(bidAuction.minGasPrice * 10 ** 9).toString(16),
        nonce: "0x" + nonce.toString(16),
        to: bidAuction.contractAddress,
        data: txData
    };
    const rawTx: RawTransaction = {
        nonce: txParams.nonce,
        gas: txParams.gas,
        gasPrice: txParams.gasPrice,
        to: txParams.to,
        data: txParams.data
    };
    return rawTx;
};

export const privateKey = (type: BidType): Buffer => {
    // if ((type === BidType.NORMAL || type === BidType.BUNDLE) && PRIVATE_KEY_BID)
    //     return Buffer.from(PRIVATE_KEY_BID, "hex");
    // if (type === BidType.PRO && PRIVATE_KEY_BID_PRO) return Buffer.from(PRIVATE_KEY_BID_PRO, "hex");
    switch (type) {
        case BidType.NORMAL:
        case BidType.BUNDLE:
            if (PRIVATE_KEY_BID) return Buffer.from(PRIVATE_KEY_BID, "hex");
            throw new Error(`Invalid private key type: ${type}`);
        case BidType.BOX:
        case BidType.MECBOX:
        case BidType.GEM:
        case BidType.GROUP:
        case BidType.PRO:
            if (PRIVATE_KEY_BID_PRO) return Buffer.from(PRIVATE_KEY_BID_PRO, "hex");
            throw new Error(`Invalid private key type: ${type}`);
        default:
            throw new Error(`Invalid private key type: ${type}`);
    }
};

export const getTxData = (bidAuction: BidAuction): string => {
    if (!bidAuction.auctions) return "";
    switch (bidAuction.type) {
        case BidType.NORMAL:
        case BidType.PRO:
        case BidType.BUNDLE:
            const isBatch = bidAuction.auctions.length > 1;
            if (!isBatch)
                return bidProvider.interface.encodeFunctionData(FunctionFragment.BID, [
                    bidAuction.auctions[0].auctor,
                    bidAuction.auctions[0].index,
                    bidAuction.auctions[0].uptime,
                    ((bidAuction.auctions[0]?.nowPrice ?? 0) + 10 ** 5).toString() + "000000000"
                ]);
            else
                return bidProvider.interface.encodeFunctionData(FunctionFragment.BID_BATCH, [
                    bidAuction.auctions.map((auction: AuctionDto) => auction.auctor),
                    bidAuction.auctions.map((auction: AuctionDto) => auction.index),
                    bidAuction.auctions.map((auction: AuctionDto) => auction.uptime),
                    bidAuction.auctions.map(
                        (auction: AuctionDto) =>
                            ((auction.nowPrice ?? 0) + 10 ** 5).toString() + "000000000"
                    ),
                    true
                ]);
        case BidType.GROUP:
            return bidProvider.interface.encodeFunctionData(FunctionFragment.BID_BLOCK, [
                bidAuction.auctionGroup?.auctor,
                bidAuction.auctionGroup?.index,
                bidAuction.auctionGroup?.orderId,
                ((bidAuction.totalPrice ?? 0) + 10 ** 5).toString() + "000000000"
            ]);
        case BidType.BOX:
            return "";
        case BidType.MECBOX:
            return "";
        case BidType.GEM:
            return "";
        default:
            return "";
    }
};

export const getBlockByTimestamp = async (timestamp: number, step: number): Promise<number> => {
    const latestBlockNumber = await ethersProvider.getBlockNumber();
    const latestBlock = await ethersProvider.getBlock(latestBlockNumber);
    if (!latestBlock) {
        throw new Error("Unable to fetch latest block data.");
    }
    if (timestamp > latestBlock.timestamp) {
        throw new Error("Timestamp is in the future.");
    }
    let startBlockNumber = latestBlockNumber;
    while (startBlockNumber > 1) {
        const block = await ethersProvider.getBlock(startBlockNumber);
        if (!block) {
            throw new Error(`Unable to fetch block data for block ${startBlockNumber}`);
        }
        if (block.timestamp < timestamp) {
            break;
        }
        startBlockNumber -= step;
    }
    startBlockNumber = Math.max(startBlockNumber, 1);
    let endBlockNumber = latestBlockNumber;
    while (startBlockNumber <= endBlockNumber) {
        const midBlockNumber = Math.floor((startBlockNumber + endBlockNumber) / 2);
        const midBlock = await ethersProvider.getBlock(midBlockNumber);
        if (!midBlock) {
            throw new Error("Unable to fetch block data.");
        }
        if (midBlock.timestamp === timestamp) {
            return midBlock.number;
        }
        if (midBlock.timestamp < timestamp) {
            startBlockNumber = midBlockNumber + 1;
        } else {
            endBlockNumber = midBlockNumber - 1;
        }
    }
    const resultBlock = await ethersProvider.getBlock(startBlockNumber);
    if (resultBlock && resultBlock.timestamp >= timestamp) {
        return resultBlock.number;
    }
    throw new Error("No block found with the given timestamp.");
};

export const getNowBlock = async (): Promise<number> => {
    const latestBlockNumber = await ethersProvider.getBlockNumber();
    return latestBlockNumber;
};

export const delay40Blocks = async (bidAuctions: BidAuction[]): Promise<boolean> => {
    if (!bidAuctions[0].uptime) return false;
    const uptime = bidAuctions[0].uptime;
    const createdBlock = await getBlockByTimestamp(uptime, 50);
    const warningBlock = createdBlock + 39;
    // Wait for check exist auction (before bid 5 blocks)
    while (true) {
        const nowBlock = await getNowBlock();
        if (nowBlock >= warningBlock - 5) {
            await sleep(3); // Wait for 3s before checking status order
            break;
        }
        const blocksRemaining = warningBlock - nowBlock;
        const estimatedDelay = blocksRemaining * 3;
        let checkInterval = Math.max(estimatedDelay / 2, 3);
        if (checkInterval > 10) {
            checkInterval = checkInterval * 1.5;
        }
        await sleep(checkInterval);
    }
    switch (bidAuctions[0].type) {
        case BidType.NORMAL:
        case BidType.BUNDLE:
        case BidType.PRO:
            if (
                !bidAuctions[0].auctions ||
                !bidAuctions[0].auctions[0] ||
                !(await isExistAuction(bidAuctions[0].auctions[0]))
            ) {
                await noticeBotCancel(bidAuctions[0]);
                return false;
            }
            break;
        case BidType.GROUP:
            if (
                !bidAuctions[0].auctionGroup ||
                !(await isExistAuctionGroup(bidAuctions[0].auctionGroup))
            ) {
                await noticeBotCancel(bidAuctions[0]);
                return false;
            }
            break;
        case BidType.BOX:
        case BidType.MECBOX:
        case BidType.GEM:
            break;
        default:
            await noticeBotCancel(bidAuctions[0]);
            return false;
    }
    // Wait for bid
    while (true) {
        const nowBlock = await getNowBlock();
        if (nowBlock >= warningBlock) {
            break;
        }
        const blocksRemaining = warningBlock - nowBlock;
        const estimatedDelay = blocksRemaining * 3;
        let checkInterval = Math.max(estimatedDelay / 2, 3);
        if (checkInterval > 10) {
            checkInterval = checkInterval * 1.5;
        }
        await sleep(checkInterval);
    }
    return true;
};

export const getSerializedTxs = async (bidAuctions: BidAuction[]): Promise<Buffer[]> => {
    const serializedTxs: Buffer[] = [];
    const nonce = {
        NORMAL: 0,
        PRO: 0,
        BUNDLE: 0,
        GROUP: 0,
        BOX: 0,
        MECBOX: 0,
        GEM: 0
    };
    nonce[BidType.BUNDLE] = nonce.NORMAL;
    if (
        bidAuctions.some(
            bidAuction =>
                bidAuction.type === BidType.PRO ||
                bidAuction.type === BidType.GROUP ||
                bidAuction.type === BidType.BOX ||
                bidAuction.type === BidType.MECBOX ||
                bidAuction.type === BidType.GEM
        )
    ) {
        nonce[BidType.PRO] =
            (await ethersProvider.getTransactionCount(PRO_BUYER || "", "latest")) - 1;
        nonce[BidType.GROUP] = nonce[BidType.PRO];
        nonce[BidType.BOX] = nonce[BidType.PRO];
        nonce[BidType.MECBOX] = nonce[BidType.PRO];
        nonce[BidType.GEM] = nonce[BidType.PRO];
    }
    if (
        bidAuctions.some(
            bidAuction => bidAuction.type === BidType.NORMAL || bidAuction.type === BidType.BUNDLE
        )
    ) {
        nonce[BidType.NORMAL] =
            (await ethersProvider.getTransactionCount(NORMAL_BUYER || "", "latest")) - 1;
        nonce[BidType.BUNDLE] = nonce[BidType.NORMAL];
    }
    for (const bidAuction of bidAuctions) {
        if (
            !bidAuction ||
            !bidAuction.profit ||
            !bidAuction.uptime ||
            !bidAuction.buyer ||
            !bidAuction.contractAddress ||
            !bidAuction.type ||
            !bidAuction.minGasPrice
        )
            continue;
        const nowTime = Math.round(Date.now() / 1000);
        if (
            bidAuction.profit < 0 ||
            nowTime - (bidAuction.uptime + TIME_ENABLE_BID_AUCTION) > TIME_DISABLE_BID
        ) {
            console.log("Over time or profit < 0", nowTime);
            await noticeErrorBid(bidAuction);
            continue;
        }
        if (!bidAuction.contractAddress || !bidAuction.buyer) continue;
        const txData = getTxData(bidAuction);
        if (!txData) continue;
        if (
            bidAuction.type === BidType.PRO ||
            bidAuction.type === BidType.GROUP ||
            bidAuction.type === BidType.BOX ||
            bidAuction.type === BidType.MECBOX ||
            bidAuction.type === BidType.GEM
        ) {
            nonce[BidType.PRO] += 1;
            nonce[BidType.GROUP] += 1;
            nonce[BidType.BOX] += 1;
            nonce[BidType.MECBOX] += 1;
            nonce[BidType.GEM] += 1;
        }
        if (bidAuction.type === BidType.NORMAL || bidAuction.type === BidType.BUNDLE) {
            nonce[BidType.NORMAL] += 1;
            nonce[BidType.BUNDLE] += 1;
        }
        const rawTx = getRawTx(bidAuction, txData, nonce[bidAuction.type]);
        const tx = new Transaction(rawTx, { common: chainInfor });
        tx.sign(privateKey(bidAuction.type));
        serializedTxs.push(tx.serialize());
    }
    return serializedTxs;
};

export const isExistAuction = async (auction: AuctionDto): Promise<boolean> => {
    try {
        if (!auction.auctor || !auction.uptime) {
            throw new Error("Auction auctor is undefined");
        }
        const order = await mpUtils.getOrder(auction.auctor, (auction.index ?? 0).toString());
        return (
            (order.status === BigInt(AuctionStatus.ACTIVE) &&
                BigInt(auction.uptime) === order.uptime &&
                order.tokenId === BigInt(auction.tokenId ?? 0) &&
                (auction.ids?.length ?? 0) === (order.ids?.length ?? 0) &&
                (auction.amounts?.length ?? 0) === (order.amounts?.length ?? 0) &&
                auction.ids?.every((id, index) => order.ids && BigInt(id) === order.ids[index]) &&
                auction.amounts?.every(
                    (amount, index) => order.amounts && BigInt(amount) === order.amounts[index]
                )) ??
            false
        );
    } catch (error) {
        console.error("Error checking auction:", error);
        return true;
    }
};

export const isExistAuctionGroup = async (auctionGroup: AuctionGroupDto): Promise<boolean> => {
    try {
        if (!auctionGroup.auctor || !auctionGroup.uptime) {
            throw new Error("Auction auctor is undefined");
        }
        const order = await mpBlockUtils.getOrderBlock(
            auctionGroup.auctor,
            (auctionGroup.index ?? 0).toString()
        );
        return (
            (order.status === BigInt(AuctionGroupStatus.ACTIVE) &&
                BigInt(auctionGroup.uptime) === order.uptime) ??
            false
        );
    } catch (error) {
        console.error("Error checking auction:", error);
        return true;
    }
};

export const getPayableBidAuctions = async (bidAuctions: BidAuction[]): Promise<BidAuction[]> => {
    const payableBidAuctions: BidAuction[] = [];
    const outOfStockBidAuctions: BidAuction[] = [];
    for (let i = 0; i < bidAuctions.length; i++) {
        const bidAuction = bidAuctions[i];
        if (!bidAuction.buyer || !bidAuction.totalPrice || !bidAuction.type) {
            continue;
        }
        const addressCheck = (type: BidType) => {
            switch (type) {
                case BidType.PRO:
                case BidType.GROUP:
                case BidType.BOX:
                case BidType.MECBOX:
                case BidType.GEM:
                    return bidContract;
                case BidType.NORMAL:
                case BidType.BUNDLE:
                    return bidContract;
                default:
                    return "";
            }
        };
        const balance = await erc20Provider.balanceOf(addressCheck(bidAuction.type));
        console.log("Balance", balance);
        if (Number(balance) / 10 ** 9 < bidAuction.totalPrice) {
            outOfStockBidAuctions.push(bidAuction);
            continue;
        }
        payableBidAuctions.push(bidAuction);
    }
    if (outOfStockBidAuctions.length > 0) {
        await noticeBotInsufficient(outOfStockBidAuctions);
    }
    return payableBidAuctions;
};
