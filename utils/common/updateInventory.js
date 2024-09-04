require("dotenv").config();
const fs = require("fs");
const Web3 = require("web3");
const { exit } = require("process");
const configJson = require("../../config/config");
const web3 = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.create));
const { abiCheckListed, abiCheckBided } = require("../../abi/abiCheckUnlist");
const getBlockByTime = require("../bid/getBlockByTime");
const { sleep } = require("../common/sleep");
let momoStorage = {};
let dataBid = {};
const fiveDaysBlock = 144000;

