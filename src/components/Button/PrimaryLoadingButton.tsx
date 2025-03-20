import React from "react";
import { RiLoader4Line } from "react-icons/ri";
import { useTheme } from "@/config/theme";

interface LoadingButtonProps {
    onClick: () => void;
    loading: boolean;
    children: React.ReactNode;
    disabled?: boolean;
    style?: React.CSSProperties;
}

const PrimaryLoadingButton: React.FC<LoadingButtonProps> = ({
    onClick,
    loading,
    children,
    disabled,
    style
}) => {
    const { theme } = useTheme();
    return (
        <button
            onClick={onClick}
            disabled={loading || disabled}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: loading ? "not-allowed" : "pointer",
                position: "relative",
                padding: "10px 20px",
                backgroundColor: theme.primaryButtonBackgroundColor,
                color: theme.primaryButtonTextColor,
                border: "none",
                borderRadius: "5px",
                ...style
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

export default PrimaryLoadingButton;
