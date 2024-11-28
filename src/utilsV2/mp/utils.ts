import { MP_ADDRESS } from "../../constants/constants";
import { MpSelector } from "../../enum/enum";
import { ethersProvider } from "../../providers/ethersProvider";
import { AbiCoder } from "ethers";

const getListedMomos = async (user: string) => {
    const abiCoder = new AbiCoder();
    const encodedAddress = abiCoder.encode(["address"], [user]);
    const data = MpSelector.GET_LISTED_MOMOS + encodedAddress.slice(2);
    const result = await ethersProvider.call({
        to: MP_ADDRESS,
        data: data
    });
    console.log("result", result);
    console.log("========================");
    const decodeData = abiCoder.decode(["uint256[]", "uint256[]", "uint256[]"], result);
    return decodeData.toString();
};

const getOrder = async (user: string, index: string) => {
    const abiCoder = new AbiCoder();
    const encodedAddress = abiCoder.encode(["address", "uint256"], [user, index]);
    const data = MpSelector.GET_ORDER + encodedAddress.slice(2);
    const result = await ethersProvider.call({
        to: MP_ADDRESS,
        data: data
    });
    const decodeData = abiCoder.decode(
        [
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256[]",
            "uint256[]"
        ],
        result
    );
    return decodeData;
};
export const mpUtils = {
    getListedMomos,
    getOrder
};
