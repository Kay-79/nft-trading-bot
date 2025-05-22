export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        console.error(error);
        return error.message.length > 100 ? "An error occurred!" : error.message;
    }
    return "An unknown error occurred.";
};
