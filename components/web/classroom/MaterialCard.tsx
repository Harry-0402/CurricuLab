
import React from 'react';
import { Icons } from '@/components/shared/Icons';
import { ClassroomMaterial } from '@/lib/services/classroom-material-service';
import { Subject, Unit } from '@/types';

interface MaterialCardProps {
    material: ClassroomMaterial;
    subject?: Subject;
    unit?: Unit;
    currentUser: any;
    submissionStatus?: { status: string; id: string };
    onPreview: (material: ClassroomMaterial) => void;
    onEdit: (material: ClassroomMaterial) => void;
    onDelete: (id: string, driveId: string) => void;
}

export function MaterialCard({
    material,
    subject,
    unit,
    currentUser,
    submissionStatus,
    onPreview,
    onEdit,
    onDelete
}: MaterialCardProps) {

    const getFileIcon = (fileType: string) => {
        switch (fileType) {
            case 'pdf': return <Icons.FileText className="text-red-600" size={24} />;
            case 'doc': return <Icons.FileText className="text-blue-600" size={24} />;
            case 'ppt': return <Icons.FileText className="text-orange-600" size={24} />;
            case 'video': return <Icons.Video className="text-purple-600" size={24} />;
            case 'image': return <Icons.Image className="text-green-600" size={24} />;
            default: return <Icons.File className="text-gray-600" size={24} />;
        }
    };

    return (
        <div
            onClick={() => onPreview(material)}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                    {getFileIcon(material.file_type)}
                </div>
                <div className="flex gap-1">
                    {/* Edit Button - Always Visible */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(material);
                        }}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group/edit"
                        title="Edit material"
                    >
                        <Icons.Edit className="w-4 h-4 text-gray-400 group-hover/edit:text-blue-600" />
                    </button>
                    {/* Delete Button - Only for owner */}
                    {currentUser?.id === material.uploaded_by && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(material.id, material.google_drive_file_id);
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group/delete"
                            title="Delete material"
                        >
                            <Icons.Trash2 className="w-4 h-4 text-gray-400 group-hover/delete:text-red-600" />
                        </button>
                    )}
                </div>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{material.title}</h3>
            {material.description && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{material.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">
                    {subject?.code || 'Unknown'}
                </span>
                <span className={`px-2 py-1 text-xs font-bold rounded-md ${material.material_category === 'study_notes' ? 'bg-green-50 text-green-700' :
                    material.material_category === 'assignments' ? 'bg-orange-50 text-orange-700' :
                        material.material_category === 'announcements' ? 'bg-purple-50 text-purple-700' :
                            material.material_category === 'cia' ? 'bg-red-50 text-red-700' :
                                'bg-gray-100 text-gray-600'
                    }`}>
                    {material.material_category === 'study_notes' ? '📚 Study Notes' :
                        material.material_category === 'assignments' ? '✅ Assignments' :
                            material.material_category === 'announcements' ? '📢 Announcements' :
                                material.material_category === 'cia' ? '📊 CIAs' :
                                    '📁 Other'}
                </span>
            </div>

            {/* Status Badge */}
            {(material.material_category === 'assignments' || material.material_category === 'cia') && (
                <div className="mb-2">
                    {submissionStatus ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                            <Icons.CheckCircle size={12} className="fill-current" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Submitted</span>
                        </div>
                    ) : material.due_date && new Date(material.due_date) < new Date() ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                            <Icons.AlertCircle size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Overdue</span>
                        </div>
                    ) : material.due_date ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                            <Icons.Clock size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Pending</span>
                        </div>
                    ) : null}
                </div>
            )}
            <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{material.uploader_name || 'Unknown'}</span>
                {material.due_date && (material.material_category === 'assignments' || material.material_category === 'cia') ? (
                    <span className="flex items-center gap-1 text-red-600 font-bold">
                        📅 Due: {new Date(material.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                ) : (
                    <span>{new Date(material.created_at).toLocaleDateString()}</span>
                )}
            </div>
        </div>
    );
}
