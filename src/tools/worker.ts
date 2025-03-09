import { connectMongo } from "@/utils/connectMongo";
import { sleep } from "@/utilsV2/common/sleep";
import { handleBidEvent, handleListingEvent } from "@/utilsV2/worker/utils";
import { fullNodeProvider } from "@/providers/fullNodeProvider";
import { TOPIC_BID, TOPIC_CREATE } from "@/constants/constants";
const step = 100;

const worker = async () => {
    const db = await connectMongo();
    console.log("Worker started");
    const syncedBlock = await db.collection("syncedBlock").findOne({});
    if (!syncedBlock) {
        console.log("No synced block found. Starting from block 0");
        await db.collection("syncedBlock").insertOne({ syncedBlock: 0 });
    } else {
        console.log("Starting from block:", syncedBlock.syncedBlock);
    }
    const startBlock = syncedBlock ? syncedBlock.syncedBlock : 0;
    const endBlock = await fullNodeProvider.getBlockNumber();

    while (true) {
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
                if (log.topics[0] === TOPIC_BID) {
                    // Handle bid event
                    console.log("Bid event detected");
                    await handleBidEvent(db, log);
                } else if (log.topics[0] === TOPIC_CREATE) {
                    // Handle listing event
                    console.log("Listing event detected");
                    await handleListingEvent(db, log);
                }
            }
            console.log("Blocks processed:", currentBlock, "to", currentBlock + step - 1);
            await sleep(1.5); // Add sleep to avoid rate limiting
        }
        console.log("Sync completed. Waiting for 30 seconds before next run.");
        await sleep(30); // Wait for 30 seconds before the next run
    }
};

worker();
