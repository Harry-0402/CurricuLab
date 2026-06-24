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
    metadataBase: new URL('https://curriculab-sj6g.onrender.com'),
    title: {
        default: "CurricuLab | University Study Management Platform",
        template: "%s | CurricuLab",
    },
    description: "CurricuLab is an advanced study management platform for university students. Organize your courses, access AI-powered notes, flashcards, and resources.",
    openGraph: {
        title: "CurricuLab | University Study Management Platform",
        description: "CurricuLab is an advanced study management platform for university students. Organize your courses, access AI-powered notes, flashcards, and resources.",
        url: "https://curriculab-sj6g.onrender.com",
        siteName: "CurricuLab",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "CurricuLab",
        description: "Study management platform for university students.",
    },
    robots: {
        index: true,
        follow: true,
    },
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
