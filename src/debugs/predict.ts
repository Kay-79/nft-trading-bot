import { predictModel } from "AI/utils";

const getDatasetF = async () => {
    let price = 0;
    price += Number(await predictModel([346, 3955, 4, 19]));
    console.log(price);
};

getDatasetF();
