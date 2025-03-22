import { NextResponse } from "next/server";
import { getMboxPriceAndRewardDelay5m, predictModel } from "@/AI/utils";
import { PredictMode } from "@/enum/enum";

export async function POST(request: Request) {
    try {
        const { hashrate, lvHashrate, prototype, level } = await request.json();
        const data = await getMboxPriceAndRewardDelay5m();
        const mboxPrice = data.mboxPrice;
        const reward = data.reward;
        const input = [
            hashrate,
            lvHashrate,
            Math.floor(prototype / 10 ** 4),
            level,
            Math.floor(Date.now() / 1000),
            mboxPrice,
            reward
        ];
        const prediction = await predictModel(input, PredictMode.ONE);
        return NextResponse.json({ prediction: prediction[0] });
    } catch {
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}
