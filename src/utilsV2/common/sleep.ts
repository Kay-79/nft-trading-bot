export const sleep = (s: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, s * 1000);
    });
};
export const ranSleep = (minS: number, maxS: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, Math.random() * (maxS - minS) * 1000 + minS * 1000);
    });
};
