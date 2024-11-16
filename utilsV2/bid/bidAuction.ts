import { TIME_DELAY_BLOCK_BID } from "../../constans/constans";
import { contractProvider } from "../../providers/contractProvider";
import { ethersProvider } from "../../providers/ethersProvider";
import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionDto } from "../../types/dtos/Auction.dto";
import { sleep } from "../common/sleep";
import { Transaction } from "ethereumjs-tx";
import common from "ethereumjs-common";
import { ENVIROMENT } from "../../config/config";
import { Enviroment } from "../../enum/enum";
const privateKey = (type: string): Buffer => {
    if (type === "NORMAL" && process.env.PRIVATE_KEY_BID_MAINNET)
        return Buffer.from(process.env.PRIVATE_KEY_BID_MAINNET, "hex");
    if (type === "PRO" && process.env.PRIVATE_KEY_BID_PRO_MAINNET)
        return Buffer.from(process.env.PRIVATE_KEY_BID_PRO_MAINNET, "hex");
    throw new Error(`Invalid private key type: ${type}`);
};
interface RawTransaction {
    nonce: string;
    gasPrice: string;
    gasLimit: string;
    to: string;
    value: string;
    data: string;
}

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
        !bidAuction.type
    )
        return;
    const nowTime = Math.round(Date.now() / 1000);
    console.log("Now time:", nowTime);
    if (bidAuction.profit < 0 || nowTime - bidAuction.uptime > TIME_DELAY_BLOCK_BID) return;
    if (!bidAuction.contractAddress || !bidAuction.buyer) return;
    const nonce = await ethersProvider.getTransactionCount(bidAuction?.buyer);
    console.log("Nonce:", nonce);
    console.log(bidAuction.auctions.map((auction: AuctionDto) => auction.auctor).join(","));
    let txData = "";
    if (bidAuction.auctions.length === 1)
        txData = contractProvider.interface.encodeFunctionData(
            "bid(address,uint256,uint256,uint256)",
            [
                bidAuction.auctions[0].auctor,
                bidAuction.auctions[0].index,
                bidAuction.auctions[0].uptime,
                bidAuction.auctions[0].nowPrice
            ]
        );
    else
        txData = contractProvider.interface.encodeFunctionData(
            "bid(address,uint256,uint256,uint256)",
            [
                bidAuction.auctions.map((auction: AuctionDto) => auction.auctor),
                bidAuction.auctions.map((auction: AuctionDto) => auction.index),
                bidAuction.auctions.map((auction: AuctionDto) => auction.uptime),
                bidAuction.auctions.map((auction: AuctionDto) => auction.nowPrice)
            ]
        );
    console.log("txData:", txData);
    const txParams = {
        from: bidAuction.buyer,
        gas: "0x" + (1000000).toString(16),
        gasPrice: "0x" + (10000000000).toString(16),
        nonce: "0x" + nonce.toString(16),
        gasLimit: "0x" + (1000000).toString(16),
        to: bidAuction.contractAddress,
        value: "0x00",
        data: txData
    };
    console.log("txParams:", txParams);
    const rawTx: RawTransaction = {
        nonce: txParams.nonce,
        gasPrice: txParams.gasPrice,
        gasLimit: txParams.gasLimit,
        to: txParams.to,
        value: txParams.value,
        data: txParams.data
    };
    const tx = new Transaction(rawTx, { common: chainInfor });
    tx.sign(privateKey(bidAuction.type));
    const serializedTx = tx.serialize();

    console.log("Serialized tx:", serializedTx.toString("hex"));
    const sendTransaction = async () => {
        try {
            const txResponse = await ethersProvider.send("eth_sendRawTransaction", [
                "0x" + serializedTx.toString("hex")
            ]);
            console.log("Transaction hash:", txResponse.hash);
        } catch (error) {
            console.error("Error sending transaction:", error);
        }
    };

    await sendTransaction();
    await sleep(5);

    exit();
};
function exit() {
    throw new Error("Processing exit");
}
