import { Log } from "ethers";
import { Db } from "mongodb";
import { byte32ToAddress } from "../common/utils";
import { allContracts } from "@/config/config";
import { ethers } from "hardhat";
import {
    logBidToId,
    logBidToInventory,
    logCancelToId,
    logCancelToInventory,
    logChangeToChange,
    logCreateToListing
} from "./utils";
import { databaseService } from "@/services/database";
import { InventoryDto } from "@/types/dtos/Inventory.dto";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { ChangeDto } from "@/types/worker/Change.dto";

export const handleBidEvent = async (db: Db, log: Log) => {
    const buyer = byte32ToAddress(log.topics[2]);
    const seller = byte32ToAddress(log.topics[1]);
    if (allContracts.includes(buyer) || allContracts.includes(ethers.getAddress(buyer))) {
        const inventories: InventoryDto[] = logBidToInventory(buyer, log.data);
        await databaseService.createOrIncreaseInventories(
            db,
            inventories,
            log.blockNumber,
            log.transactionHash
        );
    }
    if (allContracts.includes(seller) || allContracts.includes(ethers.getAddress(seller))) {
        const id = logBidToId(seller, log.data);
        await databaseService.deleteListing(db, id, log.blockNumber, log.transactionHash);
    }
};

export const handleListingEvent = async (db: Db, log: Log) => {
    const auctor = byte32ToAddress(log.topics[1]);
    if (allContracts.includes(auctor) || allContracts.includes(ethers.getAddress(auctor))) {
        const listings: AuctionDto[] = logCreateToListing(auctor, log.data);
        await databaseService.createListings(db, listings, log.blockNumber, log.transactionHash);
        await databaseService.deleteOrDecreaseInventories(
            db,
            listings,
            log.blockNumber,
            log.transactionHash
        );
    }
};

export const handleChangeEvent = async (db: Db, log: Log) => {
    const auctor = byte32ToAddress(log.topics[1]);
    if (allContracts.includes(auctor) || allContracts.includes(ethers.getAddress(auctor))) {
        const changes: ChangeDto = logChangeToChange(auctor, log.data);
        await databaseService.updateListing(db, changes, log.blockNumber, log.transactionHash);
    }
};

export const handleCancelEvent = async (db: Db, log: Log) => {
    const auctor = byte32ToAddress(log.topics[1]);
    if (allContracts.includes(auctor) || allContracts.includes(ethers.getAddress(auctor))) {
        const id = logCancelToId(auctor, log.data);
        await databaseService.deleteListing(db, id, log.blockNumber, log.transactionHash);
        const inventories: InventoryDto[] = logCancelToInventory(auctor, log.data);
        await databaseService.createOrIncreaseInventories(
            db,
            inventories,
            log.blockNumber,
            log.transactionHash
        );
    }
};
