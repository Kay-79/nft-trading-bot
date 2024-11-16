import fs from "fs";
import { BidAuction } from "../../types/bid/BidAuction";
import { ethersProvider } from "../../providers/ethersProvider";
import { RawTransaction } from "../../types/transaction/Transaction";
import { contractProvider } from "../../providers/contractProvider";
import { AuctionType, FunctionFragment } from "../../enum/enum";
import { GAS_PRICE_BID, PRIVATE_KEY_BID, PRIVATE_KEY_BID_PRO } from "../../constans/constans";
import { AuctionDto } from "../../types/dtos/Auction.dto";

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
    console.log("Raw transaction:", rawTx);
    return rawTx;
};

export const sendTransaction = async (serializedTx: Buffer) => {
    try {
        const txResponse = await ethersProvider.send("eth_sendRawTransaction", [
            "0x" + serializedTx.toString("hex")
        ]);
        console.log("Transaction hash:", txResponse);
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
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
