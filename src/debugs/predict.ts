import { predictModel } from "AI/utils";

const getDatasetF = async () => {
    let price = 0;
    price += Number(await predictModel([320, 6850, 5, 30]));
    console.log(price);
};

getDatasetF();
