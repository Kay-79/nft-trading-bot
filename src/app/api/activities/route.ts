import { NextResponse } from "next/server";
import { RecentSold } from "@/types/dtos/RecentSold.dto";
import { PRO_BUYER } from "@/constants/constants";

export async function GET() {
    const activities: RecentSold[] = [];
    const fetchPromises = [0].map(() =>
        fetch(`https://nftapi.mobox.io/auction/logs_new/${PRO_BUYER}?&page=1&limit=50`)
            .then(response => response.json())
            .then(data => {
                activities.push(...data.list);
            })
    );

    await Promise.all(fetchPromises);

    return NextResponse.json(activities);
}
