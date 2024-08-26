const updateZeroHash = require("../utils/listed/updateZeroHash");
const config = require("../config/config");
const contractBuys = config.myAcc.map(acc => acc[0]);
// console.log("contractBuys", contractBuys);

updateZeroHash.updateInventory(contractBuys);