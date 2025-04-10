import { NextResponse } from "next/server";
import { buildInputVector, predictModelOne } from "@/AI/utils";

export async function POST(request: Request) {
    try {
        const { hashrate, lvHashrate, prototype, level, tokenId } = await request.json();
        const input = await buildInputVector({
            hashrate: hashrate || 0,
            lvHashrate: lvHashrate || 0,
            prototype: prototype || 0,
            level: level || 0,
            tokenId: tokenId || 0
        });
        const prediction = await predictModelOne(input);
        return NextResponse.json({ prediction: prediction[0] });
    } catch {
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}
