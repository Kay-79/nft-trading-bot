import { ENV, TIME_DELAY_BLOCK_BID } from "../../constants/constants";
import { BidAuction } from "../../types/bid/BidAuction";
import { Transaction } from "ethereumjs-tx";
import common from "ethereumjs-common";
import { Environment } from "../../enum/enum";
import { delay40Blocks, getRawTx, getTxData, privateKey } from "./utils";
import { sendTransaction } from "./sendTransactionNormal";
import { noticeErrorBid } from "./handleNoticeBot";

const chainInfor = common.forCustomChain(
    "mainnet",
    {
        name: "bnb",
        networkId: ENV === Environment.MAINNET ? 56 : 97,
        chainId: ENV === Environment.MAINNET ? 56 : 97
    },
    "petersburg"
);

export const normalBidAuction = async (bidAuctions: BidAuction[]) => {
    const serializedTxs: Buffer[] = [];
    for (const bidAuction of bidAuctions) {
        if (
            !bidAuction ||
            !bidAuction.profit ||
            !bidAuction.uptime ||
            !bidAuction.buyer ||
            !bidAuction.auctions ||
            !bidAuction.contractAddress ||
            !bidAuction.type ||
            !bidAuction.minGasPrice ||
            !bidAuction.auctions.length
        )
            return;
        const nowTime = Math.round(Date.now() / 1000);
        if (bidAuction.profit < 0 || nowTime - bidAuction.uptime > TIME_DELAY_BLOCK_BID) {
            console.log("Over time or profit < 0", nowTime);
            await noticeErrorBid(bidAuction);
            return;
        }
        if (!bidAuction.contractAddress || !bidAuction.buyer) return;
        const txData = getTxData(bidAuction);
        const rawTx = await getRawTx(bidAuction, txData); // await to get nonce
        const tx = new Transaction(rawTx, { common: chainInfor });
        tx.sign(privateKey(bidAuction.type));
        serializedTxs.push(tx.serialize());
    }
    await delay40Blocks(bidAuctions[0].uptime ?? 0);
    for (let i = 0; i < serializedTxs.length; i++) {
        if (i === serializedTxs.length - 1) {
            await sendTransaction(serializedTxs[i], bidAuctions[i]);
        } else {
            sendTransaction(serializedTxs[i], bidAuctions[i]);
        }
    }
};
function exit() {
    throw new Error("Processing exit");
}
