"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { SkillForgeJournalEntry, SkillForgeMood, SkillForgeTrack } from '@/types';
import { getJournalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry, getTracks } from '@/lib/services/skillforge.service';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

const moodOptions: { value: SkillForgeMood; emoji: string; label: string }[] = [
    { value: 'excited', emoji: '🤩', label: 'Excited' },
    { value: 'focused', emoji: '🎯', label: 'Focused' },
    { value: 'motivated', emoji: '💪', label: 'Motivated' },
    { value: 'confused', emoji: '😕', label: 'Confused' },
    { value: 'tired', emoji: '😴', label: 'Tired' },
];

export function JournalTab() {
    const [entries, setEntries] = useState<SkillForgeJournalEntry[]>([]);
    const [tracks, setTracks] = useState<SkillForgeTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<SkillForgeJournalEntry | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '', content: '', keyLearnings: [] as string[],
        mood: undefined as SkillForgeMood | undefined, trackId: '', newLearning: ''
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        const [entriesData, tracksData] = await Promise.all([getJournalEntries(), getTracks()]);
        setEntries(entriesData);
        setTracks(tracksData);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const entryData = { title: formData.title, content: formData.content, keyLearnings: formData.keyLearnings, mood: formData.mood, trackId: formData.trackId || undefined };
        if (editingEntry) {
            const updated = await updateJournalEntry({ ...editingEntry, ...entryData });
            if (updated) { setEntries(entries.map(e => e.id === updated.id ? updated : e)); toast.success('Entry updated!'); }
        } else {
            const created = await createJournalEntry(entryData);
            if (created) { setEntries([created, ...entries]); toast.success('Entry created!'); }
        }
        resetForm();
    };

    const handleEdit = (entry: SkillForgeJournalEntry) => {
        setEditingEntry(entry);
        setFormData({ title: entry.title, content: entry.content, keyLearnings: entry.keyLearnings || [], mood: entry.mood, trackId: entry.trackId || '', newLearning: '' });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this journal entry?')) {
            const success = await deleteJournalEntry(id);
            if (success) { setEntries(entries.filter(e => e.id !== id)); toast.success('Entry deleted!'); }
        }
    };

    const addKeyLearning = () => {
        if (formData.newLearning.trim()) {
            setFormData({ ...formData, keyLearnings: [...formData.keyLearnings, formData.newLearning.trim()], newLearning: '' });
        }
    };

    const resetForm = () => {
        setShowModal(false); setEditingEntry(null);
        setFormData({ title: '', content: '', keyLearnings: [], mood: undefined, trackId: '', newLearning: '' });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return { day: date.getDate(), month: date.toLocaleDateString('en-US', { month: 'short' }), time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

    return (
        <div className="space-y-6 flex-1 flex flex-col h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div><h2 className="text-2xl font-bold text-gray-900">Learning Journal</h2><p className="text-gray-500 text-sm">Document your learning journey</p></div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"><Icons.Plus size={18} />New Entry</button>
            </div>

            {entries.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl">
                    <Icons.FileText size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600">No entries yet</h3>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-4 pb-4">
                        {entries.map((entry) => {
                            const dateInfo = formatDate(entry.createdAt);
                            const moodInfo = moodOptions.find(m => m.value === entry.mood);
                            const track = tracks.find(t => t.id === entry.trackId);
                            const isExpanded = expandedId === entry.id;
                            return (
                                <div key={entry.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all group">
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-gray-900">{entry.title}</h3>
                                                {moodInfo && <span className="text-lg" title={moodInfo.label}>{moodInfo.emoji}</span>}
                                                {track && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{track.icon} {track.title}</span>}
                                            </div>
                                            <span className="text-xs text-gray-400">{dateInfo.month} {dateInfo.day} • {dateInfo.time}</span>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                            <button onClick={() => handleEdit(entry)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Icons.Edit size={14} className="text-gray-400" /></button>
                                            <button onClick={() => handleDelete(entry.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Icons.Trash2 size={14} className="text-red-400" /></button>
                                        </div>
                                    </div>
                                    <div className={cn("prose prose-sm max-w-none text-gray-600", !isExpanded && "line-clamp-3")}><ReactMarkdown>{entry.content}</ReactMarkdown></div>
                                    {entry.content.length > 200 && <button onClick={() => setExpandedId(isExpanded ? null : entry.id)} className="text-sm text-green-600 font-medium mt-2 hover:underline">{isExpanded ? 'Show less' : 'Read more'}</button>}
                                    {entry.keyLearnings?.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-50">
                                            <div className="flex flex-wrap gap-2">{entry.keyLearnings.map((l, i) => <span key={i} className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">💡 {l}</span>)}</div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold">{editingEntry ? 'Edit Entry' : 'New Entry'}</h3>
                            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-xl"><Icons.X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200" placeholder="Title" />
                            <div className="flex gap-2">{moodOptions.map(m => <button key={m.value} type="button" onClick={() => setFormData({ ...formData, mood: formData.mood === m.value ? undefined : m.value })} className={cn("w-10 h-10 rounded-xl text-xl", formData.mood === m.value ? "bg-green-100 ring-2 ring-green-500" : "bg-gray-100")}>{m.emoji}</button>)}</div>
                            <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={6} className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none" placeholder="Write your thoughts..." />
                            <div className="flex gap-2"><input type="text" value={formData.newLearning} onChange={e => setFormData({ ...formData, newLearning: e.target.value })} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addKeyLearning())} className="flex-1 px-4 py-2 rounded-xl border" placeholder="Key learning" /><button type="button" onClick={addKeyLearning} className="px-4 py-2 bg-green-100 text-green-700 rounded-xl">Add</button></div>
                            <div className="flex flex-wrap gap-2">{formData.keyLearnings.map((l, i) => <span key={i} className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center gap-2">💡 {l}<button type="button" onClick={() => setFormData({ ...formData, keyLearnings: formData.keyLearnings.filter((_, idx) => idx !== i) })}><Icons.X size={14} /></button></span>)}</div>
                            <div className="flex gap-3 pt-4"><button type="button" onClick={resetForm} className="flex-1 px-4 py-3 border rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl">{editingEntry ? 'Update' : 'Save'}</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
