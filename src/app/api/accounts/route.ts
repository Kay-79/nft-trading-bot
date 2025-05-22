import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/connectMongo";
import { contracts } from "@/config/config";
import { shortenNumber } from "@/utils/shorten";
import { AccountConsoleDto } from "@/types/dtos/AccountConsole.dto";
import { stakingUtils } from "@/utilsV2/staking/utils";
import { erc20Provider } from "@/providers/erc20Provider";
import { ethers } from "ethers";

export async function GET() {
    try {
        const db = await connectMongo();
        const allListings = await db.collection("listings").find().toArray();
        const accounts: AccountConsoleDto[] = [];
        for (const address of contracts) {
            const balance = shortenNumber(
                Number(ethers.formatUnits(await erc20Provider.balanceOf(address), 18)),
                0,
                2
            );
            const hash = await stakingUtils.userHashrate(address);
            const listingsCount = allListings.filter(
                listing => listing.auctor?.toLowerCase() === address.toLowerCase()
            ).length;
            const totalPriceSell = allListings.reduce((acc, listing) => {
                if (listing.auctor?.toLowerCase() === address.toLowerCase()) {
                    return acc + listing.nowPrice;
                }
                return acc;
            }, 0);
            accounts.push({
                id: address,
                address,
                listingsCount,
                balance,
                hash,
                totalPriceSell: shortenNumber(totalPriceSell * 0.95, 9, 2)
            });
        }
        return NextResponse.json(accounts);
    } catch (error) {
        console.error("Error fetching accounts:", error);
        return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
    }
}
