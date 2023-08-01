const request = require('request');
const fs = require('fs');
const configJson = JSON.parse(fs.readFileSync('./config/config.json'));
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const Web3 = require('web3');
const { exit } = require('process');
// const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-testnet.public.blastapi.io"));
const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ankr.com/bsc"));
// const web3sc = new Web3(new Web3.providers.WebsocketProvider('wss://solemn-wild-aura.bsc.discover.quiknode.pro/9fbdf28f69f47aa85c76222be804b4224c2dbd22/'));
const apiTele = configJson.api.telegram
const chatId = configJson.chatId.mobox
const abi = JSON.parse(fs.readFileSync('./config/abiMobox.json'));
const consractAddress = '0x3000EdD433B4AFDbc6f94Ac2d29c170d73bb8f34'
const contract = new web3.eth.Contract(abi, consractAddress);
// console.log(acc)
async function init(Private_Key_) {
    inputdata = 'Nonce'
    Bid = false
    try {
        const inputdata = fs.readFileSync('waitBid.txt', 'utf8');
        dataBid = inputdata.split('\n')
        // console.log(dataBid)
        if (inputdata.length > 40) {
            Bid = true
        }
    } catch (err) { }
    if (Bid == true) {
        const seller_ = dataBid[0].split(',')
        const index_ = dataBid[2].split(',')
        const startTime_ = dataBid[3].split(',')
        const priceList = dataBid[1].split(',')
        const amountList = dataBid[5].split(',')
        const idList = dataBid[4].split(',')
        const gasPriceScan = Number((Number(dataBid[6].split(',')) * 10 ** 9).toFixed())
        // if (gasPriceScan > 25 * 10 ** 9) {
        //     // console.log('Err gasPrice:', gasPriceScan)
        //     gasPriceScan = Number((20 * 10 ** 9).toFixed())
        // }
        let amountBid = 0
        for (let index = 0; index < amountList.length; index++) {
            amountBid += Number(amountList[index])
        }
        if (index_[0] != '' && (Date.now() / 1000 > Number(startTime_[0]) + timeWait)) {
            if (false || (Date.now() / 1000 < Number(startTime_[0]) + timeWait + overTime)) {
                var encoded = ''
                if (index_.length > 1) {
                    encoded = contract.methods.buyBatch(seller_, index_, startTime_, priceList, true, amountBid.toString()).encodeABI();
                    gasLimit = 1000000
                }
                else if (index_.length == 1) {
                    encoded = contract.methods.bid(seller_.toString(), index_.toString(), startTime_.toString(), priceList.toString(), amountBid.toString()).encodeABI();
                    gasLimit = 900000
                }
                var tx = {
                    from: acc.address,
                    gas: gasLimit,
                    gasPrice: gasPriceScan,
                    to: consractAddress,
                    value: 0,
                    data: encoded
                }
                let checkSuccess = 'Success'
                try {
                    console.log('Paying!!')
                    let signed = await web3.eth.accounts.signTransaction(tx, Private_Key_)
                    let biding = await web3.eth.sendSignedTransaction(signed.rawTransaction)
                    console.log('Successful bid! At block:', biding.blockNumber)
                } catch (error) {
                    console.error('Error during bid Auction!');
                    // console.error(error);
                    checkSuccess = 'Fail'
                }
                await sleep(1000)
                for (let op = 0; op < idList.length; op++) {
                    idList[op] = idList[op].slice(0, 1)
                }
                try {
                    let price_send = []
                    for (let q = 0; q < priceList.length; q++) {
                        price_send.push(' ' + ((Number(priceList[q]) - 10 ** 14) / 10 ** 18).toFixed(2))
                    }
                    priceList1 = checkSuccess + ' ' + (Number(gasPriceScan) / 10 ** 9).toFixed(2) + '\nPrices   : ' + price_send.toString().replace(' ', '') + '\nAmount: ' + amountList + '\nID List   : ' + idList
                } catch (error) { }
                try {
                    request('https://api.telegram.org/' + apiTele + '/sendMessage?chat_id=@' + chatId + '&text=' + priceList1, function (error, response, body) { });
                } catch (error) { }
            }
            else {
                console.log('Over time (' + overTime.toString() + ' seconds)!!')
            }
            dataBid.splice(0, 7)
            for (let iii = 1; iii < dataBid.length; iii++) {
                dataBid[iii] = '\n' + dataBid[iii]
            }
            content = ''
            for (let iii = 0; iii < dataBid.length; iii++) {
                content = content + dataBid[iii].toString()
            }
            fs.writeFile('waitBid.txt', content, err => {
                if (err) {
                    console.error(err);
                }
            });
            await sleep(1000)
        }
    }
}
async function init2(nameFile_) {
    console.log(nameFile_)
    try {
        const passData = fs.readFileSync('myAccount' + nameFile_ + '.txt', 'utf8');
        myAccount = passData.split('\n')
    } catch (err) {
        console.error(err);
    }
    const Private_Key = myAccount[1]
    acc = web3.eth.accounts.privateKeyToAccount(Private_Key)
    console.log(acc.address)
    while (true) {
        await init(Private_Key)
        await sleep(100)
    }
}
const overTime = 10
const runAcc = fs.readFileSync('./data/runAcc.txt', 'utf8');
console.log(runAcc)
const timeWait = 117.2 //timeWait to buy (40 block ~ 120s)1:117 - may buy early, now test 117.2
init2(runAcc)