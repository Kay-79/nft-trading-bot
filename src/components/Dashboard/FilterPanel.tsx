import React from "react";
import { useTheme } from "@/config/theme";

export interface FilterParams {
    minPrice: number;
    minHashrate: number;
    search: string;
    sort: string;
    sortOrder: string;
    vType: string; // rarity
}

interface FilterPanelProps {
    filterParams: FilterParams;
    setFilterParams: React.Dispatch<React.SetStateAction<FilterParams>>;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filterParams, setFilterParams }) => {
    const { theme } = useTheme();

    const handleResetAll = () => {
        setFilterParams({
            minPrice: 0,
            minHashrate: 0,
            search: "",
            sort: "uptime",
            sortOrder: "desc",
            vType: ""
        });
    };

    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                left: "20px",
                width: "250px",
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Filter Options</h2>
            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "10px" }}>Minimum Price</label>
                <input
                    type="text"
                    value={filterParams.minPrice || ""}
                    onChange={e => {
                        const value = e.target.value;
                        if (!isNaN(Number(value)) || value === "") {
                            setFilterParams({ ...filterParams, minPrice: Number(value) });
                        }
                    }}
                    onWheel={e => e.currentTarget.blur()} // Disable scroll wheel input change
                    placeholder="0" // Add placeholder
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
                    type="text"
                    value={filterParams.minHashrate || ""}
                    onChange={e => {
                        const value = e.target.value;
                        if (!isNaN(Number(value)) || value === "") {
                            setFilterParams({ ...filterParams, minHashrate: Number(value) });
                        }
                    }}
                    placeholder="0"
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
                    value={filterParams.search}
                    onChange={e => setFilterParams({ ...filterParams, search: e.target.value })}
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
                <label style={{ display: "block", marginBottom: "10px" }}>Rarity</label>
                <select
                    value={filterParams.vType}
                    onChange={e => setFilterParams({ ...filterParams, vType: e.target.value })}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: `1px solid ${theme.textColor}`,
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor
                    }}
                >
                    <option value="">All</option>
                    <option value="1">Common</option>
                    <option value="2">Uncommon</option>
                    <option value="3">Unique</option>
                    <option value="4">Rare</option>
                    <option value="5">Epic</option>
                    <option value="6">Legendary</option>
                </select>
            </div>
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "10px" }}>Sort By</label>
                    <select
                        value={filterParams.sort}
                        onChange={e => setFilterParams({ ...filterParams, sort: e.target.value })}
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
                        <option value="prototype">Prototype</option>
                        <option value="amount">Amount</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "10px" }}>Sort Order</label>
                    <select
                        value={filterParams.sortOrder}
                        onChange={e =>
                            setFilterParams({ ...filterParams, sortOrder: e.target.value })
                        }
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "5px",
                            border: `1px solid ${theme.textColor}`,
                            backgroundColor: theme.backgroundColor,
                            color: theme.textColor
                        }}
                    >
                        <option value="desc">Desc</option>
                        <option value="asc">Asc</option>
                    </select>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
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
