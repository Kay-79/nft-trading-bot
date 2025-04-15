import React, { useState, useCallback } from "react";
import Image from "next/image";
import { InventoryDto } from "@/types/dtos/Inventory.dto";
import { getBackgroundColor } from "@/utils/colorUtils";
import { shortenNumber } from "@/utils/shorten";
import PrimaryLoadingButton from "../Button/PrimaryLoadingButton";
import { toast } from "react-toastify";
import axios from "axios";
import PrimaryLoadingIcon from "../Button/PrimaryLoadingIcon";
import { RiRefreshLine } from "react-icons/ri";
import { RiAiGenerate2 } from "react-icons/ri";
import { getImgUrl } from "@/utils/image/getImgUrl";
import { mpContractService } from "@/services/mpContract";
import { useAccount } from "wagmi";
import { ConnectWallet } from "@/components/ConnectWallet";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface InventoryDetailModalProps {
    item: InventoryDto;
    onClose: () => void;
}

const InventoryDetailModal: React.FC<InventoryDetailModalProps> = ({ item, onClose }) => {
    const [loadingList, setLoadingList] = useState(false);
    const [itemData, setItemData] = useState<InventoryDto>(item);
    const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
    const [loadingPredict, setLoadingPredict] = useState<boolean>(false);
    const [isListing, setIsListing] = useState(false);
    const [listPrice, setListPrice] = useState<number | null>(null);
    const { address } = useAccount();

    const handleList = () => {
        setIsListing(true);
    };

    const handleConfirm = async () => {
        setLoadingList(true);
        try {
            if (!listPrice) {
                toast.error("Please enter a valid price!");
                return;
            }
            if (listPrice <= 0) {
                toast.error("Price must be greater than 0!");
                return;
            }
            if (itemData.prototype === 99999) {
                toast.error("Plese sync the item first!");
                setLoadingList(false);
                return;
            }
            await mpContractService.createAuction(item, address, listPrice);
            toast.success("Item listed successfully!");
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoadingList(false);
            setIsListing(false);
            onClose();
        }
    };

    const handleRefresh = async () => {
        try {
            const response = await axios.post("/api/refreshInventory", {
                inventory: itemData
            });
            setItemData(response.data.data);
            toast.success("Listing refreshed successfully!");
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const handlePredict = useCallback(async () => {
        setLoadingPredict(true);
        try {
            const url = (itemData?.tokenId ?? 0) > 0 ? "/api/predict721" : "/api/predict1155";
            const response = await axios.post(url, {
                hashrate: itemData.hashrate ?? 0,
                lvHashrate: itemData.lvHashrate ?? 0,
                prototype: itemData.prototype ?? 0,
                level: itemData.level ?? 0,
                ids: [],
                amounts: [],
                tokenId: itemData.tokenId ?? 99999
            });
            const predicted = response.data.prediction;
            setPredictedPrice(shortenNumber(predicted, 0, 3));
        } catch {
            toast.error("Prediction failed!");
        } finally {
            setLoadingPredict(false);
        }
    }, [itemData]);

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const backgroundColor = getBackgroundColor(itemData.prototype || 0);

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
                    backgroundColor: "#1a1a1a",
                    color: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "80%",
                    maxWidth: "400px",
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
                        color: "#fff"
                    }}
                >
                    ✕
                </button>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Inventory Details</h2>
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "20px",
                        backgroundColor: backgroundColor,
                        padding: "10px",
                        borderRadius: "10px",
                        position: "relative" // Added for icon positioning
                    }}
                >
                    <div
                        className="flex justify-between items-center"
                        style={{ marginBottom: "20px" }}
                    >
                        <span className="text-sm flex items-center gap-1">
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs">
                                Lv. {itemData.level}
                            </span>
                        </span>
                        <div className="text-right">
                            <p className="text-lg font-bold">{itemData.lvHashrate}</p>
                            <p className="text-xs text-gray-300">
                                {(itemData.hashrate || 0) > 5 ? (
                                    `Lv. 1 - ${itemData.hashrate}`
                                ) : (
                                    <br />
                                )}
                            </p>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "50px"
                        }}
                    >
                        <Image
                            src={getImgUrl(itemData.prototype || 0)}
                            alt="Avatar"
                            width={100}
                            height={100}
                            priority
                        />
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            bottom: "10px",
                            right: "10px",
                            display: "flex",
                            gap: "10px"
                        }}
                    >
                        {itemData.prototype === 99999 && (
                            <PrimaryLoadingIcon onClick={handleRefresh} loading={false}>
                                <RiRefreshLine size={24} />
                            </PrimaryLoadingIcon>
                        )}
                        {predictedPrice === null ? (
                            <PrimaryLoadingIcon onClick={handlePredict} loading={loadingPredict}>
                                <RiAiGenerate2 size={24} />
                            </PrimaryLoadingIcon>
                        ) : (
                            <div>
                                {predictedPrice !== null && (
                                    <span className="text-blue-400 font-bold text-lg">
                                        {predictedPrice} USDT
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    {!address ? (
                        <ConnectWallet />
                    ) : isListing ? (
                        <>
                            <input
                                type="number"
                                placeholder="Enter price"
                                value={listPrice || predictedPrice || ""}
                                onChange={e => setListPrice(Number(e.target.value))}
                                onWheel={e => e.currentTarget.blur()}
                                style={{
                                    padding: "10px",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    marginRight: "10px",
                                    width: "60%",
                                    backgroundColor: "#fff",
                                    color: "#000"
                                }}
                            />
                            <PrimaryLoadingButton onClick={handleConfirm} loading={loadingList}>
                                Confirm
                            </PrimaryLoadingButton>
                        </>
                    ) : (
                        <PrimaryLoadingButton onClick={handleList} loading={loadingList}>
                            List
                        </PrimaryLoadingButton>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryDetailModal;
