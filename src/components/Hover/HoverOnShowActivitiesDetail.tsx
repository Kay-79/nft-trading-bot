import React from "react";
import { Momo721 } from "@/types/dtos/Momo721";
import { shortenAddress } from "@/utils/shorten";
import { getBackgroundColor } from "@/utils/colorUtils";
import PrototypeImage from "@/components/Image/PrototypeImage";

interface HoverOnShowActivitiesDetailProps {
    item: Momo721;
}

const HoverOnShowActivitiesDetail: React.FC<HoverOnShowActivitiesDetailProps> = ({ item }) => {
    const backgroundColor = getBackgroundColor(item.prototype || 0);

    return (
        <div
            style={{
                position: "absolute",
                top: "0",
                left: "100%",
                marginLeft: "10px",
                backgroundColor: backgroundColor,
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
                width: "180px", // Adjusted width
                textAlign: "center",
                color: "white"
            }}
        >
            <div className="flex justify-between items-center" style={{ fontSize: "10px" }}>
                <span className="text-sm flex items-center gap-1">
                    <span className="bg-yellow-500 text-black px-1 py-0.5 rounded-full text-xs">
                        Lv. {item.level || 1}
                    </span>
                </span>
                {item.lvHashrate && (
                    <div className="text-right" style={{ fontSize: "10px" }}>
                        <p className="font-bold">{item.lvHashrate}</p>
                        <p className="text-gray-300">
                            {(item.hashrate || 0) > 5 ? `Lv. 1 - ${item.hashrate}` : <br />}
                        </p>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: "10px", display: "flex", justifyContent: "center" }}>
                <PrototypeImage width={60} height={60} prototype={item.prototype || 0} />
            </div>
            <p style={{ fontSize: "12px", fontWeight: "bold" }}>{item.prototype}</p>
            <p style={{ fontSize: "10px", color: "#fff" }}>
                {shortenAddress(item.tokenId?.toString() || "")}
            </p>
        </div>
    );
};

export default HoverOnShowActivitiesDetail;
