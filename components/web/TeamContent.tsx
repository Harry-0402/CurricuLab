"use client"

import { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/shared/Icons';

export default function TeamContent() {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 1200);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    const copyButton = (text: string, id: string) => (
        <button
            onClick={() => handleCopy(text, id)}
            className={cn(
                "px-3 py-2 rounded-xl text-xs font-black transition-all transform active:scale-95",
                copiedId === id 
                    ? "bg-[#36d399] text-[#0b1220]" 
                    : "bg-[#7aa2ff] text-[#0b1220] hover:bg-[#7aa2ff]/90"
            )}
        >
            {copiedId === id ? "Copied ✅" : "Copy"}
        </button>
    );

    return (
        <WebAppShell>
             <div className="min-h-screen text-[#eaf0ff] font-sans selection:bg-[#7aa2ff]/30" style={{
                background: `
                    radial-gradient(1200px 600px at 20% 0%, rgba(122,162,255,0.18), transparent 60%),
                    radial-gradient(900px 500px at 100% 15%, rgba(54,211,153,0.12), transparent 60%),
                    #0b1220`
            }}>
                <div className="max-w-[1100px] mx-auto p-4 md:p-8 space-y-8">
                    
                    {/* Header */}
                    <header className="text-center space-y-4 pt-4 pb-2">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">CurricuLab (MBA Sem 2) - Team Instructions</h1>
                        <p className="text-[#b9c4e6] text-sm md:text-base max-w-2xl mx-auto">
                            Single-page guide for Data Acquisition Team. Clear steps, fewer mistakes.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                            {["Semester 2 resources", "Exam-style Q&A", "Notes + Case Studies + Projects"].map(tag => (
                                <span key={tag} className="px-3 py-1.5 rounded-full bg-[#7aa2ff]/15 border border-[#7aa2ff]/30 text-xs text-[#eaf0ff]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </header>

                    {/* Quick Nav */}
                    <nav className="bg-[#0f1a33]/70 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl">
                        <h3 className="text-center text-sm font-bold mb-4">📑 Table of Contents</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {["Goal", "Team Structure", "Workflow", "Option 1", "Option 2", "Comparison", "Final Remark", "Rules", "Suggestions"].map((item) => {
                                const id = item.toLowerCase().replace(/ /g, '-').replace('final-', 'remark').replace('suggestions', 'tips');
                                // Mapping exact IDs from HTML
                                const map: any = { "team structure": "team", "option 1": "opt1", "option 2": "opt2", "comparison": "compare", "final remark": "remark", "suggestions": "tips" };
                                const targetId = map[item.toLowerCase()] || id;
                                
                                return (
                                    <a 
                                        key={item} 
                                        href={`#${targetId}`}
                                        className="px-3 py-1.5 rounded-full bg-[#7aa2ff]/15 border border-[#7aa2ff]/30 text-xs text-[#eaf0ff] hover:bg-[#7aa2ff]/30 hover:-translate-y-px transition-all"
                                    >
                                        {item}
                                    </a>
                                )
                            })}
                        </div>
                    </nav>

                    {/* Main Content Grid */}
                    <main className="grid grid-cols-1 gap-6">

                        {/* Goal */}
                        <section id="goal" className="bg-[#0f1a33]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <h2 className="text-xl font-bold mb-4">Goal</h2>
                            <p className="text-[#b9c4e6] mb-2 leading-relaxed">
                                CurricuLab is a website that will contain MBA Semester 2 resources.
                                Main output: exam-style questions + answers (unit-wise) and structured notes.
                            </p>
                            <p className="text-[#b9c4e6] leading-relaxed">
                                We have two options for content creation. Pick the one that gives stable output with the least rework.
                            </p>
                        </section>

                        {/* Team Structure */}
                        <section id="team" className="bg-[#0f1a33]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <h2 className="text-xl font-bold mb-6">Team Structure</h2>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {/* Tech Team */}
                                <div className="p-4 rounded-xl border-l-4 border-[#7aa2ff] bg-[#7aa2ff]/10">
                                    <h3 className="text-[#36d399] font-bold mb-2 flex items-center gap-2">👨‍💼 Technical Team (Lead: Kaif)</h3>
                                    <p className="text-[#b9c4e6] mb-1 text-sm"><strong>Members:</strong> Kaif, Akash, Tejas</p>
                                    <p className="text-[#b9c4e6] text-xs">Responsible for platform development, integration, and technical infrastructure.</p>
                                </div>

                                {/* Data Team */}
                                <div className="p-4 rounded-xl border-l-4 border-[#36d399] bg-[#36d399]/10">
                                    <h3 className="text-[#36d399] font-bold mb-2 flex items-center gap-2">📊 Data Acquisition Team (Lead: Tanu)</h3>
                                    <p className="text-[#b9c4e6] mb-1 text-sm"><strong>Members:</strong> Tanu, Anukriti, Mani, Georgetta, Divya</p>
                                    <p className="text-[#b9c4e6] text-xs mb-4">Responsible for content creation, quality assurance, and MBA Sem 2 resource assembly.</p>
                                    
                                    <div className="h-px bg-white/10 my-3"></div>
                                    
                                    <h4 className="text-sm font-bold mb-3">Subject Allocation (Semester 2 - 5 Theories)</h4>
                                    <div className="grid gap-2 text-sm">
                                        {[
                                            { name: "Georgetta", subject: "PBA 207 (Data Visualization & Storytelling)", link: "https://drive.google.com/drive/folders/1ZM8W2EmxgCdZz0U960KJSlAo0tSli-uA?usp=sharing" },
                                            { name: "Tanu", subject: "PBA 206 (Legal Aspects of Business)", link: "https://drive.google.com/drive/folders/1zIP2MjeN3SzFM8Rkfw0xQKKdlR7LJvJD?usp=sharing" },
                                            { name: "Anukriti", subject: "PBA 205 (Digital Transformation)", link: "https://drive.google.com/drive/folders/1FJEJWenzKHXnCKiLMImLbHpD464JFLBO?usp=sharing" },
                                            { name: "Manishankar", subject: "PBA 208 (Business Research Methodology)", link: "https://drive.google.com/drive/folders/1Jpf6sY6nD28PMVJehRBdtLYsoeXRcw8q?usp=sharing" },
                                            { name: "Divya", subject: "PBA 204 (Production & Operations Management)", link: "https://drive.google.com/drive/folders/1nQE5vKrBPNljGPfYcD-i7V9sOWHctqxl?usp=sharing" }
                                        ].map((item, i) => (
                                            <div key={i} className="p-3 bg-white/5 rounded-lg border-l-[3px] border-[#36d399] flex justify-between items-center flex-wrap gap-2">
                                                <strong>{item.name} → {item.subject}</strong>
                                                <a href={item.link} target="_blank" className="text-[#7aa2ff] text-xs font-bold hover:underline flex items-center gap-1">
                                                    <Icons.Database size={12} /> Drive
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Coordinators */}
                                <div className="p-4 rounded-xl border-l-4 border-[#fbbf24] bg-[#fbbf24]/10">
                                    <h3 className="text-[#fbbf24] font-bold mb-2 flex items-center gap-2">📋 Project Coordinators</h3>
                                    <p className="text-[#b9c4e6] mb-1 text-sm"><strong>Members:</strong> Harish, Kaustubh</p>
                                    <p className="text-[#b9c4e6] text-xs">Oversee project timeline, resource allocation, and team coordination.</p>
                                </div>
                            </div>

                            <div className="h-px bg-white/10 my-6"></div>

                            <h3 className="text-base font-bold mb-2">Leadership & Accountability</h3>
                            <p className="text-[#b9c4e6] mb-3 text-sm"><strong>Leaders (Kaif & Tanu)</strong> are accountable and responsible for:</p>
                            <ul className="list-disc list-inside text-[#b9c4e6] text-sm space-y-1 ml-2">
                                <li>Team performance and delivery of assigned tasks</li>
                                <li>Quality assurance of all outputs</li>
                                <li>Reporting to Project Coordinators (Harish & Kaustubh)</li>
                                <li>Escalation and issue resolution within their teams</li>
                                <li>Progress tracking and status updates</li>
                            </ul>
                        </section>

                        {/* Workflow */}
                        <section id="workflow" className="bg-[#0f1a33]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <h2 className="text-xl font-bold mb-6">Project Workflow (Step-by-Step)</h2>
                            <div className="grid gap-3">
                                {[
                                    { title: "📤 Step 1: Upload & Prepare", desc: "Upload syllabus and copy-paste the prompt in your preferred AI tool (ChatGPT, Gemini, etc.) for content generation.", color: "border-[#7aa2ff] bg-[#7aa2ff]/10" },
                                    { title: "✅ Step 2: Verify & Quality Check", desc: "Verify all questions and answers to avoid duplication, missing values, or gaps. Do cross-checking thoroughly before approval.", color: "border-[#7aa2ff] bg-[#7aa2ff]/10" },
                                    { title: "❓ Step 3: Clarify Doubts", desc: "If any doubts or issues arise, contact the Project Coordinators (Harish & Kaustubh) immediately to avoid last-minute hassles.", color: "border-[#7aa2ff] bg-[#7aa2ff]/10" },
                                    { title: "📋 Step 4: Report Progress", desc: "After verification, discuss work progress with coordinators. Once approved, forward your finalized file to them.", color: "border-[#7aa2ff] bg-[#7aa2ff]/10" },
                                    { title: "🚀 Step 5: Integration & Website Launch", desc: "Technical Team Responsibility: After all data acquisition is complete, the Technical Team (Kaif, Akash, Tejas) will integrate the acquired data into the website and maintain it. Website maintenance is their primary responsibility.", color: "border-[#36d399] bg-[#36d399]/10" }
                                ].map((step, i) => (
                                    <div key={i} className={cn("p-4 rounded-xl border-l-4", step.color)}>
                                        <h3 className="font-bold mb-1 text-sm">{step.title}</h3>
                                        <p className="text-[#b9c4e6] text-xs">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        
                            <div className="h-px bg-white/10 my-6"></div>

                            <h3 className="text-base font-bold mb-2">Key Points</h3>
                            <ul className="list-disc list-inside text-[#b9c4e6] text-sm space-y-1 ml-2">
                                <li><strong>Data Acquisition Team:</strong> Focus on content quality and accuracy (Steps 1-4)</li>
                                <li><strong>Technical Team:</strong> Focus on website development and data integration (Step 5)</li>
                                <li><strong>Coordinators:</strong> Oversee entire workflow and ensure timely delivery</li>
                                <li><strong>Communication:</strong> Keep coordinators informed at every step to avoid delays</li>
                            </ul>
                        </section>

                        {/* Option 1 */}
                        <section id="opt1" className="bg-[#0f1a33]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <h2 className="text-xl font-bold mb-6">Option 1: Custom GPT Workflow (Recommended)</h2>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Syllabrix */}
                                <div className="p-4 rounded-xl border border-white/10 bg-[#0f1a33]/70">
                                    <h3 className="font-bold mb-2">Syllabrix</h3>
                                    <p className="text-[#b9c4e6] text-xs mb-1"><span className="px-2 py-0.5 rounded-full bg-[#36d399]/15 border border-[#36d399]/35 text-[#eaf0ff] text-[10px] font-bold uppercase tracking-wide mr-2">Dedicated</span> Unit-wise Question–Answers only.</p>
                                    <p className="text-[#b9c4e6] text-xs mb-3">Marks pattern + question format are pre-defined and final aligned.</p>
                                    
                                    <div className="text-sm mb-4">
                                        Link: <a href="https://chatgpt.com/g/g-69624841e9808191847e5f0682c8a6de-syllabrix" target="_blank" className="text-[#7aa2ff] font-bold hover:underline">Open Syllabrix</a>
                                    </div>

                                    <div className="bg-[#050a14]/65 border border-white/10 rounded-xl p-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[#b9c4e6] text-xs font-mono">Prompt: Generate Q+A</span>
                                            {copyButton("I have an attached syllabus of a [subject name] along with a reference book. Create detailed Question with proper structure and language should be simple, clear and humanoid.", "p1")}
                                        </div>
                                        <pre className="font-mono text-xs text-[#e8f0ff] whitespace-pre-wrap break-words">
                                            I have an attached syllabus of a [subject name] along with a reference book. Create detailed Question with proper structure and language should be simple, clear and humanoid.
                                        </pre>
                                    </div>
                                </div>

                                {/* NoteSmith */}
                                <div className="p-4 rounded-xl border border-white/10 bg-[#0f1a33]/70">
                                    <h3 className="font-bold mb-2">NoteSmith</h3>
                                    <p className="text-[#b9c4e6] text-xs mb-1"><span className="px-2 py-0.5 rounded-full bg-[#36d399]/15 border border-[#36d399]/35 text-[#eaf0ff] text-[10px] font-bold uppercase tracking-wide mr-2">Dedicated</span> Notes + Case Studies + Mini Project.</p>
                                    <p className="text-[#b9c4e6] text-xs mb-3">Better structure and stable formatting for website + PDF export.</p>
                                    
                                    <div className="text-sm mb-4">
                                        Link: <a href="https://chatgpt.com/g/g-6962605ee32481918f2c0ee70c521b90-notesmith" target="_blank" className="text-[#7aa2ff] font-bold hover:underline">Open NoteSmith</a>
                                    </div>

                                    <div className="bg-[#050a14]/65 border border-white/10 rounded-xl p-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[#b9c4e6] text-xs font-mono">Prompt: Generate Notes</span>
                                            {copyButton("I have an attached syllabus of a [subject name] along with a reference book. Create detailed notes with proper structure and language should be simple, clear and humanoid.", "p2")}
                                        </div>
                                        <pre className="font-mono text-xs text-[#e8f0ff] whitespace-pre-wrap break-words">
                                            I have an attached syllabus of a [subject name] along with a reference book. Create detailed notes with proper structure and language should be simple, clear and humanoid.
                                        </pre>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="mt-4 text-xs text-[#b9c4e6]">Tip: Always upload syllabus + reference book PDF before using the prompts.</p>
                            
                            <div className="h-px bg-white/10 my-6"></div>

                            <h3 className="text-base font-bold mb-2">Why Option 1 is best</h3>
                            <ul className="list-disc list-inside text-[#b9c4e6] text-sm space-y-1 ml-2">
                                <li>Less flow break (GPT does 1 job at a time)</li>
                                <li>Less unit mixing</li>
                                <li>Less repeated questions</li>
                                <li>Same output format across all team members</li>
                                <li>Fast and clean for website upload</li>
                            </ul>
                        </section>

                        {/* Option 2 */}
                        <section id="opt2" className="bg-[#0f1a33]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <h2 className="text-xl font-bold mb-2">Option 2: Normal GPT + Master Prompt (All-in-one)</h2>
                             <p className="text-[#b9c4e6] text-sm mb-4">
                                <span className="px-2 py-0.5 rounded-full bg-[#fbbf24]/15 border border-[#fbbf24]/35 text-[#eaf0ff] text-[10px] font-bold uppercase tracking-wide mr-2">One Prompt</span> Normal ChatGPT guided by a master prompt.
                                Master prompt includes everything in one execution.
                            </p>

                            <h3 className="text-sm font-bold mb-2">Master prompt includes (all items)</h3>
                            <ul className="list-disc list-inside text-[#b9c4e6] text-xs space-y-1 ml-2 mb-4">
                                <li>Strict syllabus mapping (Unit-wise topics)</li>
                                <li>50 questions per unit (exam-style marks-wise)</li>
                                <li>Answer pattern rules + keywords highlighting</li>
                                <li>Notes generation (detailed, exam-ready)</li>
                                <li>2 case studies per unit</li>
                                <li>1 mini project per unit</li>
                                <li>Unit completion learning challenge + mind map nodes</li>
                                <li>Execution control: stop and wait after each phase</li>
                            </ul>

                            <h3 className="text-sm font-bold mb-2">Remark</h3>
                            <p className="text-[#b9c4e6] text-sm mb-6">
                                Option 2 gives maximum flexibility. But higher disturbance risk because the output volume is huge.
                                Usually needs more correction and format cleanup.
                            </p>

                            <div className="bg-[#050a14]/65 border border-white/10 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[#b9c4e6] text-xs font-mono">Prompt: Full Master Workflow</span>
                                    {copyButton(`MASTER PROMPT — MBA Sem 2 (All‑in‑one)

ROLE
You are a business analytics and decision‑science expert, university‑level subject expert, MBA professor, syllabus analyst, and exam‑oriented answer writer. Help me do well in exams, understand concepts, and apply them in real business.

INPUTS I WILL PROVIDE
- Full syllabus (units and subtopics)
- Reference book(s) or PDFs (author list provided)

EXECUTION RULES
- Work one unit at a time. Do not mix content across units.
- Use simple, clear, professional language. Avoid jargon unless explained.
- Keep output well‑structured, consistent, and exam‑ready.

STEP 1 — STRICT SYLLABUS MAPPING (MANDATORY)
1) List ALL units in exact order.
2) Under each unit, list every subtopic clearly (no collapsing or merging).
3) After each unit, add placeholders only: Case Studies (2 titles + 1‑line context each), Mini Project (problem + result only), Mind Map (node list). Do NOT elaborate yet.
⛔ STOP after mapping. Wait for my confirmation before Step 2.

STEP 2 — QUESTIONS AND ANSWERS (PER UNIT)
Work on one unit at a time. For the selected unit, generate at least 50 questions across marks categories:
- 2 Marks × 10 (4–9 lines) — short theory
- 7 Marks × 10 (14–19 lines) — medium analytical
- 8 Marks × 10 (16–21 lines) — medium analytical
- 10 Marks × 10 (20–25 lines) — long integrative
- 15 Marks × 10 (30–35 lines) — long analytical
Distribution: ~40% direct, ~35% application‑based, ~25% Socratic.

HOW TO WRITE ANSWERS
- Explain/Describe: opening → meaning/definition → types/classification (if any) → full explanation → real‑world example → highlight KEYWORDS in context.
- Compare/Difference: use a table; include concise bullets only if requested for types/differences; add a real example at end.
- Depth scales with marks. Keep structure clean and consistent.

CONTENT CONTROL (VERY IMPORTANT)
- ❌ No content from other units
- ❌ No duplicate questions
- ❌ No extra theory beyond syllabus
- ✅ Simple, clear language suitable for MBA exams
- ✅ Cite standard academic understanding (no hallucinations)

SPECIAL MODES (ALWAYS ON)
- Question Paper Prediction Mode: focus on likely exam questions
- Concept Clarity Mode: ensure conceptual accuracy and coherence
- Hallucination Control: stay within syllabus and reference materials

AFTER EACH UNIT (POST‑WORK)
1) Final integrative challenge that combines multiple ideas
2) Reflection prompts (what/why/meaning/when‑not/how/where)
3) Suggest business/industry analytics project use or simulation
4) Notes pack: detailed explanations (paragraphs), comparison tables, helpful analogies, tips & tricks, last‑minute revision points

FORMAT/STYLE
- Headings/subheadings; numbered/bulleted lists where needed
- Tables for comparisons; examples grounded in business scenarios
- Keep tone polite, focused, analytical, and exam‑oriented

EXECUTION CONTROL
After each step or unit, STOP and wait for my next instruction (e.g., "Begin Unit 1" or "Proceed to Q&A").

STARTER INSTRUCTIONS FOR YOU
1) Acknowledge Step 1 and request the full syllabus PDF + reference book(s).
2) After mapping, pause and ask me to confirm the next unit.
3) While generating Q&A, maintain marks‑wise structure and enforce line limits.
4) If any source is missing, ask for it before proceeding.

CONTEXT
Subject: [subject name]
Outputs must be consistent and website‑ready.`, "p3")}
                                </div>
                                <pre className="font-mono text-[10px] md:text-xs text-[#e8f0ff] whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
MASTER PROMPT — MBA Sem 2 (All‑in‑one)

ROLE
You are a business analytics and decision‑science expert, university‑level subject expert, MBA professor, syllabus analyst, and exam‑oriented answer writer. Help me do well in exams, understand concepts, and apply them in real business.

INPUTS I WILL PROVIDE
- Full syllabus (units and subtopics)
- Reference book(s) or PDFs (author list provided)

EXECUTION RULES
- Work one unit at a time. Do not mix content across units.
- Use simple, clear, professional language. Avoid jargon unless explained.
- Keep output well‑structured, consistent, and exam‑ready.

STEP 1 — STRICT SYLLABUS MAPPING (MANDATORY)
1) List ALL units in exact order.
2) Under each unit, list every subtopic clearly (no collapsing or merging).
3) After each unit, add placeholders only: Case Studies (2 titles + 1‑line context each), Mini Project (problem + result only), Mind Map (node list). Do NOT elaborate yet.
⛔ STOP after mapping. Wait for my confirmation before Step 2.

STEP 2 — QUESTIONS AND ANSWERS (PER UNIT)
Work on one unit at a time. For the selected unit, generate at least 50 questions across marks categories:
- 2 Marks × 10 (4–9 lines) — short theory
- 7 Marks × 10 (14–19 lines) — medium analytical
- 8 Marks × 10 (16–21 lines) — medium analytical
- 10 Marks × 10 (20–25 lines) — long integrative
- 15 Marks × 10 (30–35 lines) — long analytical
Distribution: ~40% direct, ~35% application‑based, ~25% Socratic.

HOW TO WRITE ANSWERS
- Explain/Describe: opening → meaning/definition → types/classification (if any) → full explanation → real‑world example → highlight KEYWORDS in context.
- Compare/Difference: use a table; include concise bullets only if requested for types/differences; add a real example at end.
- Depth scales with marks. Keep structure clean and consistent.

CONTENT CONTROL (VERY IMPORTANT)
- ❌ No content from other units
- ❌ No duplicate questions
- ❌ No extra theory beyond syllabus
- ✅ Simple, clear language suitable for MBA exams
- ✅ Cite standard academic understanding (no hallucinations)

SPECIAL MODES (ALWAYS ON)
- Question Paper Prediction Mode: focus on likely exam questions
- Concept Clarity Mode: ensure conceptual accuracy and coherence
- Hallucination Control: stay within syllabus and reference materials

AFTER EACH UNIT (POST‑WORK)
1) Final integrative challenge that combines multiple ideas
2) Reflection prompts (what/why/meaning/when‑not/how/where)
3) Suggest business/industry analytics project use or simulation
4) Notes pack: detailed explanations (paragraphs), comparison tables, helpful analogies, tips & tricks, last‑minute revision points

FORMAT/STYLE
- Headings/subheadings; numbered/bulleted lists where needed
- Tables for comparisons; examples grounded in business scenarios
- Keep tone polite, focused, analytical, and exam‑oriented

EXECUTION CONTROL
After each step or unit, STOP and wait for my next instruction (e.g., "Begin Unit 1" or "Proceed to Q&A").

STARTER INSTRUCTIONS FOR YOU
1) Acknowledge Step 1 and request the full syllabus PDF + reference book(s).
2) After mapping, pause and ask me to confirm the next unit.
3) While generating Q&A, maintain marks‑wise structure and enforce line limits.
4) If any source is missing, ask for it before proceeding.

