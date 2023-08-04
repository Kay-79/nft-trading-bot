const axios = require('axios');
const fs = require('fs');
const Web3 = require('web3');
const configJson = JSON.parse(fs.readFileSync('./config/config.json'));
const abi = JSON.parse(fs.readFileSync('./config/abiMobox.json'));
const { exit } = require('process');
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
// const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-testnet.public.blastapi.io"));
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.defibit.io"));
minCM = configJson.minPrice.minCommon
minUCM = configJson.minPrice.minUncommon
minUNQ = configJson.minPrice.minUnique
Private_Key = ''
File_Key = ['_1_0_1']
try {
    const passData = fs.readFileSync('myAccount_1_0_1.txt', 'utf8');
    myAccount = passData.split('\n')
    Private_Key = myAccount[1]
} catch (err) {
    console.error(err);
}
idMomo = []
indexMomo = []
priceSell = []
priceBuy = []
nameMomo = []
boolChange = []
flagID = false
flagCountMomo = 0
async function checkListed(address) {
    axios.get('https://nftapi.mobox.io/auction/list/BNB/' + address + '?sort=-time&page=1&limit=128')
        .then(response => {
            const data = response.data;
            for (let i = 0; i < data.list.length; i++) {
                idMomo.push(data.list[i].prototype)
                indexMomo.push(data.list[i].index)
                priceBuy.push(0)
                priceSell.push(Number(data.list[i].startPrice) / 10 ** 9)
                boolChange.push(' ')
            }
        })
        .catch(error => {
            console.log(error);
        });
    await sleep(4000)
}
function checkPriceBuy(address_, page) {
    axios.get('https://nftapi.mobox.io/auction/logs_new/' + address_ + '?&page=' + page + '&limit=50')
        .then(response2 => {
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
                if (data2.list[i].bidder == address_) {
                    for (let idx2 = 0; idx2 < data2.list[i].ids.length; idx2++) {
                        for (let maxIndex = 0; maxIndex < maxAmount; maxIndex++) {
                            for (let idx3 = 0; idx3 < idMomo.length; idx3++) {
                                if (idMomo[idx3] == data2.list[i].ids[idx2] && priceBuy[idx3] == 0) {
                                    priceBuy[idx3] = Number((Number(data2.list[i].bidPrice) / 10 ** 9) / sum).toFixed(3)
                                    flagCountMomo += 1
                                    break
                                }
                            }
                        }
                    }
                }
            }
        })
}
async function checkChangePrice(indexId) {
    try {
        let response3 = await axios.get('https://nftapi.mobox.io/auction/search/BNB?page=1&limit=5&category=&vType=&sort=price&pType=' + idMomo[indexId])
        data3 = response3.data;
    } catch (error) {
        console.log('axios err')
    }
    ///
    let accListCache = []
    let indexListCache = []
    for (let indexid_ = 0; indexid_ < data3.list.length; indexid_++) {
        if (myAccounts.includes(data3.list[indexid_].auctor) == false && indexListCache.includes(Number(indexMomo[indexId])) == false) {//fix same momo
            if (((Number(data3.list[indexid_].nowPrice) / 10 ** 9) * 0.95 - priceBuy[indexId] > 0 || sellOff) && Number(Date.now() / 1000).toFixed() - Number(data3.list[indexid_].uptime) > timeWait * (indexid_ + 1)) {// time wait x2 for second momo
                priceCache = priceSell[indexId] // add to compare price
                priceSell[indexId] = (Number(data3.list[indexid_].nowPrice) / 10 ** 9).toFixed(3)
                if (priceCache > priceSell[indexId]) {
                    boolChange[indexId] = 'TRUE'
                    console.log(idMomo[indexId] + ' ' + priceCache + ' to ' + priceSell[indexId])
                }
            }
            break
        }
        // else {
        accListCache.push(data3.list[indexid_].id)
        indexListCache.push(data3.list[indexid_].index)
        // console.log(indexListCache.includes(Number(indexMomo[indexId])))
        // console.log(data3.list[indexid_].id)
        // }
        if (indexid_ >= 1) { break }
    }
    ///
    // if (myAccounts.includes(data3.list[0].auctor) == false) {
    //     if (((Number(data3.list[0].nowPrice) / 10 ** 9) * 0.95 - priceBuy[indexId] > 0 || sellOff) && Number(Date.now() / 1000).toFixed() - Number(data3.list[0].uptime) > timeWait) {
    //         priceCache = priceSell[indexId] // add to compare price
    //         priceSell[indexId] = (Number(data3.list[0].nowPrice) / 10 ** 9).toFixed(3)
    //         if (priceCache > priceSell[indexId]) {
    //             boolChange[indexId] = 'TRUE'
    //             console.log(idMomo[indexId], priceCache, 'to', priceSell[indexId])
    //         }
    //     }
    // }
}
async function changePrice(index_, priceChange_, Private_Key_, address_) {
    encoded = ''
    tx = ''
    for (let index = 0; index < myAccounts.length; index++) {
        if (address_ == myAccounts[index]) {
            contract = new web3.eth.Contract(abi, address_);
            encoded = contract.methods.changePrice(index_, priceChange_, priceChange_, 2).encodeABI();
            await web3.eth.getTransactionCount('0x11119D51e2Ff85D5353ABf499Fe63bE3344c0000').then((nonce) => {
                console.log(nonceAcc, nonce)
                tx = {
                    nonce: nonce + nonceAcc[0],
                    from: '0x11119D51e2Ff85D5353ABf499Fe63bE3344c0000',
                    gas: 57865,
                    gasPrice: gasPriceScan,
                    to: address_,
                    value: 0,
                    data: encoded
                }
            })
            nonceAcc[0] += 1
            break
        }
    }
    try {
        await sleep(500)
        await web3.eth.accounts.signTransaction(tx, Private_Key_).then(signed => { signArray.push(signed) })
        console.log(signArray.length + '/' + amountChange)
        await sleep(500)
        if (signArray.length >= amountChange) {
            console.log('Changing!', signArray.length)
            for (let index = 0; index < signArray.length; index++) {
                try {
                    // console.log('Changing!')
                    if (index == signArray.length - 1) {
                        await web3.eth.sendSignedTransaction(signArray[index].rawTransaction).catch(err => { console.error(err) })
                    } else { web3.eth.sendSignedTransaction(signArray[index].rawTransaction).catch(err => { console.error(err) }) }
                    // console.log(signChange.blockNumber)
                } catch (error) {
                    nonceAcc = [0]
                    signArray = []
                    idCache = []
                    console.log('Error during change price!!')
                }
            }
            nonceAcc = [0]
            signArray = []
            idCache = []
            await sleep(delayChange)
        }
    } catch (error) { console.log('Encode Fail', error) }
}
async function main(address_, boolMin, Private_Key_) {
    idMomo = []
    indexMomo = []
    priceSell = []
    priceBuy = []
    nameMomo = []
    boolChange = []
    flagID = false
    flagCountMomo = 0
    await sleep(1000)
    await checkListed(address_)
    for (let index1 = 1; index1 < 51; index1++) {
        await checkPriceBuy(address_, index1)
        if (flagCountMomo == idMomo.length) { break }
        await sleep(1000)
    }
    if (boolMin) {
        await sleep(5000)
        for (let indexMomo_ = idMomo.length - 1; indexMomo_ >= 0; indexMomo_--) {
            if (signArray.length > amountChange + 1) {// this code to check send bundle changePrice
                nonceAcc = File_Key.map(x => 0)
                signArray = []
                idCache = []
            }
            if (idCache.includes(idMomo[indexMomo_])) { continue }
            await checkChangePrice(indexMomo_)
            await sleep(2000)
            if (boolChange[indexMomo_] == 'TRUE') {
                // console.log('Wait!')
                idCache.push(idMomo[indexMomo_])
                if (Number(idMomo[indexMomo_]) > 10000 && Number(idMomo[indexMomo_]) < 20000 && Number(priceSell[indexMomo_]) > minCM - minChange) {
                    await changePrice(indexMomo[indexMomo_], ((Number((Number(priceSell[indexMomo_]) - minChange).toFixed(3)) * 10 ** 3).toFixed()).toString() + '000000000000000', Private_Key_, address_)
                    // console.log('Done change!')
                }
                else if (Number(idMomo[indexMomo_]) > 20000 && Number(idMomo[indexMomo_]) < 30000 && Number(priceSell[indexMomo_]) > minUCM - minChange) {
                    await changePrice(indexMomo[indexMomo_], ((Number((Number(priceSell[indexMomo_]) - minChange).toFixed(3)) * 10 ** 3).toFixed()).toString() + '000000000000000', Private_Key_, address_)
                    // console.log('Done change!')
                }
                else if (Number(idMomo[indexMomo_]) > 30000 && Number(idMomo[indexMomo_]) < 40000 && Number(priceSell[indexMomo_]) > minUNQ - minChange) {
                    await changePrice(indexMomo[indexMomo_], ((Number((Number(priceSell[indexMomo_]) - minChange).toFixed(3)) * 10 ** 3).toFixed()).toString() + '000000000000000', Private_Key_, address_)
                    // console.log('Done change!')
                }
                else if (Number(idMomo[indexMomo_]) > 40000) {
                    console.log(indexMomo[indexMomo_], 'Require set price manual!')
                }
                else { console.log(indexMomo[indexMomo_], 'Require min price, not change!') }
                boolChange[indexMomo_] = ' '
            }
        }
    }
    await sleep(1000)
}
async function loopCheck(times) {
    for (let index = 0; index < times; index++) {
        console.log('Loop:', index.toString() + '/' + times.toString())
        for (let indexAccs = 0; indexAccs < myAccounts.length; indexAccs++) {
            console.log("Account:", myAccounts[indexAccs])
            let isContract = await web3.eth.getStorageAt(myAccounts[indexAccs])
            if (!Number(isContract)) { continue }
            await main(myAccounts[indexAccs], true, Private_Key)
            await sleep(10000)
        }
        if (times > 1) { await sleep(100000) }
    }
}
// 0  
const minChange = 0.001
timeWait = 1 * 60 * 60 * 1 //wait latest change price
delayChange = 30 * 10 ** 3 //delay to update api
myAccounts = []
const myAcc = configJson.myAcc
for (let index = 0; index < myAcc.length; index++) {
    myAccounts.push(myAcc[index][0])
}
signArray = []
idCache = []
nonceAcc = [0]
amountChange = 4//bundles change
const gasPriceScan = Number((3.001 * 10 ** 9).toFixed())
const sellOff = true // if true - sale per minPrice, if false - sale if not loss
loopCheck(5000)