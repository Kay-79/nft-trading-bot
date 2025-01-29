import { archiveProvider } from "providers/archiveProvider";
import { AbiCoder } from "ethers";
import { USDT_ADDRESS } from "constants/constants";

const abiCoder = new AbiCoder();

export const getPriceMboxOnChain = async (block: number) => {
    const encodedData = abiCoder.encode(
        ["uint256", "address[]"],
        ["1000000000000000000", ["0x3203c9e46ca618c8c1ce5dc67e7e9d75f5da2377", USDT_ADDRESS]]
    );
    const data = "0xd06ca61f" + encodedData.slice(2);
    const result = await archiveProvider.call({
        to: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
        data: data,
        blockTag: block
    });
    const decodedResult = abiCoder.decode(["uint256[]"], result);
    console.log(decodedResult);
    return (Number(decodedResult[0][1]) / 10 ** 18)* 1.025;
};
