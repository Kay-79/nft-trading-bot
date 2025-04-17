export const getBackgroundColor = (prototype: number): string => {
    const firstDigit = prototype.toString()[0];
    switch (firstDigit) {
        case "1":
            return "#474747";
        case "2":
            return "#304119";
        case "3":
            return "#1e2f5c";
        case "4":
            return "#3e1f58";
        case "5":
            return "#5F4E12";
        case "6":
            return "#661919";
        default:
            return "black";
    }
};
