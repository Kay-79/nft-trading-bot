import { buildInputVector, predictModelOne } from "@/AI/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { hashrate, lvHashrate, prototype, level, tokenId } = await request.json();
        console.log("Received input:", { hashrate, lvHashrate, prototype, level, tokenId });

        if (
            hashrate == null ||
            lvHashrate == null ||
            prototype == null ||
            level == null ||
            tokenId == null
        ) {
            return NextResponse.json(
                { error: "Invalid input: All fields are required." },
                { status: 400 }
            );
        }

        const input = await buildInputVector({
            hashrate: hashrate || 0,
            lvHashrate: lvHashrate || 0,
            prototype: prototype || 0,
            level: level || 0,
            tokenId: tokenId || 0
        });
        console.log("Input vector:", input);

        const prediction = await predictModelOne(input);
        console.log("Prediction result:", prediction);

        if (prediction.length === 0) {
            return NextResponse.json({ prediction: 0 });
        }
        return NextResponse.json({ prediction: prediction[0] });
    } catch (error) {
        console.error("Error in POST /api/predict721:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}
