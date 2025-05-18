import React, { useState } from "react";
import { MdSell } from "react-icons/md";
import BulkSellModal from "@/components/Bulk/BulkSellModal";
import { BulkItemListStorage } from "@/store/reducers/bulkStorageReducer";
import { useSelector } from "react-redux";

const Bulk: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const bulkSellItems: BulkItemListStorage[] = useSelector(
        (state: { bulkStorage: { bulkSellItems: BulkItemListStorage[] } }) =>
            state.bulkStorage.bulkSellItems
    );

    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const toggleBulk = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div
            onClick={toggleBulk}
            style={{
                cursor: "pointer",
                marginLeft: "6px",
                marginRight: "12px",
                position: "relative",
                fontSize: "18px"
            }}
            title="Bulk Sell"
        >
            <MdSell />
            {bulkSellItems.length > 0 && (
                <span
                    style={{
                        position: "absolute",
                        top: "-6px",
                        right: "-6px",
                        background: "red",
                        color: "white",
                        borderRadius: "50%",
                        padding: "0px 5px",
                        fontSize: "10px",
                        fontWeight: "bold"
                    }}
                >
                    {bulkSellItems.length}
                </span>
            )}
            {isModalOpen && (
                <BulkSellModal
                    onClose={handleClose}
                    // Không cần truyền handleOutsideClick, BulkSellModal tự xử lý
                />
            )}
        </div>
    );
};

export default Bulk;
