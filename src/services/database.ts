import { AuctionDto } from "@/types/dtos/Auction.dto";
import { InventoryDto } from "../types/dtos/Inventory.dto";
import { Db } from "mongodb";
import { isNormalAuction, isProAuction } from "@/utilsV2/find/utils";
import { InventoryType } from "@/enum/enum";
import { ChangeDto } from "@/types/worker/Change.dto";

const updateSynced = async (
    db: Db,
    blockNumber: number,
    transactionHash: string
): Promise<void> => {
    try {
        console.log("Updating synced block...");
        await db
            .collection("synced")
            .updateOne({}, { $set: { block: blockNumber, tx: transactionHash } }, { upsert: true });
        console.log(`Synced block updated successfully`);
    } catch (error) {
        throw new Error(`Error updating synced block: ${error}`);
    }
};

const createOrIncreaseInventories = async (
    db: Db,
    inventories: InventoryDto[],
    blockNumber: number,
    transactionHash: string
): Promise<void> => {
    try {
        console.log("Updating inventories...");
        for (const inventory of inventories) {
            const type = inventory.type;
            const existingInventory = await db.collection("inventories").findOne({
                id: inventory.id,
                prototype: inventory.prototype,
                owner: inventory.owner,
                type
            });
            if (existingInventory) {
                await db.collection("inventories").updateOne(
                    {
                        id: inventory.id,
                        prototype: inventory.prototype,
                        owner: inventory.owner,
                        type
                    },
                    { $inc: { amount: inventory.amount } }
                );
                console.log(`Inventory ${inventory.id} amount incremented successfully`);
            } else {
                await db.collection("inventories").updateOne(
                    {
                        id: inventory.id,
                        prototype: inventory.prototype,
                        owner: inventory.owner,
                        type
                    },
                    { $set: { ...inventory } },
                    { upsert: true }
                );
                console.log(`Inventory ${inventory.id} updated successfully`);
            }
        }
        await updateSynced(db, blockNumber, transactionHash);
    } catch (error) {
        throw new Error(`Error updating inventories: ${error}`);
    }
};

const deleteOrDecreaseInventories = async (
    db: Db,
    listings: AuctionDto[],
    blockNumber: number,
    transactionHash: string
): Promise<void> => {
    try {
        console.log("Updating inventories...");
        for (const listing of listings) {
            if (isProAuction(listing)) {
            } else if (isNormalAuction(listing)) {
                const ids = listing.ids || [];
                const amounts = listing.amounts || [];
                for (let i = 0; i < ids.length; i++) {
                    const inventory = await db.collection("inventories").findOne({
                        id: `${listing.auctor}_${ids[i]}_${listing.tokenId}`,
                        prototype: ids[i],
                        owner: listing.auctor,
                        type: InventoryType.NORMAL
                    });
                    if (inventory) {
                        if (inventory.amount > amounts[i]) {
                            await db.collection("inventories").updateOne(
                                {
                                    id: `${listing.auctor}_${ids[i]}_${listing.tokenId}`,
                                    prototype: ids[i],
                                    owner: listing.auctor,
                                    type: InventoryType.NORMAL
                                },
                                { $inc: { amount: -amounts[i] } }
                            );
                            console.log(
                                `Inventory ${listing.auctor}_${ids[i]}_${listing.tokenId} amount decremented successfully`
                            );
                        } else {
                            await db.collection("inventories").deleteOne({
                                id: `${listing.auctor}_${ids[i]}_${listing.tokenId}`,
                                prototype: ids[i],
                                owner: listing.auctor,
                                type: InventoryType.NORMAL
                            });
                            console.log(
                                `Inventory ${listing.auctor}_${ids[i]}_${listing.tokenId} deleted successfully`
                            );
                        }
                    }
                }
            }
        }
        await updateSynced(db, blockNumber, transactionHash);
    } catch (error) {
        throw new Error(`Error updating inventories: ${error}`);
    }
};

const createListings = async (
    db: Db,
    listings: AuctionDto[],
    blockNumber: number,
    transactionHash: string
): Promise<void> => {
    try {
        console.log("Updating listings...");
        for (const listing of listings) {
            const existingListing = await db.collection("listings").findOne({
                id: listing.id,
                auctor: listing.auctor,
                tokenId: listing.tokenId
            });
            if (existingListing) {
                await db.collection("listings").updateOne(
                    {
                        id: listing.id,
                        auctor: listing.auctor,
                        tokenId: listing.tokenId
                    },
                    { $set: { ...listing } }
                );
                console.log(`Listing ${listing.id} updated successfully`);
            } else {
                await db.collection("listings").updateOne(
                    {
                        id: listing.id,
                        auctor: listing.auctor,
                        tokenId: listing.tokenId
                    },
                    { $set: { ...listing } },
                    { upsert: true }
                );
                console.log(`Listing ${listing.id} inserted successfully`);
            }
        }
        await updateSynced(db, blockNumber, transactionHash);
    } catch (error) {
        throw new Error(`Error updating listings: ${error}`);
    }
};

const updateListing = async (
    db: Db,
    change: ChangeDto,
    blockNumber: number,
    transactionHash: string
): Promise<void> => {
    try {
        console.log("Updating listing...");
        const existingListing = (await db.collection("listings").findOne({
            id: change.id,
            index: change.index
        })) as AuctionDto | null;
        if (existingListing) {
            await db.collection("listings").updateOne(
                {
                    id: change.id
                },
                {
                    $set: {
                        startPrice: change.startPrice,
                        endPrice: change.endPrice,
                        nowPrice: change.startPrice,
                        durationDays: change.durationDays,
                        uptime: change.newStartTime
                    }
                }
            );
            console.log(`Listing ${change.id} updated successfully`);
        } else {
            console.log(`Listing ${change.id} not found`);
        }
        await updateSynced(db, blockNumber, transactionHash);
    } catch (error) {
        throw new Error(`Error updating listing: ${error}`);
    }
};

const deleteListing = async (
    db: Db,
    id: string,
    blockNumber: number,
    transactionHash: string
): Promise<void> => {
    try {
        console.log("Deleting listing...");
        await db.collection("listings").deleteOne({ id: id });
        console.log(`Listing ${id} deleted successfully`);
        await updateSynced(db, blockNumber, transactionHash);
    } catch (error) {
        throw new Error(`Error deleting listing: ${error}`);
    }
};

export const databaseService = {
    //Sync
    // updateSynced,

    //Inventory
    createOrIncreaseInventories,
    deleteOrDecreaseInventories,
    //Listing
    createListings,
    updateListing,
    deleteListing
};
