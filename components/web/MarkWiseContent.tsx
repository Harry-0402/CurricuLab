"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { getSubjects, getUnits } from '@/lib/services/app.service';
import { MarkWiseResourceService, MarkWiseResource } from '@/lib/services/markwise-resource-service';
import { Subject, Unit } from '@/types';

export function MarkWiseContent() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<MarkWiseResource | null>(null);
    const [activeSubject, setActiveSubject] = useState('');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [resources, setResources] = useState<MarkWiseResource[]>([]);
    const [isLoadingResources, setIsLoadingResources] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        unit: '',
        driveLink: ''
    });

    // Load subjects on mount
    useEffect(() => {
        const loadSubjects = async () => {
            const data = await getSubjects();
            setSubjects(data);
            if (data.length > 0) {
                setActiveSubject(data[0].id);
            }
        };
        loadSubjects();
    }, []);

    // Load units when subject changes in form
    useEffect(() => {
        const loadUnits = async () => {
            if (formData.subject) {
                const data = await getUnits(formData.subject);
                setUnits(data);
            }
        };
        loadUnits();
    }, [formData.subject]);

    // Load resources when active subject changes
    useEffect(() => {
        const loadResources = async () => {
            if (activeSubject) {
                setIsLoadingResources(true);
                console.log('Fetching resources for subject:', activeSubject);
                const [resourceData, unitData] = await Promise.all([
                    MarkWiseResourceService.getBySubject(activeSubject),
                    getUnits(activeSubject)
                ]);
                console.log('Resources fetched:', resourceData);
                setResources(resourceData);
                setUnits(unitData);
                setIsLoadingResources(false);
            }
        };
        loadResources();
    }, [activeSubject]);

    const handleSubmit = async () => {
        try {
            console.log('Creating resource with data:', {
                subject_id: formData.subject,
                unit_id: formData.unit,
                google_drive_link: formData.driveLink,
                resource_type: 'html'
            });

            const result = await MarkWiseResourceService.create({
                subject_id: formData.subject,
                unit_id: formData.unit,
                google_drive_link: formData.driveLink,
                resource_type: 'html'
            });

            if (result) {
                console.log('Resource created successfully:', result);
                // Refresh resources if the new resource is for the active subject
                if (formData.subject === activeSubject) {
                    const updatedResources = await MarkWiseResourceService.getBySubject(activeSubject);
                    setResources(updatedResources);
                }
                setIsAddModalOpen(false);
                setFormData({ subject: '', unit: '', driveLink: '' });
                alert('Resource added successfully!');
            }
        } catch (error: any) {
            console.error('Error creating resource:', error);
            alert(`Failed to create resource: ${error.message || 'Unknown error'}`);
        }
    };

    const handleDelete = async (resourceId: string) => {
        if (!confirm('Are you sure you want to permanently delete this resource? This cannot be undone.')) {
            return;
        }

        try {
            const success = await MarkWiseResourceService.hardDelete(resourceId);
            if (success) {
                // Refresh resources list
                const updatedResources = await MarkWiseResourceService.getBySubject(activeSubject);
                setResources(updatedResources);
            }
        } catch (error) {
            console.error('Error deleting resource:', error);
        }
    };

    const handlePreview = (resource: MarkWiseResource) => {
        setSelectedResource(resource);
        setIsPreviewModalOpen(true);
    };


    return (
        <WebAppShell>
            <div className="h-[calc(100vh-140px)] flex flex-col gap-6 max-w-[1800px] mx-auto overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between shrink-0">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                        <p className="text-4xl font-black text-gray-900 tracking-tight">MarkWise</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                    >
                        <Icons.Plus size={18} />
                        <span>Add Resource</span>
                    </button>
                </div>

                {/* Course Code Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                    {subjects.map((subject) => (
                        <button
                            key={subject.id}
                            onClick={() => setActiveSubject(subject.id)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeSubject === subject.id
                                ? 'bg-blue-600 text-white shadow-sm flex items-center gap-2'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {subject.code}
                            {activeSubject === subject.id && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                        </button>
                    ))}
                </div>

                {/* Resources Grid */}
                <div className="flex-1 overflow-y-auto">
                    {isLoadingResources ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm font-medium text-gray-500">Loading resources...</p>
                            </div>
                        </div>
                    ) : resources.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <Icons.FileText className="mx-auto mb-4 text-gray-300" size={64} />
                                <p className="text-lg font-bold text-gray-400">No resources yet</p>
                                <p className="text-sm text-gray-400 mt-2">Click "Add Resource" to get started</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {resources.map((resource) => {
                                const unit = units.find(u => u.id === resource.unit_id);
                                return (
                                    <div
                                        key={resource.id}
                                        onClick={() => handlePreview(resource)}
                                        className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div
                                                className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors"
                                            >
                                                <Icons.FileText className="text-blue-600" size={24} />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(resource.id);
                                                    }}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete resource"
                                                >
                                                    <Icons.Trash2 className="text-gray-400 hover:text-red-600" size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-3">
                                            {unit ? `Unit ${unit.order}: ${unit.title}` : 'No unit assigned'}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md uppercase">
                                                {resource.resource_type}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(resource.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Resource Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-gray-900">Add Resource</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Icons.X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Subject Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                                <div className="relative">
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none pr-10"
                                    >
                                        <option value="">Select Subject...</option>
                                        {subjects.map(s => (
                                            <option key={s.id} value={s.id}>{s.code} - {s.title}</option>
                                        ))}
                                    </select>
                                    <Icons.ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Unit Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Unit</label>
                                <div className="relative">
                                    <select
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        disabled={!formData.subject}
                                        className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select Unit...</option>
                                        {units.map(u => (
                                            <option key={u.id} value={u.id}>Unit {u.order}: {u.title}</option>
                                        ))}
                                    </select>
                                    <Icons.ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>


                            {/* Google Drive Link */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Google Drive HTML Link</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={formData.driveLink}
                                        onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                                        placeholder="https://drive.google.com/..."
                                        className="w-full p-3 pl-10 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-400"
                                    />
                                    <Icons.Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Paste the shareable Google Drive link to the HTML file</p>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={!formData.subject || !formData.unit || !formData.driveLink}
                                className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                <Icons.PlusCircle size={16} />
                                Add Resource
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Preview Modal */}
            {isPreviewModalOpen && selectedResource && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Resource Preview
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {units.find(u => u.id === selectedResource.unit_id)?.title || 'No unit assigned'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => window.open(selectedResource.google_drive_link, '_blank')}
                                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Open in new tab"
                                >
                                    <Icons.ExternalLink className="text-gray-600" size={20} />
                                </button>
                                <button
                                    onClick={() => setIsPreviewModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Close"
                                >
                                    <Icons.X className="text-gray-600" size={20} />
                                </button>
                            </div>
                        </div>

                        {/* iframe Content */}
                        <div className="flex-1 relative bg-gray-50">
                            <iframe
                                src={selectedResource.google_drive_link}
                                className="w-full h-full border-0"
                                title="Resource Preview"
                                allow="autoplay"
                            />
                        </div>
                    </div>
                </div>
            )}
        </WebAppShell>
    );
}
