const axios = require('axios');
const fs = require('fs');
const { exit } = require('process');
const configJson = JSON.parse(fs.readFileSync('./config/config.json'));
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// const dataCommon = fs.readFileSync('./dataMomo/CheapestPriceMoboxCommon.csv', 'utf8');
// const commonID = dataCommon.split('\n')
// const dataUncommon = fs.readFileSync('./dataMomo/CheapestPriceMoboxUncommon.csv', 'utf8');
// const uncommonID = dataUncommon.split('\n')
// const dataUnique = fs.readFileSync('./dataMomo/CheapestPriceMoboxUnique.csv', 'utf8');
// const uniqueID = dataUnique.split('\n')
// const dataRare = fs.readFileSync('./dataMomo/CheapestPriceMoboxRare.csv', 'utf8');
// const rareID = dataRare.split('\n')
// const dataEpic = fs.readFileSync('./dataMomo/CheapestPriceMoboxEpic.csv', 'utf8');
// const epicID = dataEpic.split('\n')
// console.log(commonID[5])
// console.log(uncommonID[5])
// console.log(uniqueID[5])
minCM = configJson.minPrice.minCommon
minUCM = configJson.minPrice.minUncommon
minUNQ = configJson.minPrice.minUnique
minR = configJson.minPrice.minRare
idMomo = []
indexMomo = []
priceSell = []
priceBuy = []
indexList = []
nameMomo = []
boolChange = []
flagID = false
flagCountMomo = 0
amountBid = 0
async function checkAmountBuy(address, page) {
    let response2 = await axios.get('https://nftapi.mobox.io/auction/logs_new/' + address + '?&page=' + page + '&limit=50').catch(e => { console.log("Err1") })
    const data2 = response2.data;
    for (let i = 0; i < data2.list.length; i++) {
        if (data2.list[i].auctor != address) {
            for (let idx2 = 0; idx2 < data2.list[i].ids.length; idx2++) { for (let idx3 = 0; idx3 < Number(data2.list[i].amounts[idx2]); idx3++) { if (idMomoBought.length >= value || amountBid >= valueBid) { break } else { idMomoBought.push(data2.list[i].ids[idx2]) } } }
            amountBid += 1
        }
    }
}
async function checkChangePrice(indexId) {
    let response3 = await axios.get('https://nftapi.mobox.io/auction/search/BNB?page=1&limit=10&category=&vType=&sort=price&pType=' + idMomoBought[indexId]).catch(e => { console.log("Err2") })
    const data3 = response3.data.list;
    // console.log(data3)
    console.log(idMomoBought[indexId].toString() + '-' + (indexId + 1).toString() + '/' + idMomoBought.length.toString())
    if (myAccounts.includes(data3[0].auctor)) {
        priceSell[indexId] = (Number(data3[0].nowPrice) / 10 ** 9).toFixed(3)
        for (let index_z = 0; index_z < data3.length; index_z++) {
            if (!myAccounts.includes(data3[index_z].auctor)) {
                priceSell[indexId] = (Number(data3[index_z].nowPrice) / 10 ** 9 - minChange).toFixed(3)
                break
            }
        }
    }
    else {
        priceSell[indexId] = (Number(data3[0].nowPrice) / 10 ** 9 - minChange).toFixed(3)
        for (let index_q = 0; index_q < data3.length; index_q++) {
            if (Number(data3[index_q].uptime) > timeWait) {
                if (myAccounts.includes(data3[index_q].auctor)) {
                    priceSell[indexId] = (Number(data3[index_q].nowPrice) / 10 ** 9).toFixed(3)
                }
                else {
                    priceSell[indexId] = (Number(data3[index_q].nowPrice) / 10 ** 9 - minChange).toFixed(3)
                    break
                }
            }
        }
        let sttRarity = idMomoBought[indexId].toString().slice(0, 1)
        switch (sttRarity.toString()) {
            case '1':
                if (Number(priceSell[indexId]) < minCM) {
                    priceSell[indexId] = (minCM - minChange).toFixed(3)
                }
                break;
            case '2':
                if (Number(priceSell[indexId]) < minUCM) {
                    priceSell[indexId] = (minUCM - minChange).toFixed(3)
                }
                break;
            case '3':
                if (Number(priceSell[indexId]) < minUNQ) {
                    priceSell[indexId] = (minUNQ - minChange).toFixed(3)
                }
                break;
            default:
                priceSell[indexId] = (minR - minChange).toFixed(3)
                break;
        }
    }
}
async function getPriceToSell(address, boolMin) {
    for (let index1 = 1; index1 < 51; index1++) {
        await checkAmountBuy(address, index1)
        if (idMomoBought.length >= value || amountBid >= valueBid) { break }
        await sleep(200)
    }
    idMomoBought.reverse()
    if (boolMin) {
        await sleep(1000)
        for (let indexMomo = 0; indexMomo < idMomoBought.length; indexMomo++) {
            if (idMomoBought[indexMomo] == idMomoBought[indexMomo - 1]) {
                priceSell[indexMomo] = priceSell[indexMomo - 1]
            }
            else {
                await checkChangePrice(indexMomo)
                await sleep(1000)
            }
        }
    }
    amoutList = 0
    cacheListID = []
    cacheListPrice = []
    priceList = []
    idList = []
    for (let wr = 0; wr < idMomoBought.length; wr++) {
        amoutList += 1
        cacheListID.push(idMomoBought[wr])
        cacheListPrice.push(priceSell[wr])
        if (amoutList == 6) {
            // console.log(cacheListID)
            idList.push(cacheListID)
            priceList.push(cacheListPrice)
            cacheListID = []
            cacheListPrice = []
            amoutList = 0
        }
    }
    // console.log(idList)
    console.log("ids =\n" + JSON.stringify(idList) + "\nprices =\n" + JSON.stringify(priceList) + '\n')
    console.log(indexs.length, idList.length, priceList.length)
    for (let ii = 0; ii < priceList.length; ii++) {
        for (let jj = 0; jj < priceList[ii].length; jj++) {
            priceList[ii][jj] = ((Math.round((Number(priceList[ii][jj])) * 10 ** 5)).toString() + '0000000000000')
            if (Number(priceList[ii][jj]) < 10 ** 18) {
                console.log('Err Price')
                exit()
            }
        }
    }
}

