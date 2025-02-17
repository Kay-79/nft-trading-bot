import { NextResponse } from "next/server";
import { AuctionDto } from "@/types/dtos/Auction.dto";

const listings: AuctionDto[] = [
    // Sample data
    {
        id: "1",
        auctor: "User1",
        startPrice: 100,
        endPrice: 200,
        durationDays: 7,
        // ...other fields
    },
    {
        id: "2",
        auctor: "User2",
        startPrice: 150,
        endPrice: 250,
        durationDays: 5,
        // ...other fields
    },
    // Add more sample data as needed
];

export async function GET() {
    return NextResponse.json(listings);
}
