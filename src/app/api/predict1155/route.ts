import { getPriceSuggestNormal } from "@/utilsV2/create/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { prototype } = await request.json();
        const prediction = await getPriceSuggestNormal(prototype);
        return NextResponse.json({ prediction: prediction });
    } catch {
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}
