"use client"

import React, { useState } from 'react';
import { Icons } from '@/components/shared/Icons';

interface TelegramLoginProps {
    onLoginSuccess: () => void;
}

export function TelegramLogin({ onLoginSuccess }: TelegramLoginProps) {
    const [step, setStep] = useState<'phone' | 'code' | 'password'>('phone');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [phoneCodeHash, setPhoneCodeHash] = useState('');
    const [tempSession, setTempSession] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendCode = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/community/telegram/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'send_code', phone }),
            });
            const data = await res.json();

            if (data.success) {
                setPhoneCodeHash(data.phoneCodeHash);
                setStep('code');
            } else {
                setError(data.error || 'Failed to send code.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/community/telegram/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'sign_in',
                    phone,
                    code,
                    phoneCodeHash,
                    password: password || undefined
                }),
            });
            const data = await res.json();

            if (data.success) {
                onLoginSuccess();
            } else {
                if (data.error.includes('SESSION_PASSWORD_NEEDED')) {
                    setStep('password');
                } else {
                    setError(data.error || 'Failed to sign in.');
                }
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-6 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 text-blue-600">
                <Icons.Send size={40} />
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-2">Connect Telegram</h2>
            <p className="text-gray-500 mb-8">
                Log in with your phone number to access the community forum.
            </p>

            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold w-full mb-6 flex items-center gap-2">
                    <Icons.AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="w-full space-y-4">
                {step === 'phone' && (
                    <>
                        <input
                            type="tel"
                            placeholder="Phone Number (e.g., +1234567890)"
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <button
                            onClick={handleSendCode}
                            disabled={isLoading || !phone}
                            className="w-full h-12 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Icons.Loader2 className="animate-spin" /> : 'Send Code'}
                        </button>
                    </>
                )}

                {(step === 'code' || step === 'password') && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter Code from Telegram App"
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-center tracking-widest"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={step === 'password'}
                        />
                        {step === 'password' && (
                            <input
                                type="password"
                                placeholder="Two-Step Verification Password"
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        )}

                        <button
                            onClick={handleSignIn}
                            disabled={isLoading || !code}
                            className="w-full h-12 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Icons.Loader2 className="animate-spin" /> : (step === 'password' ? 'Unlock' : 'Verify & Sign In')}
                        </button>
                    </>
                )}
            </div>

            <div className="mt-8 text-xs text-gray-400 font-medium">
                <p>We do not store your password. Your session key is encrypted.</p>
            </div>
        </div>
    );
}
