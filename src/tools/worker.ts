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
    MP_BLOCK_ADDRESS,
    TOPIC_BID,
    TOPIC_CANCEL,
    TOPIC_CHANGE,
    TOPIC_CREATE
} from "@/constants/constants";
import { sleep } from "@/utilsV2/common/sleep";
import { SyncedDto } from "@/types/dtos/Synced.dto";
const step = 2000;

const worker = async () => {
    const db = await connectMongo();
    console.log("Worker started");
    while (true) {
        const synced = await db.collection("synced").findOne({});
        if (!synced) {
            console.log("No synced blockBot found. Starting from blockBot 0");
            const newSynced: SyncedDto = { blockBot: 0, blockAI: 0, tx: "" };
            await db.collection("synced").insertOne(newSynced);
        }
        let startBlock = synced ? synced.blockBot + 1 : 0;
        const endBlock = await fullNodeProvider.getBlockNumber();
        if (startBlock >= endBlock) {
            const synced = await db.collection("synced").findOne({});
            if (synced) {
                startBlock = synced.blockBot + 1;
            }
        }
        console.log("Syncing blocks:", startBlock, "to", endBlock);
        for (let currentBlock = startBlock; currentBlock <= endBlock; currentBlock += step) {
            console.log("Processing blocks:", currentBlock, "to", currentBlock + step - 1);
            const filter = {
                address: [MP_ADDRESS, MP_BLOCK_ADDRESS],
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
            startBlock = logs[logs.length - 1].blockNumber + 1;
        }
        const delay = 60;
        console.log(`Waiting for new blocks, sleeping for ${delay} seconds`);
        await sleep(delay);
    }
};

worker();
