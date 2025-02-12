import { MINT_MOMO_ADDRESS } from "@/constants/constants";
import { MintMomoSelector } from "@/enum/enum";
import { ethersProvider } from "@/providers/ethersProvider";
import { byte32ToAddress } from "@/utilsV2/common/utils";

const test = async () => {
    const data = MintMomoSelector.TEST; // + encodedData.slice(2);
    const result = await ethersProvider.call({
        to: MINT_MOMO_ADDRESS,
        data: data
    });
    return byte32ToAddress(result);
};

export const mintMomo = {
    test
};
