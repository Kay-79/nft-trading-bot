import React, { useState } from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { useTheme } from "@/config/theme";
import Image from "next/image";
import { shortenNumber } from "@/utils/shorten";
import axios from "axios";
// import { useAccount } from "wagmi";
import { useErrorHandler } from "@/hooks/useErrorHandler";

interface ListingDetailModalProps {
    listing: AuctionDto;
    onClose: () => void;
}

const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
    const { theme } = useTheme();
    const [price, setPrice] = useState<number>(shortenNumber(listing.nowPrice || 0, 9, 3));
    const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
    const { error, handleError } = useErrorHandler();

    const resetError = () => {
        handleError(null); // Reset error state
    };

    const handleAdjustPrice = async () => {
        resetError();
        console.log("Adjusting Price");
    };

    const handleCancel = () => {
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

    const handleClose = () => {
        onClose();
        resetError();
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
                    maxWidth: "500px"
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Listing Details</h2>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <Image
                        src={`/images/MOMO/${listing.prototype}.png`}
                        alt="Avatar"
                        width={100}
                        height={100}
                    />
                </div>
                <p>Level: {listing.level}</p>
                <p>Hashrate: {listing.hashrate}</p>
                <p>Duration: {listing.durationDays} days</p>
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
                {predictedPrice !== null && (
                    <p style={{ marginBottom: "20px" }}>Predicted Price: {predictedPrice} USDT</p>
                )}
                {error && (
                    <div style={{ color: "red", marginBottom: "20px" }}>Error: {error.message}</div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button
                        onClick={handleAdjustPrice}
                        style={{
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
                        onClick={handleCancel}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: theme.buttonBackgroundColor,
                            color: theme.buttonTextColor,
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePredict}
                        style={{
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
                </div>
                <button
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
                </button>
            </div>
        </div>
    );
};

export default ListingDetailModal;
