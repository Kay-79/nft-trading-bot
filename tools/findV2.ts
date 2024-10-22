// process.on("unhandledRejection", (reason, promise) => {});
import { getNewAutions } from "../utilsV2/find/getNewAuctions";
import { ranSleep } from "../utilsV2/common/sleep";
import { AuctionDto } from "../types/dtos/Auction.dto";
import { checkProfit } from "../utilsV2/find/checkProfit";
import { TierPrice } from "../types/dtos/TierPrice.dto";
import { updateWaitBid } from "../utilsV2/find/utils";

let cacheIds: string[] = [];

const findV2 = async () => {
    console.log("Starting findV2...");
    while (true) {
        let newAuctions: AuctionDto[] = [];
        /* await getNewAutions(cacheIds).then(async ([auctions, ids]) => {
            newAuctions = auctions;
            cacheIds = ids;
        }); */
        // checkProfit(newAuctions, examplePriceMins, exampleBnbPrice);

        const isHasProfit =
            checkProfit(exampleAuctions, examplePriceMins, exampleBnbPrice).length > 0;
        isHasProfit
            ? updateWaitBid(checkProfit(exampleAuctions, examplePriceMins, exampleBnbPrice))
            : {};
        exit();

        await ranSleep(20, 30);
    }
};

const examplePriceMins: TierPrice = {
    1: 1.42,
    2: 0.82,
    3: 0.65,
    4: 8,
    5: 40,
    6: 4111
};
const exampleAuctionBundle = [
    {
        id: "bnb_0xC0DC6D8c154e55c4326C4436f14e97989BB6B152_0",
        chain: "bnb",
        auctor: "0xC0DC6D8c154e55c4326C4436f14e97989BB6B152",
        startPrice: 11000000000,
        endPrice: 11450000000,
        durationDays: 2,
        index: 0,
        ids: ["34039", "34016", "31017", "33052", "33052", "33052"],
        amounts: ["1", "1", "1", "1", "1", "1"],
        tokenId: 0,
        uptime: 1728587071,
        prototype: 34039,
        hashrate: 3,
        lvHashrate: 3,
        level: 1,
        specialty: 0,
        category: 0,
        quality: 0,
        tx: "0x402a863d0d59687159bc451c8f1379179aec49e74b7711db349fcd0e44eeacb7",
        deleted: null,
        nowPrice: 7000000000
    }
];

const exampleAuctions = [
    {
        id: "bnb_0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D_122",
        chain: "bnb",
        auctor: "0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D",
        startPrice: 2247000000,
        endPrice: 2247000000,
        durationDays: 2,
        index: 122,
        ids: ["12054"],
        amounts: ["1"],
        tokenId: 0,
        uptime: 1728587071,
        prototype: 12054,
        hashrate: 1,
        lvHashrate: 1,
        level: 1,
        specialty: 0,
        category: 0,
        quality: 0,
        tx: "0xff6449a7b1539889bfadcdf4ceac30b10581068274af4213551875d766d99160",
        deleted: null,
        nowPrice: 1000000000
    },
    {
        id: "bnb_0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D_2",
        chain: "bnb",
        auctor: "0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D",
        startPrice: 2357000000,
        endPrice: 2357000000,
        durationDays: 2,
        index: 2,
        ids: ["11053"],
        amounts: ["1"],
        tokenId: 0,
        uptime: 1728587071,
        prototype: 11053,
        hashrate: 1,
        lvHashrate: 1,
        level: 1,
        specialty: 0,
        category: 0,
        quality: 0,
        tx: "0xff6449a7b1539889bfadcdf4ceac30b10581068274af4213551875d766d99160",
        deleted: null,
        nowPrice: 1000000000
    },
    {
        id: "bnb_0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D_123",
        chain: "bnb",
        auctor: "0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D",
        startPrice: 2577000000,
        endPrice: 2577000000,
        durationDays: 2,
        index: 123,
        ids: ["12052"],
        amounts: ["1"],
        tokenId: 0,
        uptime: 1728587071,
        prototype: 12052,
        hashrate: 1,
        lvHashrate: 1,
        level: 1,
        specialty: 0,
        category: 0,
        quality: 0,
        tx: "0xff6449a7b1539889bfadcdf4ceac30b10581068274af4213551875d766d99160",
        deleted: null,
        nowPrice: 1000000000
    },
    {
        id: "bnb_0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D_119",
        chain: "bnb",
        auctor: "0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D",
        startPrice: 2987000000,
        endPrice: 2987000000,
        durationDays: 2,
        index: 119,
        ids: ["12044"],
        amounts: ["1"],
        tokenId: 0,
        uptime: 1728587071,
        prototype: 12044,
        hashrate: 1,
        lvHashrate: 1,
        level: 1,
        specialty: 0,
        category: 0,
        quality: 0,
        tx: "0xff6449a7b1539889bfadcdf4ceac30b10581068274af4213551875d766d99160",
        deleted: null,
        nowPrice: 1000000000
    },
    {
        id: "bnb_0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D_122",
        chain: "bnb",
        auctor: "0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D",
        startPrice: 2247000000,
        endPrice: 2247000000,
        durationDays: 2,
        index: 122,
        ids: ["12054"],
        amounts: ["1"],
        tokenId: 0,
        uptime: 1728587071,
        prototype: 12054,
        hashrate: 1,
        lvHashrate: 1,
        level: 1,
        specialty: 0,
        category: 0,
        quality: 0,
        tx: "0xff6449a7b1539889bfadcdf4ceac30b10581068274af4213551875d766d99160",
        deleted: null,
        nowPrice: 1000000000
    },
    {
        id: "bnb_0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D_2",
        chain: "bnb",
        auctor: "0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D",
        startPrice: 2357000000,
        endPrice: 2357000000,
        durationDays: 2,
        index: 2,
        ids: ["11053"],
        amounts: ["1"],
        tokenId: 0,
        uptime: 1728587071,
        prototype: 11053,
        hashrate: 1,
        lvHashrate: 1,
        level: 1,
        specialty: 0,
        category: 0,
        quality: 0,
        tx: "0xff6449a7b1539889bfadcdf4ceac30b10581068274af4213551875d766d99160",
        deleted: null,
        nowPrice: 1000000000
    },
    {
        id: "bnb_0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D_123",
        chain: "bnb",
        auctor: "0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D",
        startPrice: 2577000000,
        endPrice: 2577000000,
        durationDays: 2,
        index: 123,
        ids: ["12052"],
        amounts: ["1"],
        tokenId: 0,
        uptime: 1728587071,
        prototype: 12052,
        hashrate: 1,
        lvHashrate: 1,
        level: 1,
        specialty: 0,
        category: 0,
        quality: 0,
        tx: "0xff6449a7b1539889bfadcdf4ceac30b10581068274af4213551875d766d99160",
        deleted: null,
        nowPrice: 1000000000
    },
    {
        id: "bnb_0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D_119",
        chain: "bnb",
        auctor: "0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D",
        startPrice: 2987000000,
        endPrice: 2987000000,
        durationDays: 2,
        index: 119,
        ids: ["12044"],
        amounts: ["1"],
        tokenId: 0,
        uptime: 1728587071,
        prototype: 12044,
        hashrate: 1,
        lvHashrate: 1,
        level: 1,
        specialty: 0,
        category: 0,
        quality: 0,
        tx: "0xff6449a7b1539889bfadcdf4ceac30b10581068274af4213551875d766d99160",
        deleted: null,
        nowPrice: 1000000000
    }
];

const exampleBnbPrice = 600;
findV2();
function exit() {
    throw new Error("Processing exit");
}
