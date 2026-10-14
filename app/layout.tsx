import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

// Same families as the mobile app (Sora for display, Inter for text).
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "InPockets Admin", template: "%s · InPockets Admin" },
  description: "InPockets lending operations console",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