async function checkIndex(address) {
    idMomo = []
    indexMomo = []
    priceSell = []
    priceBuy = []
    nameMomo = []
    timeChange = []
    flagID = false
    flagCountMomo = 0
    let response = await axios.get('https://nftapi.mobox.io/auction/list/BNB/' + address + '?sort=-time&page=1&limit=128').catch(e => { console.log("Err1") })
    const data = response.data;
    for (let i = 0; i < data.list.length; i++) {
        indexMomo.push(data.list[i].index)
    }
    let amount = 0
    let indexMomo2 = indexMomo.sort((a, b) => a - b)
    for (let i = 0; i < 128; i++) {
        if (i != indexMomo2[i]) {
            if (amount == 0) {
                indexEmpty = i
            }
            amount += 1
            indexMomo2.splice(i, 0, i)
            if (amount == 6) {
                amount = 0
                indexs.push(indexEmpty)
            }
        }
    }
    if (indexs) { console.log(indexs) } else {
        console.log('Auctions are full !!')
        exit()
    }
    indexs = indexs.slice(0, (value / 6 - 0.5).toFixed())//, indexs.length)
}

async function sendTxt(gasPrice_, gasLimit_, index_, ids_, prices_, hexData_, nameFile_) {
    try {
        const inputdata = fs.readFileSync('myAccount_1_0_1.txt', 'utf8');
        myAccount = inputdata.split('\n')
        // console.log(myAccount[1])
    } catch (err) {
        console.error(err);
    }
    const Private_Key = myAccount[1]
    const Web3 = require('web3');
    const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed4.binance.org"));
    acc = web3.eth.accounts.privateKeyToAccount(Private_Key)
    console.log(acc.address)
    const abi = [{ "inputs": [{ "name": "suggestIndex_", "type": "uint256" }, { "name": "tokenIds_", "type": "uint256[]" }, { "name": "prices721_", "type": "uint256[]" }, { "name": "ids_", "type": "uint256[]" }, { "name": "prices1155_", "type": "uint256[]" }], "name": "createAuctionBatch", "outputs": [], "stateMutability": "payable", "type": "function" },]
    const consractAddress = ('0xcb0cffc2b12739d4be791b8af7fbf49bc1d6a8c2')
    const contract = new web3.eth.Contract(abi, consractAddress);
    // console.log(contract)
    emptyVar = []
    // console.log(ids,prices)
    // asd
    tx = ''
    encoded = ''
    signArray = ''
    if (hexData_.length == 0) {
        encoded = contract.methods.createAuctionBatch(index_, emptyVar, emptyVar, ids_, prices_).encodeABI();
    } else { encoded = hexData_ }
    tx = {
        from: acc.address,
        gas: gasLimit_,
        gasPrice: gasPrice_ * 10 ** 9,// + i * 10 ** 6,
        to: accSell,
        value: 0,
        data: encoded
    }
    await web3.eth.accounts.signTransaction(tx, Private_Key).then(signed => {
        signArray = signed
        // console.log(Date());
    })
    console.log("Listing")
    try {
        let createAuctionBatch = await web3.eth.sendSignedTransaction(signArray.rawTransaction)
        console.log('Done at block:', createAuctionBatch.blockNumber)
        boolSell = "TRUE"
    } catch (error) {
        console.log('Over time or fail during list!')
        exit()
    }
}

async function createBatch(gasPrice_, gasLimit_, hexData_, nameFile_) {
    accSell = ''
    for (let index = 0; index < myAcc.length; index++) {
        if (nameFile_ == myAcc[index][1]) { accSell = myAcc[index][0] }
    }
    if (accSell == '') {
        console.log('Empty accSell')
        exit()
    }
    await checkIndex(accSell)
    await getPriceToSell(accSell, true) //_1_0_1
    let count = 0
    while (true) {
        // if (indexs.length != idList.length || idList.length != priceList.length) {
        //     console.log('Length array not same!')
        //     if (indexs.length<)
        //     break
        // }
        if (hexData_.length > 0) {
            await sendTxt(gasPrice_, gasLimit_, '', '', '', hexData_, nameFile_)
            break
        }
        for (let index = 0; index < indexs.length; index++) {
            if (indexs[index] != undefined) {
                boolSell = "FALSE"
                console.log(indexs[index], idList[index], priceList[index])
                await sendTxt(gasPrice_, gasLimit_, indexs[index], idList[index], priceList[index], '', nameFile_)
                if (boolSell == "TRUE") {
                    indexs[index] = undefined
                    count += 1
                }
            }
            await sleep(5000)
        }
        if (count >= indexs.length) {
            console.log("Done")
            break
        }
        await sleep(5000)
    }
}

timeWait = 1 * 60 * 60 * 1 //wait latest change price
idMomoBought = []
priceSell = []
myAccounts = []
const myAcc = configJson.myAcc
for (let index = 0; index < myAcc.length; index++) {
    myAccounts.push(myAcc[index][0])
}
value = 6 // without rare and epic
valueBid = 999
indexs = []
priceList = []
ids = []
const minChange = 0.001
var accSell = ''

createBatch(3.001, 1000000, '', '_7_4_5')