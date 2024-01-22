const sortPerBudget = async (addressesInfor, contractToken_) => {
    for (let i = 0; i < addressesInfor.length; i++) {
        addressesInfor[i].push(
            (await contractToken_.methods.balanceOf(addressesInfor[i][0]).call()) / 10 ** 18
        );
    }
    addressesInfor.sort((a, b) => {
        return b[3] - a[3];
    });
    // for (let i = 0; i < addressesInfor.length; i++) {
    //     console.log(addressesInfor[i]);
    // }
    return addressesInfor;
};
module.exports = sortPerBudget;
