const axios = require("axios");
let hisPriceBnb = 575;
const getBnbPrice = async () => {
    let bnbPriceCheck = 0;
    bnbPriceCheck = await axios
        .get("https://priceapi.mobox.io/kline/usdt?coins=[%22bnb%22]")
        .catch(e => {
            console.log("Err1");
        });
    try {
        bnbPriceCheck = Number(bnbPriceCheck.data.data.bnb.price);
    } catch (error) {
        bnbPriceCheck = hisPriceBnb;
        console.log(error);
    }
    if (bnbPriceCheck > 0) {
        return bnbPriceCheck;
    }
    return hisPriceBnb;
};

module.exports = getBnbPrice;
