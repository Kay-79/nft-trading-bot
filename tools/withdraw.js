require("dotenv").config();
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org"));
const abiWallet = require("../abi/abiWallet");
const config = require("../config/config");
const walletAddress = config.wallet.address;
const contractWallet = new web3.eth.Contract(abiWallet, walletAddress);
const tokenAddress = config.addressToken;

const withdraw = async () => {
    const tx = {
        to: walletAddress,
        data: contractWallet.methods
            .transferToken(
                tokenAddress,
                config.wallet.owner,
                (amountWithdraw * 10 ** 18).toString()
            )
            .encodeABI(),
        value: 0,
        gas: 100000,
        gasPrice: 3000000000,
    };
    const signed = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY_BID);
    if (config.wallet.owner != "0x55555D4de8df0c455C2Ff368253388FE669a8888") {
        console.warn("Please check wallet address");
        exit();
    }
    await web3.eth.sendSignedTransaction(signed.rawTransaction);
    console.log(`Withdraw successfully ${amountWithdraw} USDT to owner`);
};
// withdraw to owner
const amountWithdraw = 80.0;
withdraw();
