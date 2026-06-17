import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HeatShield AI — Urban Heat Island Monitoring & Mitigation Platform",
  description:
    "AI-powered platform for urban heat island detection, prediction, and cooling strategy recommendations. Monitor land surface temperatures, detect heat hotspots, and simulate mitigation strategies for smart cities.",
  keywords: [
    "Urban Heat Island",
    "Heat Monitoring",
    "AI",
    "Smart Cities",
    "GIS",
    "Satellite",
    "NDVI",
    "Land Surface Temperature",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
