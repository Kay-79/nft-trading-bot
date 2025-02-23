import React, { useState } from "react";
import { useTheme } from "@/config/theme";

interface FilterPanelProps {
    applyFilter: (filter: {
        minPrice: number;
        minHashrate: number;
        search: string;
        sort: string;
        sortOrder: string;
    }) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ applyFilter }) => {
    const { theme } = useTheme();
    const [minPrice, setMinPrice] = useState<number>(0);
    const [minHashrate, setMinHashrate] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    const handleApplyFilter = () => {
        applyFilter({ minPrice, minHashrate, search, sort, sortOrder });
    };

    const handleResetAll = () => {
        setMinPrice(0);
        setMinHashrate(0);
        setSearch("");
        setSort("");
        setSortOrder("asc");
        applyFilter({ minPrice: 0, minHashrate: 0, search: "", sort: "", sortOrder: "asc" });
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
            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "10px" }}>Search</label>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
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
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "10px" }}>Sort By</label>
                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "5px",
                            border: `1px solid ${theme.textColor}`,
                            backgroundColor: theme.backgroundColor,
                            color: theme.textColor
                        }}
                    >
                        <option value="">Select</option>
                        <option value="price">Price</option>
                        <option value="hashrate">Hashrate</option>
                        <option value="level">Level</option>
                        <option value="uptime">Uptime</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "10px" }}>Sort Order</label>
                    <select
                        value={sortOrder}
                        onChange={e => setSortOrder(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "5px",
                            border: `1px solid ${theme.textColor}`,
                            backgroundColor: theme.backgroundColor,
                            color: theme.textColor
                        }}
                    >
                        <option value="asc">Asc</option>
                        <option value="desc">Desc</option>
                    </select>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <button
                    onClick={handleApplyFilter}
                    style={{
                        flex: 1,
                        padding: "10px 20px",
                        backgroundColor: theme.buttonBackgroundColor,
                        color: theme.buttonTextColor,
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        textAlign: "center"
                    }}
                >
                    Apply
                </button>
                <button
                    onClick={handleResetAll}
                    style={{
                        flex: 1,
                        padding: "10px 20px",
                        backgroundColor: theme.buttonBackgroundColor,
                        color: theme.buttonTextColor,
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        textAlign: "center"
                    }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default FilterPanel;
