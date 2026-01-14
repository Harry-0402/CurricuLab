"use client"

import React, { useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { SeedService } from '@/lib/data/seed-service';

export function DataMigrationContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<any>(null);

    const handleMigration = async () => {
        if (!confirm("This will overwrite existing data with the seed data. Continue?")) return;

        setIsLoading(true);
        setResults(null);
        try {
            const res = await SeedService.seedAll();
            setResults(res);
        } catch (error) {
            console.error("Migration fatal error:", error);
            alert("Migration failed to start.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <WebAppShell>
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Icons.Database size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Global Data Migration</h2>
                    <p className="text-gray-500 mb-8">
                        Transfer all mock data (Subjects, Units, Timetable, etc.) from local files to your Supabase database.
                    </p>

                    <button
                        onClick={handleMigration}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                    >
                        {isLoading ? (
                            <>
                                <Icons.Time className="animate-spin" />
                                <span>Migrating...</span>
                            </>
                        ) : (
                            <>
                                <Icons.Upload />
                                <span>Start Migration</span>
                            </>
                        )}
                    </button>
                </div>

                {results && (
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-4">Migration Results</h3>

                        {results.errors.length > 0 && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
                                <p className="font-bold mb-2">Errors Encountered:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {results.errors.map((err: string, i: number) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <ResultCard label="Subjects" count={results.subjects} icon={Icons.Subjects} color="bg-indigo-50 text-indigo-600" />
                            <ResultCard label="Units" count={results.units} icon={Icons.Notes} color="bg-emerald-50 text-emerald-600" />
                            <ResultCard label="Notes" count={results.notes} icon={Icons.Notes} color="bg-amber-50 text-amber-600" />
                            <ResultCard label="Questions" count={results.questions} icon={Icons.Questions} color="bg-rose-50 text-rose-600" />
                            <ResultCard label="Assignments" count={results.assignments} icon={Icons.CheckSquare} color="bg-purple-50 text-purple-600" />
                            <ResultCard label="Timetable" count={results.timetable} icon={Icons.Calendar} color="bg-sky-50 text-sky-600" />
                            <ResultCard label="Announcements" count={results.announcements} icon={Icons.Home} color="bg-orange-50 text-orange-600" />
                        </div>
                    </div>
                )}
            </div>
        </WebAppShell>
    );
}

function ResultCard({ label, count, icon: Icon, color }: any) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-xl font-black text-gray-900">{count}</p>
            </div>
        </div>
    );
}
