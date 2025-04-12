import { MOMO1155_ADDRESS } from "../../constants/constants";
import { Momo1155Selector } from "../../enum/enum";
import { ethersProvider } from "../../providers/ethersProvider";
import { AbiCoder } from "ethers";

const test = async (id: string) => {
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(["uint256"], [id]);
    const data = Momo1155Selector.TEST + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MOMO1155_ADDRESS,
        data: data
    });
    const decodeData = abiCoder.decode(["string"], result);
    return decodeData;
};

export const momo1155 = {
    test
};
