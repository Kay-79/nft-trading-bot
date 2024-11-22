import { contractProvider } from "../../providers/contractProvider";

export const decodeFunctionData = (functionFragment: string, data: string) => {
    return contractProvider.interface.decodeFunctionData(functionFragment, data);
};

export const shortenAddress = (address: string, prefix = 6, suffix = 4) => {
    return `${address.slice(0, prefix)}...${address.slice(-suffix)}`;
};

export const addressTo32Bytes = (address: string) => {
    return "0x" + address.slice(2, 42).padStart(64, "0").toLowerCase();
};
