import { archiveProvider } from "providers/archiveProvider";
import { AbiCoder, ethers } from "ethers";
import { MBOX_ADDRESS, USDT_ADDRESS, WBNB_ADDRESS } from "constants/constants";

const abiCoder = new AbiCoder();

export const getPriceMboxOnChain = async (block: number) => {
    const amountIn = ethers.parseUnits("1", 18);
    const encodedData = abiCoder.encode(
        ["uint256", "address[]"],
        [amountIn, [MBOX_ADDRESS, USDT_ADDRESS]]
    );
    const data = "0xd06ca61f" + encodedData.slice(2);
    const result = await archiveProvider.call({
        to: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
        data: data,
        blockTag: block
    });
    const decodedResult = abiCoder.decode(["uint256[]"], result);
    return Number(decodedResult[0][1]) / 10 ** 18;
};
