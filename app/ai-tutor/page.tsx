import { WebAppShell } from '@/components/web/WebAppShell';
import { AiTutorContent } from '@/components/web/AiTutorContent';

export const metadata = {
    title: 'LearnPilot AI | CurricuLab',
    description: 'Your intelligent AI tutor with RAG capability.',
};

export default function AiTutorPage() {
    return (
        <WebAppShell>
            <AiTutorContent />
        </WebAppShell>
    );
}
