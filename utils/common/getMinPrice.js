const getMinPrice = async (address) => {
    const contract = new web3.eth.Contract(abiAmount, address);
    return await contract.methods.amountUnList().call();
};

module.exports = getMinPrice;
