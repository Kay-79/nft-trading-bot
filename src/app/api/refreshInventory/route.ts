import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/connectMongo";
import { momo721 } from "@/utilsV2/momo721/utils";

export async function POST(request: Request) {
    try {
        const { inventory } = await request.json();
        const momoInfo = await momo721.getMomoInfo(inventory.tokenId);
        inventory.prototype = Number(momoInfo.prototype);
        inventory.quality = Number(momoInfo.quality);
        inventory.category = Number(momoInfo.category);
        inventory.level = Number(momoInfo.level);
        inventory.specialty = Number(momoInfo.specialty);
        inventory.hashrate = Number(momoInfo.hashrate);
        inventory.lvHashrate = Number(momoInfo.lvHashrate);
        const db = await connectMongo();
        const collection = db.collection("inventories");
        await collection.updateOne(
            { id: inventory.id },
            {
                $set: {
                    prototype: inventory.prototype,
                    quality: inventory.quality,
                    category: inventory.category,
                    level: inventory.level,
                    specialty: inventory.specialty,
                    hashrate: inventory.hashrate,
                    lvHashrate: inventory.lvHashrate
                }
            }
        );
        return NextResponse.json({ message: "Listing updated successfully", data: inventory });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message });
        } else {
            return NextResponse.json({ error: "An unknown error occurred" });
        }
    }
}
