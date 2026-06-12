import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/shared/Toast";
import { SessionManager } from "@/components/SessionManager";
import { SemesterProvider } from "@/components/providers/SemesterProvider";
import { RealtimeProvider } from "@/components/providers/RealtimeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from 'sonner';

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
                <AuthProvider>
                    <SemesterProvider>
                        <RealtimeProvider>
                            <ToastProvider>
                                {children}
                            </ToastProvider>
                        </RealtimeProvider>
                    </SemesterProvider>
                </AuthProvider>
                <Toaster />
            </body>
        </html>
    );
}
