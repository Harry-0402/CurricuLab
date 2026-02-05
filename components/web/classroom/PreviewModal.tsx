
import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { ClassroomMaterial } from '@/lib/services/classroom-material-service';
import { SubmissionService, CommentService, Submission, MaterialComment } from '@/lib/services/submission-service';
import { Subject } from '@/types';
import { toast } from 'sonner';
import { SubmissionModal } from './SubmissionModal';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    material: ClassroomMaterial;
    currentUser: any;
    subjects: Subject[];
    onSubmissionChange: () => void; // To update parent state (badges)
}

export function PreviewModal({
    isOpen,
    onClose,
    material,
    currentUser,
    subjects,
    onSubmissionChange
}: PreviewModalProps) {
    const [comments, setComments] = useState<MaterialComment[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [mySubmission, setMySubmission] = useState<Submission | null>(null);
    const [commentText, setCommentText] = useState('');
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen && material) {
            loadData();
        }
    }, [isOpen, material]);

    const loadData = async () => {
        // Load comments
        const materialComments = await CommentService.getByMaterial(material.id);
        setComments(materialComments);

        // For assignments/CIAs, load submissions
        if (material.material_category === 'assignments' || material.material_category === 'cia') {
            const allSubmissions = await SubmissionService.getByMaterial(material.id);
            setSubmissions(allSubmissions);

            // Load my submission if exists
            if (currentUser) {
                const mySubmit = await SubmissionService.getByStudent(material.id, currentUser.id);
                setMySubmission(mySubmit);
            }
        }
    };

    const handlePostComment = async () => {
        if (!material || !currentUser || !commentText.trim()) return;

        try {
            const comment = await CommentService.create({
                material_id: material.id,
                user_id: currentUser.id,
                user_name: currentUser.user_metadata?.name || currentUser.email || 'Anonymous',
                comment_text: commentText,
            });

            if (comment) {
                setComments(prev => [...prev, comment]);
                setCommentText('');
                toast.success('Comment posted');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error('Failed to post comment');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Delete this comment?')) return;

        const success = await CommentService.delete(commentId);
        if (success) {
            setComments(prev => prev.filter(c => c.id !== commentId));
            toast.success('Comment deleted');
        }
    };

    const handleDeleteSubmission = async () => {
        if (!mySubmission) return;
        if (!confirm('Are you sure you want to delete your submission?')) return;

        const success = await SubmissionService.delete(mySubmission.id);
        if (success) {
            setMySubmission(null);
            setSubmissions(prev => prev.filter(s => s.id !== mySubmission!.id));
            onSubmissionChange();
            toast.success('Submission deleted');
        } else {
            toast.error('Failed to delete submission');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">{material.title}</h2>
                        <p className="text-sm text-gray-500 mt-1">{subjects.find(s => s.id === material.subject_id)?.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <Icons.X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* File/Content Viewer */}
                    {material.google_drive_file_id ? (
                        <div className="space-y-4">
                            {/* Preview Container */}
                            <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video relative group">
                                <iframe
                                    src={material.google_drive_link.replace(/\/view.*$|\/edit.*$/, '/preview')}
                                    className="w-full h-full border-0"
                                    title="Material Preview"
                                    allow="autoplay"
                                />

                                {/* Overlay Button */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a
                                        href={material.google_drive_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-white text-gray-900 rounded-lg shadow-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-50"
                                    >
                                        <Icons.ExternalLink size={16} />
                                        Open in Drive
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : material.text_content ? (
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="prose prose-sm max-w-none">
                                <p className="whitespace-pre-wrap text-gray-700">{material.text_content}</p>
                            </div>
                        </div>
                    ) : null}

                    {/* Submission Section for Assignments/CIAs */}
                    {(material.material_category === 'assignments' || material.material_category === 'cia') && currentUser && (
                        <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">📤 Your Submission</h3>
                                {mySubmission ? (
                                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                        ✓ Submitted
                                    </span>
                                ) : material.due_date && new Date(material.due_date) < new Date() ? (
                                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                        ⚠ Overdue
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                                        ⏳ Pending
                                    </span>
                                )}
                            </div>

                            {mySubmission ? (
                                <div className="bg-white rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <Icons.CheckCircle className="text-green-600" size={20} />
                                                <span className="font-bold text-gray-900">Submitted {new Date(mySubmission.submitted_at).toLocaleDateString()}</span>
                                            </div>
                                            {mySubmission.google_drive_link && (
                                                <a
                                                    href={mySubmission.google_drive_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-sm flex items-center gap-2 mb-2"
                                                >
                                                    <Icons.File size={16} />
                                                    {mySubmission.file_name || 'View submission'}
                                                </a>
                                            )}
                                            {mySubmission.submission_text && (
                                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{mySubmission.submission_text}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleDeleteSubmission}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete submission"
                                        >
                                            <Icons.Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsSubmissionModalOpen(true)}
                                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                                >
                                    Submit your work
                                </button>
                            )}
                        </div>
                    )}

                    {/* Comments Section */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">💬 Comments ({comments.length})</h3>

                        {/* Comment Input */}
                        <div className="mb-6">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                                    placeholder="Add a comment..."
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                                <button
                                    onClick={handlePostComment}
                                    disabled={!commentText.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Post
                                </button>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-3">
                            {comments.length === 0 ? (
                                <p className="text-center text-gray-400 py-8">No comments yet. Be the first to comment!</p>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-gray-900">{comment.user_name}</span>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700">{comment.comment_text}</p>
                                            </div>
                                            {currentUser && comment.user_id === currentUser.id && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="p-1 hover:bg-red-100 rounded transition-colors"
                                                    title="Delete comment"
                                                >
                                                    <Icons.Trash2 className="text-gray-400 hover:text-red-600" size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SubmissionModal
                isOpen={isSubmissionModalOpen}
                onClose={() => setIsSubmissionModalOpen(false)}
                onSuccess={(newSubmission) => {
                    setMySubmission(newSubmission);
                    setSubmissions(prev => [newSubmission, ...prev]);
                    onSubmissionChange();
                }}
                material={material}
                currentUser={currentUser}
                subjects={subjects}
            />
        </div>
    );
}
