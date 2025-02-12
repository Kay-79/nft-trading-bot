import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}

export default RootLayout;
