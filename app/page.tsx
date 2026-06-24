import { Metadata } from 'next';
import WebHomePage from '@/components/web/page_content';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Dashboard | CurricuLab',
    description: 'Welcome to your CurricuLab dashboard. View your timetable, announcements, and track your study progress all in one place.',
    openGraph: {
        title: 'Dashboard | CurricuLab',
        description: 'Welcome to your CurricuLab dashboard. View your timetable, announcements, and track your study progress all in one place.',
    }
};

export default function RootPage() {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "CurricuLab",
      "url": "https://curriculab-sj6g.onrender.com",
      "description": "Advanced study management platform for university students.",
    };

    return (
        <>
            <Script
                id="json-ld-website"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <WebHomePage />
        </>
    );
}
