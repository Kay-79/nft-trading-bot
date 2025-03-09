import React from "react";
import { RecentSoldDto } from "@/types/dtos/RecentSoldDto.dto";
import ActivityRow from "@/components/Row/ActivityRow";

interface ActivitiesProps {
    activities: RecentSoldDto[];
    view: "list" | "card";
}

const Activities: React.FC<ActivitiesProps> = ({ activities, view }) => {
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    borderBottom: "2px solid #000",
                    fontWeight: "bold",
                    minWidth: "400px"
                }}
            >
                <span style={{ flex: 3 }}>Items</span>
                <span style={{ flex: 2 }}>Buyer</span>
                <span style={{ flex: 2 }}>Seller</span>
                <span style={{ flex: 2 }}>Price</span>
                <span style={{ flex: 2 }}>Time</span>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: view === "list" ? "column" : "row",
                    flexWrap: "wrap",
                    gap: "20px"
                }}
            >
                {activities.map((activity, index) => (
                    <ActivityRow key={`${activity.tx}-${index}`} activity={activity} />
                ))}
            </div>
        </div>
    );
};

export default Activities;
