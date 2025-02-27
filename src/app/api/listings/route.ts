import { NextResponse } from "next/server";
import { AuctionDto } from "@/types/dtos/Auction.dto";
// import { contracts } from "@/config/config";
// import { PRO_BUYER } from "@/constants/constants";

export async function GET() {
    const listings: AuctionDto[] = [
        {
            id: "bnb_0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c_10",
            chain: "bnb",
            auctor: "0x5555e5DC401AB6E86a240C7C3f3F86dE88E05Ee8",
            startPrice: 96740000000,
            endPrice: 96740000000,
            durationDays: 2,
            index: 10,
            ids: [],
            amounts: [],
            tokenId: 55195,
            uptime: 1740594399,
            prototype: 41041,
            hashrate: 228,
            lvHashrate: 3453,
            level: 24,
            specialty: 1,
            category: 1,
            quality: 6,
            tx: "0xce4c694fb70c79f385311109e806a0802a7f8d3a0b336ded231c539cc7f1c87c",
            deleted: null,
            nowPrice: 96740000000
        },
        {
            id: "bnb_0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c_8",
            chain: "bnb",
            auctor: "0x5555e5DC401AB6E86a240C7C3f3F86dE88E05Ee8",
            startPrice: 27963000000,
            endPrice: 27963000000,
            durationDays: 2,
            index: 8,
            ids: [],
            amounts: [],
            tokenId: 26425,
            uptime: 1740594351,
            prototype: 44025,
            hashrate: 181,
            lvHashrate: 1615,
            level: 14,
            specialty: 1,
            category: 4,
            quality: 6,
            tx: "0xce4c694fb70c79f385311109e806a0802a7f8d3a0b336ded231c539cc7f1c87c",
            deleted: null,
            nowPrice: 27963000000
        },
        {
            id: "bnb_0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c_1",
            chain: "bnb",
            auctor: "0x5555e5DC401AB6E86a240C7C3f3F86dE88E05Ee8",
            startPrice: 6990000000,
            endPrice: 6990000000,
            durationDays: 2,
            index: 1,
            ids: [],
            amounts: [],
            tokenId: 74286,
            uptime: 1740562014,
            prototype: 42050,
            hashrate: 94,
            lvHashrate: 156,
            level: 2,
            specialty: 1,
            category: 2,
            quality: 6,
            tx: "0x7884548791b53076d6582201ebb601197a58f76c2f2562115f48dba441e8416f",
            deleted: null,
            nowPrice: 6990000000
        },
        {
            id: "bnb_0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c_0",
            chain: "bnb",
            auctor: "0x5555e5DC401AB6E86a240C7C3f3F86dE88E05Ee8",
            startPrice: 1890000000,
            endPrice: 1890000000,
            durationDays: 2,
            index: 0,
            ids: ["22032"],
            amounts: ["1"],
            tokenId: 0,
            uptime: 1740219860,
            prototype: 22032,
            hashrate: 2,
            lvHashrate: 2,
            level: 1,
            specialty: 0,
            category: 0,
            quality: 0,
            tx: "0x5a49122d373f47f0df5d70862106423ee2a85393088386855370fd1c6e24355f",
            deleted: null,
            nowPrice: 1890000000
        }
    ];
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
    // const fetchPromises = [0].map(() =>
    //     fetch(
    //         `https://nftapi.mobox.io/auction/search_v2/BNB?page=1&limit=60&category=&vType=&sort=-time&pType=`
    //     )
    //         .then(response => response.json())
    //         .then(data => {
    //             listings.push(...data.list);
    //         })
    // );

    // await Promise.all(fetchPromises);
    return NextResponse.json(listings);
}
