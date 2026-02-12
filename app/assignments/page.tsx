import React, { Suspense } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { AssignmentContent } from '@/components/web/AssignmentContent';

export default function AssignmentsPage() {
    return (
        <WebAppShell>
            <div className="space-y-12">
                <Suspense fallback={
                    <div className="flex items-center justify-center p-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                }>
                    <AssignmentContent />
                </Suspense>
            </div>
        </WebAppShell>
    );
}
