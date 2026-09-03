import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "1Fi Store | Smartphones on 0% Interest EMI Backed by Mutual Funds",
  description:
    "Buy Apple iPhone 17 Pro, Samsung S24 Ultra, and Google Pixel on 0% interest EMI backed by your mutual fund portfolio. Instant electronic lien via CAMS & KFintech.",
  keywords: [
    "1Fi",
    "Mutual Fund EMI",
    "iPhone 17 Pro EMI",
    "Zero percent EMI",
    "Lien on mutual funds",
    "Smartphone EMI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
