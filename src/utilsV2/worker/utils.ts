import { Log } from "ethers";
import { Db } from "mongodb";

export const handleBidEvent = async (db: Db, log: Log) => {
    // Update inventory in database
    await db.collection("inventory").updateOne(
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
    await db.collection("listing").updateOne(
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