CONTEXT
Subject: [subject name]
Outputs must be consistent and website‑ready.
                                </pre>
                            </div>
                        </section>

                       {/* Compare */}
                       <section id="compare" className="bg-[#0f1a33]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl overflow-x-auto">
                           <h2 className="text-xl font-bold mb-6">Comparison Table</h2>
                           <table className="w-full border-collapse rounded-xl overflow-hidden border border-white/10">
                               <thead>
                                   <tr className="bg-white/5 text-left text-sm font-bold text-[#eaf0ff]">
                                       <th className="p-3 border-b border-white/10">Factor</th>
                                       <th className="p-3 border-b border-white/10">Option 1: Custom GPTs</th>
                                       <th className="p-3 border-b border-white/10">Option 2: Master Prompt</th>
                                       <th className="p-3 border-b border-white/10 text-center">Best</th>
                                   </tr>
                               </thead>
                               <tbody className="text-xs md:text-sm text-[#b9c4e6]">
                                   {[
                                       { f: "Marks format", o1: "Fixed + final aligned", o2: "Depends on prompt accuracy", b: "Option 1" },
                                       { f: "Consistency", o1: "High", o2: "Medium", b: "Option 1" },
                                       { f: "Flow disturbance", o1: "Low", o2: "High", b: "Option 1" },
                                       { f: "Unit accuracy", o1: "High", o2: "Medium", b: "Option 1" },
                                       { f: "Repeated questions", o1: "Low", o2: "Medium–High", b: "Option 1" },
                                       { f: "Flexibility", o1: "Medium", o2: "High", b: "Option 2", warn: true },
                                       { f: "Best for team work", o1: "Strong (same tools)", o2: "Weak (varies by member)", b: "Option 1" },
                                       { f: "Best use", o1: "Main production pipeline", o2: "Special cases + experiments", b: "Option 1" },
                                   ].map((r, i) => (
                                       <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-3 border-b border-white/5">{r.f}</td>
                                            <td className="p-3 border-b border-white/5">{r.o1}</td>
                                            <td className="p-3 border-b border-white/5">{r.o2}</td>
                                            <td className="p-3 border-b border-white/5 text-center">
                                                <span className={cn(
                                                    "px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide border",
                                                    r.warn 
                                                        ? "bg-[#fbbf24]/15 border-[#fbbf24]/35 text-[#eaf0ff]" 
                                                        : "bg-[#36d399]/15 border-[#36d399]/35 text-[#eaf0ff]"
                                                )}>
                                                    {r.b}
                                                </span>
                                            </td>
                                       </tr>
                                   ))}
                                   {/* Verdict */}
                                   <tr className="bg-[#36d399]/10">
                                        <td className="p-3 font-bold text-[#eaf0ff]">Final decision</td>
                                        <td className="p-3 font-bold text-[#eaf0ff]">Use this for full production</td>
                                        <td className="p-3 text-[#b9c4e6]">Use only for polishing/editing</td>
                                        <td className="p-3 text-center">
                                            <span className="px-2 py-1 rounded-full bg-[#36d399]/15 border border-[#36d399]/35 text-[#eaf0ff] text-[10px] uppercase font-bold tracking-wide">
                                                Option 1 ✅
                                            </span>
                                        </td>
                                   </tr>
                               </tbody>
                           </table>
                       </section>

                        {/* Remark */}
                        <section id="remark" className="bg-[#0f1a33]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <h2 className="text-xl font-bold mb-4">Final Remark (Recommended Option + How it works)</h2>
                            
                            <h3 className="font-bold mb-2 text-[#eaf0ff]">Which is the best option?</h3>
                            <p className="mb-4 text-sm"><span className="px-2 py-1 rounded-full bg-[#36d399]/15 border border-[#36d399]/35 text-[#eaf0ff] text-[10px] uppercase font-bold tracking-wide">Best Option: Option 1 (Custom GPT Workflow)</span></p>
                            <p className="text-[#b9c4e6] text-sm mb-6">Reason: Our marks pattern and question format are already final aligned. So we don't need flexibility. We need speed, consistency, and zero rework.</p>

                            <div className="h-px bg-white/10 my-4"></div>

                            <h3 className="font-bold mb-2 text-[#eaf0ff]">How Option 1 works (Actual workflow)</h3>
                            <p className="text-[#b9c4e6] text-sm mb-4">Option 1 splits work into two dedicated GPTs. This prevents system flow disturbance. Each GPT does one job only, so output stays stable.</p>

                            <h3 className="font-bold mb-2 text-[#eaf0ff]">step-by-step</h3>
                            <ul className="list-disc list-inside text-[#b9c4e6] text-sm space-y-2 ml-2 mb-6">
                                <li><b>Step 1:</b> Upload syllabus + reference book PDF</li>
                                <li>
                                    <b>Step 2 (Syllabrix):</b> Generate unit-wise Question Bank (50 questions per unit)
                                    <br/><span className="text-xs text-[#b9c4e6]/70 ml-4">Pattern: 2M (10) + 7M (10) + 8M (10) + 10M (10) + 15M (10)</span>
                                </li>
                                <li><b>Step 3 (NoteSmith):</b> Generate unit-wise Notes + 2 Case Studies + 1 Mini Project</li>
                                <li><b>Step 4:</b> Save final output in Word/PDF + convert to website content (JSON/Markdown)</li>
                            </ul>

                            <div className="h-px bg-white/10 my-4"></div>

                            <h3 className="font-bold mb-2 text-[#eaf0ff]">Why Option 1 is best for CurricuLab</h3>
                            <ul className="list-disc list-inside text-[#b9c4e6] text-sm space-y-1 ml-2 mb-6">
                                <li>Low chance of flow break</li>
                                <li>No unit mixing</li>
                                <li>Less duplicate questions</li>
                                <li>Same format across all team members</li>
                                <li>Fast content production for MBA Sem 2</li>
                            </ul>

                            <div className="h-px bg-white/10 my-4"></div>

                            <h3 className="font-bold mb-2 text-[#eaf0ff]">When to use Option 2?</h3>
                            <p className="mb-2 text-sm"><span className="px-2 py-1 rounded-full bg-[#fbbf24]/15 border border-[#fbbf24]/35 text-[#eaf0ff] text-[10px] uppercase font-bold tracking-wide mr-2">Option 2 (Normal GPT + Master Prompt)</span> is only useful for editing/polishing tasks.</p>
                             <ul className="list-disc list-inside text-[#b9c4e6] text-sm space-y-1 ml-2">
                                <li>Rewrite answers in simpler words</li>
                                <li>Convert content to bullet points</li>
                                <li>Shorten or expand answers based on word limits</li>
                                <li>Create "Important Questions" list</li>
                                <li>Make website-friendly formatting</li>
                            </ul>
                        </section>

                       {/* Rules */}
                       <section id="rules" className="bg-[#0f1a33]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                           <h2 className="text-xl font-bold mb-4">Rules (Follow strictly)</h2>
                           <div className="grid gap-3">
                               <div className="p-3 border-l-4 border-[#f87171] bg-[#f87171]/10 rounded-r-lg">
                                   <strong className="text-[#eaf0ff] block mb-1">❌ No Unit mixing</strong>
                                   <p className="text-[#b9c4e6] text-xs">Keep content strictly within assigned unit boundaries. Do not pull theory from other units.</p>
                               </div>
                               <div className="p-3 border-l-4 border-[#f87171] bg-[#f87171]/10 rounded-r-lg">
                                   <strong className="text-[#eaf0ff] block mb-1">❌ No repeated questions</strong>
                                   <p className="text-[#b9c4e6] text-xs">Every question must be unique. Check previous chats before generating new content.</p>
                               </div>
                               <div className="p-3 border-l-4 border-[#36d399] bg-[#36d399]/10 rounded-r-lg">
                                   <strong className="text-[#eaf0ff] block mb-1">✅ Use same naming format</strong>
                                   <p className="text-[#b9c4e6] text-xs">Subject → Unit → Marks. Example: <code className="bg-black/30 px-1.5 py-0.5 rounded text-[10px]">Data_Analytics_Unit_1_2M.docx</code></p>
                               </div>
                           </div>
                       </section>

                       {/* Tips */}
                       <section id="tips" className="bg-[#0f1a33]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                           <h2 className="text-xl font-bold mb-4">Suggestions (to reduce mistakes)</h2>
                           <ul className="list-disc list-inside text-[#b9c4e6] text-sm space-y-2 ml-2">
                                <li>Create one folder per subject → Unit 1 to Unit 5 subfolders.</li>
                                <li>Use Option 1 for production. Use Option 2 only for polishing.</li>
                                <li>Use separate chats per unit to avoid repeated content.</li>
                                <li>Before saving, do a quick check: “No Unit mixing, no repeated questions”.</li>
                                <li>Store final output in Word + also export to PDF for backup.</li>
                                <li>For website: convert content to JSON or Markdown for easy upload.</li>
                           </ul>
                       </section>

                    </main>

                    {/* Footer */}
                    <footer className="text-center text-[#b9c4e6]/50 text-xs py-8">
                         CurricuLab • Internal team page • Open in any browser (Chrome/Edge).<br/>
                         Tip: Save this HTML in Google Drive or GitHub so everyone uses the same latest version.
                    </footer>

                </div>
            </div>
        </WebAppShell>
    );
}
