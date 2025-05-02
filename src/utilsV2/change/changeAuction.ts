import { AuctionDto } from "@/types/dtos/Auction.dto";
import { shortenNumber } from "@/utils/shorten";
import { getSerializedChangeTx } from "./utils";
import { ethersProvider } from "@/providers/ethersProvider";
import { noticeBotChangeAuction } from "../bid/handleNoticeBot";

export const changeAuction = async (auction: AuctionDto, newPrice: number) => {
    const serializedChangeTx: Buffer = await getSerializedChangeTx(auction, newPrice);
    console.log(
        `Change auction ${auction.prototype} from ${shortenNumber(
            auction.nowPrice ?? 0,
            9,
            3
        )} to ${newPrice}`
    );
    try {
        const txHash = await ethersProvider.send("eth_sendRawTransaction", [
            "0x" + serializedChangeTx.toString("hex")
        ]);
        const receipt = await ethersProvider.waitForTransaction(txHash);
        if (!receipt) {
            console.log("Error send transaction change auction");
            return;
        }
        if (receipt.status === 0) {
            console.log("Error change auction, status: 0");
            await noticeBotChangeAuction(auction, newPrice, false);
            return;
        }
        console.log(`Change auction ${auction.prototype} success`);
        await noticeBotChangeAuction(auction, newPrice, true);
    } catch (error) {
        console.error("Error send transaction", error);
        await noticeBotChangeAuction(auction, newPrice, false);
    }
};
