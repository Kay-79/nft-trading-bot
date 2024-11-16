import { TIME_DELAY_BLOCK_BID } from "../../constans/constans";
import { BidAuction } from "../../types/bid/BidAuction";
import { Transaction } from "ethereumjs-tx";
import common from "ethereumjs-common";
import { ENVIROMENT } from "../../config/config";
import { Enviroment } from "../../enum/enum";
import { delay40Blocks, getRawTx, getTxData, privateKey, sendTransaction } from "./utils";

const chainInfor = common.forCustomChain(
    "mainnet",
    {
        name: "bnb",
        networkId: ENVIROMENT === Enviroment.MAINNET ? 56 : 97,
        chainId: ENVIROMENT === Enviroment.MAINNET ? 56 : 97
    },
    "petersburg"
);

export const bidAuction = async (bidAuction: BidAuction) => {
    console.log("Start bidAuction");
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
    if (bidAuction.profit < 0 || nowTime - bidAuction.uptime > TIME_DELAY_BLOCK_BID) return;
    if (!bidAuction.contractAddress || !bidAuction.buyer) return;
    const txData = getTxData(bidAuction);
    const rawTx = await getRawTx(bidAuction, txData);
    const tx = new Transaction(rawTx, { common: chainInfor });
    tx.sign(privateKey(bidAuction.type));
    const serializedTx = tx.serialize();
    await delay40Blocks(bidAuction.uptime);
    await sendTransaction(serializedTx);
};
function exit() {
    throw new Error("Processing exit");
}
