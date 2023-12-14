const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
const ranSleep = (min, max) => {
    return new Promise((resolve) => {
        setTimeout(resolve, Math.random() * (max - min) + min);
    });
};
module.exports = {
    sleep,
    ranSleep,
};
