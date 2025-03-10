import { connectMongo } from "@/utils/connectMongo";
// import { sleep } from "@/utilsV2/common/sleep";
import {
    handleBidEvent,
    handleChangeEvent,
    handleListingEvent
} from "@/utilsV2/worker/handleEvent";
import { fullNodeProvider } from "@/providers/fullNodeProvider";
import { TOPIC_BID, TOPIC_CHANGE, TOPIC_CREATE } from "@/constants/constants";
// import { exit } from "process";
const step = 1000;

const worker = async () => {
    const db = await connectMongo();
    console.log("Worker started");
    const synced = await db.collection("synced").findOne({});
    if (!synced) {
        console.log("No synced block found. Starting from block 0");
        await db.collection("synced").insertOne({ block: 0, tx: "" });
    } else {
        console.log("Starting from block:", synced.block);
    }
    // exit(0);
    let startBlock = synced ? synced.block : 0;
    while (true) {
        const endBlock = await fullNodeProvider.getBlockNumber();
        console.log("Syncing blocks:", startBlock, "to", endBlock);
        for (let currentBlock = startBlock; currentBlock <= endBlock; currentBlock += step) {
            console.log("Processing blocks:", currentBlock, "to", currentBlock + step - 1);
            const filter = {
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
                        // Handle bid event
                        console.log("Bid event detected");
                        await handleBidEvent(db, log);
                        break;
                    case TOPIC_CREATE:
                        // Handle listing event
                        console.log("Listing event detected");
                        await handleListingEvent(db, log);
                        break;
                    case TOPIC_CHANGE:
                        // Handle change event
                        console.log("Change event detected");
                        await handleChangeEvent(db, log);
                        break;
                    default:
                        break;
                }
            }
            console.log("Blocks processed:", currentBlock, "to", currentBlock + step - 1);
            startBlock = logs[logs.length - 1].blockNumber + 1;
        }
        console.log("Sync completed. Waiting for 30 seconds before next run.");
        // await sleep(60);
    }
};

worker();
