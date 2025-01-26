import { predictModel } from "AI/utils";

const getDatasetF = async () => {
    let price = 0;
    price += Number(await predictModel([340, 2856, 4, 14]));
    console.log(price);
};

getDatasetF();
