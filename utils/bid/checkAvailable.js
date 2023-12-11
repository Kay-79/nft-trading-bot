const axios = require("axios");
const checkAvailable = async (addressCheck, indexCheck, timeCheck) => {
    // true is available
    let responseListed = await axios
        .get(
            "https://nftapi.mobox.io/auction/list/BNB/" +
                addressCheck +
                "?sort=-time&page=1&limit=30"
        )
        .catch((e) => {
            return true;
        });
    let dataAvailable = responseListed.data.list;
    for (let index = 0; index < dataAvailable.length; index++) {
        if (
            Number(indexCheck) == dataAvailable[index].index &&
            Number(timeCheck) == dataAvailable[index].uptime
        ) {
            return true;
        }
    }
    return true;
};
module.exports = checkAvailable;
