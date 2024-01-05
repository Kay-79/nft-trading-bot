const axios = require("axios");
const { sleep } = require("../common/sleep");
const getMinPrice = async () => {
    let priceRaw = [];
    for (let index0 = 0; index0 < 3; index0++) {
        let limitMomo = 17;
        if (index0 >= 4) {
            limitMomo = 5;
        }
        let dataMin = await axios
            .get(
                "https://nftapi.mobox.io/auction/search_v2/BNB?page=1&limit=" +
                    limitMomo +
                    "&category=&vType=" +
                    (index0 + 1).toString() +
                    "&sort=price&pType="
            )
            .catch((e) => {
                console.log("Err get min price!!");
            });
        if (!dataMin) {
            index0 -= 1;
            await sleep(5000);
            continue;
        }
        await sleep(2500);
        let amountMinCheck = 0;
        let sumMin = 0;
        let sumMin2 = 0;
        dataMin = dataMin.data.list;
        for (let index = 0; index < dataMin.length; index++) {
            if (Date.now() / 1000 - dataMin[index].uptime > 900) {
                amountMinCheck += 1;
                sumMin += dataMin[index].nowPrice / 10 ** 9;
            } else {
                sumMin2 += dataMin[index].nowPrice / 10 ** 9;
            }
            if (amountMinCheck >= 5) {
                break;
            }
        }
        if (amountMinCheck >= 5) {
            priceRaw[index0] = Number((sumMin / amountMinCheck).toFixed(2));
        } else {
            priceRaw[index0] = (sumMin + sumMin2) / dataMin.length;
        }
    }
    for (let index = 0; index < 3; index++) {
        if (priceRaw[index] > 10) {
            console.log("Error Normal Price!!");
            exit();
        }
    }
    if (priceRaw[3] > 25 || priceRaw[4] > 100 || priceRaw[5] > 1000) {
        console.log("Error Pro Price!!");
        exit();
    }
    return priceRaw;
};

module.exports = getMinPrice;
