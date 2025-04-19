import React, { useState } from "react";
import { useTheme } from "@/config/theme";
import { RiCloseLine } from "react-icons/ri";
import { BulkItemListStorage } from "@/store/reducers/bulkStorageReducer";
import { useSelector } from "react-redux";
import BulkSellRow from "../Row/BulkSellRow";
import { useDispatch } from "react-redux";
import { addItemToBulk, clearBulk } from "@/store/actions/storageBulk";
import { useAccount } from "wagmi";
import { ConnectWallet } from "@/components/ConnectWallet";
import PrimaryLoadingButton from "@/components/Button/PrimaryLoadingButton";
import { mpContractService } from "@/services/mpContract";
import { toast } from "react-toastify";
import { InventoryDto } from "@/types/dtos/Inventory.dto";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { MomoType } from "@/enum/enum";

interface BulkSellModalProps {
    onClose: () => void;
}

const BulkSellModal: React.FC<BulkSellModalProps> = ({ onClose }) => {
    const bulkSellItems: BulkItemListStorage[] = useSelector(
        (state: { bulkStorage: { bulkSellItems: BulkItemListStorage[] } }) =>
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
        let totalBulkSellItems = 0;
        for (let i = 0; i < bulkSellItems.length; i++) {
            totalBulkSellItems += bulkSellItems[i].quantity;
            if (bulkSellItems[i].price === 0) {
                toast.error("Please set price for all items!");
                setLoadingBulkSell(false);
                return;
            }
            if (
                bulkSellItems[i].quantity === 0 ||
                bulkSellItems[i].quantity > (bulkSellItems[i].inventory?.amount ?? 0)
            ) {
                toast.error("Required quantity is 0 or more than your inventory!");
                setLoadingBulkSell(false);
                return false;
            }
        }
        if (totalBulkSellItems > 6) {
            toast.error("Maximum 6 items for bulk sell!");
            setLoadingBulkSell(false);
            return false;
        }
        try {
            await mpContractService.createAuctionBatch(bulkSellItems, address);
            dispatch(clearBulk());
            toast.success("Bulk sell successfully!");
            onClose();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoadingBulkSell(false);
        }
    };

    const handleClearAll = () => {
        dispatch(clearBulk());
    };

    const handleAddCustomSellToStorage = () => {
        const item: InventoryDto = {
            id: Math.random().toString(36).substring(2, 15),
            type: MomoType.NORMAL,
            tokenId: 0,
            amount: 1,
            owner: "0x19De8F7bB60032b212d8Ed570fF97d60Fe52298F",
            prototype: 13019
        };
        const bulkItem: BulkItemListStorage = {
            id: item.id,
            inventory: item as InventoryDto,
            quantity: 1,
            price: 0
        };
        dispatch(addItemToBulk(bulkItem));
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
                {false && (
                    <button
                        onClick={handleAddCustomSellToStorage}
                        style={{
                            position: "absolute",
                            top: "25px",
                            left: "50px",
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "14px",
                            cursor: "pointer",
                            color: theme.textColor,
                            textDecoration: "underline"
                        }}
                    >
                        Custom Sell
                    </button>
                )}
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
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "15px"
                            }}
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
