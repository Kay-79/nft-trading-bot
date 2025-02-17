import React from "react";
import { useTheme } from "@/config/theme";

interface FilterModalProps {
    onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ onClose }) => {
    const { theme } = useTheme();

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <div
                style={{
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                    padding: "20px",
                    borderRadius: "10px",
                    width: "80%",
                    maxWidth: "500px"
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Filter Options</h2>
                {/* Add filter options here */}
                <button
                    onClick={onClose}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: theme.buttonBackgroundColor,
                        color: theme.buttonTextColor,
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "block",
                        margin: "0 auto"
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default FilterModal;
