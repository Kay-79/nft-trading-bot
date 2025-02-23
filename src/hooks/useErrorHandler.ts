import { useState } from "react";

export const useErrorHandler = () => {
    const [error, setError] = useState<Error | null>(null);

    const handleError = (error: Error | null) => {
        if (error) {
            console.error(error);
        }
        setError(error);
    };

    return { error, handleError };
};
