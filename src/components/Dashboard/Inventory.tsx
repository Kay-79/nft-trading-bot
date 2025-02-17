import React from "react";
import { Momo721 } from "@/types/dtos/Momo721";

interface InventoryProps {
    inventory: Momo721[];
    view: "list" | "card";
}

const Inventory: React.FC<InventoryProps> = ({ inventory, view }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: view === "list" ? "column" : "row",
                flexWrap: "wrap",
                gap: "20px",
            }}
        >
            {inventory.map(item => (
                <div
                    key={item.tokenId}
                    style={{
                        padding: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        width: view === "list" ? "100%" : "calc(33.333% - 20px)"
                    }}
                >
                    <h3>{item.prototype}</h3>
                    <p>Hashrate: {item.hashrate}</p>
                    <p>Level: {item.level}</p>
                    <p>Quality: {item.quality}</p>
                    {/* Add more fields as needed */}
                </div>
            ))}
        </div>
    );
};

export default Inventory;
