const axios = require("axios");
const getBnbPrice = async () => {
    let bnbPriceCheck = 0;
    bnbPriceCheck = await axios
        .get("https://priceapi.mobox.io/kline/usdt?coins=[%22bnb%22]")
        .catch((e) => {
            console.log("Err1");
        });
    try {
        bnbPriceCheck = bnbPriceCheck.data.data.bnb.price;
    } catch (error) {
        bnbPriceCheck = 320;
        console.log(error);
    }
    return bnbPriceCheck;
};

module.exports = getBnbPrice;
