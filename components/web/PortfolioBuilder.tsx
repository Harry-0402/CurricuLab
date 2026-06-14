"use client";

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';

interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    demoUrl: string;
    repoUrl: string;
    tags: string;
}

interface Education {
    id: string;
    institution: string;
    degree: string;
    year: string;
}

interface PortfolioData {
    name: string;
    title: string;
    bio: string;
    email: string;
    github: string;
    linkedin: string;
    twitter: string;
    skills: string;
    softSkills: string;
    projects: Project[];
    education: Education[];
}

export function PortfolioBuilder() {
    const [data, setData] = useState<PortfolioData>({
        name: 'Alex Developer',
        title: 'Full Stack Engineer',
        bio: 'I build pixel-perfect, engaging, and accessible digital experiences.',
        email: 'hello@example.com',
        github: 'https://github.com/alexdev',
        linkedin: 'https://linkedin.com/in/alexdev',
        twitter: '',
        skills: 'React, Next.js, TypeScript, Tailwind CSS, Node.js',
        softSkills: 'Communication, Teamwork, Problem Solving, Leadership',
        projects: [
            {
                id: '1',
                title: 'E-Commerce Platform',
                description: 'A modern e-commerce solution with Next.js, Tailwind CSS, and Stripe integration.',
                imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
                demoUrl: 'https://example.com',
                repoUrl: 'https://github.com',
                tags: 'Next.js, Tailwind, Stripe'
            }
        ],
        education: [
            {
                id: '1',
                institution: 'University of Technology',
                degree: 'B.S. Computer Science',
                year: '2020 - 2024'
            }
        ]
    });

    const [previewHtml, setPreviewHtml] = useState('');

    const generateHTML = (portfolio: PortfolioData) => {
        const renderProjects = portfolio.projects.map(p => `
            <div class="group relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-brand-500/50 transition-all duration-300">
                <div class="aspect-video w-full overflow-hidden">
                    <img src="${p.imageUrl || 'https://via.placeholder.com/800x450?text=No+Image'}" alt="${p.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold text-white mb-2">${p.title}</h3>
                    <p class="text-slate-400 text-sm mb-4 line-clamp-3">${p.description}</p>
                    ${p.tags ? `<div class="flex flex-wrap gap-2 mb-6">${p.tags.split(',').map(tag => `<span class="px-3 py-1 text-xs font-medium bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">${tag.trim()}</span>`).join('')}</div>` : ''}
                    <div class="flex items-center gap-4">
                        ${p.demoUrl ? `<a href="${p.demoUrl}" target="_blank" class="inline-flex items-center gap-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-lg transition-colors">Live Demo <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>` : ''}
                        ${p.repoUrl ? `<a href="${p.repoUrl}" target="_blank" class="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Source Code</a>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolio.name} - ${portfolio.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#f0fdfa',
                            100: '#ccfbf1',
                            400: '#2dd4bf',
                            500: '#14b8a6',
                            600: '#0d9488',
                            900: '#134e4a',
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { background-color: #0f172a; color: #f8fafc; }
        .glass-nav { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .gradient-text { background: linear-gradient(to right, #2dd4bf, #3b82f6); -webkit-background-clip: text; color: transparent; }
    </style>
</head>
<body class="antialiased min-h-screen selection:bg-brand-500/30 selection:text-brand-100">
    <nav class="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <a href="#" class="text-xl font-bold tracking-tighter text-white">${portfolio.name.split(' ')[0]}<span class="text-brand-500">.</span></a>
            <div class="flex gap-6 text-sm font-medium text-slate-300">
                <a href="#about" class="hover:text-white transition-colors">About</a>
                <a href="#projects" class="hover:text-white transition-colors">Projects</a>
                <a href="#background" class="hover:text-white transition-colors">Background</a>
                <a href="#contact" class="hover:text-white transition-colors">Contact</a>
            </div>
        </div>
    </nav>

    <main class="pt-32 pb-20">
        <!-- Hero Section -->
        <section id="about" class="max-w-6xl mx-auto px-6 py-20 flex flex-col items-start justify-center min-h-[60vh]">
            <p class="text-brand-400 font-medium tracking-wide mb-4">Hi, my name is</p>
            <h1 class="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4">${portfolio.name}.</h1>
            <h2 class="text-4xl md:text-6xl font-bold text-slate-400 tracking-tight mb-8">${portfolio.title}.</h2>
            <p class="text-lg text-slate-400 max-w-2xl leading-relaxed mb-12">${portfolio.bio}</p>
            <div class="flex items-center gap-6">
                <a href="#projects" class="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg transition-colors">View My Work</a>
                <div class="flex items-center gap-4 text-slate-400">
                    ${portfolio.github ? `<a href="${portfolio.github}" target="_blank" class="hover:text-white transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg></a>` : ''}
                    ${portfolio.linkedin ? `<a href="${portfolio.linkedin}" target="_blank" class="hover:text-white transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>` : ''}
                    ${portfolio.twitter ? `<a href="${portfolio.twitter}" target="_blank" class="hover:text-white transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>` : ''}
                    ${portfolio.email ? `<a href="mailto:${portfolio.email}" class="hover:text-white transition-colors"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></a>` : ''}
                </div>
            </div>
        </section>

        <!-- Projects Section -->
        ${portfolio.projects.length > 0 ? `
        <section id="projects" class="max-w-6xl mx-auto px-6 py-20">
            <h2 class="text-3xl font-bold text-white mb-12 flex items-center gap-4">
                <span class="text-brand-500 font-mono text-xl">01.</span> Some Things I've Built
                <div class="h-px bg-slate-700/50 flex-1 ml-4"></div>
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${renderProjects}
            </div>
        </section>
        ` : ''}

        <!-- Background (Skills & Education) -->
        <section id="background" class="max-w-6xl mx-auto px-6 py-20">
            <h2 class="text-3xl font-bold text-white mb-12 flex items-center gap-4">
                <span class="text-brand-500 font-mono text-xl">02.</span> Background
                <div class="h-px bg-slate-700/50 flex-1 ml-4"></div>
            </h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                ${portfolio.skills ? `
                <div>
                    <h3 class="text-xl font-bold text-white mb-6">Skills & Technologies</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <h4 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Technical</h4>
                            <div class="flex flex-wrap gap-2">
                                ${portfolio.skills.split(',').map(s => `<span class="px-3 py-1 bg-slate-800/50 text-brand-400 rounded-lg text-sm font-medium border border-slate-700/50">${s.trim()}</span>`).join('')}
                            </div>
                        </div>
                        ${portfolio.softSkills ? `
                        <div>
                            <h4 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Soft Skills</h4>
                            <div class="flex flex-wrap gap-2">
                                ${portfolio.softSkills.split(',').map(s => `<span class="px-3 py-1 bg-slate-800/30 text-slate-300 rounded-lg text-sm font-medium border border-slate-700/30">${s.trim()}</span>`).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}

                ${portfolio.education.length > 0 ? `
                <div>
                    <h3 class="text-xl font-bold text-white mb-6">Education</h3>
                    <div class="space-y-4">
                        ${portfolio.education.map(e => `
                            <div class="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
                                <div class="flex items-start justify-between gap-4 mb-1">
                                    <h4 class="text-lg font-bold text-white">${e.degree}</h4>
                                    <span class="text-slate-500 text-sm font-mono shrink-0 pt-1">${e.year}</span>
                                </div>
                                <p class="text-brand-400 font-medium text-sm">${e.institution}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="max-w-3xl mx-auto px-6 py-32 text-center">
            <p class="text-brand-400 font-mono text-sm tracking-widest uppercase mb-4">03. What's Next?</p>
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">Get In Touch</h2>
            <p class="text-lg text-slate-400 mb-10 leading-relaxed">Although I'm not currently looking for any new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>
            ${portfolio.email ? `<a href="mailto:${portfolio.email}" class="inline-flex items-center justify-center px-8 py-4 border border-brand-500 text-brand-400 hover:bg-brand-500/10 font-medium rounded-lg transition-colors">Say Hello</a>` : ''}
        </section>
    </main>

    <footer class="py-8 text-center text-slate-500 text-sm border-t border-slate-800">
        <p>Built with ❤️ by ${portfolio.name}</p>
    </footer>
</body>
</html>`;
    };

    useEffect(() => {
        setPreviewHtml(generateHTML(data));
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleProjectChange = (id: string, field: keyof Project, value: string) => {
        setData(prev => ({
            ...prev,
            projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
        }));
    };

    const addProject = () => {
        const newProject: Project = {
            id: Date.now().toString(),
            title: 'New Project',
            description: '',
            imageUrl: '',
            demoUrl: '',
            repoUrl: '',
            tags: ''
        };
        setData(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
    };

    const removeProject = (id: string) => {
        setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
    };

    const handleEducationChange = (id: string, field: keyof Education, value: string) => {
        setData(prev => ({
            ...prev,
            education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e)
        }));
    };

    const addEducation = () => {
        const newEdu: Education = {
            id: Date.now().toString(),
            institution: 'University Name',
            degree: 'Degree / Major',
            year: 'YYYY - YYYY'
        };
        setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
    };

    const removeEducation = (id: string) => {
        setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
    };

    const downloadHTML = () => {
        const blob = new Blob([previewHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
            {/* Editor Pane */}
            <div className="w-full lg:w-1/3 bg-white rounded-2xl border border-gray-200 overflow-y-auto flex flex-col custom-scrollbar shadow-sm">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Icons.Edit size={16} className="text-indigo-500" />
                        Editor
                    </h2>
                    <button
                        onClick={downloadHTML}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                    >
                        <Icons.Download size={14} />
                        Export HTML
                    </button>
                </div>
                
                <div className="p-5 space-y-8">
                    {/* Personal Info */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Personal Info</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" name="name" value={data.name} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Professional Title</label>
                                <input type="text" name="title" value={data.title} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Bio / Tagline</label>
                                <textarea name="bio" value={data.bio} onChange={handleChange} rows={3} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"></textarea>
                            </div>
                        </div>
                    </section>

                    {/* Links */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Links & Contact</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><Icons.Mail size={14} className="text-gray-500"/></div>
                                <input type="email" name="email" value={data.email} onChange={handleChange} placeholder="Email Address" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><Icons.Github size={14} className="text-gray-500"/></div>
                                <input type="text" name="github" value={data.github} onChange={handleChange} placeholder="GitHub URL" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><span className="text-[10px] font-bold text-gray-500">in</span></div>
                                <input type="text" name="linkedin" value={data.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><span className="text-[10px] font-bold text-gray-500">𝕏</span></div>
                                <input type="text" name="twitter" value={data.twitter} onChange={handleChange} placeholder="X / Twitter URL" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all" />
                            </div>
                        </div>
                    </section>

                    {/* Skills */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Skills & Tech</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Technical Skills</label>
                                <input type="text" name="skills" value={data.skills} onChange={handleChange} placeholder="e.g. React, Next.js, Python, Tailwind" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                                <p className="text-[10px] text-gray-400 mt-1.5 ml-1">Comma separated.</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Soft Skills</label>
                                <input type="text" name="softSkills" value={data.softSkills} onChange={handleChange} placeholder="e.g. Communication, Teamwork, Leadership" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                                <p className="text-[10px] text-gray-400 mt-1.5 ml-1">Comma separated.</p>
                            </div>
                        </div>
                    </section>

                    {/* Education */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Education</h3>
                            <button onClick={addEducation} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 flex items-center gap-1 transition-colors">
                                <Icons.Plus size={12} /> ADD
                            </button>
                        </div>
                        <div className="space-y-4">
                            {data.education.map((edu, index) => (
                                <div key={edu.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3 relative group">
                                    <button onClick={() => removeEducation(edu.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Icons.Trash2 size={14} />
                                    </button>
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase">Education {index + 1}</h4>
                                    
                                    <div>
                                        <input type="text" placeholder="Degree / Certification" value={edu.degree} onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)} className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all font-medium" />
                                    </div>
                                    <div>
                                        <input type="text" placeholder="Institution / University" value={edu.institution} onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)} className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div>
                                        <input type="text" placeholder="Year (e.g., 2020 - 2024)" value={edu.year} onChange={(e) => handleEducationChange(edu.id, 'year', e.target.value)} className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all font-mono" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Projects */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Projects</h3>
                            <button onClick={addProject} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 flex items-center gap-1 transition-colors">
                                <Icons.Plus size={12} /> ADD
                            </button>
                        </div>
                        <div className="space-y-4">
                            {data.projects.map((project, index) => (
                                <div key={project.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3 relative group">
                                    <button onClick={() => removeProject(project.id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Icons.Trash2 size={14} />
                                    </button>
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase">Project {index + 1}</h4>
                                    
                                    <div>
                                        <input type="text" placeholder="Project Title" value={project.title} onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)} className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all font-medium" />
                                    </div>
                                    <div>
                                        <textarea placeholder="Description" rows={2} value={project.description} onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)} className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all resize-none"></textarea>
                                    </div>
                                    <div>
                                        <input type="text" placeholder="Image URL (e.g., Unsplash, Imgur)" value={project.imageUrl} onChange={(e) => handleProjectChange(project.id, 'imageUrl', e.target.value)} className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input type="text" placeholder="Live Demo URL" value={project.demoUrl} onChange={(e) => handleProjectChange(project.id, 'demoUrl', e.target.value)} className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all" />
                                        <input type="text" placeholder="Source Code URL" value={project.repoUrl} onChange={(e) => handleProjectChange(project.id, 'repoUrl', e.target.value)} className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div>
                                        <input type="text" placeholder="Tags (comma separated)" value={project.tags} onChange={(e) => handleProjectChange(project.id, 'tags', e.target.value)} className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Deployment & Customization Guide */}
                    <section className="mt-8 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3">
                        <h3 className="text-xs font-black text-indigo-800 uppercase tracking-widest flex items-center gap-1.5">
                            <Icons.Info size={14} /> Next Steps
                        </h3>
                        <div className="text-xs text-indigo-900/80 space-y-2 leading-relaxed">
                            <p>
                                <strong>Deploying:</strong> Once exported, you can instantly host your HTML file for free on platforms like <a href="https://vercel.com" target="_blank" className="underline font-medium hover:text-indigo-600">Vercel</a>, <a href="https://netlify.com" target="_blank" className="underline font-medium hover:text-indigo-600">Netlify</a>, or <a href="https://pages.github.com/" target="_blank" className="underline font-medium hover:text-indigo-600">GitHub Pages</a> by dragging and dropping.
                            </p>
                            <p>
                                <strong>Customizing:</strong> Want to add a custom domain, tweak colors, or add a new section? Open the HTML file in <strong>VS Code</strong>, or use AI agents like <strong>Antigravity</strong>, <strong>Claude Code</strong>, or <strong>Codex</strong> to easily modify the code!
                            </p>
                        </div>
                    </section>
                </div>
            </div>

            {/* Preview Pane */}
            <div className="w-full lg:w-2/3 bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden flex flex-col relative shadow-inner">
                <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4 shrink-0">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="ml-4 px-3 py-1 bg-gray-900 rounded-md border border-gray-700 text-[10px] text-gray-400 font-medium flex items-center gap-2 w-64 max-w-full">
                        <Icons.Lock size={10} className="text-gray-500"/>
                        portfolio.local
                    </div>
                </div>
                <div className="flex-1 w-full bg-slate-900">
                    <iframe 
                        srcDoc={previewHtml} 
                        className="w-full h-full border-0"
                        title="Portfolio Preview"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                    />
                </div>
            </div>
        </div>
    );
}
