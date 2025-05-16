import PrototypeImage from "@/components/Image/PrototypeImage";

interface GemSlotsProps {
    gems: number[];
}

const GemSlots = ({ gems }: GemSlotsProps) => {
    return (
        <div
            style={{ display: "flex", gap: "5px", justifyContent: "center", alignItems: "center" }}
        >
            {gems.map(
                (gem, index) =>
                    gem > 0 && (
                        <PrototypeImage
                            key={index}
                            width={50}
                            height={50}
                            prototype={gem + (index + 1) * 100}
                        />
                    )
            )}
        </div>
    );
};

export default GemSlots;
