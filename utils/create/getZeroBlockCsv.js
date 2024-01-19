const fs = require("fs");
const getZeroBlockCsv = (addressCheck) => {
    let dataAddress = [];
    try {
        const data = fs.readFileSync("./data/zeroBlock.csv", "utf8");
        const dataArr = data.split("\n");
        for (let i = 0; i < dataArr.length; i++) {
            dataAddress = dataArr[i].split("|");
            if (dataAddress[0] === addressCheck) {
                return dataAddress[1];
            }
        }
    } catch (error) {
        return "Failed, add new address to zeroBlock.csv";
    }
    return "Failed, add new address to zeroBlock.csv";
};
module.exports = { getZeroBlockCsv };
// params: blockCheck: nowBlock, addressCheck: hexAddress
// console.log(getZeroBlockCsv("0x2B4F0e0498A832275af360CbE832da8135A5d9C2"));
