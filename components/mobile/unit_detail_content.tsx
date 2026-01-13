"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { Icons } from '@/components/shared/Icons';
import { getUnitById, getNotesByUnit, getQuestions } from '@/lib/services/app.service';
import { Unit, Note, Question } from '@/types';
import { TagBadge } from '@/components/shared/TagBadge';

export default function MobileUnitDetailContent() {
    const params = useParams();
    const [unit, setUnit] = useState<Unit | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        if (params.unitId) {
            const id = params.unitId as string;
            getUnitById(id).then(u => setUnit(u || null));
            getNotesByUnit(id).then(setNotes);
            getQuestions({ unitId: id }).then(setQuestions);
        }
    }, [params.unitId]);

    if (!unit) return null;

    return (
        <MobileAppShell>
            <div className="px-6 py-4 space-y-8">
                <div className="flex items-center gap-3">
                    <button onClick={() => window.history.back()} className="text-blue-600">
                        <Icons.ChevronRight className="rotate-180" size={24} />
                    </button>
                    <div className="min-w-0">
                        <h2 className="text-xl font-black text-gray-900 truncate">{unit.title}</h2>
                    </div>
                </div>
                {/* ... Rest of MobileUnitDetailPage content ... */}
            </div>
        </MobileAppShell>
    );
}
