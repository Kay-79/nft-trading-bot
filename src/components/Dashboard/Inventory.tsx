import React from "react";
import InventoryCard from "@/components/Card/InventoryCard";
import { InventoryDto } from "@/types/dtos/Inventory.dto";

interface InventoryProps {
    inventories: InventoryDto[];
}

const Inventory: React.FC<InventoryProps> = ({ inventories }) => {
    if (!Array.isArray(inventories)) {
        return <div>No inventories available</div>;
    }

    const totalInventories = inventories.reduce(
        (sum, inventory) => sum + (inventory.amount || 0),
        0
    );

    return (
        <div>
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
                <p style={{ margin: 0 }}>Total Inventories: {totalInventories}</p>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "20px",
                    justifyContent: "center"
                }}
            >
                {inventories.map(item => (
                    <InventoryCard key={item.id + (item.tokenId?.toString() ?? "")} item={item} />
                ))}
                <style jsx>{`
                    @media (max-width: 768px) {
                        div {
                            grid-template-columns: 1fr;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Inventory;
