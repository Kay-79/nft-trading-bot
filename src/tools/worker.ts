import { connectMongo } from "@/utils/connectMongo";
// import { sleep } from "@/utilsV2/common/sleep";
import {
    handleBidEvent,
    handleCancelEvent,
    handleChangeEvent,
    handleListingEvent
} from "@/utilsV2/worker/handleEvent";
import { fullNodeProvider } from "@/providers/fullNodeProvider";
import {
    MP_ADDRESS,
    TOPIC_BID,
    TOPIC_CANCEL,
    TOPIC_CHANGE,
    TOPIC_CREATE
} from "@/constants/constants";
import { sleep } from "@/utilsV2/common/sleep";
import { SyncedDto } from "@/types/dtos/Synced.dto";
import { AnalysisDto } from "@/types/dtos/Analysis.dto";
const step = 2000;

const worker = async () => {
    const db = await connectMongo();
    console.log("Worker started");
    const analysis = await db.collection("analysis").findOne({});
    if (!analysis) {
        console.log("No analysis found. Starting from block 0");
        const newAnalysis: AnalysisDto = {
            normal: {
                totalBuy: { amount: 0, value: 0 },
                totalSell: { amount: 0, value: 0 },
                totalCancel: { amount: 0, value: 0 }
            },
            pro: {
                totalBuy: { amount: 0, value: 0 },
                totalSell: { amount: 0, value: 0 },
                totalCancel: { amount: 0, value: 0 }
            }
        };
        await db.collection("analysis").insertOne(newAnalysis);
    }
    const synced = await db.collection("synced").findOne({});
    if (!synced) {
        console.log("No synced block found. Starting from block 0");
        const newSynced: SyncedDto = { block: 0, tx: "" };
        await db.collection("synced").insertOne(newSynced);
    } else {
        console.log("Starting from block:", synced.block);
    }
    let startBlock = synced ? synced.block : 0;
    while (true) {
        const endBlock = await fullNodeProvider.getBlockNumber();
        console.log("Syncing blocks:", startBlock, "to", endBlock);
        for (let currentBlock = startBlock; currentBlock <= endBlock; currentBlock += step) {
            console.log("Processing blocks:", currentBlock, "to", currentBlock + step - 1);
            const filter = {
                address: [MP_ADDRESS],
                fromBlock: currentBlock,
                toBlock: currentBlock + step - 1
            };
            const logs = await fullNodeProvider.getLogs(filter);
            if (!logs.length) {
                console.log(
                    "No logs found for blocks:",
                    currentBlock,
                    "to",
                    currentBlock + step - 1
                );
                continue;
            }
            for (const log of logs) {
                switch (log.topics[0]) {
                    case TOPIC_BID:
                        await handleBidEvent(db, log);
                        break;
                    case TOPIC_CREATE:
                        await handleListingEvent(db, log);
                        break;
                    case TOPIC_CHANGE:
                        await handleChangeEvent(db, log);
                        break;
                    case TOPIC_CANCEL:
                        await handleCancelEvent(db, log);
                        break;
                    default:
                        break;
                }
            }
            console.log("Blocks processed:", currentBlock, "to", currentBlock + step - 1);
            startBlock = logs[logs.length - 1].blockNumber + 1;
        }
        await sleep(30);
    }
};

worker();
