import { traders } from "config/config";
import { MP_ADDRESS, TOPIC_BID } from "constants/constants";
import { fullNodeProvider } from "providers/fullNodeProvider";
import { byte32ToAddress } from "utilsV2/common/utils";
import { AbiCoder } from "ethers";
import { momo721 } from "utilsV2/momo721/utils";
import fs from "fs";
import { exit } from "process";
import { sleep } from "utilsV2/common/sleep";

const abiCoder = new AbiCoder();
const periodBlocks = 7776000; // 90 days

export const crawlingDatasetsRpc = async () => {
    let endBlock = await fullNodeProvider.getBlockNumber();
    // let startBlock = endBlock - periodBlocks;
    let startBlock = 38083619;
    while (startBlock < endBlock) {
        let datasets = "";
        const toBlock = startBlock + 5000;
        const filter = {
            address: [MP_ADDRESS],
            fromBlock: startBlock,
            toBlock: toBlock
        };
        const logs = await fullNodeProvider.getLogs(filter);
        for (const log of logs) {
            if (log.topics[0] !== TOPIC_BID) continue;
            if (
                traders.includes(byte32ToAddress(log.topics[2])) ||
                traders.includes(byte32ToAddress(log.topics[2]).toLocaleLowerCase())
            )
                continue;
            const decodedResult = abiCoder.decode(
                ["uint256", "uint256", "uint256", "uint256[]", "uint256[]", "uint256"],
                log.data
            );
            if (decodedResult[2] === 0n) continue;
            console.log("Processing", decodedResult);
            const block = await fullNodeProvider.getBlock(log.blockNumber);
            if (!block) continue;
            const timestamp = block.timestamp; // timestamp của block
            console.log("Block", log.blockNumber, "timestamp", block.timestamp);
            if (timestamp - Number(decodedResult[5]) < 1800) {
                console.log("Bid too fast");
                continue;
            }
            if (timestamp - Number(decodedResult[5]) > 24 * 3600) {
                console.log("Bid too slow");
                continue;
            }
            const momo721InforHistory = await momo721.getMomoInfoHistory(
                Number(decodedResult[2]).toString(),
                log.blockNumber
            );
            await sleep(1);
            if (momo721InforHistory.hashrate === 0n || momo721InforHistory.prototype === 6n)
                continue;
            if (Number(momo721InforHistory.prototype) >= 60000) {
                console.log("Legendary prototype is not allowed");
                continue;
            }
            const bidPrice = +(decodedResult[0].toString().slice(0, -9) / 1e9).toFixed(2);
            const dataset = {
                input: [
                    Number(momo721InforHistory.hashrate ?? 0),
                    Number(momo721InforHistory.lvHashrate ?? 0),
                    Math.floor(Number(momo721InforHistory.prototype ?? 0) / 1e4),
                    Number(momo721InforHistory.level ?? 0)
                ],
                output: [bidPrice]
            };
            datasets += JSON.stringify(dataset) + ",";
        }
        if (datasets.length > 0) {
            let existingData = [];
            const filePath = "./src/AI/data/datasets.json";

            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, "utf-8");
                existingData = fileContent.trim() ? JSON.parse(fileContent) : [];
            }

            const newData = JSON.parse(`[${datasets.slice(0, -1)}]`);
            const updatedData = existingData.concat(newData);

            fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
        }
        if (logs.length === 0) startBlock = toBlock + 1;
        else startBlock = logs[logs.length - 1].blockNumber + 1;
        console.log("Querying from block", startBlock, "to block", toBlock);
    }
    console.log("Done");
};
