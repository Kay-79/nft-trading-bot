import { AuctionDto } from "@/types/dtos/Auction.dto";

export const sortVsFilterAuctions = (myAuctions: AuctionDto[]) => {
    myAuctions.sort((a, b) => (a.uptime ?? 0) - (b.uptime ?? 0)); // sort auctions by uptime asc
    // lọc auction có trùng ids[0]
    const auctionIds: string[] = [];
    return myAuctions.filter(auction => {
        if (auctionIds.includes(auction.ids?.[0] ?? "")) {
            return false;
        }
        auctionIds.push(auction.ids?.[0] ?? "");
        return true;
    });
};
