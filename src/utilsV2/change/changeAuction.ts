import { AuctionDto } from "@/types/dtos/Auction.dto";
import { shortenNumber } from "@/utils/shorten";
import { getSerializedChangeTx } from "./utils";
import { ethersProvider } from "@/providers/ethersProvider";

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
            return;
        }
        console.log(`Change auction ${auction.prototype} success`);
    } catch (error) {
        console.error("Error send transaction", error);
    }
};
