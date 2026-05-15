import type { Metadata } from "next";
import "./globals.css";
import { TopBar } from "@/components/layout/ToPBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Inter, Geist_Mono } from "next/font/google";
import { StoreHydration } from "@/components/StoreHydration";

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "GT India Directory Helpline | Discover Trusted Businesses",
  description:
    "Connect with verified professionals and services across India. Find trusted businesses, read reviews, and grow your business with GT India Directory Helpline.",
  keywords: [
    "business directory",
    "India",
    "verified businesses",
    "local services",
    "GT India Directory",
  ],
  icons: {
    icon: "/logoBgRemoved.png",
    apple: "/logoBgRemoved.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${_inter.variable} ${_geistMono.variable} font-sans antialiased`}
      >
        <TopBar />
        <Header />
        <main className="min-h-screen">
          <StoreHydration />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
