import React, { useState, useEffect } from 'react';

import { Icons } from "@/components/shared/Icons";
import { cn } from "@/lib/utils";
import { Assignment, Subject, Unit } from "@/types";
import { getUnits } from '@/lib/services/app.service';

interface AssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (assignment: Partial<Assignment>) => void;
    assignment?: Assignment | null;
    subjects: Subject[];
    activeSubjectId?: string | null;
}

export function AssignmentModal({ isOpen, onClose, onSave, assignment, subjects, activeSubjectId }: AssignmentModalProps) {
    const [units, setUnits] = useState<Unit[]>([]);
    const [subjectSearch, setSubjectSearch] = useState('');
    const [isSubjectPickerOpen, setIsSubjectPickerOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Assignment>>({
        title: '',
        description: '',
        questions: [],
        subjectId: activeSubjectId || subjects[0]?.id || '',
        unitId: '',
        platform: 'ERP',
        dueDate: '',
    });

    useEffect(() => {
        if (assignment) {
            setFormData({
                ...assignment,
                questions: assignment.questions || [],
                description: assignment.description || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                questions: [],
                subjectId: activeSubjectId || subjects[0]?.id || '',
                unitId: '',
                platform: 'ERP',
                dueDate: new Date().toISOString().split('T')[0],
            });
        }
    }, [assignment, subjects, isOpen, activeSubjectId]);

    useEffect(() => {
        const fetchMethod = async () => {
            if (formData.subjectId) {
                const fetchedUnits = await getUnits(formData.subjectId);
                setUnits(fetchedUnits);
            } else {
                setUnits([]);
            }
        };
        fetchMethod();
    }, [formData.subjectId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const [showSmartPaste, setShowSmartPaste] = useState(false);
    const [smartPasteContent, setSmartPasteContent] = useState('');
    const [smartPasteFile, setSmartPasteFile] = useState<File | null>(null);
    const [isProcessingPaste, setIsProcessingPaste] = useState(false);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                let encoded = reader.result as string;
                encoded = encoded.split(',')[1];
                resolve(encoded);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    setSmartPasteFile(file);
                    e.preventDefault();
                }
            }
        }
    };

    const handleSmartPaste = async () => {
        if (!smartPasteContent.trim() && !smartPasteFile) return;
        setIsProcessingPaste(true);
        try {
            const { AiService } = await import('@/lib/services/ai-service');

            let fileData = undefined;
            if (smartPasteFile) {
                const base64 = await fileToBase64(smartPasteFile);
                fileData = { base64, mimeType: smartPasteFile.type };
            }

            const parsed = await AiService.parseAssignmentContent(smartPasteContent, fileData);

            setFormData(prev => {
                let inferredSubjectId = prev.subjectId;
                if (parsed.subjectCode || parsed.subjectName) {
                    const matched = subjects.find(s => {
                        const codeMatch = parsed.subjectCode && (
                            s.code.toLowerCase().includes(parsed.subjectCode.toLowerCase()) ||
                            parsed.subjectCode.toLowerCase().includes(s.code.toLowerCase())
                        );
                        const nameMatch = parsed.subjectName && (
                            s.title.toLowerCase().includes(parsed.subjectName.toLowerCase()) ||
                            parsed.subjectName.toLowerCase().includes(s.title.toLowerCase())
                        );
                        return codeMatch || nameMatch;
                    });
                    if (matched) inferredSubjectId = matched.id;
                }
                return {
                    ...prev,
                    title: parsed.title || prev.title,
                    dueDate: parsed.date || prev.dueDate,
                    description: parsed.description || prev.description,
                    subjectId: inferredSubjectId,
                    questions: (parsed.questions || []).map((q: string) => ({ id: crypto.randomUUID(), text: q }))
                };
            });

            setShowSmartPaste(false);
            setSmartPasteContent('');
            setSmartPasteFile(null);
        } catch (error) {
            console.error("Smart paste failed:", error);
        } finally {
            setIsProcessingPaste(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl w-full max-w-2xl p-5 sm:p-8 animate-in zoom-in-95 duration-200 border border-gray-100 max-h-[85vh] overflow-y-auto custom-scrollbar relative">
                
                {/* Floating Smart Paste Button */}
                {!showSmartPaste && !assignment && (
                    <button
                        type="button"
                        onClick={() => setShowSmartPaste(true)}
                        className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-purple-200 hover:scale-105 active:scale-95 transition-all z-10"
                        title="Smart Paste with AI"
                    >
                        <Icons.Sparkles size={24} className="sm:w-7 sm:h-7" />
                    </button>
                )}

                {!showSmartPaste ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{assignment ? 'Edit Assignment' : 'Add New Assignment'}</h2>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">Fill in the details below to {assignment ? 'update' : 'create'} an assignment.</p>
                            </div>
                            <button type="button" onClick={onClose} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-100 rounded-xl sm:rounded-full transition-colors shrink-0">
                                <Icons.X size={20} className="sm:w-6 sm:h-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            {/* Subject & Unit Wrapper */}
                            <div className="space-y-4 sm:space-y-6">
                                {/* Subject */}
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2 pl-1">Subject</label>
                                    <div className="relative">
                                        <select
                                            value={formData.subjectId}
                                            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                            className="w-full px-4 py-3 sm:p-4 bg-gray-50 border-none rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all hover:bg-gray-100 pr-10"
                                        >
                                            <option value="">Select Subject...</option>
                                            {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.title}</option>)}
                                        </select>
                                        <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                {/* Unit */}
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2 pl-1">Unit <span className="text-gray-300 font-normal normal-case">(Optional)</span></label>
                                    <div className="flex flex-wrap gap-2">
                                        {units.map(u => {
                                            const isActive = formData.unitId === u.id;
                                            return (
                                                <button
                                                    key={u.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, unitId: isActive ? '' : u.id })}
                                                    className={cn(
                                                        "flex-1 min-w-[60px] h-10 sm:h-12 rounded-xl text-xs font-bold transition-all border",
                                                        isActive
                                                            ? "bg-gray-900 text-white border-gray-900 shadow-md"
                                                            : "bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                                    )}
                                                >
                                                    U{u.order}
                                                </button>
                                            );
                                        })}
                                        {units.length === 0 && (
                                            <div className="text-xs text-gray-400 font-medium py-2 px-1">Select a subject first to see units</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2 pl-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter a descriptive title..."
                                    className="w-full px-4 py-3 sm:p-4 bg-gray-50 border-none rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:font-medium placeholder:text-gray-400 transition-all hover:bg-gray-100"
                                />
                            </div>

                            {/* Due Date + Platform */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2 pl-1">Due Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={formData.dueDate || ''}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            className="w-full px-4 py-3 sm:p-4 bg-gray-50 border-none rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:bg-gray-100 appearance-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2 pl-1">Platform</label>
                                    <div className="relative">
                                        <select
                                            value={formData.platform}
                                            onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                                            className="w-full px-4 py-3 sm:p-4 bg-gray-50 border-none rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all hover:bg-gray-100 pr-10"
                                        >
                                            <option value="ERP">ERP</option>
                                            <option value="GCR">Google Classroom (GCR)</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Questions */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5 sm:mb-2 pl-1">
                                    <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Questions</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newQuestions = [...(formData.questions || []), { id: crypto.randomUUID(), text: '' }];
                                            setFormData({ ...formData, questions: newQuestions });
                                        }}
                                        className="flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <Icons.Plus size={14} />
                                        Add Question
                                    </button>
                                </div>
                                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(formData.questions || []).length === 0 && (
                                        <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-xl sm:rounded-2xl border border-dashed border-gray-200">
                                            <p className="text-xs sm:text-sm font-bold text-gray-400">No questions added yet</p>
                                        </div>
                                    )}
                                    {(formData.questions || []).map((q, index) => (
                                        <div key={q.id} className="group relative">
                                            <textarea
                                                required
                                                rows={2}
                                                value={q.text}
                                                onChange={(e) => {
                                                    const newQuestions = [...(formData.questions || [])];
                                                    newQuestions[index] = { ...q, text: e.target.value };
                                                    setFormData({ ...formData, questions: newQuestions });
                                                }}
                                                placeholder={`Question ${index + 1}`}
                                                className="w-full px-4 py-3 sm:p-4 bg-gray-50 border-none rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:font-medium placeholder:text-gray-400 transition-all hover:bg-gray-100 resize-none pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newQuestions = (formData.questions || []).filter((_, i) => i !== index);
                                                    setFormData({ ...formData, questions: newQuestions });
                                                }}
                                                className="absolute right-2 sm:right-3 top-2 sm:top-3 p-1.5 sm:p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                            >
                                                <Icons.X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div>
                                <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2 pl-1">Additional Notes <span className="text-gray-300 font-normal normal-case">(Optional)</span></label>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Add any extra instructions or notes here..."
                                    className="w-full px-4 py-3 sm:p-4 bg-gray-50 border-none rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:font-medium placeholder:text-gray-400 transition-all hover:bg-gray-100 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!formData.title || !formData.subjectId}
                                className="w-full py-4 sm:py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-[22px] text-xs sm:text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98]"
                            >
                                {assignment ? <Icons.Save size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Icons.Plus size={16} className="sm:w-[18px] sm:h-[18px]" />}
                                {assignment ? 'Update Assignment' : 'Add Assignment'}
                            </button>
                        </form>
                    </>
                ) : (
                    // Smart Paste Modal Layout
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <div className="flex items-center gap-2 sm:gap-3 mb-1">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-100 shrink-0">
                                        <Icons.Sparkles size={18} className="sm:w-5 sm:h-5" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Smart Paste</h2>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-500 mt-2">Paste messy details below, and AI will structure it for you.</p>
                            </div>
                            <button onClick={() => { setShowSmartPaste(false); setSmartPasteContent(''); setSmartPasteFile(null); }} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-100 rounded-xl sm:rounded-full transition-colors shrink-0">
                                <Icons.X size={20} className="sm:w-6 sm:h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <textarea
                                    value={smartPasteContent}
                                    onChange={(e) => setSmartPasteContent(e.target.value)}
                                    onPaste={handlePaste}
                                    placeholder="Paste assignment text here... (You can also paste images directly!)"
                                    className="w-full h-40 sm:h-48 px-4 py-3 sm:p-5 bg-gray-50 border-none rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none placeholder:text-gray-400 transition-all hover:bg-gray-100 resize-none"
                                />

                                {smartPasteFile ? (
                                    <div className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 mt-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                                                <Icons.FileText size={16} className="sm:w-5 sm:h-5" />
                                            </div>
                                            <div className="text-xs sm:text-sm min-w-0">
                                                <p className="font-bold text-gray-900 truncate max-w-[200px] sm:max-w-[300px]">{smartPasteFile.name}</p>
                                                <p className="text-gray-500">{(smartPasteFile.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSmartPasteFile(null)}
                                            className="p-2 sm:p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all shrink-0"
                                        >
                                            <Icons.X size={16} className="sm:w-5 sm:h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 mt-3">
                                        <input
                                            type="file"
                                            id="smart-paste-file"
                                            className="hidden"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setSmartPasteFile(file);
                                            }}
                                        />
                                        <label
                                            htmlFor="smart-paste-file"
                                            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-50 border border-gray-200 border-dashed rounded-xl sm:rounded-xl text-xs sm:text-sm font-bold text-gray-500 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 cursor-pointer transition-all"
                                        >
                                            <Icons.Paperclip size={14} className="sm:w-4 sm:h-4" />
                                            Attach Image or PDF
                                        </label>
                                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Optional</span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleSmartPaste}
                                disabled={isProcessingPaste || (!smartPasteContent.trim() && !smartPasteFile)}
                                className={cn(
                                    "w-full py-4 sm:py-4 mt-2 rounded-xl sm:rounded-[22px] text-xs sm:text-sm font-black uppercase tracking-widest shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98]",
                                    isProcessingPaste
                                        ? "bg-gray-400 text-white"
                                        : "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-purple-200 hover:shadow-2xl"
                                )}
                            >
                                {isProcessingPaste ? (
                                    <><Icons.Loader2 size={16} className="animate-spin sm:w-[18px] sm:h-[18px]" /> Processing...</>
                                ) : (
                                    <><Icons.Wand2 size={16} className="sm:w-[18px] sm:h-[18px]" /> Magic Process</>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
