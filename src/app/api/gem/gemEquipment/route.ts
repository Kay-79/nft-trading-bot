import { NextResponse } from "next/server";
import { momo721 } from "@/utilsV2/momo721/utils";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tokenId = searchParams.get("tokenId");
        const gems = await momo721.getEquipmentMomo(tokenId || "0");
        return NextResponse.json(gems);
    } catch (error) {
        console.error("Error fetching accounts:", error);
        return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
    }
}
