import { MP_ADDRESS, NORMAL_BUYER } from "@/constants/constants";
import { MpSelector } from "@/enum/enum";
import { ethersProvider } from "@/providers/ethersProvider";
import { databaseService } from "@/services/database";
import { InventoryDto } from "@/types/dtos/Inventory.dto";
import { closeMongoConnection, connectMongo } from "@/utils/connectMongo";
import { mpUtils } from "@/utilsV2/mp/utils";
import { stakingUtils } from "@/utilsV2/staking/utils";
import { AbiCoder } from "ethers";
const db = await connectMongo();

const deleteInventory = async (addressCheck: string) => {
    await databaseService.deleteInventoryUser(db, addressCheck);
};

/**
 * * Syncs the inventory of a given address by creating auction for all token IDs.
 * * @param {string} addressCheck - The address to sync the inventory for.
 * * @returns {Promise<void>} - A promise that resolves when the inventory sync is complete.
 * * @throws {Error} - Throws an error if the address is invalid or if the sync fails.
 */
// sync momo pro via momo721 utils (comming soon)
const syncInventoryNormal = async (
    addressCheck: string,
    totalHash: number,
    suggestIndex: number
): Promise<void> => {
    const amountKind = 60;
    const idsAll: number[] = [];
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 4; j++) {
            for (let k = 1; k <= amountKind; k++) {
                idsAll.push(i * 10000 + j * 1000 + k);
            }
        }
    }
    let totalMomoInInventory = 0;
    let countHashrate = 0;
    for (let o = 0; o < idsAll.length; o++) {
        const ids = [idsAll[o].toString()];
        let amountMomoInInventory = 0;
        while (true) {
            const amounts = [(amountMomoInInventory + 1).toString()];
            const abiCoder = new AbiCoder();
            const encodedData = abiCoder.encode(
                ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256[]", "uint256[]"],
                [
                    1000000000000000000n,
                    1000000000000000000n,
                    2,
                    suggestIndex.toString(),
                    0n,
                    ids,
                    amounts
                ]
            );
            const data = MpSelector.CREATE_AUCTION + encodedData.slice(2);
            const encodedDataExecute = abiCoder.encode(
                ["address", "uint256", "bytes"],
                [MP_ADDRESS, 0, data]
            );
            const dataExecute = MpSelector.EXECUTE + encodedDataExecute.slice(2);
            try {
                const estimatedGas = await ethersProvider.estimateGas({
                    to: addressCheck,
                    from: NORMAL_BUYER,
                    data: dataExecute
                });
                console.log("ID:", idsAll[o], "estimatedGas:", estimatedGas.toString());
                amountMomoInInventory++;
            } catch {
                console.error("EstimateGas failed for ID:", idsAll[o]);
                if (amountMomoInInventory > 0) {
                    totalMomoInInventory += amountMomoInInventory;
                    countHashrate += Math.floor(idsAll[o] / 10000) * amountMomoInInventory;
                    console.log("ID:", idsAll[o], "amountMomoInInventory:", amountMomoInInventory);
                    const newInventory: InventoryDto = {
                        id: `${addressCheck}_${idsAll[o]}_0`,
                        prototype: idsAll[o],
                        owner: addressCheck,
                        amount: amountMomoInInventory,
                        tokenId: 0,
                        quality: 1,
                        category: 1,
                        level: 1,
                        specialty: 1,
                        hashrate: Math.floor(idsAll[o] / 10000),
                        lvHashrate: Math.floor(idsAll[o] / 10000)
                    };
                    await databaseService.insertNewInventory(db, newInventory);
                }
                break;
            }
        }
        if (countHashrate >= totalHash) {
            break;
        }
    }
    console.log("Total Momo in Inventory:", totalMomoInInventory);
    await closeMongoConnection();
};

const syncInventory = async (addressCheck: string) => {
    addressCheck = addressCheck.toLowerCase();
    if (!addressCheck) {
        throw new Error("Please check your address!");
    }
    const totalHashrate = await stakingUtils.userHashrate(addressCheck);
    if (totalHashrate <= 0) {
        console.log(`User ${addressCheck} has no hashrate`);
        return;
    }
    console.log(`Syncing inventory for address: ${addressCheck}`);
    console.log(`Total hashrate: ${totalHashrate}`);
    const suggestIndex = await mpUtils.getNewIndex(addressCheck);
    if (suggestIndex >= 128) {
        console.log("Required index < 128, please check your address:", addressCheck);
        return;
    } else {
        console.log(`Deleting inventory for address: ${addressCheck}`);
        await deleteInventory(addressCheck);
    }
    await syncInventoryNormal(addressCheck, totalHashrate, suggestIndex);
    // await syncInventoryPro(addressCheck);
};

syncInventory("0x19De8F7bB60032b212d8Ed570fF97d60Fe52298F");
