import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/connectMongo";

export async function GET() {
    try {
        const db = await connectMongo();
        const inventory = await db.collection("inventory").find().toArray();
        console.log(inventory);
        return NextResponse.json({ data: inventory });
    } catch (error) {
        return NextResponse.json({ error });
    }
}
