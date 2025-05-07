interface GemSlotsProps {
    gems: number[];
}

const GemSlots = ({ gems }: GemSlotsProps) => {
    const gemColors = [
        "bg-red-500 border-red-700",
        "bg-green-500 border-green-700",
        "bg-sky-500 border-sky-700",
        "bg-yellow-500 border-yellow-700"
    ];

    return (
        <div className="flex flex-col gap-2 items-center">
            {gems.map((gem, index) => (
                <div
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${gemColors[index]}`}
                >
                    <span className="text-white font-bold">{gem}</span>
                </div>
            ))}
        </div>
    );
};

export default GemSlots;
