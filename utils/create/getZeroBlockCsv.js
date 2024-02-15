const fs = require("fs");
const getZeroBlockCsv = (addressCheck) => {
    let dataAddress = [];
    try {
        const data = fs.readFileSync("./data/zeroBlock.csv", "utf8");
        console.log(data);
        const dataArr = data.split("\n");
        for (let i = 0; i < dataArr.length; i++) {
            dataAddress = dataArr[i].split("|");
            console.log(dataAddress);
            if (dataAddress[0] === addressCheck) {
                return Number(dataAddress[1]);
            }
        }
    } catch (error) {
        console.log(error);
    }
};
module.exports = { getZeroBlockCsv };
// params: blockCheck: nowBlock, addressCheck: hexAddress
// console.log(getZeroBlockCsv("0x2B4F0e0498A832275af360CbE832da8135A5d9C2"))
console.log(getZeroBlockCsv("0x891016f99BA622F8556bE12B4EA336157aA6cb20"));
