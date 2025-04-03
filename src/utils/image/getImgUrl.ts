import { images } from "./imgs";

export const getImgUrl = (prototype: number) => {
    const hash = images[prototype.toString() as keyof typeof images];
    if (!hash) {
        return "/images/defaultMomo.png";
    }
    return `https://www.mobox.io/momo/img/${prototype}.${hash}.png`;
};
