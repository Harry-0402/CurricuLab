"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/shared/Button';
import { Icons } from '@/components/shared/Icons';
import { ResumeData } from '@/types';
import { AiService } from '@/lib/services/ai-service';
import { PlatformExportService } from '@/lib/services/export-service';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'curriculab_resume_draft';

const INITIAL_DATA: ResumeData = {
    fullName: '',
    currentRole: '',
    summary: '',
    contact: {
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        location: ''
    },
    skills: [
        { id: '1', category: 'Technical Skills', skills: [] },
        { id: '2', category: 'Soft Skills', skills: [] }
    ],
    experience: [
        {
            id: '1',
            company: '',
            role: '',
            location: '',
            period: '',
            description: ['']
        }
    ],
    projects: [
        {
            id: '1',
            title: '',
            techStack: [],
            description: [''],
            link: ''
        }
    ],
    education: [
        {
            id: '1',
            institution: '',
            degree: '',
            location: '',
            period: '',
            score: '',
            relevantCoursework: []
        }
    ],
    certifications: [],
    awards: []
};

// Local Input & Textarea to avoid missing components
const Input = ({ className, ...props }: any) => (
    <input className={cn("flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
);

const Textarea = ({ className, ...props }: any) => (
    <textarea className={cn("flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
);

const Card = ({ children, className }: any) => (
    <div className={cn("rounded-xl border border-gray-100 bg-white shadow-sm", className)}>{children}</div>
);

export function ResumeBuilderContent() {
    const [data, setData] = useState<ResumeData>(INITIAL_DATA);

    // Persistence: Load on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load saved resume draft", e);
            }
        }
    }, []);

    // Persistence: Save on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
            setData(INITIAL_DATA);
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const [isPolishing, setIsPolishing] = useState<string | null>(null);

    const handlePolish = async (section: 'experience' | 'projects', itemId: string, bulletIndex: number) => {
        const text = section === 'experience'
            ? data.experience.find(e => e.id === itemId)?.description[bulletIndex]
            : data.projects.find(p => p.id === itemId)?.description[bulletIndex];

        if (!text) return;

        setIsPolishing(`${itemId}-${bulletIndex}`);
        try {
            const polished = await AiService.polishResumeBullet(text);
            const newData = { ...data };
            if (section === 'experience') {
                const exp = newData.experience.find(e => e.id === itemId);
                if (exp) exp.description[bulletIndex] = polished;
            } else {
                const proj = newData.projects.find(p => p.id === itemId);
                if (proj) proj.description[bulletIndex] = polished;
            }
            setData(newData);
        } catch (error) {
            console.error('Failed to polish point.');
        } finally {
            setIsPolishing(null);
        }
    };

    return (
        <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Resume Architect</h2>
                    <p className="text-sm font-medium text-gray-500">ATS-Friendly • machine parsable</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleClear} className="text-gray-400 hover:text-red-600">
                        <Icons.RefreshCw className="mr-2 h-4 w-4" />
                        Clear All
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => PlatformExportService.generateResumeHTMLExport(data)} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                        <Icons.Download className="mr-2 h-4 w-4" />
                        HTML Export
                    </Button>
                    <Button size="sm" onClick={() => PlatformExportService.generateResumeWordExport(data)} className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100">
                        <Icons.Download className="mr-2 h-4 w-4" />
                        Word Export
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Side */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Icons.User className="text-blue-600" size={18} />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                <Input value={data.fullName} onChange={(e: any) => setData({ ...data, fullName: e.target.value })} placeholder="Enter your full name" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Professional Title (Optional)</label>
                                <Input value={data.currentRole} onChange={(e: any) => setData({ ...data, currentRole: e.target.value })} placeholder="Enter your professional title" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                                <Input value={data.contact.email} onChange={(e: any) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })} placeholder="Enter your email" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                                <Input value={data.contact.phone} onChange={(e: any) => setData({ ...data, contact: { ...data.contact, phone: e.target.value } })} placeholder="Enter your phone number" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location (Optional)</label>
                                <Input value={data.contact.location} onChange={(e: any) => setData({ ...data, contact: { ...data.contact, location: e.target.value } })} placeholder="Enter your location" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">LinkedIn (Optional)</label>
                                <Input value={data.contact.linkedin} onChange={(e: any) => setData({ ...data, contact: { ...data.contact, linkedin: e.target.value } })} placeholder="Enter your LinkedIn profile URL" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">GitHub (Optional)</label>
                                <Input value={data.contact.github} onChange={(e: any) => setData({ ...data, contact: { ...data.contact, github: e.target.value } })} placeholder="Enter your GitHub profile URL" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Icons.FileText className="text-blue-600" size={18} />
                            Professional Summary (Optional)
                        </h3>
                        <Textarea
                            value={data.summary}
                            onChange={(e: any) => setData({ ...data, summary: e.target.value })}
                            placeholder="Briefly describe your career goals and achievements..."
                            className="min-h-[120px]"
                        />
                    </Card>

                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Icons.Code2 className="text-blue-600" size={18} />
                                Skills
                            </h3>
                            <Button variant="outline" size="sm" onClick={() => {
                                const newSkills = [...data.skills, { id: Date.now().toString(), category: 'New Category', skills: [] }];
                                setData({ ...data, skills: newSkills });
                            }} className="h-8 text-xs font-bold border-blue-100 text-blue-600">
                                <Icons.Plus className="mr-1 h-3 w-3" />
                                Add Category
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {data.skills.map((cat, idx) => (
                                <div key={cat.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3 relative group">
                                    <button onClick={() => {
                                        const newSkills = data.skills.filter(s => s.id !== cat.id);
                                        setData({ ...data, skills: newSkills });
                                    }} className="absolute -top-2 -right-2 h-6 w-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                        <Icons.X size={12} />
                                    </button>
                                    <Input
                                        value={cat.category}
                                        onChange={(e: any) => {
                                            const newSkills = [...data.skills];
                                            newSkills[idx].category = e.target.value;
                                            setData({ ...data, skills: newSkills });
                                        }}
                                        className="font-bold border-none bg-transparent p-0 focus-visible:ring-0 shadow-none h-auto text-blue-600"
                                    />
                                    <Input
                                        value={cat.skills.join(', ')}
                                        onChange={(e: any) => {
                                            const newSkills = [...data.skills];
                                            newSkills[idx].skills = e.target.value.split(',').map((s: string) => s.trim());
                                            setData({ ...data, skills: newSkills });
                                        }}
                                        placeholder="Skill 1, Skill 2, ..."
                                        className="text-sm bg-white border-gray-100"
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Icons.Briefcase className="text-blue-600" size={18} />
                                Experience (Optional)
                            </h3>
                            <Button variant="outline" size="sm" onClick={() => {
                                const newExp = [...data.experience, { id: Date.now().toString(), company: 'New Company', role: 'Role', location: '', period: 'Period', description: ['Key contribution...'] }];
                                setData({ ...data, experience: newExp });
                            }} className="h-8 text-xs font-bold border-blue-100 text-blue-600">
                                <Icons.Plus className="mr-1 h-3 w-3" />
                                Add
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {data.experience.map((exp, expIdx) => (
                                <div key={exp.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-4 relative group">
                                    <button onClick={() => {
                                        const newExp = data.experience.filter(e => e.id !== exp.id);
                                        setData({ ...data, experience: newExp });
                                    }} className="absolute -top-2 -right-2 h-6 w-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                        <Icons.X size={12} />
                                    </button>
                                    <div className="flex justify-between gap-4">
                                        <Input value={exp.company} onChange={(e: any) => {
                                            const newExp = [...data.experience];
                                            newExp[expIdx].company = e.target.value;
                                            setData({ ...data, experience: newExp });
                                        }} className="font-bold border-none bg-transparent p-0 focus-visible:ring-0 shadow-none h-auto text-blue-600" placeholder="Company Name" />
                                        <Input value={exp.period} onChange={(e: any) => {
                                            const newExp = [...data.experience];
                                            newExp[expIdx].period = e.target.value;
                                            setData({ ...data, experience: newExp });
                                        }} className="text-right border-none bg-transparent p-0 focus-visible:ring-0 shadow-none h-auto w-40 text-gray-500 text-xs font-bold" placeholder="Dates" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input value={exp.role} onChange={(e: any) => {
                                            const newExp = [...data.experience];
                                            newExp[expIdx].role = e.target.value;
                                            setData({ ...data, experience: newExp });
                                        }} className="text-sm border-gray-100" placeholder="Job Title" />
                                        <Input value={exp.location} onChange={(e: any) => {
                                            const newExp = [...data.experience];
                                            newExp[expIdx].location = e.target.value;
                                            setData({ ...data, experience: newExp });
                                        }} className="text-sm border-gray-100" placeholder="Location (Optional)" />
                                    </div>
                                    <div className="space-y-2">
                                        {exp.description.map((bullet, idx) => (
                                            <div key={idx} className="group relative">
                                                <Textarea
                                                    value={bullet}
                                                    onChange={(e: any) => {
                                                        const newExp = [...data.experience];
                                                        newExp[expIdx].description[idx] = e.target.value;
                                                        setData({ ...data, experience: newExp });
                                                    }}
                                                    className="rounded-xl bg-white border-gray-100 text-sm py-2 px-3 resize-none min-h-[40px] pr-10"
                                                />
                                                <div className="absolute right-2 top-2 flex gap-1">
                                                    <button
                                                        onClick={() => handlePolish('experience', exp.id, idx)}
                                                        disabled={isPolishing === `${exp.id}-${idx}`}
                                                        className="h-6 w-6 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
                                                    >
                                                        {isPolishing === `${exp.id}-${idx}` ? <Icons.RefreshCw className="animate-spin" size={12} /> : <Icons.Sparkles size={12} />}
                                                    </button>
                                                    <button onClick={() => {
                                                        const newExp = [...data.experience];
                                                        newExp[expIdx].description = newExp[expIdx].description.filter((_, i) => i !== idx);
                                                        setData({ ...data, experience: newExp });
                                                    }} className="h-6 w-6 p-0 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                                        <Icons.X size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <Button variant="outline" size="sm" onClick={() => {
                                            const newExp = [...data.experience];
                                            newExp[expIdx].description.push('New achievement...');
                                            setData({ ...data, experience: newExp });
                                        }} className="w-full text-[10px] h-7 border-dashed">Add Bullet Point</Button>
                                    </div>
                                </div>
                            ))}
                            {data.experience.length === 0 && (
                                <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
                                    <p className="text-sm text-gray-400">No experience added. This section will be hidden in the final resume.</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Icons.Code2 className="text-blue-600" size={18} />
                                Projects (Optional)
                            </h3>
                            <Button variant="outline" size="sm" onClick={() => {
                                const newProj = [...data.projects || [], { id: Date.now().toString(), title: 'New Project', techStack: [], description: ['Key feature...'], link: '' }];
                                setData({ ...data, projects: newProj });
                            }} className="h-8 text-xs font-bold border-blue-100 text-blue-600">
                                <Icons.Plus className="mr-1 h-3 w-3" />
                                Add
                            </Button>
                        </div>
                        <div className="space-y-6">
                            {(data.projects || []).map((proj, projIdx) => (
                                <div key={proj.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-4 relative group">
                                    <button onClick={() => {
                                        const newProj = data.projects.filter(p => p.id !== proj.id);
                                        setData({ ...data, projects: newProj });
                                    }} className="absolute -top-2 -right-2 h-6 w-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                        <Icons.X size={12} />
                                    </button>
                                    <Input value={proj.title} onChange={(e: any) => {
                                        const newProj = [...data.projects];
                                        newProj[projIdx].title = e.target.value;
                                        setData({ ...data, projects: newProj });
                                    }} className="font-bold border-none bg-transparent p-0 focus-visible:ring-0 shadow-none h-auto text-blue-600" placeholder="Project Title" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input value={proj.techStack.join(', ')} onChange={(e: any) => {
                                            const newProj = [...data.projects];
                                            newProj[projIdx].techStack = e.target.value.split(',').map((s: string) => s.trim());
                                            setData({ ...data, projects: newProj });
                                        }} className="text-xs bg-white border-gray-100" placeholder="Tech Stack (comma separated)" />
                                        <Input value={proj.link || ''} onChange={(e: any) => {
                                            const newProj = [...data.projects];
                                            newProj[projIdx].link = e.target.value;
                                            setData({ ...data, projects: newProj });
                                        }} className="text-xs bg-white border-gray-100" placeholder="Project Link (Optional)" />
                                    </div>
                                    <div className="space-y-2">
                                        {proj.description.map((bullet, idx) => (
                                            <div key={idx} className="group relative">
                                                <Textarea
                                                    value={bullet}
                                                    onChange={(e: any) => {
                                                        const newProj = [...data.projects];
                                                        newProj[projIdx].description[idx] = e.target.value;
                                                        setData({ ...data, projects: newProj });
                                                    }}
                                                    className="rounded-xl bg-white border-gray-100 text-sm py-2 px-3 resize-none min-h-[40px] pr-10"
                                                />
                                                <div className="absolute right-2 top-2 flex gap-1">
                                                    <button
                                                        onClick={() => handlePolish('projects', proj.id, idx)}
                                                        disabled={isPolishing === `${proj.id}-${idx}`}
                                                        className="h-6 w-6 p-0 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
                                                    >
                                                        {isPolishing === `${proj.id}-${idx}` ? <Icons.RefreshCw className="animate-spin" size={12} /> : <Icons.Sparkles size={12} />}
                                                    </button>
                                                    <button onClick={() => {
                                                        const newProj = [...data.projects];
                                                        newProj[projIdx].description = newProj[projIdx].description.filter((_, i) => i !== idx);
                                                        setData({ ...data, projects: newProj });
                                                    }} className="h-6 w-6 p-0 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                                        <Icons.X size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <Button variant="outline" size="sm" onClick={() => {
                                            const newProj = [...data.projects];
                                            newProj[projIdx].description.push('New impact point...');
                                            setData({ ...data, projects: newProj });
                                        }} className="w-full text-[10px] h-7 border-dashed">Add Project Point</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Icons.Subjects className="text-blue-600" size={18} />
                                Education
                            </h3>
                            <Button variant="outline" size="sm" onClick={() => {
                                const newEdu = [...data.education, { id: Date.now().toString(), institution: 'University', degree: 'Degree', location: '', period: 'Period', relevantCoursework: [] }];
                                setData({ ...data, education: newEdu });
                            }} className="h-8 text-xs font-bold border-blue-100 text-blue-600">
                                <Icons.Plus className="mr-1 h-3 w-3" />
                                Add
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {data.education.map((edu, eduIdx) => (
                                <div key={edu.id} className="space-y-4 p-4 rounded-xl border border-gray-100 relative group">
                                    <button onClick={() => {
                                        const newEdu = data.education.filter(e => e.id !== edu.id);
                                        setData({ ...data, education: newEdu });
                                    }} className="absolute -top-2 -right-2 h-6 w-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                        <Icons.X size={12} />
                                    </button>
                                    <Input value={edu.institution} onChange={(e: any) => {
                                        const newEdu = [...data.education];
                                        newEdu[eduIdx].institution = e.target.value;
                                        setData({ ...data, education: newEdu });
                                    }} className="font-bold text-blue-600 border-none bg-transparent p-0 focus-visible:ring-0 shadow-none h-auto" placeholder="Institution" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input value={edu.degree} onChange={(e: any) => {
                                            const newEdu = [...data.education];
                                            newEdu[eduIdx].degree = e.target.value;
                                            setData({ ...data, education: newEdu });
                                        }} className="text-sm" placeholder="Degree" />
                                        <Input value={edu.period} onChange={(e: any) => {
                                            const newEdu = [...data.education];
                                            newEdu[eduIdx].period = e.target.value;
                                            setData({ ...data, education: newEdu });
                                        }} className="text-sm" placeholder="Period (e.g. 2021 - 2025)" />
                                        <Input value={edu.location} onChange={(e: any) => {
                                            const newEdu = [...data.education];
                                            newEdu[eduIdx].location = e.target.value;
                                            setData({ ...data, education: newEdu });
                                        }} className="text-sm" placeholder="Location (Optional)" />
                                        <Input value={edu.score} onChange={(e: any) => {
                                            const newEdu = [...data.education];
                                            newEdu[eduIdx].score = e.target.value;
                                            setData({ ...data, education: newEdu });
                                        }} className="text-sm" placeholder="GPA / Score (Optional)" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Relevant Coursework (Optional, comma separated)</label>
                                        <Input
                                            value={edu.relevantCoursework?.join(', ') || ''}
                                            onChange={(e: any) => {
                                                const newEdu = [...data.education];
                                                newEdu[eduIdx].relevantCoursework = e.target.value.split(',').map((s: string) => s.trim());
                                                setData({ ...data, education: newEdu });
                                            }}
                                            className="text-sm bg-gray-50/50 border-gray-100"
                                            placeholder="e.g. Data Structures, AI"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Icons.CheckCircle className="text-blue-600" size={18} />
                            Certifications & Awards (Optional)
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Certifications (Optional, one per line)</label>
                                <Textarea
                                    value={data.certifications?.join('\n') || ''}
                                    onChange={(e: any) => setData({ ...data, certifications: e.target.value.split('\n').filter((s: string) => s.trim()) })}
                                    placeholder="AWS Certified..."
                                    className="min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Awards & Honors (Optional, one per line)</label>
                                <Textarea
                                    value={data.awards?.join('\n') || ''}
                                    onChange={(e: any) => setData({ ...data, awards: e.target.value.split('\n').filter((s: string) => s.trim()) })}
                                    placeholder="SFIT Hackathon Winner..."
                                    className="min-h-[80px]"
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Preview Side */}
                <div className="p-10 border border-gray-100 bg-white rounded-2xl shadow-sm h-fit sticky top-24 overflow-hidden">
                    <div className="relative z-10 max-w-[600px] mx-auto">
                        <div className="text-center mb-6 border-b-2 border-blue-900 pb-4">
                            <h1 className="text-2xl font-bold text-[#1e3a8a] uppercase tracking-wide">{data.fullName || 'YOUR NAME'}</h1>
                            {data.currentRole && <p className="text-sm font-semibold text-gray-600 mt-1">{data.currentRole}</p>}
                        </div>

                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-gray-700 font-medium mb-8">
                            {data.contact.phone && <span>{data.contact.phone}</span>}
                            {data.contact.phone && data.contact.email && <span>|</span>}
                            {data.contact.email && <span>{data.contact.email}</span>}
                            {data.contact.location && (
                                <><span>|</span><span>{data.contact.location}</span></>
                            )}
                            {(data.contact.linkedin || data.contact.github) && <br />}
                            {data.contact.linkedin && (
                                <span className="text-blue-700">{data.contact.linkedin.replace('https://', '').replace('www.', '')}</span>
                            )}
                            {data.contact.linkedin && data.contact.github && <span className="mx-1">|</span>}
                            {data.contact.github && (
                                <span className="text-blue-700">{data.contact.github.replace('https://', '').replace('www.', '')}</span>
                            )}
                        </div>

                        {data.summary && (
                            <div className="mb-6">
                                <h2 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-widest border-b border-blue-900 pb-1 mb-2">Professional Summary</h2>
                                <p className="text-[11px] text-gray-700 leading-relaxed text-justify">
                                    {data.summary}
                                </p>
                            </div>
                        )}

                        {data.skills && data.skills.some(s => s.skills.length > 0) && (
                            <div className="mb-6">
                                <h2 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-widest border-b border-blue-900 pb-1 mb-2">Skills</h2>
                                <div className="space-y-1">
                                    {data.skills.map(cat => cat.skills.length > 0 && (
                                        <div key={cat.id} className="text-[11px]">
                                            <strong className="text-gray-900">{cat.category}: </strong>
                                            <span className="text-gray-700">{cat.skills.join(' | ')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {data.experience && data.experience.length > 0 && data.experience.some(e => e.company || e.role) && (
                            <div className="mb-6">
                                <h2 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-widest border-b border-blue-900 pb-1 mb-2">Experience</h2>
                                <div className="space-y-4">
                                    {data.experience.map(exp => (exp.company || exp.role) && (
                                        <div key={exp.id}>
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h4 className="text-[12px] font-bold text-gray-900">{exp.company}</h4>
                                                <span className="text-[10px] text-gray-600 font-bold">{exp.period}</span>
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-600 mb-1 italic">{exp.role}</div>
                                            <ul className="list-disc pl-4 space-y-0.5">
                                                {exp.description.map((b, i) => b && (
                                                    <li key={i} className="text-[10px] text-gray-700 leading-tight">{b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {data.projects && data.projects.length > 0 && data.projects.some(p => p.title) && (
                            <div className="mb-6">
                                <h2 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-widest border-b border-blue-900 pb-1 mb-2">Projects</h2>
                                <div className="space-y-4">
                                    {data.projects.map(proj => proj.title && (
                                        <div key={proj.id}>
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-sm">{proj.title}</h4>
                                                    <p className="text-[10px] text-gray-500 font-medium italic">{proj.techStack.join(' | ')}</p>
                                                </div>
                                                {proj.link && (
                                                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-pink-600 font-bold hover:underline">
                                                        Project Link
                                                    </a>
                                                )}
                                            </div>
                                            <ul className="list-disc pl-4 space-y-0.5">
                                                {proj.description.map((b, i) => b && (
                                                    <li key={i} className="text-[10px] text-gray-700 leading-tight">{b}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {data.education && data.education.some(e => e.institution) && (
                            <div className="mb-6">
                                <h2 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-widest border-b border-blue-900 pb-1 mb-2">Education</h2>
                                <div className="space-y-3">
                                    {data.education.map(edu => edu.institution && (
                                        <div key={edu.id}>
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="text-[11px] font-bold text-gray-900">{edu.institution}</h4>
                                                <span className="text-[10px] text-gray-600 font-bold">{edu.period}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-700">{edu.degree} {edu.score && `• ${edu.score}`}</div>
                                            {edu.relevantCoursework && edu.relevantCoursework.length > 0 && edu.relevantCoursework.some(c => c) && (
                                                <div className="text-[9px] text-gray-500 mt-0.5">
                                                    <strong>Relevant Coursework:</strong> {edu.relevantCoursework.filter(c => c).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {((data.certifications && data.certifications.length > 0) || (data.awards && data.awards.length > 0)) && (
                            <div>
                                <h2 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-widest border-b border-blue-900 pb-1 mb-2">Certifications & Awards</h2>
                                {data.certifications && data.certifications.length > 0 && (
                                    <ul className="list-disc pl-4 space-y-0.5">
                                        {data.certifications.map((c, i) => (
                                            <li key={i} className="text-[10px] text-gray-700">{c}</li>
                                        ))}
                                    </ul>
                                )}
                                {data.awards && data.awards.length > 0 && (
                                    <ul className="list-disc pl-4 space-y-0.5 mt-1">
                                        {data.awards.map((a, i) => (
                                            <li key={i} className="text-[10px] text-gray-700">{a}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
