
'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/services/auth.service';

export default function DebugEmailPage() {
    const [subscribers, setSubscribers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [sendResult, setSendResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchSubscribers = async () => {
        try {
            const subs = await AuthService.getSubscribers();
            setSubscribers(subs);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const sendTestEmail = async () => {
        setLoading(true);
        setSendResult(null);
        try {
            const res = await fetch('/api/notifications/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'Test',
                    title: 'Debug Email Test',
                    content: 'This is a test to verify the broadcast system is working.',
                    recipients: subscribers // Pass fetched subscribers explicitly
                })
            });
            const data = await res.json();
            setSendResult(data);
        } catch (err: any) {
            setSendResult({ error: err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    return (
        <div className="p-10 max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">📧 Email System Debugger</h1>

            <div className="p-4 border rounded bg-gray-50">
                <h2 className="font-semibold mb-2">1. Valid Recipients (from Database)</h2>
                {error ? (
                    <div className="text-red-500">Error fetching users: {error}</div>
                ) : (
                    <div>
                        <p className="text-sm text-gray-600 mb-2">
                            Found <strong>{subscribers.length}</strong> authorized users.
                        </p>
                        {subscribers.length === 0 ? (
                            <div className="text-amber-600 bg-amber-50 p-2 text-sm rounded border border-amber-200">
                                ⚠️ <strong>Warning:</strong> No users found! Emails will essentially be sent to no one (or fallback to admin).
                                <br />
                                <strong>Fix:</strong> Run the SQL script to insert users into 'authorized_users'.
                            </div>
                        ) : (
                            <ul className="list-disc pl-5 text-sm h-32 overflow-y-auto border p-2 bg-white rounded">
                                {subscribers.map(email => <li key={email}>{email}</li>)}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            <div className="p-4 border rounded bg-gray-50">
                <h2 className="font-semibold mb-2">2. Test Broadcast</h2>
                <button
                    onClick={sendTestEmail}
                    disabled={loading || subscribers.length === 0}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Send Test Broadcast'}
                </button>

                {sendResult && (
                    <div className="mt-4 p-3 bg-slate-800 text-green-400 font-mono text-xs rounded overflow-auto">
                        <pre>{JSON.stringify(sendResult, null, 2)}</pre>
                    </div>
                )}
            </div>

            <a href="/" className="block text-indigo-600 hover:underline">&larr; Back to Dashboard</a>
        </div>
    );
}
