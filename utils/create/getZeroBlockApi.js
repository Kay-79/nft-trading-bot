const getZeroBlockApi = async (blockCheck, addressCheck) => {
    console.log(blockCheck);
    try {
        let firstBlock = blockCheck - 2000;
        let mpListed = null;
        try {
            mpListed = await axios.get(
                `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${firstBlock}&toBlock=${blockCheck}&address=${process.env.ADDRESS_MOMO}&topic0=${process.env.TOPIC_HASH}&apikey=${process.env.BSC_API_KEY}`
            );
        } catch (error) {
            console.log(error);
            return await getZeroBlockApi(blockCheck, addressCheck);
        }
        const data = mpListed.data.result;
        if (data.length === 0) {
            return await getZeroBlockApi(firstBlock, addressCheck);
        }
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].topics[1] === addressCheck) {
                if (data[i].data.slice(120, 130) === "0000000000") {
                    const result = Number(data[i].blockNumber);
                    return result;
                }
            }
        }
        return await getZeroBlockApi(Number(data[0].blockNumber) - 1, addressCheck);
    } catch (error) {
        console.log(error);
        exit();
    }
};
module.exports = { getZeroBlockApi };
// params: blockCheck: nowBlock, addressCheck: hexAddress
