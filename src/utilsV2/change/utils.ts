import {
    API_MOBOX,
    CHANGER,
    GAS_LIMIT_CHANGE,
    MIN_GAS_PRICE_CHANGE,
    PRIVATE_KEY_CHANGE
} from "@/constants/constants";
import { ethersProvider } from "@/providers/ethersProvider";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import axios from "axios";
import { chainInfor } from "../bid/normalBidAuction";
import { Transaction } from "ethereumjs-tx";
import { bidProvider } from "@/providers/bidProvider";
import { FunctionFragment } from "@/enum/enum";
import { ethers } from "ethers";
import { RawTransaction } from "@/types/transaction/Transaction";

export const getAuctionsByPrototype = async (prototype: number): Promise<AuctionDto[]> => {
    const params = {
        page: 1,
        limit: 10,
        category: "",
        vType: "",
        sort: "price",
        pType: prototype
    };
    try {
        const data = await axios.get(`${API_MOBOX}/auction/search_v2/BNB`, { params });
        return data?.data?.list || [];
    } catch {
        console.log(`Error get new auctions, waiting for next loop...`);
        return [];
    }
};

export const getTxData = (auction: AuctionDto, newPrice: number): string => {
    const startPrice = ethers.parseUnits(newPrice.toString(), 18);
    const endPrice = ethers.parseUnits(newPrice.toString(), 18);
    return bidProvider.interface.encodeFunctionData(FunctionFragment.CHANGE_PRICE, [
        auction.index,
        startPrice,
        endPrice,
        2
    ]);
};

export const getRawTx = (auction: AuctionDto, txData: string, nonce: number): RawTransaction => {
    const gasLimit = GAS_LIMIT_CHANGE;
    const txParams = {
        from: CHANGER,
        gas: "0x" + Math.round(gasLimit).toString(16),
        gasPrice: "0x" + Math.round(MIN_GAS_PRICE_CHANGE * 10 ** 9).toString(16),
        nonce: "0x" + nonce.toString(16),
        to: auction.auctor || "",
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

export const getSerializedChangeTx = async (
    auction: AuctionDto,
    newPrice: number
): Promise<Buffer> => {
    const nonce = await ethersProvider.getTransactionCount(CHANGER || "", "latest");
    const txData = getTxData(auction, newPrice);
    const rawTx = getRawTx(auction, txData, nonce);
    const tx = new Transaction(rawTx, { common: chainInfor });
    tx.sign(Buffer.from(PRIVATE_KEY_CHANGE, "hex"));
    return tx.serialize();
};
