import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/connectMongo";
import { momo721 } from "@/utilsV2/momo721/utils";

export async function POST(request: Request) {
    try {
        const { listing } = await request.json();
        const momoInfo = await momo721.getMomoInfo(listing.tokenId);
        listing.prototype = Number(momoInfo.prototype);
        listing.quality = Number(momoInfo.quality);
        listing.category = Number(momoInfo.category);
        listing.level = Number(momoInfo.level);
        listing.specialty = Number(momoInfo.specialty);
        listing.hashrate = Number(momoInfo.hashrate);
        listing.lvHashrate = Number(momoInfo.lvHashrate);
        const db = await connectMongo();
        const collection = db.collection("listings");
        await collection.updateOne({ _id: listing._id }, { $set: listing });
        return NextResponse.json({ message: "Listing updated successfully", data: listing });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message });
        } else {
            return NextResponse.json({ error: "An unknown error occurred" });
        }
    }
}
