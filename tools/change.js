const axios = require('axios');
const fs = require('fs');
const Web3 = require('web3');
const price = require('./config.json');
const abi = require('./config/abiMobox.json');
const { exit } = require('process');
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
// const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-testnet.public.blastapi.io"));
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.defibit.io"));
minCM = price.minPrice.minCommon
minUCM = price.minPrice.minUncommon
minUNQ = price.minPrice.minUnique
Private_Key = []
Account_Key = []
File_Key = ['_1_0_1', '_4_1_1', '_4_1_2', '_5_8_1', '_6_7_1', '_7_7_1']
nonceAcc = File_Key.map(x => 0)
for (let indexFiles = 0; indexFiles < File_Key.length; indexFiles++) {
    try {
        const passData = fs.readFileSync('myAccount' + File_Key[indexFiles] + '.txt', 'utf8');
        myAccount = passData.split('\n')
    } catch (err) {
        console.error(err);
    }
    Private_Key.push(myAccount[1])
    // Account_Key.push(web3.eth.accounts.privateKeyToAccount(Private_Key[indexFiles]).address)
    Account_Key.push(web3.utils.toChecksumAddress(web3.eth.accounts.privateKeyToAccount(Private_Key[indexFiles]).address))
}
const contractAddress = ('0xcb0cffc2b12739d4be791b8af7fbf49bc1d6a8c2')
const contract = new web3.eth.Contract(abi, contractAddress);
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
    for (let index = 0; index < Account_Key.length; index++) {
        if (address_ == Account_Key[index]) {
            encoded = contract.methods.changePrice(index_, priceChange_, priceChange_, 2).encodeABI();
            await web3.eth.getTransactionCount(address_).then((nonce) => {
                tx = {
                    nonce: nonce + nonceAcc[index],
                    from: address_,
                    gas: 57865,
                    gasPrice: gasPriceScan,
                    to: contractAddress,
                    value: 0,
                    data: encoded
                }
            })
            nonceAcc[index] += 1
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
                    nonceAcc = File_Key.map(x => 0)
                    signArray = []
                    idCache = []
                    console.log('Error during change price!!')
                }
            }
            nonceAcc = File_Key.map(x => 0)
            signArray = []
            idCache = []
            await sleep(delayChange)
        }
    } catch (error) { console.log('Encode Fail') }
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
        for (let indexAccs = 0; indexAccs < Account_Key.length; indexAccs++) {
            console.log("Account:", Account_Key[indexAccs])
            await main(Account_Key[indexAccs], true, Private_Key[indexAccs])
            await sleep(10000)
        }
        if (times > 1) { await sleep(100000) }
    }
}
// 0  
const minChange = 0.001
timeWait = 1 * 60 * 60 * 1 //wait latest change price
delayChange = 30 * 10 ** 3 //delay to update api
myAccounts = [
    ['0x11119D51e2Ff85D5353ABf499Fe63bE3344c0000'],
    ['0x444430ba89a0741902253756d009213ba1151111'],
    ['0x4444eA3CeBBD866c19F7769aA260E02B5D561111'],
    ['0x55555D4de8df0c455C2Ff368253388FE669a8888'],
    ['0x666685e40D852fa173136Ef77A16142431Cc7777'],
    ['0x77775a358050DE851b06603864FbD380637C7777'],
    ['0x3000EdD433B4AFDbc6f94Ac2d29c170d73bb8f34']
]
signArray = []
idCache = []
amountChange = 1//bundles change
const gasPriceScan = Number((3.001 * 10 ** 9).toFixed())
const sellOff = true // if true - sale per minPrice, if false - sale if not loss
loopCheck(5000)