import { ENV, TIME_DELAY_BLOCK_BID } from "../../constants/constants";
import { BidAuction } from "../../types/bid/BidAuction";
import { Transaction } from "ethereumjs-tx";
import common from "ethereumjs-common";
import { Environment } from "../../enum/enum";
import { delay40Blocks, getRawTx, getSerializedTxs, getTxData, privateKey } from "./utils";
import { sendTransaction } from "./sendTransactionNormal";
import { noticeErrorBid } from "./handleNoticeBot";

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
    const serializedTxs: Buffer[] = await getSerializedTxs(bidAuctionsSameTime);
    await delay40Blocks(bidAuctionsSameTime[0]);
    for (let i = 0; i < serializedTxs.length; i++) {
        if (i === serializedTxs.length - 1) {
            await sendTransaction(serializedTxs[i], bidAuctionsSameTime[i]);
        } else {
            sendTransaction(serializedTxs[i], bidAuctionsSameTime[i]);
        }
    }
};
function exit() {
    throw new Error("Processing exit");
}
