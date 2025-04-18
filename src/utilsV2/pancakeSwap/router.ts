import { USDT_ADDRESS, WBNB_ADDRESS } from "@/constants/constants";
import { ethersProvider } from "@/providers/ethersProvider";
import { AbiCoder, ethers } from "ethers";

const abiCoder = new AbiCoder();

/**
 * @description Get the price of token on-chain using the PancakeSwap router
 * @param tokenAddress The address of the token to get the price for
 * @param routerAddress The address of the PancakeSwap router
 * @returns The price of the token in USDT
 * @throws {Error} If the token address is invalid or if the call fails
 */
export const getPriceOnChain = async (
    tokenAddress: string,
    routerAddress: string
): Promise<number> => {
    const decimalsToken = 18;
    const amountIn = ethers.parseUnits("1", decimalsToken);

    const fetchPrice = async (path: string[]): Promise<number> => {
        const encodedData = abiCoder.encode(["uint256", "address[]"], [amountIn, path]);
        const data = "0xd06ca61f" + encodedData.slice(2); // 0xd06ca61f is the function selector for getAmountsOut
        try {
            const result = await ethersProvider.call({
                to: routerAddress,
                data: data
            });
            const decodedResult = abiCoder.decode(["uint256[]"], result);
            const price = Number(decodedResult[0][path.length - 1]) / 10 ** 18; // 18 decimals for USDT
            if (price > 0) {
                return price;
            } else {
                throw new Error("Price is zero or negative");
            }
        } catch {
            return NaN;
        }
    };

    for (const path of [
        [tokenAddress, USDT_ADDRESS],
        [tokenAddress, WBNB_ADDRESS, USDT_ADDRESS]
    ]) {
        const price = await fetchPrice(path);
        if (!isNaN(price)) return price;
    }
    return NaN;
};
