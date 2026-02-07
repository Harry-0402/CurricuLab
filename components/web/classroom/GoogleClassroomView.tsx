import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { ClassroomCourse, ClassroomCourseWork, ClassroomAnnouncement } from '@/lib/services/google-classroom-service';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface GoogleClassroomViewProps {
    isDriveConnected: boolean | null;
    connectGoogleDrive: () => void;
    selectedCourse: ClassroomCourse | null;
}

export function GoogleClassroomView({ isDriveConnected, connectGoogleDrive, selectedCourse }: GoogleClassroomViewProps) {
    const [courseWork, setCourseWork] = useState<ClassroomCourseWork[]>([]);
    const [courseMaterials, setCourseMaterials] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<ClassroomAnnouncement[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'assignments' | 'materials' | 'announcements'>('assignments');

    // Modal State
    const [selectedAssignment, setSelectedAssignment] = useState<ClassroomCourseWork | null>(null);
    const [submission, setSubmission] = useState<any>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewTitle, setPreviewTitle] = useState<string | null>(null);

    useEffect(() => {
        if (selectedCourse?.id) {
            loadCourseDetails(selectedCourse.id);
        }
    }, [selectedCourse?.id]);

    const loadCourseDetails = async (courseId: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/classroom/google/course/${courseId}/work`);
            const data = await res.json();
            if (data.courseWork) setCourseWork(data.courseWork);
            if (data.courseMaterials) setCourseMaterials(data.courseMaterials);
            if (data.announcements) setAnnouncements(data.announcements);
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
                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
                        <button
                            onClick={() => setActiveTab('assignments')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'assignments'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <Icons.CheckSquare size={16} />
                            Assignments
                        </button>
                        <button
                            onClick={() => setActiveTab('materials')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'materials'
                                ? 'bg-white text-purple-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <Icons.FileText size={16} />
                            Materials
                        </button>
                        <button
                            onClick={() => setActiveTab('announcements')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'announcements'
                                ? 'bg-white text-orange-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <Icons.Bell size={16} />
                            Announcements
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto pr-2 pb-20">
                        {/* Assignments Tab */}
                        {activeTab === 'assignments' && (
                            <div className="space-y-4">
                                {courseWork.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Icons.CheckSquare className="text-blue-500" size={24} />
                                        </div>
                                        <p className="text-gray-500">No assignments found for this course</p>
                                    </div>
                                ) : (
                                    courseWork.map((work) => (
                                        <div
                                            key={work.id}
                                            onClick={() => handleAssignmentClick(work)}
                                            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors group cursor-pointer"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{work.title}</h4>
                                                {work.dueDate && (
                                                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">
                                                        Due {work.dueDate.day}/{work.dueDate.month}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mb-4 line-clamp-2">{work.description}</p>
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                                <div className="flex gap-3 text-xs font-medium text-gray-400">
                                                    {work.maxPoints && <span>Points: {work.maxPoints}</span>}
                                                    {work.state && <span className="capitalize px-2 py-0.5 bg-gray-100 rounded text-gray-600">{work.state.toLowerCase()}</span>}
                                                </div>
                                                <div className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                                                    Open Assignment <Icons.ChevronRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Study Materials Tab */}
                        {activeTab === 'materials' && (
                            <div className="space-y-4">
                                {courseMaterials.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Icons.FileText className="text-purple-500" size={24} />
                                        </div>
                                        <p className="text-gray-500">No study materials available</p>
                                    </div>
                                ) : (
                                    courseMaterials.map((material) => (
                                        <div key={material.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                                            <div className="mb-4">
                                                <h4 className="font-bold text-gray-900 text-lg mb-2">{material.title}</h4>
                                                {material.description && <p className="text-gray-600 text-sm leading-relaxed">{material.description}</p>}
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                {material.materials && material.materials.map((item: any, idx: number) => (
                                                    <a
                                                        key={idx}
                                                        href={item.driveFile?.driveFile?.alternateLink || item.link?.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-lg transition-colors border border-blue-100"
                                                    >
                                                        {item.driveFile ? <Icons.FileText size={16} /> : <Icons.Link size={16} />}
                                                        <span className="font-medium truncate max-w-[200px]">
                                                            {item.driveFile?.driveFile?.title || item.link?.title || 'View Resource'}
                                                        </span>
                                                        <Icons.ExternalLink size={12} className="opacity-50" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Announcements Tab */}
                        {activeTab === 'announcements' && (
                            <div className="space-y-4">
                                {announcements.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Icons.Bell className="text-orange-500" size={24} />
                                        </div>
                                        <p className="text-gray-500">No announcements posted</p>
                                    </div>
                                ) : (
                                    announcements.map((announcement) => (
                                        <div key={announcement.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                                                        {announcement.creatorUserId ? 'T' : 'A'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">Announcement</p>
                                                        <p className="text-xs text-gray-500">
                                                            {announcement.updateTime ? new Date(announcement.updateTime).toLocaleDateString() : 'No date'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="prose prose-sm max-w-none text-gray-700 mb-4 bg-gray-50 p-4 rounded-lg">
                                                {announcement.text}
                                            </div>

                                            {announcement.materials && announcement.materials.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Attachments</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {announcement.materials.map((item: any, idx: number) => (
                                                            <a
                                                                key={idx}
                                                                href={item.driveFile?.driveFile?.alternateLink || item.link?.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                                                            >
                                                                {item.driveFile ? <Icons.FileText size={14} /> : <Icons.Link size={14} />}
                                                                {item.driveFile?.driveFile?.title || item.link?.title || 'Attachment'}
                                                            </a>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <Icons.CheckSquare size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-none">{selectedAssignment.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-2">
                                        {selectedAssignment.maxPoints || 'No'} points • Due {selectedAssignment.dueDate ? `${selectedAssignment.dueDate.day}/${selectedAssignment.dueDate.month}/${selectedAssignment.dueDate.year}` : 'No due date'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedAssignment(null);
                                    setSubmission(null);
                                }}
                                className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
                            >
                                <Icons.X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: Description & Teacher Materials */}
                                <div className="lg:col-span-2 space-y-8">
                                    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Instructions</h4>
                                        <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {selectedAssignment.description || "No instructions provided."}
                                        </div>
                                    </section>

                                    {selectedAssignment.materials && selectedAssignment.materials.length > 0 && (
                                        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Reference Materials</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {selectedAssignment.materials.map((item: any, idx: number) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handlePreview(item)}
                                                        className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all group text-left w-full"
                                                    >
                                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 group-hover:text-blue-600 shadow-sm">
                                                            {item.driveFile ? <Icons.FileText size={20} /> : item.youtubeVideo ? <Icons.Youtube size={20} /> : <Icons.Link size={20} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 truncate">
                                                                {item.driveFile?.driveFile?.title || item.link?.title || item.youtubeVideo?.title || 'View Resource'}
                                                            </p>
                                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
                                                                {item.driveFile ? 'Drive File' : item.youtubeVideo ? 'YouTube' : 'Link'}
                                                            </p>
                                                        </div>
                                                        <Icons.ExternalLink size={14} className="text-gray-300 group-hover:text-blue-500" />
                                                    </button>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                {/* Right Column: Submission Status & Actions */}
                                <div className="space-y-6">
                                    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 font-black"></div>

                                        <div className="flex items-center justify-between mb-6 relative">
                                            <h4 className="text-lg font-black text-gray-900">Your Work</h4>
                                            {(() => {
                                                const state = submission?.state || 'Assigned';
                                                const isAssigned = ['NEW', 'CREATED', 'RECLAIMED_BY_STUDENT', 'Assigned'].includes(state);
                                                const label = isAssigned ? 'Assigned' :
                                                    state === 'TURNED_IN' ? 'Turned In' :
                                                        state === 'RETURNED' ? 'Returned' : state;

                                                return (
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isAssigned ? 'bg-orange-100 text-orange-700' :
                                                        state === 'TURNED_IN' ? 'bg-green-100 text-green-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {label}
                                                    </span>
                                                );
                                            })()}
                                        </div>

                                        <div className="space-y-3 mb-6 relative">
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
                                                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400 shadow-sm whitespace-nowrap">
                                                                    {item.driveFile ? <Icons.FileText size={16} /> : <Icons.Link size={16} />}
                                                                </div>
                                                                <p className="text-sm font-bold text-gray-700 truncate">
                                                                    {title}
                                                                </p>
                                                            </button>

                                                            <Icons.ExternalLink size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center py-8 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                                    <p className="text-xs text-gray-400 font-bold">No files attached</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <a
                                                href={selectedAssignment.alternateLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-4 px-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2 group"
                                            >
                                                <Icons.ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                Open in Google Classroom
                                            </a>

                                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                                                <div className="flex gap-3">
                                                    <Icons.Info size={20} className="text-blue-500 shrink-0" />
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
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 lg:p-12 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full h-full max-w-7xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-black text-gray-900 truncate">{previewTitle || 'Preview'}</h3>
                            <button
                                onClick={() => {
                                    setPreviewUrl(null);
                                    setPreviewTitle(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <Icons.X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 bg-gray-50 relative">
                            <iframe
                                src={previewUrl}
                                className="w-full h-full border-none"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            />
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
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
        </div>
    );
}
