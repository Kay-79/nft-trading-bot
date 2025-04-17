import { CHANGER } from "@/constants/constants";
import { MpSelector } from "@/enum/enum";
import { ethersProvider } from "@/providers/ethersProvider";
import { mpUtils } from "@/utilsV2/mp/utils";
import { AbiCoder } from "ethers";

const checkHideMomo = async (addressCheck: string) => {
    const idsAll: number[] = [];
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 4; j++) {
            for (let k = 1; k <= 60; k++) {
                idsAll.push(i * 10000 + j * 1000 + k);
            }
        }
    }
    const suggestIndex = await mpUtils.getNewIndex(addressCheck);
    if (suggestIndex === 128) {
        console.log("Error: suggestIndex is null");
        return;
    }
    for (let o = 0; o < idsAll.length; o++) {
        const tokenIds: number[] = [];
        const ids = [idsAll[o].toString()];
        const prices721s: number[] = [];
        const prices1155s = [1000000000000000000n];
        const abiCoder = new AbiCoder();
        const encodedData = abiCoder.encode(
            ["uint256", "uint256[]", "uint256[]", "uint256[]", "uint256[]"],
            [suggestIndex, tokenIds, prices721s, ids, prices1155s]
        );
        const data = MpSelector.CREATE_AUCTION_BATCH + encodedData.slice(2);
        try {
            const estimatedGas = await ethersProvider.estimateGas({
                to: addressCheck,
                from: CHANGER,
                data: data
            });
            console.log("ID:", idsAll[o], "estimatedGas:", estimatedGas.toString());
        } catch {
            console.error("EstimateGas failed for ID:", idsAll[o]);
        }
    }
};

checkHideMomo("0x19De8F7bB60032b212d8Ed570fF97d60Fe52298F");
