import { connectMongo } from "@/utils/connectMongo";
import { archiveProvider } from "@/providers/archiveProvider";
import { sleep } from "@/utilsV2/common/sleep";
import { handleBidEvent, handleListingEvent } from "@/utilsV2/worker/utils";

const worker = async (startBlock: number, endBlock: number) => {
    const db = await connectMongo();
    console.log("Worker started");

    for (let currentBlock = startBlock; currentBlock <= endBlock; currentBlock++) {
        console.log("Processing block:", currentBlock);
        const filter = {
            fromBlock: currentBlock,
            toBlock: currentBlock
        };
        const logs = await archiveProvider.getLogs(filter);
        if (!logs.length) {
            console.log("No logs found for block:", currentBlock);
            continue;
        }
        for (const log of logs) {
            if (
                log.topics[0] ===
                "0x0512c533a1b2e5d56e859ca83a85832b35a81ea8c3fefa118ae718e3e4c53d05"
            ) {
                // Handle bid event
                console.log("Bid event detected");
                await handleBidEvent(db, log);
            } else if (
                log.topics[0] ===
                "0x11292b7e6e886f4104d7c2a4e909668c6544953163649b1864cec75cdde355c8"
            ) {
                // Handle listing event
                console.log("Listing event detected");
                await handleListingEvent(db, log);
            }
        }
        console.log("Block processed:", currentBlock);
        await sleep(1.5); // Add sleep to avoid rate limiting
    }
    console.log("Worker finished");
};

worker();
