"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/shared/Icons';

export default function TermsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen w-full bg-[#fafbfc] flex flex-col items-center justify-start p-4 md:p-8 relative overflow-hidden font-sans">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/40 to-transparent -z-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10" />
            <div className="absolute top-1/4 -left-24 w-80 h-80 bg-purple-100/20 rounded-full blur-3xl -z-10" />

            <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[40px] border border-white/50 shadow-2xl shadow-blue-500/5 mt-6 mb-16 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors w-fit group"
                    >
                        <Icons.ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight">Terms & Conditions</h1>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">
                            Effective Date: June 12, 2026 • Version 1.0
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-6 text-[#334155] text-sm md:text-base leading-relaxed font-medium">
                    <p>
                        Welcome to <strong>CurricuLab</strong>. These Terms & Conditions governs your use of our website, services, and applications.
                        By accessing or using CurricuLab, you agree to be bound by these terms. If you do not agree, please do not access or use our services.
                    </p>

                    <hr className="border-gray-100" />

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By creating an account, logging in, or using any feature of CurricuLab (including but not limited to study tools, syllabus mapping, and attendance logging), you affirm that you are at least 18 years of age or possess legal parental or guardian consent, and are fully able and competent to enter into these terms.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            2. Description of Service
                        </h2>
                        <p>
                            CurricuLab is a study management and academic organization suite. We provide features such as AI tutoring/assistance, attendance verification via facial recognition, timetable tracking, assignments management, and syllabus resource curation.
                        </p>
                        <p>
                            We reserve the right to modify, suspend, or discontinue any aspect of the service at any time without prior notice or liability.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            3. User Accounts & Security
                        </h2>
                        <p>
                            To access most features, you must sign in via supported OAuth providers (Google, GitHub). You are solely responsible for maintaining the security of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            4. Privacy Policy
                        </h2>
                        <p>
                            Your privacy is important to us. Please refer to our <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline font-bold">Privacy Policy</a> to understand how we collect, use, store, and protect your personal data, including facial recognition descriptors.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            5. User Conduct & Prohibited Uses
                        </h2>
                        <p>
                            You agree not to use the services to:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 font-medium text-gray-600">
                            <li>Engage in any unlawful activity or violate local, state, or international laws.</li>
                            <li>Attempt to breach or bypass system security, authentication systems, or rate-limiters.</li>
                            <li>Abuse AI features (e.g. prompt injection, scraping outputs, or generating harmful content).</li>
                            <li>Falsify attendance records or bypass face verification checks.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            6. Intellectual Property
                        </h2>
                        <p>
                            The service structure, codebase, logo, layouts, and system designs are the intellectual property of CurricuLab and its creators. You are granted a limited, non-exclusive, non-transferable license to access the application for personal, academic use only.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            7. Disclaimer of Warranties
                        </h2>
                        <p className="italic bg-gray-50 p-4 rounded-2xl border border-gray-100 text-gray-500">
                            The service is provided on an "AS IS" and "AS AVAILABLE" basis. CurricuLab makes no warranties, expressed or implied, regarding system uptime, accuracy of AI models, or data persistence. You use the service at your own risk.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            8. Limitation of Liability
                        </h2>
                        <p>
                            In no event shall CurricuLab or its creators be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your access to, use of, or inability to use the service.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            9. Contact Information
                        </h2>
                        <p>
                            If you have any questions about these Terms & Conditions, please contact us at: <span className="font-bold text-gray-900">support@curriculab.io</span>.
                        </p>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span>© {new Date().getFullYear()} CurricuLab IO</span>
                    <div className="flex gap-4">
                        <a href="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
