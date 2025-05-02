import { buildInputVector, predictModelOne } from "@/AI/utils";
import { CACHE_TIER_PRICE } from "@/constants/constants";
import { getPriceSuggestNormal } from "@/utilsV2/create/utils";
import { getTierPrice } from "@/utilsV2/find/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { activity } = await request.json();
        if (activity === null) {
            return NextResponse.json(
                { error: "Invalid input: All fields are required." },
                { status: 400 }
            );
        }
        if (activity.type === 1 || activity.type === 0) {
            let predictPrice = 0;
            for (const activityToken of activity.tokens) {
                if (
                    !activityToken.prototype ||
                    !activityToken.hashrate ||
                    !activityToken.lvHashrate ||
                    !activityToken.level
                ) {
                    return NextResponse.json(
                        { error: "Invalid input: All fields are required." },
                        { status: 400 }
                    );
                }
                const input = await buildInputVector({
                    hashrate: activityToken.hashrate || 0,
                    lvHashrate: activityToken.lvHashrate || 0,
                    prototype: activityToken.prototype || 0,
                    level: activityToken.level || 0,
                    tokenId: activityToken.tokenId || 0
                });
                const prediction = await predictModelOne(input);
                predictPrice += prediction[0] || 0;
            }
            if (activity.type === 1) {
                const floorPrices = await getTierPrice(CACHE_TIER_PRICE);
                const crewPrice =
                    (floorPrices[1] + floorPrices[2] + floorPrices[2]) * activity.tokens.length;
                return NextResponse.json({ prediction: predictPrice + crewPrice });
            }
            return NextResponse.json({ prediction: predictPrice });
        }
        if (activity.tokens.length === 1) {
            const input = await buildInputVector({
                hashrate: activity.tokens[0].hashrate || 0,
                lvHashrate: activity.tokens[0].lvHashrate || 0,
                prototype: activity.tokens[0].prototype || 0,
                level: activity.tokens[0].level || 0,
                tokenId: activity.tokens[0].tokenId || 0
            });
            const prediction = await predictModelOne(input);
            console.log("prediction", prediction);
            return NextResponse.json({ prediction: prediction[0] });
        }
        if (activity.ids && activity.ids.length > 0) {
            let totalPredict = 0;
            for (let i = 0; i < activity.ids.length; i++) {
                const prototype = activity.ids[i];
                const prediction = await getPriceSuggestNormal(prototype);
                totalPredict += prediction * activity.amounts[i];
            }
            return NextResponse.json({ prediction: totalPredict });
        }
    } catch (error) {
        console.error("Error in POST /api/predictActivity:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}
