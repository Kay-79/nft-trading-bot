import {
    CACHE_MBOX_PRICE,
    CACHE_REWARD_PER_1000_HASH,
    ENV,
    MP_ADDRESS,
    TOPIC_BID
} from "@/constants/constants";
import { fullNodeProvider } from "@/providers/fullNodeProvider";
import { byte32ToAddress, shortenNumber } from "@/utilsV2/common/utils";
import { AbiCoder } from "ethers";
import { momo721 } from "@/utilsV2/momo721/utils";
import fs from "fs";
import { Environment } from "@/enum/enum";
import { getPriceMboxOnChain } from "@/utilsV2/pancakeSwap/router";
import { stakingUtils } from "@/utilsV2/staking/utils";
import { sleep } from "@/utilsV2/common/sleep";
import { ethersProvider } from "@/providers/ethersProvider";

const abiCoder = new AbiCoder();

export const crawlingDatasetsRpc = async () => {
    if (ENV !== Environment.MAINNET) {
        console.log("Testnet not supported");
        return;
    }
    const endBlock = await fullNodeProvider.getBlockNumber();
    await sleep(1.5);
    const lastBlock = JSON.parse(fs.readFileSync("./src/AI/data/lastBlock.json", "utf-8"));
    let startBlock = lastBlock.lastBlock;
    const step = 1000;
    let cacheMboxPrice = CACHE_MBOX_PRICE;
    let cacheRewardPer1000Hash = CACHE_REWARD_PER_1000_HASH;
    while (startBlock < endBlock) {
        fs.writeFileSync(
            "./src/AI/data/lastBlock.json",
            JSON.stringify({ lastBlock: startBlock }, null, 2)
        );
        let datasets = "";
        const toBlock = startBlock + step;
        const filter = {
            address: [MP_ADDRESS],
            fromBlock: startBlock,
            toBlock: toBlock
        };
        const logs = await fullNodeProvider.getLogs(filter);
        await sleep(1.5);
        let rewardPer1000Hashrate = "";
        let mboxPriceHistory = "";
        for (const log of logs) {
            if (log.topics[0] !== TOPIC_BID) continue;
            const decodedResult = abiCoder.decode(
                ["uint256", "uint256", "uint256", "uint256[]", "uint256[]", "uint256"],
                log.data
            );
            if (decodedResult[2] === 0n) continue;
            console.log("Processing", decodedResult);
            const block = await ethersProvider.getBlock(log.blockNumber);
            await sleep(1.5);
            if (!block) continue;
            const timestamp = block.timestamp;
            const momo721InforHistory = await momo721.getMomoInfoHistory(
                Number(decodedResult[2]).toString(),
                log.blockNumber
            );
            if (mboxPriceHistory === "") {
                mboxPriceHistory = shortenNumber(
                    await getPriceMboxOnChain(log.blockNumber, cacheMboxPrice),
                    0,
                    4
                );
                cacheMboxPrice = Number(mboxPriceHistory);
            }
            await sleep(1.5);
            if (rewardPer1000Hashrate === "") {
                await sleep(1.5);
                rewardPer1000Hashrate = shortenNumber(
                    await stakingUtils.getRewardPer1000Hashrate(
                        log.blockNumber,
                        cacheRewardPer1000Hash
                    ),
                    0,
                    4
                );
                cacheRewardPer1000Hash = Number(rewardPer1000Hashrate);
            }
            await sleep(1.5);
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
                    Number(momo721InforHistory.level ?? 0),
                    timestamp,
                    Number(mboxPriceHistory),
                    Number(rewardPer1000Hashrate)
                ],
                output: [bidPrice],
                bidTime: timestamp,
                listTime: Number(decodedResult[5]),
                bidder: byte32ToAddress(log.topics[2]),
                auctor: byte32ToAddress(log.topics[1])
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
        console.log("Querying from block", startBlock, "to block", toBlock + step);
    }
    console.log("Done");
};

crawlingDatasetsRpc();
