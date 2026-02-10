import React from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { AssignmentContent } from '@/components/web/AssignmentContent';

export default function AssignmentsPage() {
    return (
        <WebAppShell>
            <div className="space-y-12">


                <AssignmentContent />
            </div>
        </WebAppShell>
    );
}
