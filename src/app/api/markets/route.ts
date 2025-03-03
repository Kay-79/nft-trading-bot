import { NextResponse } from "next/server";
import { AuctionDto } from "@/types/dtos/Auction.dto";

export async function GET() {
    const markets: AuctionDto[] = [];
    const fetchPromises = [0].map(() =>
        fetch(
            `https://nftapi.mobox.io/auction/search_v2/BNB?page=1&limit=30&category=&vType=&sort=-time&pType=`
        )
            .then(response => response.json())
            .then(data => {
                markets.push(...data.list);
            })
    );

    await Promise.all(fetchPromises);
    return NextResponse.json(markets);
}
