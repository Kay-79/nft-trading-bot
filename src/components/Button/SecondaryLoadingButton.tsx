import React from "react";
import { RiLoader4Line } from "react-icons/ri";
import { useTheme } from "@/config/theme";

interface SecondaryLoadingButtonProps {
    onClick: () => void;
    loading: boolean;
    children: React.ReactNode;
    disabled?: boolean;
    style?: React.CSSProperties;
}

const SecondaryLoadingButton: React.FC<SecondaryLoadingButtonProps> = ({
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
                padding: "10px 20px",
                backgroundColor: theme.secondaryButtonBackgroundColor,
                color: theme.secondaryButtonTextColor,
                border: `1px solid ${theme.secondaryButtonTextColor}`,
                borderRadius: "5px",
                cursor: "pointer",
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

export default SecondaryLoadingButton;
