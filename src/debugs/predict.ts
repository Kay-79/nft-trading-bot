import { predictModel } from "AI/utils";

const getDatasetF = async () => {
    let price = 0;
    price += Number(await predictModel([300, 3303, 4, 18, 1]));
    console.log(price);
};

getDatasetF();
