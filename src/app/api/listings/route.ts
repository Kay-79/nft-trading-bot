import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/connectMongo";

export async function GET() {
    try {
        const db = await connectMongo();
        const listing = await db.collection("listings").find().toArray();
        return NextResponse.json(listing);
    } catch (error) {
        return NextResponse.json({ error });
    }
}
