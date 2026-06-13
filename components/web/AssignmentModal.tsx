import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/shared/Dialog";
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

    // Fetch units when subject changes
    useEffect(() => {
        const fetchMethod = async () => {
            if (formData.subjectId) {
                const fetchedUnits = await getUnits(formData.subjectId);
                setUnits(fetchedUnits);

                // If editing and we have a unitId, it will auto-select.
                // If creating, defaulting to empty or first unit is handled by user choice.
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
                // Remove data url prefix (e.g. "data:image/jpeg;base64,")
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
                fileData = {
                    base64,
                    mimeType: smartPasteFile.type
                };
            }

            const parsed = await AiService.parseAssignmentContent(smartPasteContent, fileData);

            setFormData(prev => ({
                ...prev,
                title: parsed.title || prev.title,
                dueDate: parsed.date || prev.dueDate,
                description: parsed.description || prev.description,
                questions: (parsed.questions || []).map((q: string) => ({ id: crypto.randomUUID(), text: q }))
            }));

            setShowSmartPaste(false);
            setSmartPasteContent('');
            setSmartPasteFile(null);
        } catch (error) {
            console.error("Smart paste failed:", error);
        } finally {
            setIsProcessingPaste(false);
        }
    };

    return (

        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                {!showSmartPaste ? (
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                    <Icons.Calendar size={20} />
                                </div>
                                <div className="flex-1">
                                    <DialogTitle>{assignment ? 'Edit Assignment' : 'New Assignment'}</DialogTitle>
                                    <DialogDescription>
                                        {assignment ? 'Update assignment details' : 'Add a new academic task'}
                                    </DialogDescription>
                                </div>
                                {!assignment && (
                                    <button
                                        type="button"
                                        onClick={() => setShowSmartPaste(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 mr-12"
                                    >
                                        <Icons.Sparkles size={12} />
                                        Smart Paste
                                    </button>
                                )}
                            </div>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Operational Efficiency Report"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 relative">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsSubjectPickerOpen(!isSubjectPickerOpen)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 flex items-center justify-between hover:bg-white hover:border-blue-500/30 transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-3">
                                            {subjects.find(s => s.id === formData.subjectId) && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-md text-[10px] uppercase">
                                                    {subjects.find(s => s.id === formData.subjectId)?.code}
                                                </span>
                                            )}
                                            <span className="truncate max-w-[120px]">
                                                {subjects.find(s => s.id === formData.subjectId)?.title || 'Select Subject'}
                                            </span>
                                        </div>
                                        <Icons.ChevronDown className={cn("text-gray-400 transition-transform", isSubjectPickerOpen && "rotate-180")} size={16} />
                                    </button>

                                    {/* Subject Picker Dropdown */}
                                    {isSubjectPickerOpen && (
                                        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 z-50 transform origin-top transition-all animate-in fade-in zoom-in-95 duration-200">
                                            <div className="relative mb-4">
                                                <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                                <input
                                                    autoFocus
                                                    value={subjectSearch}
                                                    onChange={(e) => setSubjectSearch(e.target.value)}
                                                    placeholder="Search code or title..."
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>
                                            <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-1">
                                                {subjects
                                                    .filter(s =>
                                                        s.code.toLowerCase().includes(subjectSearch.toLowerCase()) ||
                                                        s.title.toLowerCase().includes(subjectSearch.toLowerCase())
                                                    )
                                                    .map(s => (
                                                        <button
                                                            key={s.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, subjectId: s.id, unitId: '' });
                                                                setIsSubjectPickerOpen(false);
                                                                setSubjectSearch('');
                                                            }}
                                                            className={cn(
                                                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group",
                                                                formData.subjectId === s.id
                                                                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                                                                    : "hover:bg-blue-50 text-gray-700 font-bold"
                                                            )}
                                                        >
                                                            <span className={cn(
                                                                "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                                                                formData.subjectId === s.id
                                                                    ? "bg-white/20 text-white"
                                                                    : "bg-gray-100 text-gray-400 group-hover:bg-blue-200 group-hover:text-blue-600"
                                                            )}>
                                                                {s.code}
                                                            </span>
                                                            <span className="text-xs truncate">{s.title}</span>
                                                            {formData.subjectId === s.id && (
                                                                <Icons.Check className="ml-auto" size={14} />
                                                            )}
                                                        </button>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit</label>
                                    <select
                                        value={formData.unitId || ''}
                                        onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Unit (Optional)</option>
                                        {units.map(u => {
                                            const cleanTitle = u.title.replace(/^Unit\s+[IVXLCDM\d]+\s*:\s*/i, '');
                                            return (
                                                <option key={u.id} value={u.id}>Unit {u.order}: {cleanTitle}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={formData.dueDate || ''}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Platform</label>
                                    <div className="flex gap-2">
                                        {['ERP', 'GCR', 'Other'].map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, platform: p as any })}
                                                className={cn(
                                                    "flex-1 py-4 rounded-2xl text-xs font-bold transition-all border",
                                                    formData.platform === p
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                                                        : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                                                )}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Questions</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newQuestions = [...(formData.questions || []), { id: crypto.randomUUID(), text: '' }];
                                            setFormData({ ...formData, questions: newQuestions });
                                        }}
                                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-all"
                                    >
                                        <Icons.Plus size={12} />
                                        Add Question
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(formData.questions || []).length === 0 && (
                                        <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                            <p className="text-xs font-bold text-gray-400">No questions added yet</p>
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
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newQuestions = (formData.questions || []).filter((_, i) => i !== index);
                                                    setFormData({ ...formData, questions: newQuestions });
                                                }}
                                                className="absolute right-4 top-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Icons.X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Additional Notes (Optional)</label>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Add any extra instructions or notes here..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                                />
                            </div>

                            <DialogFooter className="pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-10 py-4 bg-blue-600 text-white rounded-[22px] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                                >
                                    {assignment ? 'Update Assignment' : 'Create Assignment'}
                                </button>
                            </DialogFooter>
                        </form>
                    </>
                ) : (
                    <div className="py-2 space-y-4">
                        <DialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-100">
                                    <Icons.Sparkles size={20} />
                                </div>
                                <div>
                                    <DialogTitle>Smart Paste</DialogTitle>
                                    <DialogDescription>
                                        Paste your messy assignment details below, and AI will structure it for you.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-3">
                            <textarea
                                value={smartPasteContent}
                                onChange={(e) => setSmartPasteContent(e.target.value)}
                                onPaste={handlePaste}
                                placeholder="Paste assignment text here... (You can also paste images directly!)"
                                className="w-full h-32 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all resize-none"
                            />

                            {smartPasteFile ? (
                                <div className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded-xl p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                            <Icons.FileText size={16} />
                                        </div>
                                        <div className="text-xs">
                                            <p className="font-bold text-gray-900 truncate max-w-[200px]">{smartPasteFile.name}</p>
                                            <p className="text-gray-500">{(smartPasteFile.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSmartPasteFile(null)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Icons.X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
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
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 border-dashed rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 hover:border-gray-300 cursor-pointer transition-all"
                                    >
                                        <Icons.Paperclip size={14} />
                                        Attach Image or PDF
                                    </label>
                                    <span className="text-[10px] text-gray-400 font-medium">Optional</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => { setShowSmartPaste(false); setSmartPasteContent(''); setSmartPasteFile(null); }}
                                className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all active:scale-95 bg-gray-50 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSmartPaste}
                                disabled={isProcessingPaste || (!smartPasteContent.trim() && !smartPasteFile)}
                                className={cn(
                                    "flex-[2] py-4 rounded-[22px] text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2",
                                    isProcessingPaste
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-purple-500 to-indigo-600 shadow-purple-200 hover:shadow-xl hover:scale-[1.02]"
                                )}
                            >
                                {isProcessingPaste ? (
                                    <><Icons.Loader2 size={14} className="animate-spin" /> Processing...</>
                                ) : (
                                    <><Icons.Wand2 size={14} /> Magic Process</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
