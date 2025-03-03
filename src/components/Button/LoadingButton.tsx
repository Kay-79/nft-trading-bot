import React from "react";
import { useTheme } from "@/config/theme";
import { RiLoader4Line } from "react-icons/ri";

interface LoadingButtonProps {
    onClick: () => void;
    loading: boolean;
    children: React.ReactNode;
    disabled?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ onClick, loading, children, disabled }) => {
    const { theme } = useTheme();

    return (
        <button
            onClick={onClick}
            disabled={loading || disabled}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 20px",
                backgroundColor: theme.buttonBackgroundColor,
                color: theme.textColor,
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
                position: "relative"
            }}
        >
            {loading ? (
                <RiLoader4Line
                    size={24}
                    style={{
                        animation: "spin 1s linear infinite"
                    }}
                />
            ) : (
                children
            )}
            <style jsx>{`
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </button>
    );
};

export default LoadingButton;
