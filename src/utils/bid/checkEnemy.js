const enemyMethodID = [
    "0x8f70585f", // bid MP normal
    "0x9ca71766", // bid MP bundle
    "0x49932a23", // pro enemy
    "0x3f98d8b3", // pro enemy bundle
    "0x91d787f0", // idiot enemy
    "0x55136b8c", // pro enemy 2
    "0x34e40b2e" // pro enemy bundle
];
const checkEnemy = txInput => {
    for (let i = 0; i < enemyMethodID.length; i++) {
        if (txInput.includes(enemyMethodID[i])) return true;
    }
    return false;
};

module.exports = checkEnemy;
