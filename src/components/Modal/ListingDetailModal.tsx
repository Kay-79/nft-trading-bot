import React, { useState } from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { useTheme } from "@/config/theme";
import Image from "next/image";
import { shortenNumber, shortenAddress } from "@/utils/shorten";
import axios from "axios";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getBackgroundColor } from "@/utils/colorUtils";
import { mpContractService } from "@/services/mpContract";
import { useAccount } from "wagmi";

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

    const resetError = () => {
        handleError(null); // Reset error state
    };

    const handleAdjustPrice = async () => {
        await mpContractService.ajustPricePro(listing, address, price);
        console.log("Adjusting Price");
    };

    const handleDelist = () => {
        resetError();
        try {
            throw new Error("An example error");
        } catch (err) {
            handleError(err as Error);
        }
    };

    const handlePredict = async () => {
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
    };

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // const handleClose = () => {
    //     onClose();
    //     resetError();
    // };

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
                    maxWidth: "500px"
                }}
            >
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
                            <p className="text-lg font-bold">{listing.lvHashrate}</p>
                            <p className="text-xs text-gray-300">
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
                                color: theme.textColor
                            }}
                        >
                            &lt;
                        </button>
                    )}
                    <div
                        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                        <Image src={imageSrc} alt="Avatar" width={100} height={100} />
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
                                color: theme.textColor
                            }}
                        >
                            &gt;
                        </button>
                    )}
                    {listing.ids && listing.ids.length > 1 && (
                        <p style={{ textAlign: "center", marginBottom: "20px" }}>
                            Quantity: {listing.amounts?.[currentImageIndex] ?? 1}
                        </p>
                    )}
                    <p className="text-center text-lg font-semibold">{prototype}</p>
                    <p className="text-center text-lg font-semibold">
                        {shortenAddress(listing.auctor || "")}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-green-400 font-bold text-lg">
                            {shortenNumber(listing.nowPrice || 0, 9, 3)} USDT
                        </span>
                    </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "10px" }}>Price (USDT)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
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
                {predictedPrice !== null && (listing.hashrate ?? 0) > 10 && (
                    <p style={{ marginBottom: "20px" }}>Predicted Price: {predictedPrice} USDT</p>
                )}
                {error && (
                    <div style={{ color: "red", marginBottom: "20px" }}>Error: {error.message}</div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                    <button
                        onClick={handleAdjustPrice}
                        style={{
                            flex: 1,
                            padding: "10px 20px",
                            backgroundColor: theme.buttonBackgroundColor,
                            color: theme.buttonTextColor,
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Adjust
                    </button>
                    <button
                        onClick={handleDelist}
                        style={{
                            flex: 1,
                            padding: "10px 20px",
                            backgroundColor: theme.buttonBackgroundColor,
                            color: theme.buttonTextColor,
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Delist
                    </button>
                    {listing.hashrate && listing.hashrate > 10 && (
                        <button
                            onClick={handlePredict}
                            style={{
                                flex: 1,
                                padding: "10px 20px",
                                backgroundColor: theme.buttonBackgroundColor,
                                color: theme.buttonTextColor,
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer"
                            }}
                        >
                            Predict
                        </button>
                    )}
                </div>
                {/* <button
                    onClick={handleClose}
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
                </button> */}
            </div>
        </div>
    );
};

export default ListingDetailModal;
