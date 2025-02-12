import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navbar />
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
