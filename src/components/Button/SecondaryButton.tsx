import React from "react";
import { useTheme } from "@/config/theme";

interface SecondaryButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ onClick, children, style }) => {
    const { theme } = useTheme();

    return (
        <button
            onClick={onClick}
            style={{
                padding: "10px 20px",
                backgroundColor: theme.secondaryButtonBackgroundColor,
                color: theme.secondaryButtonTextColor,
                border: `1px solid ${theme.secondaryButtonTextColor}`,
                borderRadius: "5px",
                cursor: "pointer",
                ...style
            }}
        >
            {children}
        </button>
    );
};

export default SecondaryButton;
