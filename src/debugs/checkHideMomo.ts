import { CHANGER } from "@/constants/constants";
import { MpSelector } from "@/enum/enum";
import { ethersProvider } from "@/providers/ethersProvider";
import { AbiCoder } from "ethers";

const checkHideMomo = async () => {
    const idsAll: number[] = [];
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 4; j++) {
            for (let k = 1; k <= 60; k++) {
                idsAll.push(i * 10000 + j * 1000 + k);
            }
        }
    }
    for (let o = 0; o < idsAll.length; o++) {
        const suggestIndex = 127;
        const tokenId: number[] = [];
        const ids = [idsAll[o]];
        const prices721: number[] = ids.map(() => 0); // Ensure prices721 matches the length of ids
        const prices1155 = ids.map(() => "1000000000000000000"); // Ensure prices1155 matches the length of ids
        const abiCoder = new AbiCoder();
        const encodedData = abiCoder.encode(
            ["uint256", "uint256[]", "uint256[]", "uint256[]", "uint256[]"],
            [suggestIndex, tokenId, prices721, ids, prices1155]
        );
        const data = MpSelector.CREATE_AUCTION_BATCH + encodedData.slice(2);
        console.log(data);
        const decodedResult = abiCoder.decode(
            ["uint256", "uint256[]", "uint256[]", "uint256[]", "uint256[]"],
            encodedData
        );
        console.log(decodedResult);
        try {
            const estimatedGas = await ethersProvider.estimateGas({
                to: "0x19De8F7bB60032b212d8Ed570fF97d60Fe52298F",
                from: CHANGER,
                data: data,
                gasLimit: (await ethersProvider.getBlock("latest"))?.gasLimit ?? "0"
            });
            console.log(estimatedGas.toString());
        } catch (error) {
            console.log("Error: ", error);
            console.log("Error: ", idsAll[o]);
        }
    }
};

checkHideMomo();
