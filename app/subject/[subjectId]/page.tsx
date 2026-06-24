import { Metadata, ResolvingMetadata } from 'next';
import WebSubjectDetailContent from '@/components/web/subject_detail_content';
import { SubjectService } from '@/lib/data/subject-service';
import Script from 'next/script';

type Props = {
    params: { subjectId: string };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const subject = await SubjectService.getById(params.subjectId);

    if (!subject) {
        return {
            title: 'Subject Not Found | CurricuLab',
            description: 'The requested subject could not be found.',
        };
    }

    const title = `${subject.code}: ${subject.title} | CurricuLab`;
    const description = subject.description || `Study materials and details for ${subject.code} ${subject.title}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
    };
}

export default async function SubjectDetailPage({ params }: Props) {
    const subject = await SubjectService.getById(params.subjectId);
    
    let jsonLd = null;
    if (subject) {
        jsonLd = {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": subject.title,
            "description": subject.description,
            "provider": {
                "@type": "Organization",
                "name": "CurricuLab",
                "sameAs": "https://curriculab-sj6g.onrender.com"
            }
        };
    }

    return (
        <>
            {jsonLd && (
                <Script
                    id={`json-ld-course-${subject?.id}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <WebSubjectDetailContent />
        </>
    );
}
