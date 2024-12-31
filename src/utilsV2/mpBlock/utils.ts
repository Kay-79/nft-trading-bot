import { MP_BLOCK_ADDRESS } from "../../constants/constants";
import { MpBlockSelector } from "../../enum/enum";
import { ethersProvider } from "../../providers/ethersProvider";
import { AbiCoder } from "ethers";
import { OrderBlockInfo } from "types/dtos/OrderBlockInfo.dto";

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

const getOrderBlock = async (user: string, index: string): Promise<OrderBlockInfo> => {
    const abiCoder = new AbiCoder();
    const encodedAddress = abiCoder.encode(["address", "uint256"], [user, index]);
    const data = MpBlockSelector.GET_ORDER + encodedAddress.slice(2);
    const result = await ethersProvider.call({
        to: MP_BLOCK_ADDRESS,
        data: data
    });
    const decodeData = abiCoder.decode(
        [
            "uint256", //orderId
            "uint256", //price
            "uint256", // order status
            "uint256", // index
            "uint256", // uptime
            "uint256[]", //tokenIds
            "uint256[]" //ids
        ],
        result
    );
    let orderBlockInforesult: OrderBlockInfo = {
        orderId: decodeData[0],
        price: decodeData[1],
        status: decodeData[2],
        index: decodeData[3],
        uptime: decodeData[4],
        tokenIds: decodeData[5],
        ids: decodeData[6]
    };
    return orderBlockInforesult;
};

export const mpBlockUtils = {
    getListedMomos,
    getOrderBlock
};
