import fs from "fs";
import { BidAuction } from "../../types/bid/BidAuction";
import { ethersProvider } from "../../providers/ethersProvider";
import { RawTransaction } from "../../types/transaction/Transaction";
import { contractProvider } from "../../providers/contractProvider";
import { AuctionType, FunctionFragment } from "../../enum/enum";
import {
    GAS_PRICE_BID,
    PRIVATE_KEY_BID,
    PRIVATE_KEY_BID_PRO,
    WAIT_BID_PATH
} from "../../constants/constants";
import { AuctionDto } from "../../types/dtos/Auction.dto";
import { sleep } from "../common/sleep";

export const getBidAuctions = async (): Promise<BidAuction[]> => {
    try {
        const bidAuctions = JSON.parse(fs.readFileSync(WAIT_BID_PATH, "utf8")).data;
        return bidAuctions;
    } catch (error) {
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

export const getRawTx = async (bidAuction: BidAuction, txData: string): Promise<RawTransaction> => {
    if (!bidAuction.buyer || !bidAuction.minGasPrice || !bidAuction.contractAddress) {
        return {} as RawTransaction;
    }
    const nonce = await ethersProvider.getTransactionCount(bidAuction?.buyer);
    const txParams = {
        from: bidAuction.buyer,
        gas: "0x" + GAS_PRICE_BID.toString(16),
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

export const privateKey = (type: string): Buffer => {
    if (type === AuctionType.NORMAL && PRIVATE_KEY_BID) return Buffer.from(PRIVATE_KEY_BID, "hex");
    if (type === AuctionType.PRO && PRIVATE_KEY_BID_PRO)
        return Buffer.from(PRIVATE_KEY_BID_PRO, "hex");
    throw new Error(`Invalid private key type: ${type}`);
};

export const getTxData = (bidAuction: BidAuction): string => {
    if (!bidAuction || !bidAuction.auctions || !bidAuction.auctions.length) return "";
    const isBatch = bidAuction.auctions.length > 1;
    if (isBatch)
        return contractProvider.interface.encodeFunctionData(FunctionFragment.BID, [
            bidAuction.auctions[0].auctor,
            bidAuction.auctions[0].index,
            bidAuction.auctions[0].uptime,
            bidAuction.auctions[0].nowPrice
        ]);
    else
        return contractProvider.interface.encodeFunctionData(FunctionFragment.BID_BATCH, [
            bidAuction.auctions.map((auction: AuctionDto) => auction.auctor),
            bidAuction.auctions.map((auction: AuctionDto) => auction.index),
            bidAuction.auctions.map((auction: AuctionDto) => auction.uptime),
            bidAuction.auctions.map((auction: AuctionDto) => auction.nowPrice),
            true
        ]);
};

export const getBlockByTimestamp = async (timestamp: number): Promise<number> => {
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
        startBlockNumber -= 50;
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

export const delay40Blocks = async (uptime: number) => {
    const createdBlock = await getBlockByTimestamp(uptime);
    const warningBlock = createdBlock + 39;
    while (true) {
        const nowBlock = await getNowBlock();
        if (nowBlock >= warningBlock) {
            break;
        }
        const blocksRemaining = warningBlock - nowBlock;
        const estimatedDelay = blocksRemaining * 3;
        const checkInterval = Math.max((estimatedDelay / 3) * 2, 3);
        await sleep(checkInterval);
    }
};
