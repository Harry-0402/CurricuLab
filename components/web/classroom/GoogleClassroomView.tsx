import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '@/components/shared/Icons';
import { ClassroomCourse, ClassroomCourseWork, ClassroomAnnouncement } from '@/lib/services/google-classroom-service';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { createAssignment, getSubjects, getAssignments } from '@/lib/services/app.service';
import { Subject, Assignment } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/shared/Dialog";
import { cn } from "@/lib/utils";

interface GoogleClassroomViewProps {
    isDriveConnected: boolean | null;
    connectGoogleDrive: () => void;
    selectedCourse: ClassroomCourse | null;
}

import { SubjectService } from '@/lib/data/subject-service';
import { useSemester } from '@/components/providers/SemesterProvider';

type TabType = 'assignments' | 'materials' | 'announcements';

const TABS: { id: TabType; label: string; icon: keyof typeof Icons; mobileLabel: string }[] = [
    { id: 'assignments', label: 'Assignments', mobileLabel: 'Assignments', icon: 'CheckSquare' },
    { id: 'materials',   label: 'Materials',   mobileLabel: 'Materials',   icon: 'FileText'   },
    { id: 'announcements', label: 'Announcements', mobileLabel: 'Announcements', icon: 'Bell' },
];

export function GoogleClassroomView({ isDriveConnected, connectGoogleDrive, selectedCourse }: GoogleClassroomViewProps) {
    const { activeSemesterId } = useSemester();
    const [courseWork, setCourseWork] = useState<ClassroomCourseWork[]>([]);
    const [courseMaterials, setCourseMaterials] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<ClassroomAnnouncement[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('assignments');
    const [showTabDropdown, setShowTabDropdown] = useState(false);
    const tabDropdownRef = useRef<HTMLDivElement>(null);

    // Feature State
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [sendingAssignmentId, setSendingAssignmentId] = useState<string | null>(null);
    const [importedAssignments, setImportedAssignments] = useState<Assignment[]>([]);

    // ... existing modal state ...
    const [selectedAssignment, setSelectedAssignment] = useState<ClassroomCourseWork | null>(null);
    const [submission, setSubmission] = useState<any>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewTitle, setPreviewTitle] = useState<string | null>(null);

    // Import Modal State
    const [importModal, setImportModal] = useState<{ isOpen: boolean; work: ClassroomCourseWork | null }>({
        isOpen: false,
        work: null
    });
    const [isParsing, setIsParsing] = useState(false);

    // Close tab dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (tabDropdownRef.current && !tabDropdownRef.current.contains(e.target as Node)) {
                setShowTabDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            const fetched = await SubjectService.getAll();
            setSubjects(fetched);
        };
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedCourse?.id) {
            loadCourseDetails(selectedCourse.id);
        }
    }, [selectedCourse?.id]);

    // ... existing loadCourseDetails ...

    const handleSendToAssignments = (e: React.MouseEvent, work: ClassroomCourseWork) => {
        e.stopPropagation();
        setImportModal({ isOpen: true, work });
    };

    const handleConfirmImport = async (importMode: 'text' | 'instructions' | 'attachments') => {
        const work = importModal.work;
        if (!work || !selectedCourse) return;

        setImportModal({ ...importModal, isOpen: false });
        setSendingAssignmentId(work.id);

        try {
            // Invalidate cache and fetch fresh subjects to avoid stale data if edited in the admin panel
            SubjectService.invalidateCache();
            const freshSubjects = await SubjectService.getAll();

            // Helper to normalize strings for robust matching (ignores casing, punctuation, & vs and, and double-letter typos)
            const normalizeStr = (str: string): string => {
                return str
                    .toLowerCase()
                    .replace(/&/g, 'and')
                    .replace(/[^a-z0-9]/g, '')
                    .replace(/(.)\1+/g, '$1');
            };

            const courseNameNormalized = normalizeStr(selectedCourse.name);

            // 1. Identify Subject by GCR Keyword or Title (fuzzy normalized matching)
            const subject = freshSubjects.find(s => {
                if (s.gcrKeyword) {
                    const keywordNormalized = normalizeStr(s.gcrKeyword);
                    if (courseNameNormalized.includes(keywordNormalized) || keywordNormalized.includes(courseNameNormalized)) {
                        return true;
                    }
                }
                return false;
            });

            if (!subject) {
                toast.error(`No matching subject found for "${selectedCourse.name}". Please set a GCR Keyword in the admin panel.`);
                return;
            }

            let assignmentData: any = {
                id: crypto.randomUUID(),
                subjectId: subject.id,
                title: work.title || 'Untitled Assignment',
                description: work.description || '',
                questions: [],
                dueDate: work.dueDate ?
                    `${work.dueDate.year}-${String(work.dueDate.month).padStart(2, '0')}-${String(work.dueDate.day).padStart(2, '0')}` :
                    null,
                platform: 'GCR',
                gcrId: work.id,
                externalLink: work.alternateLink,
                unitId: undefined
            };

            // 2. Optional AI Parsing
            if (importMode === 'attachments') {
                const firstAttachment = work.materials?.find(m => m.driveFile || m.link);
                if (firstAttachment) {
                    setIsParsing(true);
                    try {
                        let fileData: { base64: string, mimeType: string, text?: string } | undefined = undefined;
                        if (firstAttachment.driveFile) {
                            const driveFileId = firstAttachment.driveFile.driveFile?.id || firstAttachment.driveFile.id;
                            const res = await fetch(`/api/classroom/google/file/${driveFileId}/content`);
                            if (res.ok) {
                                const data = await res.json();
                                fileData = {
                                    base64: data.base64,
                                    mimeType: data.mimeType,
                                    text: data.text
                                };
                            } else {
                                const errorData = await res.json();
                                if (res.status === 403 || res.status === 401 || errorData.details?.toLowerCase().includes('scope')) {
                                    toast.error("Drive access denied. Please re-connect Google Drive to grant permissions.", {
                                        duration: 6000,
                                        action: {
                                            label: "Re-connect",
                                            onClick: () => connectGoogleDrive()
                                        }
                                    });
                                    setIsParsing(false);
                                    setSendingAssignmentId(null);
                                    return; // Stop processing
                                }
                                throw new Error(errorData.details || errorData.error || "Failed to fetch file content");
                            }
                        }

                        const { AiService } = await import('@/lib/services/ai-service');
                        const extractedQuestions = await AiService.extractQuestionsFromContent(work.description || '', fileData);

                        assignmentData = {
                            ...assignmentData,
                            questions: (extractedQuestions || []).map((q: string) => ({ id: crypto.randomUUID(), text: q }))
                        };
                        toast.success("AI extracted questions from attachment!");
                    } catch (err) {
                        console.error("AI parsing failed:", err);
                        toast.error("AI parsing failed, proceeding with basic import.");
                    } finally {
                        setIsParsing(false);
                    }
                } else {
                    toast.info("No attachments found to parse, proceeding with basic import.");
                }
            } else if (importMode === 'instructions') {
                if (work.description) {
                    setIsParsing(true);
                    try {
                        const { AiService } = await import('@/lib/services/ai-service');
                        const extractedQuestions = await AiService.extractQuestionsFromContent(work.description, undefined);

                        assignmentData = {
                            ...assignmentData,
                            questions: (extractedQuestions || []).map((q: string) => ({ id: crypto.randomUUID(), text: q }))
                        };
                        toast.success("AI extracted questions from instructions!");
                    } catch (err) {
                        console.error("AI parsing failed:", err);
                        toast.error("AI parsing failed, proceeding with basic import.");
                    } finally {
                        setIsParsing(false);
                    }
                } else {
                    toast.info("No instructions found to parse, proceeding with basic import.");
                }
            }

            // 3. Create Assignment
            const createdAssignment = await createAssignment(assignmentData);
            setImportedAssignments(prev => [...prev, createdAssignment]);
            toast.success("Assignment sent to tracker!");

        } catch (error: any) {
            console.error("Failed to send assignment:", error);
            toast.error(`Failed to send assignment: ${error?.message || 'Unknown error'}`);
        } finally {
            setSendingAssignmentId(null);
            setImportModal({ isOpen: false, work: null });
        }
    };


    const loadCourseDetails = async (courseId: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/classroom/google/course/${courseId}/work`);
            const data = await res.json();
            if (data.courseWork) setCourseWork(data.courseWork);
            if (data.courseMaterials) setCourseMaterials(data.courseMaterials);
            if (data.announcements) setAnnouncements(data.announcements);

            // Also fetch internal assignments to track imports
            const internalAssignments = await getAssignments();
            setImportedAssignments(internalAssignments.filter(a => a.platform === 'GCR'));
        } catch (error) {
            console.error('Error loading course details:', error);
            toast.error('Failed to load course details');
        } finally {
            setIsLoading(false);
        }
    };

    const loadSubmissionDetails = async (assignment: ClassroomCourseWork) => {
        if (!selectedCourse) return;
        setIsActionLoading(true);
        try {
            const res = await fetch(`/api/classroom/google/course/${selectedCourse.id}/work/${assignment.id}/submit`);
            const data = await res.json();
            if (data.submission) {
                setSubmission(data.submission);
            }
        } catch (error) {
            console.error('Error loading submission details:', error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handlePreview = (item: any) => {
        let url = '';
        let title = '';

        // Unified Drive File logic (handles both teacher materials and student attachments)
        const driveFile = item.driveFile?.driveFile || item.driveFile;

        if (driveFile?.alternateLink) {
            url = driveFile.alternateLink.replace('/view', '/preview');
            title = driveFile.title;
        } else if (item.link) {
            url = item.link.url;
            title = item.link.title;
        } else if (item.youtubeVideo) {
            url = `https://www.youtube.com/embed/${item.youtubeVideo.id}`;
            title = item.youtubeVideo.title;
        }

        if (url) {
            setPreviewUrl(url);
            setPreviewTitle(title);
        }
    };

    const handleAssignmentClick = (assignment: ClassroomCourseWork) => {
        setSubmission(null); // Clear stale data
        setSelectedAssignment(assignment);
        loadSubmissionDetails(assignment);
    };

    if (!isDriveConnected) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Icons.Google size={32} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Google Classroom</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                    Connect your Google account to view your courses, assignments, and announcements directly in CurricuLab.
                </p>
                <button
                    onClick={connectGoogleDrive}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                    <Icons.Link size={18} />
                    Connect Account
                </button>
            </div>
        );
    }

    const activeTabMeta = TABS.find(t => t.id === activeTab)!;
    const ActiveTabIcon = Icons[activeTabMeta.icon];

    return (
        <div className="flex flex-col h-full relative">
            {isLoading ? (
                <div className="flex-1 flex justify-center items-center py-12">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500 font-medium">Loading details...</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-full overflow-hidden">

                    {/* ── Tab Bar ─────────────────────────────────────────────── */}
                    {/* Desktop: pill group */}
                    <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
                        {TABS.map(tab => {
                            const Icon = Icons[tab.icon];
                            const colors: Record<TabType, string> = {
                                assignments: 'text-blue-600',
                                materials: 'text-purple-600',
                                announcements: 'text-orange-600',
                            };
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                        activeTab === tab.id
                                            ? `bg-white shadow-sm ${colors[tab.id]}`
                                            : 'text-gray-500 hover:text-gray-900'
                                    )}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Mobile: dropdown selector */}
                    <div className="sm:hidden mb-4 relative" ref={tabDropdownRef}>
                        <button
                            onClick={() => setShowTabDropdown(v => !v)}
                            className="flex items-center gap-2 w-full px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-bold text-gray-700"
                        >
                            <ActiveTabIcon size={16} className="shrink-0" />
                            <span className="flex-1 text-left">{activeTabMeta.label}</span>
                            <Icons.ChevronDown size={14} className={cn("shrink-0 text-gray-400 transition-transform duration-200", showTabDropdown && "rotate-180")} />
                        </button>
                        {showTabDropdown && (
                            <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
                                {TABS.map(tab => {
                                    const Icon = Icons[tab.icon];
                                    const colors: Record<TabType, string> = {
                                        assignments: 'text-blue-600',
                                        materials: 'text-purple-600',
                                        announcements: 'text-orange-600',
                                    };
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => { setActiveTab(tab.id); setShowTabDropdown(false); }}
                                            className={cn(
                                                "flex items-center gap-3 w-full px-4 py-3 text-sm font-bold transition-colors",
                                                activeTab === tab.id
                                                    ? `bg-gray-50 ${colors[tab.id]}`
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            )}
                                        >
                                            <Icon size={16} />
                                            {tab.label}
                                            {activeTab === tab.id && <Icons.Check size={14} className="ml-auto" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ── Content Area ─────────────────────────────────────────── */}
                    <div className="flex-1 overflow-y-auto pb-24 sm:pb-20">

                        {/* Assignments Tab */}
                        {activeTab === 'assignments' && (
                            <div className="space-y-3">
                                {courseWork.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Icons.CheckSquare className="text-blue-500" size={24} />
                                        </div>
                                        <p className="text-gray-500">No assignments found for this course</p>
                                    </div>
                                ) : (
                                    courseWork.map((work) => {
                                        const importedAssignment = importedAssignments.find(a => a.gcrId === work.id);
                                        return (
                                            <div
                                                key={work.id}
                                                onClick={() => handleAssignmentClick(work)}
                                                className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 hover:border-blue-300 hover:shadow-sm transition-all group cursor-pointer"
                                            >
                                                {/* Title row */}
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <h4 className="font-bold text-gray-900 text-base sm:text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                                        {work.title}
                                                    </h4>
                                                    {work.dueDate && (
                                                        <span className="shrink-0 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100 whitespace-nowrap">
                                                            Due {work.dueDate.day}/{work.dueDate.month}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Description */}
                                                {work.description && (
                                                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{work.description}</p>
                                                )}

                                                {/* Meta + Actions */}
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-3 border-t border-gray-100">
                                                    {/* Points & status badges */}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {work.maxPoints != null && (
                                                            <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                                {work.maxPoints} pts
                                                            </span>
                                                        )}
                                                        {work.state && (
                                                            <span className="text-[11px] font-bold capitalize text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                                {work.state.toLowerCase()}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Action buttons */}
                                                    <div className="flex items-center gap-2 sm:ml-auto" onClick={e => e.stopPropagation()}>
                                                        {/* Import / See in Assignments */}
                                                        {importedAssignment ? (
                                                            <a
                                                                href={`/assignments?subjectId=${importedAssignment.subjectId}&assignmentId=${importedAssignment.id}`}
                                                                className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-all border border-blue-100 whitespace-nowrap"
                                                            >
                                                                <Icons.ExternalLink size={12} />
                                                                See in Assignments
                                                            </a>
                                                        ) : (
                                                            <button
                                                                onClick={(e) => handleSendToAssignments(e, work)}
                                                                disabled={sendingAssignmentId === work.id}
                                                                className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 whitespace-nowrap disabled:opacity-50"
                                                            >
                                                                {sendingAssignmentId === work.id
                                                                    ? <Icons.Loader2 size={12} className="animate-spin" />
                                                                    : <Icons.Send size={12} />
                                                                }
                                                                <span className="hidden sm:inline">Send to Assignments</span>
                                                                <span className="sm:hidden">Import</span>
                                                            </button>
                                                        )}

                                                        {/* Open Assignment */}
                                                        <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                                                            Open <Icons.ChevronRight size={12} className="shrink-0" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}

                        {/* Study Materials Tab */}
                        {activeTab === 'materials' && (
                            <div className="space-y-3">
                                {courseMaterials.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Icons.FileText className="text-purple-500" size={24} />
                                        </div>
                                        <p className="text-gray-500">No study materials available</p>
                                    </div>
                                ) : (
                                    courseMaterials.map((material) => (
                                        <div key={material.id} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 hover:border-purple-300 transition-colors">
                                            <div className="mb-3">
                                                <h4 className="font-bold text-gray-900 text-base mb-1">{material.title}</h4>
                                                {material.description && <p className="text-gray-500 text-sm leading-relaxed">{material.description}</p>}
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {material.materials && material.materials.map((item: any, idx: number) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handlePreview(item)}
                                                        className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors border border-blue-100 group"
                                                    >
                                                        {item.driveFile ? <Icons.FileText size={14} /> : <Icons.Link size={14} />}
                                                        <span className="font-medium truncate max-w-[160px] text-left">
                                                            {item.driveFile?.driveFile?.title || item.link?.title || 'View Resource'}
                                                        </span>
                                                        <Icons.Eye size={13} className="opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Announcements Tab */}
                        {activeTab === 'announcements' && (
                            <div className="space-y-3">
                                {announcements.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Icons.Bell className="text-orange-500" size={24} />
                                        </div>
                                        <p className="text-gray-500">No announcements posted</p>
                                    </div>
                                ) : (
                                    announcements.map((announcement) => (
                                        <div key={announcement.id} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 hover:border-orange-300 transition-colors">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                                                    {announcement.creatorUserId ? 'T' : 'A'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">Announcement</p>
                                                    <p className="text-xs text-gray-400">
                                                        {announcement.updateTime ? new Date(announcement.updateTime).toLocaleDateString() : 'No date'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl leading-relaxed mb-3">
                                                {announcement.text}
                                            </div>

                                            {announcement.materials && announcement.materials.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Attachments</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {announcement.materials.map((item: any, idx: number) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => handlePreview(item)}
                                                                className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 group transition-colors"
                                                            >
                                                                {item.driveFile ? <Icons.FileText size={13} /> : <Icons.Link size={13} />}
                                                                <span className="truncate max-w-[160px]">
                                                                    {item.driveFile?.driveFile?.title || item.link?.title || 'Attachment'}
                                                                </span>
                                                                <Icons.Eye size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Assignment Preview Modal */}
            {selectedAssignment && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                                    <Icons.CheckSquare size={20} className="text-blue-600 sm:hidden" />
                                    <Icons.CheckSquare size={24} className="text-blue-600 hidden sm:block" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight truncate">{selectedAssignment.title}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {selectedAssignment.maxPoints || 'No'} pts
                                        {selectedAssignment.dueDate
                                            ? ` • Due ${selectedAssignment.dueDate.day}/${selectedAssignment.dueDate.month}/${selectedAssignment.dueDate.year}`
                                            : ' • No due date'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedAssignment(null);
                                    setSubmission(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900 shrink-0 ml-2"
                            >
                                <Icons.X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-gray-50/50">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
                                {/* Left Column: Description & Teacher Materials */}
                                <div className="lg:col-span-2 space-y-5 sm:space-y-8">
                                    <section className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Instructions</h4>
                                        <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                                            {selectedAssignment.description || "No instructions provided."}
                                        </div>
                                    </section>

                                    {selectedAssignment.materials && selectedAssignment.materials.length > 0 && (
                                        <section className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Reference Materials</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                                {selectedAssignment.materials.map((item: any, idx: number) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handlePreview(item)}
                                                        className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all group text-left w-full"
                                                    >
                                                        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-gray-400 group-hover:text-blue-600 shadow-sm shrink-0">
                                                            {item.driveFile ? <Icons.FileText size={18} /> : item.youtubeVideo ? <Icons.Youtube size={18} /> : <Icons.Link size={18} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 truncate">
                                                                {item.driveFile?.driveFile?.title || item.link?.title || item.youtubeVideo?.title || 'View Resource'}
                                                            </p>
                                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
                                                                {item.driveFile ? 'Drive File' : item.youtubeVideo ? 'YouTube' : 'Link'}
                                                            </p>
                                                        </div>
                                                        <Icons.Eye size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                                                    </button>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                {/* Right Column: Submission Status & Actions */}
                                <div className="space-y-4 sm:space-y-6">
                                    <section className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />

                                        <div className="flex items-center justify-between mb-4 sm:mb-6 relative">
                                            <h4 className="text-base font-black text-gray-900">Your Work</h4>
                                            {(() => {
                                                const state = submission?.state || 'Assigned';
                                                const isAssigned = ['NEW', 'CREATED', 'RECLAIMED_BY_STUDENT', 'Assigned'].includes(state);
                                                const label = isAssigned ? 'Assigned' :
                                                    state === 'TURNED_IN' ? 'Turned In' :
                                                        state === 'RETURNED' ? 'Returned' : state;

                                                return (
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                        isAssigned ? 'bg-orange-100 text-orange-700' :
                                                            state === 'TURNED_IN' ? 'bg-green-100 text-green-700' :
                                                                'bg-blue-100 text-blue-700'
                                                    )}>
                                                        {label}
                                                    </span>
                                                );
                                            })()}
                                        </div>

                                        <div className="space-y-2 mb-4 sm:mb-6 relative">
                                            {submission?.assignmentSubmission?.attachments ? (
                                                submission.assignmentSubmission.attachments.map((item: any, idx: number) => {
                                                    const driveFile = item.driveFile?.driveFile || item.driveFile;
                                                    const title = driveFile?.title || item.link?.title || 'Attachment';

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-all group w-full"
                                                        >
                                                            <button
                                                                onClick={() => handlePreview(item)}
                                                                className="flex items-center gap-3 flex-1 min-w-0"
                                                            >
                                                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400 shadow-sm shrink-0">
                                                                    {item.driveFile ? <Icons.FileText size={16} /> : <Icons.Link size={16} />}
                                                                </div>
                                                                <p className="text-sm font-bold text-gray-700 truncate">{title}</p>
                                                            </button>
                                                            <Icons.Eye size={15} className="text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center py-6 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                                    <p className="text-xs text-gray-400 font-bold">No files attached</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <a
                                                href={selectedAssignment.alternateLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-3.5 px-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2 group"
                                            >
                                                <Icons.ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                Open in Google Classroom
                                            </a>

                                            <div className="bg-blue-50 border border-blue-100 p-3 sm:p-4 rounded-2xl">
                                                <div className="flex gap-2.5">
                                                    <Icons.Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                                    <div className="text-[10px] font-bold text-blue-800 leading-relaxed">
                                                        To add, remove, or turn in your work, please use the Google Classroom website. Changes will appear here automatically.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewUrl && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 lg:p-12 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full h-full max-w-7xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <p className="font-bold text-gray-900 truncate text-sm sm:text-base">{previewTitle}</p>
                            <button
                                onClick={() => { setPreviewUrl(null); setPreviewTitle(null); }}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900 shrink-0 ml-2"
                            >
                                <Icons.X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <iframe
                                src={previewUrl}
                                className="w-full h-full border-0"
                                title={previewTitle || 'Preview'}
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            />
                        </div>
                        <div className="px-4 sm:px-6 py-3 border-t border-gray-100 flex justify-end">
                            <a
                                href={previewUrl.replace('/preview', '/view')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200"
                            >
                                <Icons.ExternalLink size={16} />
                                Open Original
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Confirmation Dialog */}
            <Dialog open={importModal.isOpen} onOpenChange={(open) => !open && setImportModal({ ...importModal, isOpen: false })}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                            <Icons.Sparkles className="text-blue-600" size={24} />
                        </div>
                        <DialogTitle className="text-xl font-black">AI Assignment Import</DialogTitle>
                        <DialogDescription className="font-medium text-gray-500">
                            Would you like CurricuLab AI to analyze the assignment attachments to extract questions and details?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Assignment</h5>
                            <p className="text-sm font-bold text-gray-900">{importModal.work?.title}</p>
                            {importModal.work?.materials && importModal.work.materials.length > 0 && (
                                <p className="text-[10px] font-bold text-blue-600 mt-2 flex items-center gap-1">
                                    <Icons.Paperclip size={10} /> {importModal.work.materials.length} attachment(s) found
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleConfirmImport('text')}
                                className="w-full px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 transition-all border border-gray-100"
                            >
                                No, Import Only Title & Text
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleConfirmImport('instructions')}
                                    className="flex-1 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all border border-blue-200 flex items-center justify-center gap-2 group"
                                >
                                    <Icons.FileText size={14} className="group-hover:scale-110 transition-transform" />
                                    Parse Instructions
                                </button>
                                <button
                                    onClick={() => handleConfirmImport('attachments')}
                                    className="flex-[1.2] px-4 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Icons.Wand2 size={14} className="group-hover:rotate-12 transition-transform" />
                                    Parse Attachments
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] text-gray-400 font-medium text-center">
                        AI analysis might take a few seconds depending on the attachment size.
                    </p>
                </DialogContent>
            </Dialog>

            {/* Parsing Overlay */}
            {isParsing && (
                <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-center">
                            <p className="font-black text-gray-900">AI is Analyzing...</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Reading attachments</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
