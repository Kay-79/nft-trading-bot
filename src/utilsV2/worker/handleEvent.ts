import { Log } from "ethers";
import { Db } from "mongodb";
import { byte32ToAddress } from "../common/utils";
import { contracts } from "@/config/config";
import { ethers } from "hardhat";
import { logBidToId, logBidToInventory, logCreateToListing } from "./utils";
import { databaseService } from "@/services/database";
import { InventoryDto } from "@/types/dtos/Inventory.dto";
import { AuctionDto } from "@/types/dtos/Auction.dto";

export const handleBidEvent = async (db: Db, log: Log) => {
    const buyer = byte32ToAddress(log.topics[2]);
    const seller = byte32ToAddress(log.topics[1]);
    if (contracts.includes(buyer) || contracts.includes(ethers.getAddress(buyer))) {
        const inventories: InventoryDto[] = logBidToInventory(buyer, log.data);
        await databaseService.createOrIncreaseInventories(db, inventories);
    }
    if (contracts.includes(seller) || contracts.includes(ethers.getAddress(seller))) {
        const id = logBidToId(seller, log.data);
        await databaseService.deleteListing(db, id);
    }
};

export const handleListingEvent = async (db: Db, log: Log) => {
    const auctor = byte32ToAddress(log.topics[1]);
    if (contracts.includes(auctor) || contracts.includes(ethers.getAddress(auctor))) {
        const listings: AuctionDto[] = logCreateToListing(auctor, log.data);
        await databaseService.updateListings(db, listings);
        await databaseService.deleteOrDecreaseInventories(db, listings);
    }
};

export const handleChangeEvent = async (db: Db, log: Log) => {
    // Update listing in database
    console.log("Change event detected");
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
