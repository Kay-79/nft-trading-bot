import React, { useState, useCallback, useMemo } from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { customDarkTheme, useTheme } from "@/config/theme";
import Image from "next/image";
import { shortenNumber, shortenAddress } from "@/utils/shorten";
import axios from "axios";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getBackgroundColor } from "@/utils/colorUtils";
import { mpContractService } from "@/services/mpContract";
import { useAccount } from "wagmi";
import { ConnectWallet } from "@/components/ConnectWallet";
import {
    RiAiGenerate2,
    RiCloseLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiRefreshLine
} from "react-icons/ri";
import PrimaryButton from "@/components/Button/PrimaryButton";
import PrimaryLoadingIcon from "@/components/Button/PrimaryLoadingIcon";
import { toast } from "react-toastify";
import PrimaryLoadingButton from "../Button/PrimaryLoadingButton";
import SecondaryLoadingButton from "../Button/SecondaryLoadingButton";
import { allContracts } from "@/config/config";
import { ethers } from "ethers";

interface ListingDetailModalProps {
    listing: AuctionDto;
    onClose: () => void;
}

const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
    const { theme } = useTheme();
    const [price, setPrice] = useState<number>(shortenNumber(listing.nowPrice || 0, 9, 3));
    const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
    const { error, handleError } = useErrorHandler();
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const { address } = useAccount();
    const [showAdjustInput, setShowAdjustInput] = useState<boolean>(false);
    const [listingData, setListingData] = useState<AuctionDto>(listing);
    const [loadingAdjust, setLoadingAdjust] = useState<boolean>(false);
    const [loadingDelist, setLoadingDelist] = useState<boolean>(false);
    const [loadingPredict, setLoadingPredict] = useState<boolean>(false);
    const [loadingPurchase, setLoadingPurchase] = useState<boolean>(false);
    const isMyListing = useMemo(() => {
        if (
            allContracts.includes(listingData.auctor || "") ||
            allContracts.includes(ethers.getAddress(listingData.auctor || ""))
        ) {
            return true;
        }
        return false;
    }, [listingData]);

    const resetError = useCallback(() => {
        handleError(null);
    }, [handleError]);

    const handleAdjustPrice = async () => {
        setLoadingAdjust(true);
        try {
            await mpContractService.changePrice(listingData, address, price);
            toast.success("Price adjusted successfully!");
            onClose();
        } catch {
            handleError(error as Error);
            toast.error("Failed to adjust price");
        } finally {
            setLoadingAdjust(false);
        }
    };

    const handleAdjustClick = () => {
        if (showAdjustInput) {
            handleAdjustPrice();
        } else {
            setPrice(predictedPrice ?? 0); // Set default price
            setShowAdjustInput(true);
        }
    };

    const handleDelist = async () => {
        setLoadingDelist(true);
        try {
            await mpContractService.cancelAuction(listingData, address);
            toast.success("Price cancel successfully!");
            onClose();
        } catch {
            toast.error("Failed to cancel listing");
        } finally {
            setLoadingDelist(false);
        }
    };

    const handlePredict = useCallback(async () => {
        resetError();
        setLoadingPredict(true);
        try {
            const url = (listingData?.tokenId ?? 0) > 0 ? "/api/predict721" : "/api/predict1155";
            const response = await axios.post(url, {
                hashrate: listingData.hashrate ?? 0,
                lvHashrate: listingData.lvHashrate ?? 0,
                prototype: listingData.prototype ?? 0,
                level: listingData.level ?? 0
            });
            const predicted = response.data.prediction;
            setPredictedPrice(shortenNumber(predicted, 0, 3));
        } catch (error) {
            handleError(error as Error);
            toast.error("Prediction failed!");
        } finally {
            setLoadingPredict(false);
        }
    }, [listingData, resetError, handleError]);

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % (listingData.ids?.length ?? 1));
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(
            prevIndex =>
                (prevIndex - 1 + (listingData.ids?.length ?? 1)) % (listingData.ids?.length ?? 1)
        );
    };

    const handleRefresh = async () => {
        resetError();
        try {
            const response = await axios.post("/api/refreshListing", {
                listing: listingData
            });
            setListingData(response.data.data);
            toast.success("Listing refreshed successfully!");
        } catch (error) {
            handleError(error as Error);
            toast.error("Failed to refresh listing");
        }
    };

    const handlePurchase = async () => {
        setLoadingPurchase(true);
        try {
            await mpContractService.bidAuction(listingData, address);
            toast.success("Purchase successful!");
            onClose();
        } catch (error) {
            handleError(error as Error);
            toast.error("Failed to purchase");
        } finally {
            setLoadingPurchase(false);
        }
    };

    const imageSrc =
        listingData.ids && listingData.ids.length > 1
            ? `/images/MOMO/${(listingData.ids ?? [])[currentImageIndex]}.png`
            : `/images/MOMO/${listingData.prototype}.png`;

    const backgroundColor =
        listingData.ids && listingData.ids.length > 1
            ? getBackgroundColor(Number((listingData.ids ?? [])[currentImageIndex]))
            : getBackgroundColor(listingData.prototype || 0);

    const prototype =
        listingData.ids && listingData.ids.length > 1
            ? (listingData.ids ?? [])[currentImageIndex]
            : listingData.prototype || 0;

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
                    <RiCloseLine size={24} />
                </button>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Listing Details</h2>
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "20px",
                        position: "relative",
                        backgroundColor: backgroundColor,
                        padding: "10px",
                        borderRadius: "10px"
                    }}
                >
                    <div
                        className="flex justify-between items-center"
                        style={{ marginBottom: "20px" }}
                    >
                        <span className="text-sm flex items-center gap-1">
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs">
                                Lv. {listingData.level}
                            </span>
                        </span>
                        <div className="text-right">
                            <p
                                className="text-lg font-bold"
                                style={{ color: customDarkTheme.textColor }}
                            >
                                {listingData.lvHashrate}
                            </p>
                            <p className="text-xs" style={{ color: customDarkTheme.textColor }}>
                                {(listingData.hashrate || 0) > 5
                                    ? `Lv. 1 - ${listingData.hashrate}`
                                    : <br />}
                            </p>
                        </div>
                    </div>
                    {listingData.ids && listingData.ids.length > 1 && (
                        <button
                            onClick={handlePrevImage}
                            style={{
                                position: "absolute",
                                left: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                                color: customDarkTheme.textColor
                            }}
                        >
                            <RiArrowLeftSLine size={24} />
                        </button>
                    )}
                    <div
                        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                        <Image src={imageSrc} alt="Avatar" width={100} height={100} priority />
                    </div>
                    {listingData.ids && listingData.ids.length > 1 && (
                        <button
                            onClick={handleNextImage}
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                                color: customDarkTheme.textColor
                            }}
                        >
                            <RiArrowRightSLine size={24} />
                        </button>
                    )}
                    {listingData.ids && listingData.ids.length > 1 && (
                        <p
                            style={{
                                textAlign: "center",
                                marginBottom: "20px",
                                color: customDarkTheme.textColor
                            }}
                        >
                            Quantity: {listingData.amounts?.[currentImageIndex] ?? 1}
                        </p>
                    )}
                    <p
                        className="text-center text-lg font-semibold"
                        style={{ color: customDarkTheme.textColor }}
                    >
                        {prototype}
                    </p>
                    <p
                        className="text-center text-lg font-semibold"
                        style={{ color: customDarkTheme.textColor }}
                    >
                        {shortenAddress(listingData.auctor || "")}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-green-400 font-bold text-lg">
                            {shortenNumber(listingData.nowPrice || 0, 9, 3)} USDT
                        </span>
                        <div className="flex">
                            {listingData.prototype === 99999 && (
                                <PrimaryLoadingIcon onClick={handleRefresh} loading={false}>
                                    <RiRefreshLine size={24} />
                                </PrimaryLoadingIcon>
                            )}
                            {predictedPrice !== null ? (
                                <span className="text-blue-400 font-bold text-lg">
                                    {predictedPrice} USDT
                                </span>
                            ) : (
                                <PrimaryLoadingIcon
                                    onClick={handlePredict}
                                    loading={loadingPredict}
                                >
                                    <RiAiGenerate2 size={24} />
                                </PrimaryLoadingIcon>
                            )}
                        </div>
                    </div>
                </div>
                {showAdjustInput && (
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "10px" }}>
                            Price (USDT)
                        </label>
                        <input
                            type="text"
                            value={price || ""}
                            placeholder="0"
                            onChange={e => {
                                const value = e.target.value;
                                if (!isNaN(Number(value)) || value === "") {
                                    setPrice(Number(value));
                                }
                            }}
                            onWheel={e => e.currentTarget.blur()}
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
                )}
                {error && (
                    <div style={{ color: "red", marginBottom: "20px" }}>Error: {error.message}</div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                    {address ? (
                        isMyListing ? (
                            <>
                                {showAdjustInput ? (
                                    <div
                                        style={{
                                            flex: 1,
                                            display: "flex",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <PrimaryLoadingButton
                                            onClick={handleAdjustClick}
                                            loading={loadingAdjust}
                                        >
                                            Confirm
                                        </PrimaryLoadingButton>
                                    </div>
                                ) : (
                                    <>
                                        <PrimaryButton
                                            onClick={handleAdjustClick}
                                            style={{ flex: 1 }}
                                        >
                                            Adjust
                                        </PrimaryButton>
                                        <SecondaryLoadingButton
                                            onClick={handleDelist}
                                            loading={loadingDelist}
                                            style={{ flex: 1 }}
                                            disabled={loadingPredict}
                                        >
                                            Delist
                                        </SecondaryLoadingButton>
                                    </>
                                )}
                            </>
                        ) : (
                            <PrimaryLoadingButton
                                onClick={handlePurchase}
                                loading={loadingPurchase}
                                style={{ flex: 1 }}
                                disabled={loadingPurchase}
                            >
                                Purchase
                            </PrimaryLoadingButton>
                        )
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

export default ListingDetailModal;
