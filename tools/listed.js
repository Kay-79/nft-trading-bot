const axios = require('axios');
const fs = require('fs');
const Web3 = require('web3');
// const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ankr.com/bsc"));
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.bnbchain.org"));
const abiBUSD = [{ "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
const contract = new web3.eth.Contract(abiBUSD, '0xe9e7cea3dedca5984780bafc599bd69add087d56');
const dataCommon = fs.readFileSync('./data/CheapestPriceMoboxCommon.csv', 'utf8');
const commonID = dataCommon.split('\n')
const dataUncommon = fs.readFileSync('./data/CheapestPriceMoboxUncommon.csv', 'utf8');
const uncommonID = dataUncommon.split('\n')
const dataUnique = fs.readFileSync('./data/CheapestPriceMoboxUnique.csv', 'utf8');
const uniqueID = dataUnique.split('\n')
const dataRare = fs.readFileSync('./data/CheapestPriceMoboxRare.csv', 'utf8');
const rareID = dataRare.split('\n')
const dataEpic = fs.readFileSync('./data/CheapestPriceMoboxEpic.csv', 'utf8');
const epicID = dataEpic.split('\n')
const dataLegend = fs.readFileSync('./data/CheapestPriceMoboxLegendary.csv', 'utf8');
const LegendID = dataLegend.split('\n')

idMomo = []
indexMomo = []
priceSell = []
priceBuy = []
nameMomo = []
timeChange = []
flagID = false
flagCountMomo = 0

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function checkListed(address) {
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
        idMomo.push(data.list[i].prototype)
        indexMomo.push(data.list[i].index)
        priceBuy.push(0)
        priceSell.push(Number(data.list[i].startPrice) / 10 ** 9)
        sumSell += Number(data.list[i].startPrice) / 10 ** 9
        timeChange.push(Number(data.list[i].uptime))
    }
    for (let ii = 0; ii < idMomo.length; ii++) {
        flagID = false
        if (Number(idMomo[ii]) < 20000) {
            for (let oo = 0; oo < commonID.length; oo++) {
                if (Number(commonID[oo]) == Number(idMomo[ii])) {
                    nameMomo.push(commonID[oo + 1])
                    sumMomoCM += 1
                    flagID = true
                    break
                }
            }
        }
        if (Number(idMomo[ii]) < 30000 && Number(idMomo[ii]) > 20000) {
            for (let oo = 0; oo < uncommonID.length; oo++) {
                if (Number(uncommonID[oo]) == Number(idMomo[ii])) {
                    nameMomo.push(uncommonID[oo + 1])
                    sumMomoUCM += 1
                    flagID = true
                    break
                }
            }
        }
        if (Number(idMomo[ii]) < 40000 && Number(idMomo[ii]) > 30000) {
            for (let oo = 0; oo < uniqueID.length; oo++) {
                if (Number(uniqueID[oo]) == Number(idMomo[ii])) {
                    nameMomo.push(uniqueID[oo + 1])
                    sumMomoUNQ += 1
                    flagID = true
                    break
                }
            }
        }
        if (Number(idMomo[ii]) < 50000 && Number(idMomo[ii]) > 40000) {
            for (let oo = 0; oo < rareID.length; oo++) {
                if (Number(rareID[oo]) == Number(idMomo[ii])) {
                    nameMomo.push(rareID[oo + 1])
                    sumMomoR += 1
                    flagID = true
                    break
                }
            }
        }
        if (Number(idMomo[ii]) < 60000 && Number(idMomo[ii]) > 50000) {
            for (let oo = 0; oo < epicID.length; oo++) {
                if (Number(epicID[oo]) == Number(idMomo[ii])) {
                    nameMomo.push(epicID[oo + 1])
                    sumMomoE += 1
                    flagID = true
                    break
                }
            }
        }
        if (Number(idMomo[ii]) > 60000) {
            for (let oo = 0; oo < epicID.length; oo++) {
                if (Number(LegendID[oo]) == Number(idMomo[ii])) {
                    nameMomo.push(LegendID[oo + 1])
                    sumMomoL += 1
                    flagID = true
                    break
                }
            }
        }
        if (flagID == false) {
            nameMomo.push('  ##########')
        }
    }
    if (nameMomo.length == idMomo.length && idMomo.length == indexMomo.length && indexMomo.length == priceSell.length) {
        dataExcel = ''
        for (let ii = 0; ii < indexMomo.length; ii++) {
            dataExcel = dataExcel + nameMomo[ii].slice(2, nameMomo[ii].length - 1) + '\t' + idMomo[ii] + '\t' + indexMomo[ii] + '\t' + priceSell[ii] + '\t \t' + priceBuy[ii] + '\t1' + '\n'
        }
        sumMomo += idMomo.length
    }
    // await sleep(4000)
}

async function scanIndex(logData) {
    let amount = 0
    let indexMomo2 = indexMomo.sort((a, b) => a - b)
    let indexList = ''
    for (let i = 0; i < 128; i++) {
        if (i != indexMomo2[i]) {
            if (amount == 0) {
                indexEmpty = i
            }
            amount += 1
            indexMomo2.splice(i, 0, i)
            if (amount == 6) {
                amount = 0
                indexList = indexList + indexEmpty + ', '
            }
        }
    }
    if (indexList) { console.log(logData + '\t' + indexList) } else (console.log(logData + '\t' + 'Auctions are full !!'))
}

async function checkPriceBuy(address, page) {
    let response2 = await axios.get('https://nftapi.mobox.io/auction/logs_new/' + address + '?&page=' + page + '&limit=50').catch(e => { console.log("Err2") })
    if (!response2) {
        console.log("Error connect to api")
        exit()
    }
    const data2 = response2.data;
    for (let i = 0; i < data2.list.length; i++) {
        let sum = 0;
        let maxAmount = 0
        data2.list[i].amounts.map(function (value) {
            sum += Number(value)
            if (Number(value) > maxAmount) {
                maxAmount = value
            }
        })
        if (data2.list[i].bidder == address) {
            if (data2.list[i].amounts.length == 0) {
                for (let idx3 = 0; idx3 < idMomo.length; idx3++) {
                    if (Number(idMomo[idx3]) == Number(data2.list[i].tokens[0].prototype) && priceBuy[idx3] == 0) {
                        priceBuy[idx3] = Number((Number(data2.list[i].bidPrice) / 10 ** 9)).toFixed(3)
                        sumBuy += Number(data2.list[i].bidPrice) / 10 ** 9
                        flagCountMomo += 1
                        break
                    }
                }
            }
            else {
                for (let idx2 = 0; idx2 < data2.list[i].ids.length; idx2++) {
                    for (let maxIndex = 0; maxIndex < maxAmount; maxIndex++) {
                        for (let idx3 = 0; idx3 < idMomo.length; idx3++) {
                            if (idMomo[idx3] == data2.list[i].ids[idx2] && priceBuy[idx3] == 0) {
                                priceBuy[idx3] = Number((Number(data2.list[i].bidPrice) / 10 ** 9) / sum).toFixed(3)
                                sumBuy += Number((Number(data2.list[i].bidPrice) / 10 ** 9) / sum)
                                flagCountMomo += 1
                                break
                            }
                        }
                    }
                }
            }
        }
    }
}

async function main(address, nameFile_, rate_) {
    let budget = await contract.methods.balanceOf(address).call();
    budget = (budget / 10 ** 18).toFixed(2)
    sumUSD += Number(budget)
    budget = (budget * rate_).toFixed(3)
    await checkListed(address)
    let balance = await web3.eth.getBalance(address)
    balance = (balance / 10 ** 18).toFixed(4)
    sumBNB += Number(balance)
    balance = (balance * rate_).toFixed(5)
    for (let index1 = 1; index1 < 51; index1++) {
        await checkPriceBuy(address, index1)
        if (flagCountMomo == idMomo.length) {
            // console.log('Break')
            break
        }
        await sleep(100)
    }
    // await sleep(1000)
    if (nameMomo.length == idMomo.length && idMomo.length == indexMomo.length && indexMomo.length == priceSell.length) {
        dataExcel = ''
        momoListed += idMomo.length
        amountAccount += 1
        for (let ii = 0; ii < indexMomo.length; ii++) {
            let profit = (Number((priceSell[ii]) * 0.95 - ((5.4 * 10 ** -9 * 500000 * bnbPrice) / 3) - 0.0583 - Number(priceBuy[ii]))).toFixed(3) //0.0583 is fee list
            if (profit < 0) {
                countLoss += 1
            }
            else if (profit > 0) {
                countProfit += 1
            }
            else {
                countTie += 1
            }
            dataExcel = dataExcel + nameMomo[ii].slice(2, nameMomo[ii].length - 1) + '\t' + idMomo[ii] + '\t' + indexMomo[ii] + '\t' + priceSell[ii] + '\t' + timeChange[ii] + '\t' + priceBuy[ii] + '\t' + nameFile_ + '\t5.4\t' + profit + '\n'
        }
        // console.log(dataExcel)
        listed = listed + dataExcel
        for (let index = idMomo.length; index < 128; index++) {
            dataExcel = dataExcel + '' + '\t' + '' + '\t' + '' + '\t' + '' + '\t' + '' + '\t' + '' + '\t\t' + '\n'
        }
        if (save == true) {
            fs.writeFile(nameFile_ + '.csv', dataExcel, err => {
                if (err) {
                    console.error(err);
                }
            });
        }
        let space = ''
        let flagBalance = balance + ' BNB'
        if (Number(flagCountMomo) < 10) { space = '0' }
        if (!Number(balance)) {
            let abiAmount = [{ "inputs": [], "name": "amountUnList", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
            let contractAcc = new web3.eth.Contract(abiAmount, address);
            let amountUnList = await contractAcc.methods.amountUnList().call();
            flagBalance = 'isContract ' + amountUnList
        }
        else if (balance / rate_ < minBNB / 2) {
            flagBalance = 'SwapNOW ' + (balance / rate_).toFixed(3)
        }
        else if (balance / rate_ < minBNB) {
            flagBalance = 'SwapLATER ' + (balance / rate_).toFixed(3)
        }
        let logData = (nameFile_ + '\t' + space + flagCountMomo.toString() + ' vs ' + space + (idMomo.length).toString() + '\t' + budget + ' BUSD\t' + flagBalance)
        scanIndex(logData)
        if (nameFile_ == lastAcc) {
            for (let index = momoListed; index < amountAccount * 128; index++) {
                listed = listed + '' + '\t' + '' + '\t' + '' + '\t' + '' + '\t' + '' + '\t' + '' + '\t\t' + '\n'
            }
            fs.writeFile('listed' + '.csv', listed, err => {
                if (err) {
                    console.error(err);
                }
            });
        }
    }
}

async function checkListedAll(rate_) {
    bnbPrice = await axios.get('https://priceapi.mobox.io/kline/usdt?coins=[%22bnb%22]').catch(e => { console.log("Err1") })
    bnbPrice = Number(bnbPrice.data.data.bnb.price.toFixed(2))
    usdPrice = await axios.get('https://wise.com/rates/live?source=USD&target=VND&length=30&resolution=hourly&unit=day').catch(e => { console.log("Err1") })
    usdPrice = Number(usdPrice.data.value.toFixed())
    for (let index = 0; index < myAcc.length; index++) {
        await main(myAcc[index][0], myAcc[index][1], rate_)
    }
    console.log("BNB Price:", bnbPrice)
    console.log("USD Price:", usdPrice)
    console.log('Total BUSD:\t\t', (sumUSD * rate_).toFixed(2))
    console.log('Total BNB:\t\t', (sumBNB * rate_).toFixed(4))
    console.log('Total Fund:\t\t', ((sumBNB * bnbPrice + sumUSD) * usdPrice * rate_).toFixed(), 'đ')
    sumBuyVnd = (sumBNB * bnbPrice + sumUSD + sumBuy) * usdPrice * rate_
    sumSaleVnd = (sumBNB * bnbPrice + sumUSD + sumSell * 0.95) * usdPrice * rate_
    console.log('Estimate Fund:\t', sumBuyVnd.toFixed(), '--', sumSaleVnd.toFixed(), 'đ')
    console.log('Estimate Fund:\t', (sumBuyVnd + (sumSaleVnd - sumBuyVnd) * rateSale).toFixed(), 'đ')
    var currentdate = new Date();
    var datetime = "Last Sync: "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    console.log(sumMomo + ' Momos: ' + sumMomoCM + ' Common, ' + sumMomoUCM + ' Uncommon, ' + sumMomoUNQ + ' Unique, ' + sumMomoR + ' Rare, ' + sumMomoE + ' Epic, ' + sumMomoL + ' Legend (' + (sumBuy).toFixed() + ',', (sumSell * 0.95).toFixed() + ')', 'Profit: ' + countProfit + ' - Loss: ' + countLoss + ' - Tie: ' + countTie, datetime)
}

myAcc = [
    ['0x11119D51e2Ff85D5353ABf499Fe63bE3344c0000', '_1_0_1'],
    ['0x444430ba89a0741902253756d009213ba1151111', '_4_1_1'],
    ['0x4444eA3CeBBD866c19F7769aA260E02B5D561111', '_4_1_2'],
    ['0x55555D4de8df0c455C2Ff368253388FE669a8888', '_5_8_1'],
    ['0x666685e40D852fa173136Ef77A16142431Cc7777', '_6_7_1'],
    ['0x77775a358050DE851b06603864FbD380637C7777', '_7_7_1'],
    ['0x3000EdD433B4AFDbc6f94Ac2d29c170d73bb8f34', '_3_0_0'],
    ['0xb69A82d8B5e0C11f82987AA89c585A04C0308461', '_b_6_9']
]

var listed = ''
var momoListed = 0, sumMomo = 0, countLoss = 0, countProfit = 0, countTie = 0, sumMomoCM = 0, sumMomoUCM = 0, sumMomoUNQ = 0, sumMomoR = 0, sumMomoE = 0, sumMomoL = 0, amountAccount = 0, sumSell = 0, sumBuy = 0, sumUSD = 0, sumBNB = 0
const minBNB = 0.01
const lastAcc = myAcc[myAcc.length - 1][1]
const save = false
const rateSale = 0.42

checkListedAll(0.1)