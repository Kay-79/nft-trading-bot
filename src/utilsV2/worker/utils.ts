import { Log } from "ethers";
import { Db } from "mongodb";

export const handleBidEvent = async (db: Db, log: Log) => {
    // Update inventory in database
    console.log("Bid event detected");
    console.log("Log data:", log.data);
    await db.collection("inventories").updateOne(
        {
            /* query criteria */
        },
        {
            $set: {
                /* updated fields based on event data */
            }
        }
    );
};

export const handleListingEvent = async (db: Db, log: Log) => {
    // Update listing in database
    console.log("Listing event detected");
    console.log("Log data:", log.data);
    await db.collection("listings").updateOne(
        {
            /* query criteria */
        },
        {
            $set: {
                /* updated fields based on event data */
            }
        }
    );
};
