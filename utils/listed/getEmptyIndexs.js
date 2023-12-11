const axios = require("axios");

const getEmptyIndexs = async (address) => {
    let emptyIndexs = [];
    for (let i = 0; i < 128; i++) {
        emptyIndexs.push(i);
    }
    let response = await axios
        .get(
            `https://nftapi.mobox.io/auction/list/BNB/${address}?sort=-time&page=1&limit=128`
        )
        .catch((e) => {
            console.log("Err1");
            return [];
        });
    const data = response.data.list;
    // console.log(data);
    if (data.length == 0) {
        return [];
    }
    for (let j = 0; j < data.length; j++) {
        if (emptyIndexs.includes(Number(data[j].index))) {
            emptyIndexs[data[j].index] = 999;
        }
    }
    for (let k = 0; k < emptyIndexs.length; k++) {
        if (emptyIndexs[k] != 999) {
            return [emptyIndexs[k]];
        }
    }
    return [];
};

module.exports = getEmptyIndexs;