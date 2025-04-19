import { getPriceSuggestNormal } from "@/utilsV2/create/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { ids, amounts, prototype } = await request.json();
        if (ids == null || amounts == null || prototype == null) {
            return NextResponse.json(
                { error: "Invalid input: All fields are required." },
                { status: 400 }
            );
        }
        if (ids && ids.length > 0) {
            let totalPredict = 0;
            for (let i = 0; i < ids.length; i++) {
                const prototype = ids[i];
                const prediction = await getPriceSuggestNormal(prototype);
                totalPredict += prediction * amounts[i];
            }
            return NextResponse.json({ prediction: totalPredict });
        }
        if (prototype) {
            const prediction = await getPriceSuggestNormal(prototype);
            return NextResponse.json({ prediction: prediction });
        }
    } catch (error) {
        console.error("Error in predict1155 route:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}
