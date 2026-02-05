
import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { ClassroomMaterialService, ClassroomMaterial } from '@/lib/services/classroom-material-service';
import { getUnits } from '@/lib/services/app.service';
import { Subject, Unit } from '@/types';
import { toast } from 'sonner';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    subjects: Subject[];
    editingMaterial: ClassroomMaterial | null;
    isDriveConnected: boolean | null;
    currentUser: any;
    connectGoogleDrive: () => void;
}

export function UploadModal({
    isOpen,
    onClose,
    onSuccess,
    subjects,
    editingMaterial,
    isDriveConnected,
    currentUser,
    connectGoogleDrive
}: UploadModalProps) {
    const [units, setUnits] = useState<Unit[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        subject: '',
        unit: '',
        title: '',
        description: '',
        textContent: '',
        dueDate: '',
        category: '' as 'study_notes' | 'assignments' | 'announcements' | 'cia' | 'other' | '',
    });

    // Reset form when opening/closing or changing editingMaterial
    useEffect(() => {
        if (isOpen) {
            if (editingMaterial) {
                setFormData({
                    subject: editingMaterial.subject_id,
                    unit: editingMaterial.unit_id || '',
                    title: editingMaterial.title,
                    description: editingMaterial.description || '',
                    textContent: editingMaterial.text_content || '',
                    dueDate: editingMaterial.due_date || '',
                    category: editingMaterial.material_category,
                });
            } else {
                setFormData({ subject: '', unit: '', title: '', description: '', textContent: '', dueDate: '', category: '' });
                setSelectedFile(null);
            }
        }
    }, [isOpen, editingMaterial]);

    // Load units when subject changes
    useEffect(() => {
        const loadUnits = async () => {
            if (formData.subject) {
                try {
                    const data = await getUnits(formData.subject);
                    setUnits(data);
                } catch (error) {
                    console.error("Failed to load units", error);
                }
            } else {
                setUnits([]);
            }
        };
        loadUnits();
    }, [formData.subject]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            // Auto-set title if empty
            if (!formData.title) {
                setFormData(prev => ({ ...prev, title: file.name }));
            }
        }
    };

    const handleUpload = async () => {
        if (!formData.subject) {
            toast.error('Please select a subject');
            return;
        }

        if (!formData.category) {
            toast.error('Please select a material category');
            return;
        }

        if (!formData.title) {
            toast.error('Please enter a title');
            return;
        }

        // For announcements/other without files, text content is required
        if (!selectedFile && (formData.category === 'announcements' || formData.category === 'other')) {
            if (!formData.textContent || formData.textContent.trim() === '') {
                toast.error('Please provide text content or upload a file for announcements');
                return;
            }
        }

        // For other materials without files, ensure we have content
        if (!selectedFile && !formData.textContent && !editingMaterial) {
            // Logic check: if we are editing, we might not have a *new* file, which is fine.
            // But the original code was: if (!selectedFile && !formData.textContent)
            // We should check if editingMaterial already has a file or content?
            // Actually, for editing, we might just update metadata.
            // If creating new: need file OR content.
            // If editing: we already have something, unless we deleted it (which isn't supported here).
            if (!editingMaterial) {
                toast.error('Please either upload a file or provide text content');
                return;
            }
        }


        setIsUploading(true);
        setUploadProgress(10);

        try {
            // If editing, handle update
            if (editingMaterial) {
                setUploadProgress(50);

                await ClassroomMaterialService.update(editingMaterial.id, {
                    subject_id: formData.subject,
                    unit_id: formData.unit || undefined,
                    title: formData.title,
                    description: formData.description || undefined,
                    text_content: formData.textContent || undefined,
                    due_date: formData.dueDate || undefined,
                    material_category: formData.category as 'study_notes' | 'assignments' | 'announcements' | 'cia' | 'other',
                });

                setUploadProgress(100);
                toast.success('Material updated successfully!');
                onSuccess();
                onClose();
                return;
            }

            let driveData = null;

            // Step 1: Upload to Google Drive (if file is provided)
            if (selectedFile) {
                const formDataToSend = new FormData();
                formDataToSend.append('file', selectedFile);
                formDataToSend.append('metadata', JSON.stringify({
                    subjectId: formData.subject,
                    subjectTitle: subjects.find(s => s.id === formData.subject)?.title || '',
                    unitId: formData.unit,
                    unitTitle: units.find(u => u.id === formData.unit)?.title || '',
                    category: formData.category, // Pass category for folder organization
                    title: formData.title,
                    description: formData.description,
                }));

                setUploadProgress(30);

                const uploadResponse = await fetch('/api/classroom/upload', {
                    method: 'POST',
                    body: formDataToSend,
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.error || 'Failed to upload file');
                }

                driveData = await uploadResponse.json();
                setUploadProgress(70);
            } else {
                setUploadProgress(50);
            }

            // Step 2: Save metadata to database
            await ClassroomMaterialService.create({
                subject_id: formData.subject,
                unit_id: formData.unit || undefined,
                title: formData.title,
                description: formData.description || undefined,
                text_content: formData.textContent || undefined,
                due_date: formData.dueDate || undefined,
                google_drive_file_id: driveData?.id || '',
                google_drive_link: driveData?.webViewLink || '',
                file_name: selectedFile?.name || undefined,
                file_size_bytes: driveData ? parseInt(driveData.size) : undefined,
                mime_type: selectedFile?.type || undefined,
                material_category: formData.category as 'study_notes' | 'assignments' | 'announcements' | 'cia' | 'other',
                uploaded_by: currentUser?.id || undefined,
                uploader_name: currentUser?.user_metadata?.name || currentUser?.email || 'Unknown',
            });

            setUploadProgress(100);
            toast.success(selectedFile ? 'Material uploaded successfully!' : 'Material created successfully!');
            onSuccess();
            onClose();

        } catch (error: any) {
            console.error('Error uploading material:', error);
            toast.error(`Failed to upload material: ${error.message}`);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        {editingMaterial ? 'Edit Material' : 'Upload Material'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <Icons.X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Connect Google Drive Warning & Button */}
                    {isDriveConnected === false && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                    <Icons.AlertCircle size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-orange-800">Google Drive Not Connected</h3>
                                    <p className="text-xs text-orange-600 mt-1 mb-3">
                                        You need to connect your Google Drive to upload files.
                                        This ensures you own your files and have unlimited storage.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={connectGoogleDrive}
                                        className="px-4 py-2 bg-white border border-orange-200 text-orange-700 text-xs font-bold rounded-lg shadow-sm hover:bg-orange-50 transition-colors flex items-center gap-2"
                                    >
                                        <Icons.ExternalLink size={14} />
                                        Connect Google Drive
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={isDriveConnected === false ? 'opacity-50 pointer-events-none filter blur-[1px] select-none' : ''}>
                        {/* File Upload Area */}
                        {!editingMaterial && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">File (Optional)</label>
                                <input
                                    type="file"
                                    onChange={handleFileSelect}
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.gif"
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all text-center group"
                                >
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <Icons.Upload size={20} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">
                                        {selectedFile ? selectedFile.name : 'Click to select file'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Optional - Add files or create text-only materials
                                    </p>
                                </label>
                            </div>
                        )}


                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter material title"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Subject */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Subject *</label>
                                <div className="relative">
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value, unit: '' })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                                    >
                                        <option value="">Select Subject...</option>
                                        {subjects.map(s => (
                                            <option key={s.id} value={s.id}>{s.code} - {s.title}</option>
                                        ))}
                                    </select>
                                    <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Unit */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Unit (Optional)</label>
                                <div className="relative">
                                    <select
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        disabled={!formData.subject}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium disabled:opacity-50"
                                    >
                                        <option value="">Select Unit...</option>
                                        {units.map(u => (
                                            <option key={u.id} value={u.id}>Unit {u.order}: {u.title}</option>
                                        ))}
                                    </select>
                                    <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Material Category *</label>
                            <div className="relative">
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                                >
                                    <option value="">Select Category...</option>
                                    <option value="study_notes">📚 Study Notes</option>
                                    <option value="assignments">✅ Assignments</option>
                                    <option value="announcements">📢 Announcements</option>
                                    <option value="cia">📊 CIAs</option>
                                    <option value="other">📁 Other Material</option>
                                </select>
                                <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description (Optional)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of the material"
                                rows={1}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium resize-none"
                            />
                        </div>

                        {/* Text Content - Show for announcements and text-based materials */}
                        {(formData.category === 'announcements' || formData.category === 'other') && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    📝 Full Content {!selectedFile && '*'}
                                </label>
                                <textarea
                                    value={formData.textContent}
                                    onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                                    placeholder="Enter the full announcement or text content here...&#10;&#10;You can write multiple paragraphs, lists, and detailed information."
                                    rows={6}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium resize-y"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    💡 Add detailed text content for announcements or information without files
                                </p>
                            </div>
                        )}

                        {/* Due Date - Show for assignments and CIAs */}
                        {(formData.category === 'assignments' || formData.category === 'cia') && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    📅 Due Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    ⏰ Optional: Add a deadline for this {formData.category === 'cia' ? 'CIA' : 'assignment'}
                                </p>
                            </div>
                        )}

                        {/* Progress Bar */}
                        {isUploading && (
                            <div className="space-y-2">
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-2 transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 text-center">Uploading... {uploadProgress}%</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleUpload}
                            type="button"
                            disabled={!formData.subject || !formData.title || isUploading}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <Icons.Loader2 size={20} className="animate-spin" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <span>{editingMaterial ? 'Update Material' : (selectedFile ? 'Upload Material' : 'Create Material')}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
