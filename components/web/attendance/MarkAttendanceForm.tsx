import React, { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { Subject } from '@/types';
import { FaceVerificationModal } from './FaceVerificationModal';
import { FaceRecognitionService } from '@/lib/services/face-recognition-service';
import { toast } from 'sonner';

interface MarkAttendanceFormProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    selectedSubject: string;
    onSubjectChange: (subId: string) => void;
    availableSubjects: Subject[];
    dayName: string;
    status: 'Present' | 'Absent' | 'Canceled';
    onStatusChange: (status: 'Present' | 'Absent' | 'Canceled') => void;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    verificationImage?: Blob | null;
    onVerificationComplete?: (image: Blob | null) => void;
    onDailyCheckIn?: (image: Blob) => void;
}

export function MarkAttendanceForm({
    selectedDate,
    onDateChange,
    selectedSubject,
    onSubjectChange,
    availableSubjects,
    dayName,
    status,
    onStatusChange,
    isSubmitting,
    onSubmit,
    verificationImage,
    onVerificationComplete,
    onDailyCheckIn
}: MarkAttendanceFormProps) {
    const [activeTab, setActiveTab] = useState<'daily' | 'manual'>('daily');
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [isProcessingVerification, setIsProcessingVerification] = useState(false);

    const handleCapture = async (blob: Blob) => {
        setIsProcessingVerification(true);
        try {
            const result = await FaceRecognitionService.verifyFace(blob);

            if (result.verified) {
                // Play "Attendance Marked" audio
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance("Attendance Marked");
                    utterance.rate = 1.1;
                    utterance.pitch = 1.1;
                    window.speechSynthesis.speak(utterance);
                }

                toast.success("Identity Verified", { description: result.message });

                // For the Daily tab, we trigger the callback immediately
                if (onDailyCheckIn) {
                    onDailyCheckIn(blob);
                }

                setIsVerificationModalOpen(false);
            } else {
                toast.error("Verification Failed", { description: result.message || "Face not recognized" });
            }
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("Error", { description: "Failed to verify face. Please try again." });
        } finally {
            setIsProcessingVerification(false);
        }
    };

    const handleDailyLogClick = () => {
        setIsVerificationModalOpen(true);
    };

    return (
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm relative overflow-hidden flex flex-col">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-5">
                <Icons.CheckCircle size={120} />
            </div>

            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-gray-900">Mark Attendance</h3>
                <div className="flex p-1 bg-gray-50 rounded-xl relative z-10">
                    <button
                        onClick={() => setActiveTab('daily')}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                            activeTab === 'daily'
                                ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-100"
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        Face ID (Daily)
                    </button>
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                            activeTab === 'manual'
                                ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-100"
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        Manual
                    </button>
                </div>
            </div>

            {activeTab === 'daily' ? (
                <div className="flex flex-col relative z-10">
                    <div className="space-y-6">
                        <div className="bg-blue-50/50 p-5 rounded-[20px] border border-blue-100/50">
                            <p className="text-xs text-blue-600 font-medium mb-4 flex items-center gap-2">
                                <Icons.Info size={14} />
                                One-click sync for all today's classes after verification.
                            </p>
                            <div>
                                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 mb-1 block">Date for Check-in</label>
                                <input
                                    type="date"
                                    required
                                    value={selectedDate}
                                    onChange={(e) => onDateChange(e.target.value)}
                                    className="w-full bg-white border-blue-100 rounded-xl px-4 py-3 font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-base"
                                />
                            </div>
                        </div>

                    </div>

                    <Button
                        onClick={handleDailyLogClick}
                        className="w-full rounded-xl py-7 text-base shadow-lg shadow-blue-500/10 mt-8"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Syncing...' : 'Log Attendance (Daily)'}
                    </Button>
                </div>
            ) : (
                <form onSubmit={onSubmit} className="flex flex-col relative z-10">
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={selectedDate}
                                    onChange={(e) => onDateChange(e.target.value)}
                                    className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Subject</label>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => onSubjectChange(e.target.value)}
                                    className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                                    disabled={availableSubjects.length === 0}
                                >
                                    {availableSubjects.length === 0 ? (
                                        <option value="">- No classes -</option>
                                    ) : (
                                        availableSubjects.map(s => (
                                            <option key={s.id} value={s.id}>{s.title}</option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Status</label>
                            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl">
                                {(['Present', 'Absent', 'Canceled'] as const).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => onStatusChange(s)}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                                            status === s
                                                ? (s === 'Present' ? "bg-green-100 text-green-700 shadow-sm ring-1 ring-green-200" : s === 'Absent' ? "bg-red-100 text-red-700 shadow-sm ring-1 ring-red-200" : "bg-gray-200 text-gray-700 shadow-sm")
                                                : "text-gray-400 hover:text-gray-600 hover:bg-white"
                                        )}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full rounded-xl py-6 text-base shadow-lg shadow-blue-500/20 mt-6"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Log Attendance'}
                    </Button>
                </form>
            )}

            <FaceVerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                onCapture={handleCapture}
                isProcessing={isProcessingVerification}
            />
        </div>
    );
}
