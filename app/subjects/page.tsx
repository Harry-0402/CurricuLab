import { Metadata } from 'next';
import WebSubjectsContent from '@/components/web/subjects_content';

export const metadata: Metadata = {
    title: 'Subjects | CurricuLab',
    description: 'Browse all subjects, view your progress, and access detailed study materials.',
    openGraph: {
        title: 'Subjects | CurricuLab',
        description: 'Browse all subjects, view your progress, and access detailed study materials.',
    }
};

export default function SubjectsPage() {
    return <WebSubjectsContent />;
}
