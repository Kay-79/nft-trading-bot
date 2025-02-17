import React, { useState } from "react";
import { useTheme } from "@/config/theme";

interface FilterPanelProps {
    applyFilter: (filter: { minPrice: number; minHashrate: number }) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ applyFilter }) => {
    const { theme } = useTheme();
    const [minPrice, setMinPrice] = useState<number>(0);
    const [minHashrate, setMinHashrate] = useState<number>(0);

    const handleApplyFilter = () => {
        applyFilter({ minPrice, minHashrate });
    };

    return (
        <div
            style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Filter Options</h2>
            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "10px" }}>Minimum Price</label>
                <input
                    type="number"
                    value={minPrice}
                    onChange={e => setMinPrice(Number(e.target.value))}
                    onWheel={e => e.currentTarget.blur()} // Disable scroll wheel input change
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: `1px solid ${theme.textColor}`,
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor
                    }}
                />
            </div>
            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "10px" }}>Minimum Hashrate</label>
                <input
                    type="number"
                    value={minHashrate}
                    onChange={e => setMinHashrate(Number(e.target.value))}
                    onWheel={e => e.currentTarget.blur()} // Disable scroll wheel input change
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: `1px solid ${theme.textColor}`,
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor
                    }}
                />
            </div>
            <button
                onClick={handleApplyFilter}
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
                Apply Filter
            </button>
        </div>
    );
};

export default FilterPanel;
