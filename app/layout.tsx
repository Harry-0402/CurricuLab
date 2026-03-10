import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/shared/Toast";
import { SessionManager } from "@/components/SessionManager";
import { GoogleOAuthProvider } from '@react-oauth/google';

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
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <SessionManager />
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}
