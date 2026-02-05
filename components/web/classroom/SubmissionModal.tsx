
import React, { useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { SubmissionService, Submission } from '@/lib/services/submission-service';
import { ClassroomMaterial } from '@/lib/services/classroom-material-service';
import { Subject } from '@/types';
import { toast } from 'sonner';

interface SubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (submission: Submission) => void;
    material: ClassroomMaterial;
    currentUser: any;
    subjects: Subject[];
}

export function SubmissionModal({
    isOpen,
    onClose,
    onSuccess,
    material,
    currentUser,
    subjects
}: SubmissionModalProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [submissionFile, setSubmissionFile] = useState<File | null>(null);
    const [submissionText, setSubmissionText] = useState('');

    const handleSubmitWork = async () => {
        if (!material || !currentUser) return;

        if (!submissionFile && !submissionText.trim()) {
            toast.error('Please upload a file or enter submission text');
            return;
        }

        setIsUploading(true);
        try {
            let driveData = null;

            if (submissionFile) {
                const formDataToSend = new FormData();
                formDataToSend.append('file', submissionFile);
                formDataToSend.append('metadata', JSON.stringify({
                    subjectId: material.subject_id,
                    subjectTitle: subjects.find(s => s.id === material.subject_id)?.title || 'Unknown Subject',
                    type: 'submission',
                    title: submissionFile.name, // Use actual filename for the file title
                    assignmentTitle: material.title,
                    studentName: currentUser.user_metadata?.name || currentUser.email || 'Unknown Student',
                }));

                const uploadResponse = await fetch('/api/classroom/upload', {
                    method: 'POST',
                    body: formDataToSend,
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.error || 'Failed to upload file');
                }

                driveData = await uploadResponse.json();
            }

            const submission = await SubmissionService.create({
                material_id: material.id,
                student_id: currentUser.id,
                student_name: currentUser.user_metadata?.name || currentUser.email,
                google_drive_file_id: driveData?.id || '',
                google_drive_link: driveData?.webViewLink || '',
                submission_text: submissionText || undefined,
                file_name: submissionFile?.name || undefined,
                file_size_bytes: driveData ? parseInt(driveData.size) : undefined,
                mime_type: submissionFile?.type || undefined,
            });

            if (submission) {
                toast.success('Submission successful!');
                onSuccess(submission);
                onClose();
                setSubmissionFile(null);
                setSubmissionText('');
            }
        } catch (error: any) {
            console.error('Error submitting:', error);
            toast.error(`Failed to submit: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-2xl font-black text-gray-900">Submit Your Work</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <Icons.X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* File Upload */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">File (Optional)</label>
                        <input
                            type="file"
                            onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id="submission-file-upload"
                        />
                        <label
                            htmlFor="submission-file-upload"
                            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all text-center group"
                        >
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Icons.Upload size={20} />
                            </div>
                            <p className="text-sm font-bold text-gray-700">
                                {submissionFile ? submissionFile.name : 'Click to select file'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Upload your assignment file
                            </p>
                        </label>
                    </div>

                    {/* Text Submission */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Or Enter Text Submission</label>
                        <textarea
                            value={submissionText}
                            onChange={(e) => setSubmissionText(e.target.value)}
                            placeholder="Type your answer or submission here..."
                            rows={6}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium resize-y"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmitWork}
                        disabled={(!submissionFile && !submissionText.trim()) || isUploading}
                        className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <Icons.Loader2 size={20} className="animate-spin" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <Icons.CheckCircle size={20} />
                                <span>Submit Assignment</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
