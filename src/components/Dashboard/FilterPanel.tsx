import React from "react";
import { useTheme } from "@/config/theme";

export enum SortOptions {
    Time = "-time",
    HighToLow = "-price",
    LowToHigh = "price",
    HashrateDesc = "-hashrate",
    HashrateAsc = "hashrate"
}

export interface FilterParams {
    minPrice: number;
    maxPrice: number;
    minHashrate: number;
    maxHashrate: number;
    search: string;
    sort: SortOptions;
    vType: string;
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
            maxPrice: 0,
            minHashrate: 0,
            maxHashrate: 0,
            search: "",
            sort: SortOptions.Time,
            vType: ""
        });
    };

    const handleInputChange = (key: keyof FilterParams, value: string) => {
        if (!isNaN(Number(value)) || value === "") {
            setFilterParams({ ...filterParams, [key]: Number(value) });
        }
    };

    return (
        <div className="filter-panel">
            <h2>Filter Options</h2>
            <div className="filter-group">
                <label>Price Range</label>
                <div className="filter-range">
                    <input
                        type="text"
                        value={filterParams.minPrice || ""}
                        onChange={e => handleInputChange("minPrice", e.target.value)}
                        placeholder="Min"
                    />
                    <input
                        type="text"
                        value={filterParams.maxPrice || ""}
                        onChange={e => handleInputChange("maxPrice", e.target.value)}
                        placeholder="Max"
                    />
                </div>
            </div>
            <div className="filter-group">
                <label>Hashrate Range</label>
                <div className="filter-range">
                    <input
                        type="text"
                        value={filterParams.minHashrate || ""}
                        onChange={e => handleInputChange("minHashrate", e.target.value)}
                        placeholder="Min"
                    />
                    <input
                        type="text"
                        value={filterParams.maxHashrate || ""}
                        onChange={e => handleInputChange("maxHashrate", e.target.value)}
                        placeholder="Max"
                    />
                </div>
            </div>
            <div className="filter-group">
                <label>Search</label>
                <input
                    type="text"
                    value={filterParams.search}
                    onChange={e => setFilterParams({ ...filterParams, search: e.target.value })}
                />
            </div>
            <div className="filter-group">
                <label>Rarity</label>
                <select
                    value={filterParams.vType}
                    onChange={e => setFilterParams({ ...filterParams, vType: e.target.value })}
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
            <div className="filter-group">
                <label>Sort</label>
                <div className="filter-range">
                    <select
                        value={filterParams.sort}
                        onChange={e =>
                            setFilterParams({
                                ...filterParams,
                                sort: e.target.value as SortOptions
                            })
                        }
                    >
                        <option value="">Select</option>
                        <option value={SortOptions.Time}>Time</option>
                        <option value={SortOptions.HighToLow}>Price↓</option>
                        <option value={SortOptions.LowToHigh}>Price↑</option>
                        <option value={SortOptions.HashrateDesc}>Hashrate↓</option>
                        <option value={SortOptions.HashrateAsc}>Hashrate↑</option>
                    </select>
                </div>
            </div>
            <div className="filter-actions">
                <button onClick={handleResetAll}>Reset</button>
            </div>
            <style jsx>{`
                .filter-panel {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    width: 250px;
                    background-color: ${theme.backgroundColor};
                    color: ${theme.textColor};
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .filter-panel h2 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .filter-group {
                    margin-bottom: 20px;
                }
                .filter-group label {
                    display: block;
                    margin-bottom: 10px;
                }
                .filter-range {
                    display: flex;
                    gap: 10px;
                }
                .filter-range input,
                .filter-group input,
                .filter-range select,
                .filter-group select {
                    width: 100%;
                    padding: 10px;
                    border-radius: 5px;
                    border: 1px solid ${theme.textColor};
                    background-color: ${theme.backgroundColor};
                    color: ${theme.textColor};
                }
                .filter-actions {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                }
                .filter-actions button {
                    flex: 1;
                    padding: 10px 20px;
                    background-color: ${theme.buttonBackgroundColor};
                    color: ${theme.buttonTextColor};
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default FilterPanel;
