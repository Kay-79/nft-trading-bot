import { predictAuctionPro } from "@/AI/utils";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { isProAuction } from "@/utilsV2/find/utils";
import axios from "axios";

const debugAI = async () => {
    const data = await axios.get(
        "https://nftapi.mobox.io/auction/list/BNB/0xE4534fA363016b1BD1E95C20144361cFB7c2d3aC?sort=-time&page=1&limit=128"
    );
    const myAuctions = data.data.list;
    const proAuction: AuctionDto[] = [];
    for (const myAuction of myAuctions) {
        if (isProAuction(myAuction)) {
            proAuction.push(myAuction);
        }
    }
    for (const myAuction of proAuction) {
        const prediction = await predictAuctionPro(myAuction);
        console.log("=========================================");
        console.log(myAuction.hashrate, myAuction.lvHashrate, myAuction.prototype, myAuction.level);
        console.log(prediction);
    }
};

debugAI();
