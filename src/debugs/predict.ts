import { predictModel } from "AI/utils";

const getDatasetF = async () => {
    let price = 0;
    price += Number(await predictModel([800, 21965, 5, 40]));
    console.log(price);
};

getDatasetF();
