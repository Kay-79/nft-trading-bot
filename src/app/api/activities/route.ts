import { NextResponse } from "next/server";
import { RecentSoldDto } from "@/types/dtos/RecentSold.dto";
import { API_MOBOX } from "@/constants/constants";

export async function GET() {
    const activities: RecentSoldDto[] = [];
    const fetchPromises = [0].map(() =>
        fetch(`${API_MOBOX}/auction/logs_new?&page=1&limit=50`)
            .then(response => response.json())
            .then(data => {
                activities.push(...data.list);
            })
    );
    await Promise.all(fetchPromises);
    return NextResponse.json(activities);
}
