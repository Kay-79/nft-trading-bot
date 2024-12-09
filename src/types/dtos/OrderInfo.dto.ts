import { AuctionStatus } from "../../enum/enum";

export class OrderInfo {
    status?: BigInt;
    startPrice?: BigInt;
    endPrice?: BigInt;
    uptime?: BigInt;
    durationDays?: BigInt;
    tokenId?: BigInt;
    ids?: BigInt[];
    amounts?: BigInt[];
}
