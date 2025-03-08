import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/connectMongo";

export async function GET() {
    try {
        const db = await connectMongo();
        const inventory = await db.collection("inventories").find().toArray();
        console.log(inventory);
        return NextResponse.json(inventory);
    } catch (error) {
        return NextResponse.json({ error });
    }
}
