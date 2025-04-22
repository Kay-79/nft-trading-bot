import { NextResponse } from "next/server";
import { RecentSoldDto } from "@/types/dtos/RecentSold.dto";

export async function POST(request: Request) {
    const { address } = await request.json();
    const activities: RecentSoldDto[] = [];
    const fetchPromises = [0].map(() =>
        fetch(`https://nftapi.mobox.io/auction/logs_new/${address}?&page=1&limit=50`)
            .then(response => response.json())
            .then(data => {
                activities.push(...data.list);
            })
    );

    await Promise.all(fetchPromises);

    return NextResponse.json(activities);
}
