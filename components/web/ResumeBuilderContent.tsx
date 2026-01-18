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
    targetDomain: '',
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
    awards: [],
    activities: [],
    hobbies: []
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
    const [atsScore, setAtsScore] = useState(0);
    const [atsFeedback, setAtsFeedback] = useState<string[]>([]);

    // New AI Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<{ keywords: string[], improvements: string[] } | null>(null);

    useEffect(() => {
        const { score, feedback } = calculateATSScore(data);
        setAtsScore(score);
        setAtsFeedback(feedback);
        // Clear old suggestions if content changes significantly? Maybe keep them until manual re-run.
    }, [data]);

    const handleAiAnalysis = async () => {
        if (!data.targetDomain) {
            alert("Please select a Target Domain in Personal Information first.");
            return;
        }
        setIsAnalyzing(true);
        try {
            const suggestions = await AiService.analyzeResume(data, data.targetDomain);
            setAiSuggestions(suggestions);
        } catch (e) {
            console.error(e);
            alert("Failed to analyze resume. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handlePolish = async (section: 'experience' | 'projects', itemId: string, bulletIndex: number) => {
        const text = section === 'experience'
            ? data.experience.find(e => e.id === itemId)?.description[bulletIndex]
            : data.projects.find(p => p.id === itemId)?.description[bulletIndex];

        if (!text) return;

        setIsPolishing(`${itemId}-${bulletIndex}`);
        try {
            const polished = await AiService.polishResumeBullet(text, data.targetDomain);
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

    const ATS_ACTION_VERBS = [
        'achieved', 'accelerated', 'awarded', 'boosted', 'built', 'calculated', 'collaborated',
        'created', 'decreased', 'delivered', 'developed', 'directed', 'earned', 'enhanced',
        'established', 'evaluated', 'expanded', 'generated', 'guided', 'improved', 'increased',
        'launched', 'led', 'managed', 'maximized', 'mentored', 'negotiated', 'optimized',
        'orchestrated', 'organized', 'outperformed', 'planned', 'produced', 'reduced', 'resolved',
        'saved', 'secured', 'spearheaded', 'streamlined', 'strengthened', 'structured', 'surpassed',
        'trained', 'transformed', 'upgraded'
    ];

    const getPlaceholders = (domain?: string) => {
        switch (domain) {
            case 'Software Engineering': return { role: 'Full Stack Developer', summary: 'Experienced software engineer specialized in React and Node.js...', exp: 'Developed scalable microservices...', skill: 'React, TypeScript, AWS' };
            case 'Data Science': return { role: 'Data Scientist', summary: 'Data scientist with expertise in machine learning...', exp: 'Built predictive models for...', skill: 'Python, PyTorch, SQL' };
            case 'Finance': return { role: 'Financial Analyst', summary: 'Detail-oriented financial analyst...', exp: 'Conducted financial modeling for...', skill: 'Financial Modeling, Excel, Bloomberg' };
            case 'Marketing': return { role: 'Marketing Manager', summary: 'Creative marketing professional...', exp: 'Led a cross-channel campaign...', skill: 'SEO, SEM, Google Analytics' };
            case 'Product Management': return { role: 'Product Manager', summary: 'Product leader focused on user-centric design...', exp: 'Launched a new feature specific to...', skill: 'Agile, Jira, User Research' };
            case 'Consulting': return { role: 'Management Consultant', summary: 'Strategic consultant with experience in...', exp: 'Optimized operational efficiency by...', skill: 'Strategy, Market Analysis, PowerPoint' };
            case 'Design': return { role: 'Product Designer', summary: 'Passionate designer creating intuitive user experiences...', exp: 'Designed a new design system for...', skill: 'Figma, Adobe XD, Prototyping' };
            default: return { role: 'Professional Role', summary: 'Briefly describe your career goals and achievements...', exp: 'Key contribution or achievement...', skill: 'Skill 1, Skill 2...' };
        }
    };

    function calculateATSScore(data: ResumeData): { score: number, feedback: string[] } {
        let score = 0;
        const feedback: string[] = [];

        // 1. Contact Info (15 pts)
        if (data.fullName.length > 2) score += 5;
        else feedback.push("Add your full name.");

        if (data.contact.email.includes('@')) score += 5;
        else feedback.push("Add a valid email address.");

        if (data.contact.phone.length > 5) score += 5;
        else feedback.push("Add a phone number.");

        // 2. Summary (10 pts)
        if (data.summary.length > 50) score += 10;
        else if (data.summary.length > 0) score += 5;
        else feedback.push("Add a professional summary (50+ chars).");

        // 3. Experience (25 pts)
        const hasExperience = data.experience.some(e => e.company.length > 1);
        const hasRole = data.experience.some(e => e.role.length > 1);

        if (hasExperience && hasRole) {
            score += 10;
            // Check for bullets
            const totalBullets = data.experience.reduce((acc, curr) => acc + curr.description.filter(d => d.length > 10).length, 0);
            if (totalBullets >= 3) score += 15;
            else if (totalBullets > 0) score += 5;
            else feedback.push("Add more detailed bullet points to your experience.");
        } else {
            feedback.push("Add at least one work experience.");
        }

        // 4. Skills (10 pts)
        const hasSkills = data.skills.some(c => c.skills.length > 0);
        if (hasSkills) score += 10;
        else feedback.push("Add technical or soft skills.");

        // 5. Education (10 pts)
        if (data.education.some(e => e.institution.length > 1)) score += 10;
        else feedback.push("Add education details.");

        // 6. Impact & Action Verbs (20 pts)
        let actionVerbCount = 0;
        let numbersCount = 0;

        const allText = [
            ...data.experience.flatMap(e => e.description),
            ...data.projects.flatMap(p => p.description)
        ].join(' ').toLowerCase();

        ATS_ACTION_VERBS.forEach(verb => {
            if (allText.includes(verb)) actionVerbCount++;
        });

        // Check for numbers (digits or %)
        const numberMatches = allText.match(/\d+|%|\$/g);
        if (numberMatches) numbersCount = numberMatches.length;

        if (actionVerbCount >= 5) score += 10;
        else if (actionVerbCount > 0) {
            score += 5;
            feedback.push(`Use more action verbs (Found: ${actionVerbCount}, Target: 5+).`);
        } else feedback.push("Use strong action verbs (e.g., 'Led', 'Developed', 'Optimized').");

        if (numbersCount >= 3) score += 10;
        else if (numbersCount > 0) {
            score += 5;
            feedback.push(`Quantify your results more (Found: ${numbersCount} metrics, Target: 3+).`);
        } else feedback.push("Include numbers/metrics in your descriptions (e.g., 'Increased revenue by 20%').");

        // 7. Projects (10 pts)
        if (data.projects.some(p => p.title.length > 1)) score += 10;

        return { score: Math.min(100, score), feedback };
    }

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
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target Domain / Industry</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={['Data Analytics', 'Product Analytics', 'Marketing Analytics', 'Financial Analytics', 'Web Analytics', 'Economic Analytics', 'Social Media Analytics', 'Investment Analytics', 'HR'].includes(data.targetDomain || '') ? data.targetDomain : (data.targetDomain ? "Other" : "")}
                                    onChange={(e) => setData({ ...data, targetDomain: e.target.value === "Other" ? "Other" : e.target.value })}
                                >
                                    <option value="">Select a Target Domain (Recommended)</option>
                                    {['Data Analytics', 'Product Analytics', 'Marketing Analytics', 'Financial Analytics', 'Web Analytics', 'Economic Analytics', 'Social Media Analytics', 'Investment Analytics', 'HR'].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                    <option value="Other">Other</option>
                                </select>
                                {((data.targetDomain === "Other") || (data.targetDomain && !['Data Analytics', 'Product Analytics', 'Marketing Analytics', 'Financial Analytics', 'Web Analytics', 'Economic Analytics', 'Social Media Analytics', 'Investment Analytics', 'HR'].includes(data.targetDomain))) && (
                                    <Input
                                        placeholder="Enter your specific domain..."
                                        value={data.targetDomain === "Other" ? "" : data.targetDomain}
                                        onChange={(e: any) => setData({ ...data, targetDomain: e.target.value || "Other" })}
                                        autoFocus
                                    />
                                )}
                            </div>

                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Professional Title (Optional)</label>
                                <Input value={data.currentRole} onChange={(e: any) => setData({ ...data, currentRole: e.target.value })} placeholder={getPlaceholders(data.targetDomain).role} />
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
                            placeholder={getPlaceholders(data.targetDomain).summary}
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
                                        placeholder={getPlaceholders(data.targetDomain).skill}
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
                                                    placeholder={getPlaceholders(data.targetDomain).exp}
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
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Icons.CheckCircle className="text-blue-600" size={18} />
                                Certifications & Awards (Optional)
                            </h3>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setData({ ...data, certifications: [...(data.certifications || []), ''] })} className="h-7 text-[10px] font-bold border-blue-100 text-blue-600">
                                    + Cert
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setData({ ...data, awards: [...(data.awards || []), ''] })} className="h-7 text-[10px] font-bold border-blue-100 text-blue-600">
                                    + Award
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Certifications</label>
                                <div className="space-y-2">
                                    {(data.certifications || []).map((cert, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input value={cert} onChange={(e: any) => {
                                                const newCert = [...data.certifications!];
                                                newCert[idx] = e.target.value;
                                                setData({ ...data, certifications: newCert });
                                            }} placeholder="AWS Certified..." className="text-sm h-9" />
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                const newCert = data.certifications!.filter((_, i) => i !== idx);
                                                setData({ ...data, certifications: newCert });
                                            }} className="h-9 w-9 p-0 text-red-500 hover:bg-red-50">
                                                <Icons.X size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Awards & Honors</label>
                                <div className="space-y-2">
                                    {(data.awards || []).map((award, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input value={award} onChange={(e: any) => {
                                                const newAward = [...data.awards!];
                                                newAward[idx] = e.target.value;
                                                setData({ ...data, awards: newAward });
                                            }} placeholder="SFIT Hackathon Winner..." className="text-sm h-9" />
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                const newAward = data.awards!.filter((_, i) => i !== idx);
                                                setData({ ...data, awards: newAward });
                                            }} className="h-9 w-9 p-0 text-red-500 hover:bg-red-50">
                                                <Icons.X size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Icons.Heart className="text-blue-600" size={18} />
                                Extra-Curricular Activities (Optional)
                            </h3>
                            <Button variant="outline" size="sm" onClick={() => setData({ ...data, activities: [...(data.activities || []), ''] })} className="h-8 text-xs font-bold border-blue-100 text-blue-600">
                                <Icons.Plus className="mr-1 h-3 w-3" />
                                Add Activity
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {(data.activities || []).map((act, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input value={act} onChange={(e: any) => {
                                        const newAct = [...data.activities!];
                                        newAct[idx] = e.target.value;
                                        setData({ ...data, activities: newAct });
                                    }} placeholder="Student Council Member..." className="text-sm h-9" />
                                    <Button variant="ghost" size="sm" onClick={() => {
                                        const newAct = data.activities!.filter((_, i) => i !== idx);
                                        setData({ ...data, activities: newAct });
                                    }} className="h-9 w-9 p-0 text-red-500 hover:bg-red-50">
                                        <Icons.X size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Icons.Music className="text-blue-600" size={18} />
                                Hobbies (Optional)
                            </h3>
                            <Button variant="outline" size="sm" onClick={() => setData({ ...data, hobbies: [...(data.hobbies || []), ''] })} className="h-8 text-xs font-bold border-blue-100 text-blue-600">
                                <Icons.Plus className="mr-1 h-3 w-3" />
                                Add Hobby
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {(data.hobbies || []).map((hobby, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input value={hobby} onChange={(e: any) => {
                                        const newHobby = [...data.hobbies!];
                                        newHobby[idx] = e.target.value;
                                        setData({ ...data, hobbies: newHobby });
                                    }} placeholder="Photography, Chess..." className="text-sm h-9" />
                                    <Button variant="ghost" size="sm" onClick={() => {
                                        const newHobby = data.hobbies!.filter((_, i) => i !== idx);
                                        setData({ ...data, hobbies: newHobby });
                                    }} className="h-9 w-9 p-0 text-red-500 hover:bg-red-50">
                                        <Icons.X size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Preview Side */}
                <div className="space-y-6 sticky top-24 h-fit">
                    {/* ATS Score Card */}
                    <Card className="p-5 border-l-4 border-l-purple-600 bg-purple-50/50">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Icons.Sparkles className="text-purple-600" size={18} />
                                    ATS Strength Score
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Optimization for Applicant Tracking Systems</p>
                            </div>
                            <div className={cn(
                                "h-12 w-12 rounded-full flex items-center justify-center font-black text-lg border-4",
                                atsScore >= 80 ? "border-green-500 text-green-700 bg-green-50" :
                                    atsScore >= 50 ? "border-yellow-500 text-yellow-700 bg-yellow-50" :
                                        "border-red-500 text-red-700 bg-red-50"
                            )}>
                                {atsScore}
                            </div>
                        </div>

                        {atsFeedback.length > 0 ? (
                            <div className="mt-4 space-y-2">
                                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Improvement Tips:</p>
                                <ul className="space-y-1">
                                    {atsFeedback.slice(0, 3).map((tip, i) => (
                                        <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                                            <span className="text-red-500 mt-0.5">•</span>
                                            {tip}
                                        </li>
                                    ))}
                                    {atsFeedback.length > 3 && (
                                        <li className="text-xs text-purple-600 font-medium italic">
                                            + {atsFeedback.length - 3} more improvements available...
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ) : (
                            <div className="mt-4 flex items-center gap-2 text-green-700 text-xs font-bold bg-green-100 p-2 rounded-lg">
                                <Icons.CheckCircle size={14} />
                                Excellent! Your resume is ATS optimized.
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-purple-100">
                            {!aiSuggestions ? (
                                <Button
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                                    onClick={handleAiAnalysis}
                                    disabled={isAnalyzing}
                                >
                                    {isAnalyzing ? (
                                        <><Icons.Loader2 className="mr-2 h-3 w-3 animate-spin" /> Analyzing...</>
                                    ) : (
                                        <><Icons.Bot className="mr-2 h-3 w-3" /> Get AI Keywords & Tips</>
                                    )}
                                </Button>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-800 uppercase flex items-center gap-1 mb-2">
                                            <Icons.Key className="text-purple-600" size={12} /> Missing Keywords
                                        </h4>
                                        <div className="flex flex-wrap gap-1">
                                            {aiSuggestions.keywords.map((kw, i) => (
                                                <span key={i} className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-100 font-medium">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-800 uppercase flex items-center gap-1 mb-2">
                                            <Icons.Lightbulb className="text-yellow-600" size={12} /> Strategic Tips
                                        </h4>
                                        <ul className="space-y-1">
                                            {aiSuggestions.improvements.map((imp, i) => (
                                                <li key={i} className="text-[10px] text-gray-600 flex items-start gap-1.5">
                                                    <span className="text-purple-500 mt-0.5">•</span>
                                                    {imp}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-[10px] h-7 border-purple-100 text-purple-600"
                                        onClick={handleAiAnalysis}
                                        disabled={isAnalyzing}
                                    >
                                        <Icons.RefreshCw className="mr-1.5 h-3 w-3" /> Re-Analyze
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>

                    <div className="p-10 border border-gray-100 bg-white rounded-2xl shadow-sm overflow-hidden">
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
                                <div className="mb-6">
                                    <h2 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-widest border-b border-blue-900 pb-1 mb-2">Certifications & Awards</h2>
                                    {data.certifications && data.certifications.length > 0 && (
                                        <ul className="list-disc pl-4 space-y-0.5">
                                            {data.certifications.filter(c => c.trim()).map((c, i) => (
                                                <li key={i} className="text-[10px] text-gray-700">{c}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {data.awards && data.awards.length > 0 && (
                                        <ul className="list-disc pl-4 space-y-0.5 mt-1">
                                            {data.awards.filter(a => a.trim()).map((a, i) => (
                                                <li key={i} className="text-[10px] text-gray-700">{a}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {data.activities && data.activities.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-widest border-b border-blue-900 pb-1 mb-2">Extra-Curricular Activities</h2>
                                    <ul className="list-disc pl-4 space-y-0.5">
                                        {data.activities.filter(act => act.trim()).map((act, i) => (
                                            <li key={i} className="text-[10px] text-gray-700">{act}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {data.hobbies && data.hobbies.length > 0 && data.hobbies.some(h => h.trim()) && (
                                <div>
                                    <h2 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-widest border-b border-blue-900 pb-1 mb-2">Hobbies</h2>
                                    <p className="text-[10px] text-gray-700 leading-relaxed">
                                        {data.hobbies.filter(h => h.trim()).join(', ')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
