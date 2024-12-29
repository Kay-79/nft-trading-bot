import { MP_BLOCK_ADDRESS } from "../../constants/constants";
import { MpBlockSelector } from "../../enum/enum";
import { ethersProvider } from "../../providers/ethersProvider";
import { AbiCoder } from "ethers";
import { OrderInfo } from "../../types/dtos/OrderInfo.dto";

const getListedMomos = async (user: string) => {
    const abiCoder = new AbiCoder();
    const encodedAddress = abiCoder.encode(["address"], [user]);
    const data = MpBlockSelector.GET_LISTED_MOMOS + encodedAddress.slice(2);
    const result = await ethersProvider.call({
        to: MP_BLOCK_ADDRESS,
        data: data
    });
    const decodeData = abiCoder.decode(["uint256[]", "uint256[]", "uint256[]"], result);
    return decodeData.toString();
};

const getOrder = async (user: string, index: string): Promise<OrderInfo> => {
    const abiCoder = new AbiCoder();
    const encodedAddress = abiCoder.encode(["address", "uint256"], [user, index]);
    const data = MpBlockSelector.GET_ORDER + encodedAddress.slice(2);
    const result = await ethersProvider.call({
        to: MP_BLOCK_ADDRESS,
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
    let orderInforesult: OrderInfo = {
        status: decodeData[0],
        startPrice: decodeData[1],
        endPrice: decodeData[2],
        uptime: decodeData[3],
        durationDays: decodeData[4],
        tokenId: decodeData[5],
        ids: decodeData[6],
        amounts: decodeData[7]
    };
    return orderInforesult;
};

export const mpUtils = {
    getListedMomos,
    getOrder
};
