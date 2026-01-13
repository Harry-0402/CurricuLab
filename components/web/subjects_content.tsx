"use client"

import React, { useEffect, useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { SubjectCard } from '@/components/web/SubjectCard';
import { getSubjects } from '@/lib/services/app.service';
import { Subject } from '@/types';

export default function WebSubjectsContent() {
    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect(() => {
        getSubjects().then(setSubjects);
    }, []);

    return (
        <WebAppShell>
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h2>
                    <p className="text-gray-500">Manage your subjects and track your study progress.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subjects.map((subject) => (
                        <SubjectCard key={subject.id} subject={subject} />
                    ))}
                </div>
            </div>
        </WebAppShell>
    );
}
