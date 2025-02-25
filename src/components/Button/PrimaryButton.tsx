import React from "react";
import { useTheme } from "@/config/theme";

interface PrimaryButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick, children, style }) => {
    const { theme } = useTheme();

    return (
        <button
            onClick={onClick}
            style={{
                padding: "10px 20px",
                backgroundColor: theme.primaryButtonBackgroundColor,
                color: theme.primaryButtonTextColor,
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                ...style
            }}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
