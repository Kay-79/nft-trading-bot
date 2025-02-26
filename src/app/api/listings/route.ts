import { NextResponse } from "next/server";
import { AuctionDto } from "@/types/dtos/Auction.dto";
// import { contracts } from "@/config/config";
// import { PRO_BUYER } from "@/constants/constants";

export async function GET() {
    const listings: AuctionDto[] = [];
    // console.log(`Fetching listings for contracts: ${contracts.join(", ")}`);
    // fetch(`https://nftapi.mobox.io/auction/list/BNB/${PRO_BUYER}?sort=-time&page=1&limit=128`)
    //     .then(response => response.json())
    //     .then(data => {
    //         listings.push(...data.list);
    //     });
    // const fetchPromises = contracts.map(contract =>
    //     fetch(`https://nftapi.mobox.io/auction/list/BNB/${contract}?sort=-time&page=1&limit=128`)
    //         .then(response => response.json())
    //         .then(data => {
    //             listings.push(...data.list);
    //         })
    // );
    const fetchPromises = [0].map(() =>
        fetch(
            `https://nftapi.mobox.io/auction/search_v2/BNB?page=1&limit=60&category=&vType=&sort=-time&pType=`
        )
            .then(response => response.json())
            .then(data => {
                listings.push(...data.list);
            })
    );
    await Promise.all(fetchPromises);
    return NextResponse.json(listings);
}
