import { contractProvider } from "../../providers/contractProvider";

export const decodeFunctionData = (functionFragment: string, data: string) => {
    return contractProvider.interface.decodeFunctionData(functionFragment, data);
};
