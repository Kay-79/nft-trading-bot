import React, { useState, useCallback } from "react";
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
import { RiAiGenerate2, RiCloseLine } from "react-icons/ri";
import PrimaryButton from "@/components/Button/PrimaryButton";
import SecondaryButton from "@/components/Button/SecondaryButton";

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

    const resetError = useCallback(() => {
        handleError(null); // Reset error state
    }, [handleError]);

    const handleAdjustPrice = async () => {
        await mpContractService.changePrice(listing, address, price);
        console.log("Adjusting Price");
    };

    const handleAdjustClick = () => {
        if (showAdjustInput) {
            handleAdjustPrice();
        } else {
            setPrice(predictedPrice ?? 0); // Set default price
            setShowAdjustInput(true);
        }
    };

    const handleDelist = () => {
        resetError();
        try {
            throw new Error("An example error");
        } catch (err) {
            handleError(err as Error);
        }
    };

    const handlePredict = useCallback(async () => {
        resetError();
        try {
            const response = await axios.post("/api/predictOne", {
                hashrate: listing.hashrate ?? 0,
                lvHashrate: listing.lvHashrate ?? 0,
                prototype: listing.prototype ?? 0,
                level: listing.level ?? 0
            });
            const predicted = response.data.prediction;
            setPredictedPrice(shortenNumber(predicted, 0, 3));
        } catch (error) {
            handleError(error as Error);
        }
    }, [listing, resetError, handleError]);

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % (listing.ids?.length ?? 1));
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(
            prevIndex => (prevIndex - 1 + (listing.ids?.length ?? 1)) % (listing.ids?.length ?? 1)
        );
    };

    const imageSrc =
        listing.ids && listing.ids.length > 1
            ? `/images/MOMO/${(listing.ids ?? [])[currentImageIndex]}.png`
            : `/images/MOMO/${listing.prototype}.png`;

    const backgroundColor =
        listing.ids && listing.ids.length > 1
            ? getBackgroundColor(Number((listing.ids ?? [])[currentImageIndex]))
            : getBackgroundColor(listing.prototype || 0);

    const prototype =
        listing.ids && listing.ids.length > 1
            ? (listing.ids ?? [])[currentImageIndex]
            : listing.prototype || 0;

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
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Listing Details</h2>
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "20px",
                        position: "relative",
                        backgroundColor: backgroundColor, // Set background color for image container
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
                                Lv. {listing.level}
                            </span>
                        </span>
                        <div className="text-right">
                            <p
                                className="text-lg font-bold"
                                style={{ color: customDarkTheme.textColor }}
                            >
                                {listing.lvHashrate}
                            </p>
                            <p className="text-xs" style={{ color: customDarkTheme.textColor }}>
                                {(listing.hashrate || 0) > 5 ? `Lv. 1 - ${listing.hashrate}` : ""}
                            </p>
                        </div>
                    </div>
                    {listing.ids && listing.ids.length > 1 && (
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
                            &lt;
                        </button>
                    )}
                    <div
                        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                        <Image src={imageSrc} alt="Avatar" width={100} height={100} priority />
                    </div>
                    {listing.ids && listing.ids.length > 1 && (
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
                            &gt;
                        </button>
                    )}
                    {listing.ids && listing.ids.length > 1 && (
                        <p
                            style={{
                                textAlign: "center",
                                marginBottom: "20px",
                                color: customDarkTheme.textColor
                            }}
                        >
                            Quantity: {listing.amounts?.[currentImageIndex] ?? 1}
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
                        {shortenAddress(listing.auctor || "")}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-green-400 font-bold text-lg">
                            {shortenNumber(listing.nowPrice || 0, 9, 3)} USDT
                        </span>
                        {(listing.tokenId ?? 0) > 0 &&
                            (predictedPrice !== null ? (
                                <span className="text-blue-400 font-bold text-lg">
                                    AI: {predictedPrice} USDT
                                </span>
                            ) : (
                                <RiAiGenerate2
                                    onClick={handlePredict}
                                    style={{
                                        marginLeft: "10px",
                                        cursor: "pointer",
                                        color: customDarkTheme.textColor
                                    }}
                                    size={24}
                                />
                            ))}
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
                        <>
                            {showAdjustInput ? (
                                <PrimaryButton onClick={handleAdjustClick} style={{ flex: 1 }}>
                                    Confirm
                                </PrimaryButton>
                            ) : (
                                <>
                                    <PrimaryButton onClick={handleAdjustClick} style={{ flex: 1 }}>
                                        Adjust
                                    </PrimaryButton>
                                    <SecondaryButton onClick={handleDelist} style={{ flex: 1 }}>
                                        Delist
                                    </SecondaryButton>
                                </>
                            )}
                        </>
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
