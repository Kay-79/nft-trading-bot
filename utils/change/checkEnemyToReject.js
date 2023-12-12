const enemys = [
    "0x914ddECd7238a2b2858808C227969F74Eb276288",
    "0x06e8e9e60eba78495f166d73333A10fA49b23f8c",
    "0x946398fb54a90d3512E9Be5f5F66456f2f760215",
];

const checkReject = (address) => {
    for (let i = 0; i < enemys.length; i++) {
        if (enemys[i] == address) {
            return true;
        }
    }
    return false;
};

module.exports = checkReject;
