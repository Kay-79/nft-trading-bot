import fs from "fs";
import { BidAuction } from "../../types/bid/BidAuction";
import exp from "constants";
import { ethersProvider } from "../../providers/ethersProvider";
import { RawTransaction } from "../../types/transaction/Transaction";

export const getBidAuctions = async (): Promise<BidAuction[]> => {
    try {
        const bidAuctions = JSON.parse(fs.readFileSync("waitBid.json", "utf8")).data;
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
        fs.writeFileSync("waitBid.json", JSON.stringify({ data: bidAuctions }));
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
        gas: "0x" + (1000000).toString(16),
        gasPrice: "0x" + (bidAuction.minGasPrice * 10 ** 9).toString(16),
        nonce: "0x" + nonce.toString(16),
        gasLimit: "0x" + (1000000).toString(16),
        to: bidAuction.contractAddress,
        value: "0x00",
        data: txData
    };
    const rawTx: RawTransaction = {
        nonce: txParams.nonce,
        gasPrice: txParams.gasPrice,
        gasLimit: txParams.gasLimit,
        to: txParams.to,
        value: txParams.value,
        data: txParams.data
    };
    return rawTx;
};
