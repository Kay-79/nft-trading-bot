import { predictAuctionPro } from "@/AI/utils";

const debugAI = async () => {
    const auction = {
        id: "bnb_0xE4534fA363016b1BD1E95C20144361cFB7c2d3aC_0",
        chain: "bnb",
        auctor: "0xE4534fA363016b1BD1E95C20144361cFB7c2d3aC",
        startPrice: 266866000000,
        endPrice: 266866000000,
        durationDays: 2,
        index: 0,
        ids: [],
        amounts: [],
        tokenId: 9933,
        uptime: 1744114261,
        prototype: 50021,
        hashrate: 119,
        lvHashrate: 4326,
        level: 40,
        specialty: 3,
        category: 5,
        quality: 6,
        tx: "0x4e39d58a465ad39f69ad6e282476aac81e25667da162edd1c638d4dce44abeff",
        deleted: null,
        nowPrice: 266866000000
    };
    const price = await predictAuctionPro(auction);
    console.log(price);
};

debugAI();
