import { ENV, TIME_DELAY_BLOCK_BID } from "../../constants/constants";
import { BidAuction } from "../../types/bid/BidAuction";
import { Transaction } from "ethereumjs-tx";
import common from "ethereumjs-common";
import { Environment } from "../../enum/enum";
import { delay40Blocks, getSerializedTxs, isExistAuction } from "./utils";
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
    if (!bidAuctionsSameTime || bidAuctionsSameTime.length === 0) {
        throw new Error("bidAuctionsSameTime is empty or undefined");
    }
    const serializedTxs: Buffer[] = await getSerializedTxs(bidAuctionsSameTime);
    const firstAuction = bidAuctionsSameTime[0];
    await delay40Blocks(firstAuction);
    if (!firstAuction.auctions || firstAuction.auctions.length === 0) {
        throw new Error("auctions is empty or undefined");
    }
    if (!isExistAuction(firstAuction.auctions[0])) {
        await noticeErrorBid(firstAuction);
        return;
    }
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
