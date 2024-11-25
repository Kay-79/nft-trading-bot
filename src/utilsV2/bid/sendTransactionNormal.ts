import { BidStatus } from "../../enum/enum";
import { ethersProvider } from "../../providers/ethersProvider";
import { BidAuction } from "../../types/bid/BidAuction";
import { noticeProfitAuction } from "./handleNoticeBot";

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export const sendTransaction = async (serializedTx: Buffer, bidAuction: BidAuction) => {
    try {
        const txResponse = await ethersProvider.send("eth_sendRawTransaction", [
            "0x" + serializedTx.toString("hex")
        ]);
        const receipt = await ethersProvider.send("eth_getTransactionReceipt", [txResponse]);
        if (!receipt) {
            await noticeProfitAuction(bidAuction, BidStatus.FAILED, "");
            return;
        }
        if (receipt.status === "0x0") {
            await noticeProfitAuction(bidAuction, BidStatus.FAILED, txResponse);
            return;
        }
        await noticeProfitAuction(bidAuction, BidStatus.SUCCESS, txResponse);
    } catch (error) {
        console.error("Error send transaction", error);
        await noticeProfitAuction(bidAuction, BidStatus.FAILED, "");
    }
};
