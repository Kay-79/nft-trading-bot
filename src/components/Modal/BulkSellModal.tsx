import React from "react";
import { useTheme } from "@/config/theme";
import { RiCloseLine } from "react-icons/ri";
import { InventoryDto } from "@/types/dtos/Inventory.dto";
import { useSelector } from "react-redux";
import BulkSellRow from "../Row/BulkSellRow";

interface BulkSellModalProps {
    onClose: () => void;
}

const BulkSellModal: React.FC<BulkSellModalProps> = ({ onClose }) => {
    const items: InventoryDto[] = useSelector(
        (state: { bulkStorage: { items: InventoryDto[] } }) => state.bulkStorage.items
    );

    const { theme } = useTheme();

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleBulkSell = () => {
        // Implement bulk sell logic here
    };

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
                alignItems: "center",
                zIndex: 1000 // Ensure the modal stays above other elements
            }}
            onClick={handleOutsideClick}
        >
            <div
                style={{
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                    padding: "20px",
                    borderRadius: "10px",
                    width: "80%",
                    maxWidth: "500px",
                    position: "relative" // Add relative positioning for the close button
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer",
                        color: theme.textColor
                    }}
                >
                    <RiCloseLine />
                </button>
                <h1 style={{ textAlign: "center" }}>Bulk Sell</h1>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {items.map((item, index) => (
                        <div
                            key={index}
                            style={{ display: "flex", justifyContent: "space-between" }}
                        >
                            <BulkSellRow bulkSellItem={item} />
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleBulkSell}
                    style={{
                        marginTop: "20px",
                        width: "100%",
                        padding: "10px 20px",
                        backgroundColor: theme.buttonBackgroundColor,
                        color: theme.buttonTextColor,
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        textAlign: "center"
                    }}
                >
                    Bulk Sell
                </button>
            </div>
        </div>
    );
};

export default BulkSellModal;
