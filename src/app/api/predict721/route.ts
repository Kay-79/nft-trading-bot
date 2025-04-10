import { NextResponse } from "next/server";
import { getMboxPriceAndRewardDelay1Hour, predictModel } from "@/AI/utils";
import { PredictMode } from "@/enum/enum";
import { momo721 } from "@/utilsV2/momo721/utils";

export async function POST(request: Request) {
    try {
        const { hashrate, lvHashrate, prototype, level, tokenId } = await request.json();
        const cache = await getMboxPriceAndRewardDelay1Hour();
        const momoInfo = [hashrate, lvHashrate, Math.floor(prototype / 10 ** 4), level];
        const momoEquipment = await momo721.getEquipmentMomo(tokenId);
        const mboxPrice = cache.mboxPrice;
        const reward = cache.reward;
        const timestamp = Math.floor(Date.now() / 1000);
        const input = [...momoInfo, ...momoEquipment, mboxPrice, reward, timestamp];
        const prediction = await predictModel(input, PredictMode.ONE);
        return NextResponse.json({ prediction: prediction[0] });
    } catch {
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}
