import { BidStatus } from "../../enum/enum";
import { ethersProvider } from "../../providers/ethersProvider";
import { BidAuction } from "../../types/bid/BidAuction";
import { noticeProfitAuction } from "./handleNoticeBot";

export const sendTransaction = async (serializedTx: Buffer, bidAuction: BidAuction) => {
    try {
        const txHash = await ethersProvider.send("eth_sendRawTransaction", [
            "0x" + serializedTx.toString("hex")
        ]);
        const receipt = await ethersProvider.waitForTransaction(txHash);
        if (!receipt) {
            await noticeProfitAuction(bidAuction, BidStatus.FAILED, "");
            return;
        }
        if (receipt.status === 0) {
            await noticeProfitAuction(bidAuction, BidStatus.FAILED, txHash);
            return;
        }
        await noticeProfitAuction(bidAuction, BidStatus.SUCCESS, txHash);
    } catch (error) {
        console.error("Error send transaction", error);
        await noticeProfitAuction(bidAuction, BidStatus.FAILED, "");
    }
};
