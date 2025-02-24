import React from "react";
import { RecentSold } from "@/types/dtos/RecentSold.dto";
import ActivityRow from "@/components/Row/ActivityRow";

interface ActivitiesProps {
    activities: RecentSold[];
    view: "list" | "card";
}

const Activities: React.FC<ActivitiesProps> = ({ activities, view }) => {
    return (
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
    );
};

export default Activities;
