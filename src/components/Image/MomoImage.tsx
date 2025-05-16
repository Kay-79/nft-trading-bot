import { getImgUrl } from "@/utils/image/getImgUrl";
import Image from "next/image";

interface MomoImageProps {
    width: number;
    height: number;
    prototype: number;
}

const MomoImage: React.FC<MomoImageProps> = ({ width, height, prototype }) => {
    return (
        <div>
            <a rel="noopener noreferrer" style={{ display: "inline-block" }}>
                <Image
                    src={getImgUrl(Number(prototype))}
                    alt={`MOMO ${prototype}`}
                    width={width}
                    height={height}
                    priority
                    style={{ pointerEvents: "none" }}
                />
            </a>
        </div>
    );
};

export default MomoImage;
