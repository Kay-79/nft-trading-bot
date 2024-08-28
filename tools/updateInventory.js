const updateInventory = require("../utils/create/updateInventory");
const config = require("../config/config");
const contractBuys = config.myAcc.map(acc => acc[0]);
// console.log("contractBuys", contractBuys);

updateInventory.updateInventory(contractBuys);
