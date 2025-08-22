import { getAllMyAuctions } from "@/utilsV2/change/getAllMyAuctions";
import { closeMongoConnection, connectMongo } from "@/utils/connectMongo";
import { AuctionDto } from "@/types/dtos/Auction.dto";

const fixListingsDB = async () => {
    const allListings: AuctionDto[] = await getAllMyAuctions();
    console.log("Fetched all listings:", allListings.length);
    if (!allListings || allListings.length === 0) {
        console.log("No listings found to update.");
        return;
    }
    allListings.forEach(listing => {
        listing.id = listing.id?.toLowerCase();
        listing.auctor = listing.auctor?.toLowerCase();
    });
    const db = await connectMongo();
    await db.collection("listings").deleteMany({});
    await db.collection("listings").insertMany(allListings);
    await closeMongoConnection();
    console.log("Listings updated successfully.");
};

fixListingsDB();
