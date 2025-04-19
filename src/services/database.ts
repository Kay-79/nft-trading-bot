import { AuctionDto } from "@/types/dtos/Auction.dto";
import { InventoryDto } from "../types/dtos/Inventory.dto";
import { Db } from "mongodb";
import { isNormalAuction, isProAuction } from "@/utilsV2/find/utils";
import { ChangeDto } from "@/types/worker/Change.dto";
import { MomoType } from "@/enum/enum";
import { AnalysisDto } from "@/types/dtos/Analysis.dto";

const updateSyncedMp = async (
    db: Db,
    blockNumber: number,
    transactionHash: string
): Promise<void> => {
    try {
        if (transactionHash) {
            await db
                .collection("synced")
                .updateOne(
                    {},
                    { $set: { blockBot: blockNumber, tx: transactionHash } },
                    { upsert: true }
                );
        } else {
            await db
                .collection("synced")
                .updateOne({}, { $set: { blockBot: blockNumber } }, { upsert: true });
        }
    } catch (error) {
        throw new Error(`Error updating synced block: ${error}`);
    }
};
const updateSyncedAI = async (db: Db, blockNumber: number): Promise<void> => {
    try {
        await db
            .collection("synced")
            .updateOne({}, { $set: { blockAI: blockNumber } }, { upsert: true });
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
        for (const inventory of inventories) {
            const type = inventory.type;
            if (type === MomoType.NORMAL) {
                const existingInventory = await db.collection("inventories").findOne({
                    id: inventory.id
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
                    console.log(`Inventory amount incremented`);
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
                    console.log(`Inventory created`);
                }
            } else {
                await db.collection("inventories").updateOne(
                    {
                        id: inventory.id
                    },
                    { $set: { ...inventory } },
                    { upsert: true }
                );
                console.log(`Inventory created`);
            }
        }
        await updateSyncedMp(db, blockNumber, transactionHash);
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
        for (const listing of listings) {
            if (isProAuction(listing)) {
                const inventory = (await db.collection("inventories").findOne({
                    id: `${listing.auctor}_99999_${listing.tokenId}`
                })) as InventoryDto | null;
                if (inventory) {
                    if (inventory.amount !== undefined && inventory.amount > 1) {
                        await db.collection("inventories").updateOne(
                            {
                                id: `${listing.auctor}_99999_${listing.tokenId}`
                            },
                            { $inc: { amount: -1 } }
                        );
                        console.log(`Inventory amount decremented`);
                    } else {
                        await db.collection("inventories").deleteOne({
                            id: `${listing.auctor}_99999_${listing.tokenId}`
                        });
                        console.log(`Inventory deleted`);
                    }
                }
            } else if (isNormalAuction(listing)) {
                const ids = listing.ids || [];
                const amounts = listing.amounts || [];
                for (let i = 0; i < ids.length; i++) {
                    const inventory = (await db.collection("inventories").findOne({
                        id: `${listing.auctor}_${ids[i]}_${listing.tokenId}`
                    })) as InventoryDto | null;
                    if (inventory) {
                        if (
                            inventory.amount !== undefined &&
                            inventory.amount > Number(amounts[i])
                        ) {
                            await db.collection("inventories").updateOne(
                                {
                                    id: `${listing.auctor}_${ids[i]}_${listing.tokenId}`
                                },
                                { $inc: { amount: -Number(amounts[i]) } }
                            );
                            console.log(`Inventory amount decremented`);
                        } else {
                            await db.collection("inventories").deleteOne({
                                id: `${listing.auctor}_${ids[i]}_${listing.tokenId}`
                            });
                            console.log(`Inventory deleted`);
                        }
                    }
                }
            }
        }
        await updateSyncedMp(db, blockNumber, transactionHash);
    } catch (error) {
        throw new Error(`Error updating inventories: ${error}`);
    }
};

const deleteInventoryUser = async (db: Db, address: string): Promise<void> => {
    try {
        await db.collection("inventories").deleteMany({ owner: address });
        console.log(`Inventory deleted`);
    } catch (error) {
        throw new Error(`Error deleting inventory: ${error}`);
    }
};

const insertNewInventory = async (db: Db, inventory: InventoryDto): Promise<void> => {
    try {
        const existingInventory = await db.collection("inventories").findOne({
            id: inventory.id,
            prototype: inventory.prototype,
            owner: inventory.owner,
            type: inventory.type
        });
        if (existingInventory) {
            await db
                .collection("inventories")
                .updateOne({ ...inventory }, { $set: { ...inventory } });
            console.log(`Inventory updated`);
        } else {
            await db.collection("inventories").insertOne({ ...inventory });
            console.log(`Inventory created`);
        }
    } catch (error) {
        throw new Error(`Error: ${error}`);
    }
};

const createListings = async (
    db: Db,
    listings: AuctionDto[],
    blockNumber: number,
    transactionHash: string
): Promise<void> => {
    try {
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
                console.log(`Listing updated`);
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
                console.log(`Listing created`);
            }
        }
        await updateSyncedMp(db, blockNumber, transactionHash);
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
            console.log(`Listing updated`);
        } else {
            console.log(`Listing ${change.id} not found`);
        }
        await updateSyncedMp(db, blockNumber, transactionHash);
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
        await db.collection("listings").deleteOne({ id: id });
        console.log(`Listing deleted`);
        await updateSyncedMp(db, blockNumber, transactionHash);
    } catch (error) {
        throw new Error(`Error deleting listing: ${error}`);
    }
};

const updateAnalysis = async (db: Db, analysis: AnalysisDto): Promise<void> => {
    try {
        const existingAnalysis = (await db.collection("analysis").findOne({
            id: analysis.id
        })) as AnalysisDto | null;
        if (existingAnalysis) {
            await db.collection("analysis").updateOne(
                {
                    id: analysis.id
                },
                {
                    $set: {
                        totalBid: existingAnalysis.totalBid + analysis.totalBid,
                        totalSell: existingAnalysis.totalSell + analysis.totalSell,
                        countBid: existingAnalysis.countBid + analysis.countBid,
                        countSold: existingAnalysis.countSold + analysis.countSold,
                        countChange: existingAnalysis.countChange + analysis.countChange,
                        countCancel: existingAnalysis.countCancel + analysis.countCancel
                    }
                }
            );
            console.log(`Analysis updated`);
        } else {
            await db.collection("analysis").updateOne(
                {
                    id: analysis.id
                },
                { $set: { ...analysis } },
                { upsert: true }
            );
            console.log(`Analysis created`);
        }
    } catch {}
};

export const databaseService = {
    //Sync
    updateSyncedMp,
    updateSyncedAI,
    //Inventory
    createOrIncreaseInventories,
    deleteOrDecreaseInventories,
    deleteInventoryUser,
    insertNewInventory,
    //Listing
    createListings,
    updateListing,
    deleteListing,
    //Analysis
    updateAnalysis
};
