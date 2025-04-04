import { getPriceSuggestNormal } from "@/utilsV2/create/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { ids, amounts } = await request.json();
        // const prediction = await getPriceSuggestNormal(prototype);
        let totalPredict = 0;
        for (let i = 0; i < ids.length; i++) {
            const prototype = ids[i];
            const prediction = await getPriceSuggestNormal(prototype);
            totalPredict += prediction * amounts[i];
        }
        return NextResponse.json({ prediction: totalPredict });
    } catch {
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}
