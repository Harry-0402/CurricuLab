import React, { useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { JobListing } from '@/lib/services/job-service';
import { AiService } from '@/lib/services/ai-service';
import { toast } from 'sonner';

interface CoverLetterModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: JobListing | undefined;
}

export function CoverLetterModal({ isOpen, onClose, job }: CoverLetterModalProps) {
    const [userBio, setUserBio] = useState('');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'text' | 'pdf'>('text');

    if (!isOpen || !job) return null;


    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleGenerate = async () => {
        if (activeTab === 'text' && !userBio.trim()) {
            toast.error("Please enter your resume details or bio.");
            return;
        }
        if (activeTab === 'pdf' && !resumeFile) {
            toast.error("Please upload a resume PDF.");
            return;
        }

        setLoading(true);
        try {
            let userContext = userBio;
            let resumeBase64 = undefined;

            if (activeTab === 'pdf' && resumeFile) {
                resumeBase64 = await fileToBase64(resumeFile);
                userContext = ""; // Context comes from PDF
            }

            const letter = await AiService.generateCoverLetter(
                job.title,
                job.company,
                // @ts-ignore - description might not exist on type yet
                job.description || `Location: ${job.location}. Salary: ${job.salary_range || 'N/A'}`,
                userContext,
                resumeBase64
            );
            setGeneratedLetter(letter);
            toast.success("Cover Letter Generated!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate cover letter.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">AI Job Evaluation</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">Analyze fit for {job.title} at {job.company}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Icons.X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {!generatedLetter ? (
                        <div className="space-y-4">
                            {/* Tabs */}
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveTab('text')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'text' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Text Bio
                                </button>
                                <button
                                    onClick={() => setActiveTab('pdf')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'pdf' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Upload Resume
                                </button>
                            </div>

                            {activeTab === 'text' ? (
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
                                        Your Profile / Resume Summary
                                    </label>
                                    <textarea
                                        className="w-full p-4 bg-gray-50 border-2 border-indigo-100 focus:border-indigo-500 rounded-xl text-sm min-h-[200px] outline-none transition-all placeholder:text-gray-400"
                                        placeholder="Paste your resume summary, skills, and experience here..."
                                        value={userBio}
                                        onChange={(e) => setUserBio(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative group">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setResumeFile(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                        {resumeFile ? <Icons.FileText size={24} /> : <Icons.UploadCloud size={24} />}
                                    </div>
                                    <p className="font-bold text-gray-700">{resumeFile ? resumeFile.name : 'Click to Upload Resume (PDF)'}</p>
                                    <p className="text-xs text-gray-400 mt-1">{resumeFile ? 'Ready to analyze' : 'Max size 5MB'}</p>
                                    {resumeFile && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setResumeFile(null);
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-red-50 text-gray-400 hover:text-red-500 z-20"
                                        >
                                            <Icons.X size={14} />
                                        </button>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={loading || (activeTab === 'text' && !userBio.trim()) || (activeTab === 'pdf' && !resumeFile)}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-black text-sm hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <Icons.Loader2 className="animate-spin" /> : <Icons.Sparkles />}
                                <span>Evaluate & Generate Letter</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
                                    Generated Letter
                                </label>
                                <textarea
                                    className="w-full p-6 bg-white border border-gray-200 rounded-xl text-sm leading-relaxed min-h-[300px] outline-none focus:border-indigo-500 font-serif text-gray-700 shadow-inner"
                                    value={generatedLetter}
                                    onChange={(e) => setGeneratedLetter(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCopy}
                                    className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <Icons.Copy size={16} />
                                    Copy Text
                                </button>
                                <button
                                    onClick={() => setGeneratedLetter('')}
                                    className="px-6 py-3 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    Start Over
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
