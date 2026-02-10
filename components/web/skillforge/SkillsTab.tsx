"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { SkillForgeSkill, SkillForgeProficiency } from '@/types';
import { getSkills, createSkill, updateSkill, deleteSkill } from '@/lib/services/skillforge.service';
import { toast } from 'sonner';

const proficiencyOptions: { value: SkillForgeProficiency; label: string; color: string; percent: number }[] = [
    { value: 'beginner', label: 'Beginner', color: 'bg-blue-100 text-blue-700', percent: 25 },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700', percent: 50 },
    { value: 'advanced', label: 'Advanced', color: 'bg-orange-100 text-orange-700', percent: 75 },
    { value: 'expert', label: 'Expert', color: 'bg-purple-100 text-purple-700', percent: 100 },
];

const categoryOptions = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Languages', 'Soft Skills', 'Other'];

export function SkillsTab() {
    const [skills, setSkills] = useState<SkillForgeSkill[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSkill, setEditingSkill] = useState<SkillForgeSkill | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [formData, setFormData] = useState({
        name: '', category: 'Programming', proficiencyLevel: 'beginner' as SkillForgeProficiency, trackIds: [] as string[], notes: ''
    });

    useEffect(() => { loadSkills(); }, []);

    const loadSkills = async () => {
        setLoading(true);
        const data = await getSkills();
        setSkills(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSkill) {
            const updated = await updateSkill({ ...editingSkill, ...formData });
            if (updated) { setSkills(skills.map(s => s.id === updated.id ? updated : s)); toast.success('Skill updated!'); }
        } else {
            const created = await createSkill(formData);
            if (created) { setSkills([created, ...skills]); toast.success('Skill added!'); }
        }
        resetForm();
    };

    const handleEdit = (skill: SkillForgeSkill) => {
        setEditingSkill(skill);
        setFormData({ name: skill.name, category: skill.category, proficiencyLevel: skill.proficiencyLevel, trackIds: skill.trackIds || [], notes: skill.notes || '' });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this skill?')) {
            const success = await deleteSkill(id);
            if (success) { setSkills(skills.filter(s => s.id !== id)); toast.success('Skill deleted!'); }
        }
    };

    const handleProficiencyChange = async (skill: SkillForgeSkill, newLevel: SkillForgeProficiency) => {
        const updated = await updateSkill({ ...skill, proficiencyLevel: newLevel });
        if (updated) { setSkills(skills.map(s => s.id === updated.id ? updated : s)); toast.success('Proficiency updated!'); }
    };

    const resetForm = () => {
        setShowModal(false); setEditingSkill(null);
        setFormData({ name: '', category: 'Programming', proficiencyLevel: 'beginner', trackIds: [], notes: '' });
    };

    const filteredSkills = skills.filter(s => categoryFilter === 'all' || s.category === categoryFilter);
    const groupedByCategory = filteredSkills.reduce((acc, s) => {
        if (!acc[s.category]) acc[s.category] = [];
        acc[s.category].push(s);
        return acc;
    }, {} as Record<string, SkillForgeSkill[]>);

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>;

    return (
        <div className="space-y-6 flex-1 flex flex-col h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div><h2 className="text-2xl font-bold text-gray-900">Skills Tracker</h2><p className="text-gray-500 text-sm">Track and level up your skills</p></div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"><Icons.Plus size={18} />Add Skill</button>
            </div>

            <div className="flex flex-wrap gap-2">
                <button onClick={() => setCategoryFilter('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", categoryFilter === 'all' ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600")}>All</button>
                {categoryOptions.map(cat => (
                    <button key={cat} onClick={() => setCategoryFilter(cat)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", categoryFilter === cat ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600")}>{cat}</button>
                ))}
            </div>

            {filteredSkills.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl">
                    <Icons.Trophy size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600">No skills tracked yet</h3>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-6 pb-4">
                        {Object.entries(groupedByCategory).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{category}</h3>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {items.map(skill => {
                                        const profInfo = proficiencyOptions.find(p => p.value === skill.proficiencyLevel);
                                        return (
                                            <div key={skill.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all group">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{skill.name}</h4>
                                                        <span className={cn("text-xs px-2 py-0.5 rounded-full inline-block mt-1", profInfo?.color)}>{profInfo?.label}</span>
                                                    </div>
                                                    <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                                                        <button onClick={() => handleEdit(skill)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Icons.Edit size={14} className="text-gray-400" /></button>
                                                        <button onClick={() => handleDelete(skill.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Icons.Trash2 size={14} className="text-red-400" /></button>
                                                    </div>
                                                </div>

                                                <div className="mb-2">
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-purple-600 transition-all" style={{ width: `${profInfo?.percent}%` }}></div>
                                                    </div>
                                                </div>

                                                <select value={skill.proficiencyLevel} onChange={(e) => handleProficiencyChange(skill, e.target.value as SkillForgeProficiency)} className="w-full text-xs px-2 py-1 border border-gray-200 rounded-lg">
                                                    {proficiencyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                </select>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold">{editingSkill ? 'Edit Skill' : 'Add Skill'}</h3>
                            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-xl"><Icons.X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200" placeholder="Skill name" />
                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200">
                                {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency Level</label>
                                <div className="space-y-2">
                                    {proficiencyOptions.map(opt => (
                                        <button key={opt.value} type="button" onClick={() => setFormData({ ...formData, proficiencyLevel: opt.value })} className={cn("w-full text-left px-4 py-2 rounded-xl border-2 transition-all", formData.proficiencyLevel === opt.value ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-gray-300")}>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{opt.label}</span>
                                                <span className="text-xs text-gray-500">{opt.percent}%</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none" placeholder="Notes..." />
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={resetForm} className="flex-1 px-4 py-3 border rounded-xl">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl">{editingSkill ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
