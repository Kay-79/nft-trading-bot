import React from "react";
import { Momo721 } from "@/types/dtos/Momo721";
import { useTheme } from "@/config/theme";
import Image from "next/image";
import { RiCloseLine } from "react-icons/ri";

interface InventoryDetailModalProps {
    item: Momo721;
    onClose: () => void;
}

const InventoryDetailModal: React.FC<InventoryDetailModalProps> = ({ item, onClose }) => {
    const { theme } = useTheme();

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
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
                    <RiCloseLine size={24} /> {/* Use the close icon */}
                </button>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Inventory Details</h2>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <Image
                        src={`/images/MOMO/${item.prototype}.png`}
                        alt="Avatar"
                        width={100}
                        height={100}
                    />
                </div>
                <p>Level: {item.level}</p>
                <p>Hashrate: {item.hashrate}</p>
                <p>Prototype: {item.prototype}</p>
                <p>Quality: {item.quality}</p>
                <p>Specialty: {item.specialty}</p>
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
                        margin: "20px auto 0"
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default InventoryDetailModal;
