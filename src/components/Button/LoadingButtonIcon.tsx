import { customDarkTheme } from "@/config/theme";
import React from "react";
import { RiLoader4Line } from "react-icons/ri";

interface LoadingButtonIconProps {
    onClick: () => void;
    loading: boolean;
    children: React.ReactNode;
    disabled?: boolean;
    style?: React.CSSProperties;
}

const LoadingButtonIcon: React.FC<LoadingButtonIconProps> = ({
    onClick,
    loading,
    children,
    disabled
}) => {
    return (
        <button
            onClick={onClick}
            disabled={loading || disabled}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 20px",
                color: customDarkTheme.textColor,
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

export default LoadingButtonIcon;
