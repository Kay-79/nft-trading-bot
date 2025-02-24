import React from "react";
import Image from "next/image";
import { RecentSold } from "@/types/dtos/RecentSold.dto";
import { shortenAddress, shortenNumber } from "@/utils/shorten";

interface ActivityRowProps {
    activity: RecentSold;
}

const ActivityRow: React.FC<ActivityRowProps> = ({ activity }) => {
    const renderImages = () => {
        if (activity.ids && activity.ids.length > 0) {
            return activity.ids.map((id, index) => (
                <Image
                    key={index}
                    src={`/images/MOMO/${id}.png`}
                    alt={`MOMO ${id}`}
                    width={50}
                    height={50}
                    priority
                />
            ));
        } else if (activity.tokens && activity.tokens.length > 0) {
            return activity.tokens.map((token, index) => (
                <Image
                    key={index}
                    src={`/images/MOMO/${token.prototype}.png`}
                    alt={`MOMO ${token.prototype}`}
                    width={50}
                    height={50}
                    priority
                />
            ));
        }
        return null;
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #ccc"
            }}
        >
            <div style={{ display: "flex", gap: "10px" }}>{renderImages()}</div>
            <div style={{ flex: 1, marginLeft: "10px" }}>
                <h3>{shortenAddress(activity.auctor || "")}</h3>
                <p>Bidder: {shortenAddress(activity.bidder || "")}</p>
                <p>Bid Price: {shortenNumber(activity.bidPrice || 0, 9, 3)} USDT</p>
                <p>Transaction: {activity.tx}</p>
            </div>
        </div>
    );
};

export default ActivityRow;
