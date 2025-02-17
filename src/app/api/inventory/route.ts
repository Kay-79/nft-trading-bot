import { NextResponse } from "next/server";
import { Momo721 } from "@/types/dtos/Momo721";

const inventory: Momo721[] = [
    // Sample data
    {
        tokenId: 1,
        prototype: 101,
        hashrate: 50,
        level: 2,
        quality: 3
        // ...other fields
    },
    {
        tokenId: 2,
        prototype: 102,
        hashrate: 60,
        level: 3,
        quality: 4
        // ...other fields
    }
    // Add more sample data as needed
];

export async function GET() {
    return NextResponse.json(inventory);
}
