import { NextResponse } from "next/server";
import { RecentSold } from "@/types/dtos/RecentSold.dto";

const activities: RecentSold[] = [
    // Sample data
    {
        auctor: "User1",
        bidder: "UserA",
        bidPrice: 120,
        tx: "0x123",
        // ...other fields
    },
    {
        auctor: "User2",
        bidder: "UserB",
        bidPrice: 180,
        tx: "0x456",
        // ...other fields
    },
    // Add more sample data as needed
];

export async function GET() {
    return NextResponse.json(activities);
}
