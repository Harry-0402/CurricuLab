import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/shared/Toast";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
};

export const metadata: Metadata = {
    title: "CurricuLab",
    description: "Study management platform for students.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </body>
        </html>
    );
}
