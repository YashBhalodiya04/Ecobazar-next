import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import MasterLayout from "@/components/MasterLyout";
import { Metadata } from "next";
import ReduxProvider from "@/components/ReduxProvider";
import SplashScreen from "@/components/SplashScreen";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Cobazar",
  description: "E-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f5f5f5]">
        <Toaster />
        <Suspense fallback={<SplashScreen />}>
          <SplashScreen />
          <ReduxProvider>{children}</ReduxProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
