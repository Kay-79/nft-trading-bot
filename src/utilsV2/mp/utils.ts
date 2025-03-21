import { MP_ADDRESS } from "@/constants/constants";
import { MpSelector } from "@/enum/enum";
import { archiveProvider } from "@/providers/archiveProvider";
import { ethersProvider } from "@/providers/ethersProvider";
import { OrderInfo } from "@/types/dtos/OrderInfo.dto";
import { AbiCoder } from "ethers";

const getListedProMomos = async (user: string): Promise<string[]> => {
    const abiCoder = new AbiCoder();
    const encodedAddress = abiCoder.encode(["address"], [user]);
    const data = MpSelector.GET_LISTED_MOMOS + encodedAddress.slice(2);
    const result = await ethersProvider.call({
        to: MP_ADDRESS,
        data: data
    });
    const decodeData = abiCoder.decode(["uint256[]", "uint256[]", "uint256[]"], result);
    return decodeData[2].toString().split(",");
};

const getOrder = async (user: string, index: string): Promise<OrderInfo> => {
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
    const orderInforesult: OrderInfo = {
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

const getOrderHistory = async (user: string, index: string, block: number): Promise<OrderInfo> => {
    const abiCoder = new AbiCoder();
    const encodedAddress = abiCoder.encode(["address", "uint256"], [user, index]);
    const data = MpSelector.GET_ORDER + encodedAddress.slice(2);
    const result = await archiveProvider.call({
        to: MP_ADDRESS,
        data: data,
        blockTag: block
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
    const orderInforesult: OrderInfo = {
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

const getNewIndex = async (user: string): Promise<number> => {
    const abiCoder = new AbiCoder();
    const encodedAddress = abiCoder.encode(["address"], [user]);
    const data = MpSelector.GET_SUGGEST_INDEX + encodedAddress.slice(2);
    const result = await ethersProvider.call({
        to: MP_ADDRESS,
        data: data
    });
    const decodeData = abiCoder.decode(["uint256"], result);
    return Number(decodeData[0]);
};

export const mpUtils = {
    getListedProMomos,
    getOrder,
    getOrderHistory,
    getNewIndex
};
