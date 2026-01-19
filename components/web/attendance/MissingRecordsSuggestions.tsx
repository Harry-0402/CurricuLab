import React from 'react';
import { Icons } from '@/components/shared/Icons';
import { format } from 'date-fns';
import { MissingRecord } from '@/lib/services/attendance-service';

interface MissingRecordsSuggestionsProps {
    missingRecords: MissingRecord[];
    onQuickLog: (record: MissingRecord, status: 'Present' | 'Absent') => void;
}

export function MissingRecordsSuggestions({ missingRecords, onQuickLog }: MissingRecordsSuggestionsProps) {
    if (missingRecords.length === 0) return null;

    return (
        <div className="bg-orange-50 p-6 rounded-[32px] border border-orange-100">
            <div className="flex items-center gap-3 mb-4 text-orange-800">
                <Icons.AlertTriangle size={18} />
                <h4 className="font-bold text-sm">Missing Records (Last 5 Days)</h4>
            </div>
            <div className="space-y-3 max-h-[150px] overflow-y-auto pr-1">
                {missingRecords.map((record, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-orange-100/50 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-900">{record.subjectName}</p>
                            <p className="text-[10px] text-gray-400">{record.dayName} • {format(new Date(record.date), 'MMM d')}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => onQuickLog(record, 'Present')}
                                className="w-7 h-7 bg-green-50 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors"
                                title="Mark Present"
                            >
                                <Icons.Check size={14} />
                            </button>
                            <button
                                onClick={() => onQuickLog(record, 'Absent')}
                                className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                                title="Mark Absent"
                            >
                                <Icons.X size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
