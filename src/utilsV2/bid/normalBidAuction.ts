import { ENV } from "../../constants/constants";
import { BidAuction } from "../../types/bid/BidAuction";
import common from "ethereumjs-common";
import { Environment } from "../../enum/enum";
import { delay40Blocks, getPayableBidAuctions, getSerializedTxs } from "./utils";
import { sendTransaction } from "./sendTransactionNormal";

export const chainInfor = common.forCustomChain(
    "mainnet",
    {
        name: "bnb",
        networkId: ENV === Environment.MAINNET ? 56 : 97,
        chainId: ENV === Environment.MAINNET ? 56 : 97
    },
    "petersburg"
);

export const normalBidAuction = async (bidAuctionsSameTime: BidAuction[]) => {
    if (!bidAuctionsSameTime || bidAuctionsSameTime.length === 0) {
        return;
    }
    let payableBidAuctions = await getPayableBidAuctions(bidAuctionsSameTime);
    if (!payableBidAuctions || payableBidAuctions.length === 0) {
        return;
    }
    const serializedTxs: Buffer[] = await getSerializedTxs(payableBidAuctions);
    const isExistAuction = await delay40Blocks(bidAuctionsSameTime); // wait 2m and check auction is exist
    if (!isExistAuction) {
        return;
    }
    for (let i = 0; i < serializedTxs.length; i++) {
        if (i === serializedTxs.length - 1) {
            await sendTransaction(serializedTxs[i], payableBidAuctions[i]);
        } else {
            sendTransaction(serializedTxs[i], payableBidAuctions[i]);
        }
    }
};
