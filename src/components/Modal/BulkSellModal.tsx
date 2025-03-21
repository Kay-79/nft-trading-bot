import React, { useState } from "react";
import { useTheme } from "@/config/theme";
import { RiCloseLine } from "react-icons/ri";
import { InventoryDto } from "@/types/dtos/Inventory.dto";
import { useSelector } from "react-redux";
import BulkSellRow from "../Row/BulkSellRow";
import { useDispatch } from "react-redux";
import { clearBulk } from "@/store/actions/storageBulk";
import { useAccount } from "wagmi";
import { ConnectWallet } from "@/components/ConnectWallet";
import PrimaryLoadingButton from "@/components/Button/PrimaryLoadingButton";

interface BulkSellModalProps {
    onClose: () => void;
}

const BulkSellModal: React.FC<BulkSellModalProps> = ({ onClose }) => {
    const bulkSellItems: InventoryDto[] = useSelector(
        (state: { bulkStorage: { bulkSellItems: InventoryDto[] } }) =>
            state.bulkStorage.bulkSellItems
    );
    const dispatch = useDispatch();

    const { theme } = useTheme();
    const { address } = useAccount();
    const [loadingBulkSell, setLoadingBulkSell] = useState<boolean>(false);

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleBulkSell = async () => {
        setLoadingBulkSell(true);
        try {
            // similate bulk sell
            await new Promise(resolve => setTimeout(resolve, 2000));
            dispatch(clearBulk());
            onClose();
        } catch {
            // Handle error
        } finally {
            setLoadingBulkSell(false);
        }
    };

    const handleClearAll = () => {
        dispatch(clearBulk());
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
                zIndex: 1000
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
                    position: "relative"
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
                <button
                    onClick={handleClearAll}
                    style={{
                        position: "absolute",
                        top: "25px",
                        right: "50px",
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "14px",
                        cursor: "pointer",
                        color: theme.textColor,
                        textDecoration: "underline"
                    }}
                >
                    Clear All
                </button>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {bulkSellItems?.map((item, index) => (
                        <div
                            key={index}
                            style={{ display: "flex", justifyContent: "space-between" }}
                        >
                            <BulkSellRow bulkSellItem={item} />
                        </div>
                    ))}
                </div>
                <div
                    style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}
                >
                    {address ? (
                        <PrimaryLoadingButton
                            onClick={handleBulkSell}
                            loading={loadingBulkSell}
                            style={{
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
                        </PrimaryLoadingButton>
                    ) : (
                        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            <ConnectWallet />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BulkSellModal;
