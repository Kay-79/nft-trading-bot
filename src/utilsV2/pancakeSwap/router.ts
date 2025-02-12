import { MBOX_ADDRESS, USDT_ADDRESS } from "@/constants/constants";
import { archiveProvider } from "@/providers/archiveProvider";
import { ethersProvider } from "@/providers/ethersProvider";
import { AbiCoder, ethers } from "ethers";

const abiCoder = new AbiCoder();
/**
 * Get price of MBOX in USDT on chain
 * @param block
 * if block > 0, get price at block
 * if block <= 0, get price at latest block
 * @returns price of MBOX in USDT
 */
export const getPriceMboxOnChain = async (
    block: number,
    cacheMboxPrice: number
): Promise<number> => {
    const amountIn = ethers.parseUnits("1", 18);
    const encodedData = abiCoder.encode(
        ["uint256", "address[]"],
        [amountIn, [MBOX_ADDRESS, USDT_ADDRESS]]
    );
    const data = "0xd06ca61f" + encodedData.slice(2);
    let result = "";
    if (block > 0) {
        result = await archiveProvider.call({
            to: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
            data: data,
            blockTag: block
        });
    } else {
        try {
            result = await ethersProvider.call({
                to: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
                data: data
            });
        } catch (error) {
            console.log("error getPriceMboxOnChain", error);
            return cacheMboxPrice;
        }
    }
    const decodedResult = abiCoder.decode(["uint256[]"], result);
    return Number(decodedResult[0][1]) / 10 ** 18;
};
