"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/shared/Icons';

export default function PrivacyPage() {
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
                        <h1 className="text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight">Privacy Policy</h1>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">
                            Effective Date: June 12, 2026 • Version 1.0
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-6 text-[#334155] text-sm md:text-base leading-relaxed font-medium">
                    <p>
                        At <strong>CurricuLab</strong>, we take your privacy seriously. This Privacy Policy describes how we collect, use, store, and share your personal information when you use our academic suite.
                    </p>

                    <hr className="border-gray-100" />

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            1. Information We Collect
                        </h2>
                        <p>
                            We collect information necessary to provide you with the services, customize your study workflow, and manage authentication:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 font-medium">
                            <li>
                                <strong>Account Information:</strong> When you sign in via Google or GitHub, we receive your email, full name, and avatar image.
                            </li>
                            <li>
                                <strong>Academic Data:</strong> This includes your enrolled semester, classes, timetable schedules, assignments, study notes, reminders, and check-in logs.
                            </li>
                            <li>
                                <strong>Biometric Verification Data (Face ID):</strong> To verify attendance, our platform uses facial recognition models. If you enroll in Face ID, we generate a numerical facial descriptor vector. Raw images are processed locally on your client device or uploaded securely solely for the log verification proof. The descriptor is stored in your private database profile.
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            2. How We Use Your Information
                        </h2>
                        <p>
                            We use the collected information for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-600 font-medium">
                            <li>To authenticate your session and secure your private workspace.</li>
                            <li>To dynamically scope subjects, timetables, and assignments to your semester/class.</li>
                            <li>To verify your attendance and compile study progress metrics.</li>
                            <li>To process AI tutor assistance and syllabus content curation.</li>
                            <li>To send you important system updates or notifications.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            3. Data Sharing & Third Parties
                        </h2>
                        <p>
                            We do not sell, trade, or rent your personal information to third parties. We only share information with third-party service providers who assist us in operating our business:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-600 font-medium">
                            <li><strong>Supabase:</strong> For cloud hosting, data storage, and authentication.</li>
                            <li><strong>Google & GitHub:</strong> For secure OAuth authentication.</li>
                            <li><strong>Google Generative AI / OpenAI:</strong> For generating study assistance, answers, and tutoring responses (prompts are shared with these services, but no account credentials or personal information is passed).</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            4. Data Storage & Security
                        </h2>
                        <p>
                            Your data is stored securely in our database and object storage platforms. We implement a variety of security measures, including HTTPS encryption in transit and database-level row-level security (RLS) to ensure that only authorized users can read or write their own academic logs.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            5. Your Control & Privacy Rights
                        </h2>
                        <p>
                            You have full control over your data:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-600 font-medium">
                            <li><strong>Export Data:</strong> You can export all profile settings and data as a JSON file from your Profile Page settings.</li>
                            <li><strong>Clear Cache:</strong> You can wipe all locally cached data from the browser cache via Settings.</li>
                            <li><strong>Delete Face ID:</strong> You can reset or overwrite your facial recognition data at any time.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            6. Cookies
                        </h2>
                        <p>
                            We use standard browser cookies to keep you signed in. These cookies do not track your activity on other websites and are solely used to maintain your session credentials.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            7. Changes to this Privacy Policy
                        </h2>
                        <p>
                            We reserve the right to update this policy from time to time. If we make material changes, we will notify you by updating the effective date at the top of this page.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                            8. Contact Us
                        </h2>
                        <p>
                            If you have questions about this policy or your data privacy, contact us at: <span className="font-bold text-gray-900">privacy@curriculab.io</span>.
                        </p>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span>© {new Date().getFullYear()} CurricuLab IO</span>
                    <div className="flex gap-4">
                        <a href="/terms" className="hover:text-blue-500 transition-colors">Terms & Conditions</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
