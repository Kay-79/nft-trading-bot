const fs = require('fs');
const Web3 = require('web3');
const { exit } = require('process');
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org"));
const abi = [{ "constant": true, "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferERC20", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
const contractBUSD = new web3.eth.Contract(abi, '0xe9e7cea3dedca5984780bafc599bd69add087d56');
const configJson = JSON.parse(fs.readFileSync('./config/config.json'));
const myAcc = configJson.myAcc
try {
    const passData = fs.readFileSync('myAccount_5_8_1.txt', 'utf8');
    myAccount = passData.split('\n')
} catch (err) {
    console.error(err);
    exit()
}
const Private_Key = myAccount[1]

async function withdrawTo(address_) {
    let checkMyAcc = false
    for (let index = 0; index < myAcc.length; index++) {
        if (myAcc[index][0] == address_) { checkMyAcc = true }
    }
    if (!checkMyAcc) {
        console.log("Owner address is not you!")
        exit()
    }
    let cacheWithdraw = 0
    for (let index = 0; index < myAcc.length; index++) {
        let isContract = await web3.eth.getStorageAt(myAcc[index][0])
        if (!Number(isContract) || myAcc[index][0] == address_ || myAcc[index][1] == '_F_E_A') { continue }
        let balanceSC = await contractBUSD.methods.balanceOf(myAcc[index][0]).call()
        console.log(myAcc[index][0])
        console.log(balanceSC / 10 ** 18)
        if (balanceSC / 10 ** 18 > 10) {
            cacheWithdraw += balanceSC / 10 ** 18
            if (cacheWithdraw > maxWithdraw) {
                balanceSC = Number((Number((cacheWithdraw - maxWithdraw).toFixed(2)) * 10 ** 18).toFixed(0))
            }
            try {
                const contractAddress = new web3.eth.Contract(abi, myAcc[index][0]);
                let encoded = await contractAddress.methods.transferERC20('0xe9e7cea3dedca5984780bafc599bd69add087d56', address_, balanceSC.toString()).encodeABI();
                var tx = {
                    gas: 100000,
                    gasPrice: 3.001 * 10 ** 9,
                    to: myAcc[index][0],
                    value: 0,
                    data: encoded
                }
                let signed = await web3.eth.accounts.signTransaction(tx, Private_Key)
                await web3.eth.sendSignedTransaction(signed.rawTransaction)
                console.log('Tranfer ' + (balanceSC / 10 ** 18).toFixed(2).toString() + 'BUSD from ' + myAcc[index][0] + ' to ' + address_);
            } catch (error) {
                console.log("Encode Fail", error)
            }
            if (cacheWithdraw > maxWithdraw) {
                console.log("Done withdraw max", maxWithdraw)
                exit()
            }
        }
    }
}

const maxWithdraw = 50

withdrawTo('0x11119D51e2Ff85D5353ABf499Fe63bE3344c0000')