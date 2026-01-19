import React from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, getDay } from 'date-fns';
import { AttendanceLog } from '@/lib/services/attendance-service';
import { Subject } from '@/types';

interface AttendanceLogsTableProps {
    logs: AttendanceLog[];
    currentMonth: Date;
    onMonthChange: (date: Date) => void;
    filterSubject: string;
    onFilterSubjectChange: (sub: string) => void;
    filterStatus: string;
    onFilterStatusChange: (status: string) => void;
    subjects: Subject[];
    selectedLogs: Set<string>;
    onToggleSelectLog: (id: string) => void;
    onToggleSelectAll: () => void;
    onDeleteLog: (id: string) => void;
    onBulkDelete: () => void;
}

export function AttendanceLogsTable({
    logs,
    currentMonth,
    onMonthChange,
    filterSubject,
    onFilterSubjectChange,
    filterStatus,
    onFilterStatusChange,
    subjects,
    selectedLogs,
    onToggleSelectLog,
    onToggleSelectAll,
    onDeleteLog,
    onBulkDelete
}: AttendanceLogsTableProps) {

    // Filter logs based on criteria
    const filteredLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        const matchesMonth = logDate.getMonth() === currentMonth.getMonth() && logDate.getFullYear() === currentMonth.getFullYear();
        if (!matchesMonth) return false;
        if (filterSubject !== 'All' && log.subjectId !== filterSubject) return false;
        if (filterStatus !== 'All' && log.status !== filterStatus) return false;
        return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort desc

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Calculate monthly stats from filtered logs (or all logs for this month if no filters?)
    // Layout implies showing stats for the *filtered* view usually, or total for month.
    // Let's stick to simple counts from the filtered list for now or recalculate for the whole month if needed.
    // The original code calculated 'totalClasses', 'present', 'absent' from 'monthDays' logic which is complex.
    // For simplicity of this component, let's just show what we have in logs.

    // Actually, checking original Logic: it iterates `monthDays` and tries to find a log for each day?
    // No, the table view iterates `filteredLogs`.

    const monthlyTotal = filteredLogs.length;
    const monthlyPresent = filteredLogs.filter(l => l.status === 'Present').length;
    const monthlyAbsent = filteredLogs.filter(l => l.status === 'Absent').length;
    const monthlyCanceled = filteredLogs.filter(l => l.status === 'Canceled').length;

    const handleExportCSV = () => {
        const headers = ['Date', 'Subject', 'Status', 'Time Logged'];
        const rows = filteredLogs.map(log => [
            format(new Date(log.date), 'yyyy-MM-dd'),
            log.subjectName,
            log.status,
            format(new Date(log.createdAt), 'HH:mm:ss')
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `attendance_logs_${format(currentMonth, 'MM_yyyy')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm mt-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-xl text-gray-900">Attendance Logs</h3>
                    <p className="text-xs text-gray-400 mt-1">Showing {filteredLogs.length} record(s) for {format(currentMonth, 'MMMM yyyy')}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onMonthChange(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Previous month"
                    >
                        <Icons.ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => onMonthChange(new Date())}
                        className="px-3 py-1 text-xs font-bold hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => onMonthChange(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Next month"
                    >
                        <Icons.ChevronRight size={18} />
                    </button>
                    <select
                        value={filterSubject}
                        onChange={(e) => onFilterSubjectChange(e.target.value)}
                        className="px-3 py-2 bg-gray-50 border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="All">All Subjects</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => onFilterStatusChange(e.target.value)}
                        className="px-3 py-2 bg-gray-50 border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="All">All Status</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Canceled">Canceled</option>
                    </select>
                    {selectedLogs.size > 0 && (
                        <button
                            onClick={onBulkDelete}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                        >
                            Delete ({selectedLogs.size})
                        </button>
                    )}
                    <button
                        onClick={handleExportCSV}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                        title="Export CSV"
                    >
                        <Icons.Download size={18} />
                    </button>
                </div>
            </div>

            {/* Summary Row */}
            <div className="flex gap-4 mb-6">
                <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</span>
                    <span className="ml-2 text-sm font-black text-gray-900">{monthlyTotal}</span>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                    <span className="text-xs text-green-600 uppercase font-bold tracking-wider">Present</span>
                    <span className="ml-2 text-sm font-black text-green-700">{monthlyPresent}</span>
                </div>
                <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                    <span className="text-xs text-red-600 uppercase font-bold tracking-wider">Absent</span>
                    <span className="ml-2 text-sm font-black text-red-700">{monthlyAbsent}</span>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-xl border border-gray-200">
                    <span className="text-xs text-gray-600 uppercase font-bold tracking-wider">Canceled</span>
                    <span className="ml-2 text-sm font-black text-gray-700">{monthlyCanceled}</span>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-4 py-3 font-medium text-gray-400 w-10">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
                                    checked={filteredLogs.length > 0 && selectedLogs.size === filteredLogs.length}
                                    onChange={onToggleSelectAll}
                                />
                            </th>
                            <th className="px-4 py-3 font-medium text-gray-400">Date</th>
                            <th className="px-4 py-3 font-medium text-gray-400">Subject</th>
                            <th className="px-4 py-3 font-medium text-gray-400">Status</th>
                            <th className="px-4 py-3 font-medium text-gray-400">Logged At</th>
                            <th className="px-4 py-3 font-medium text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredLogs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Icons.Calendar size={32} className="text-gray-200" />
                                        <p>No attendance logs found for this period</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
                                            checked={selectedLogs.has(log.id)}
                                            onChange={() => onToggleSelectLog(log.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {format(new Date(log.date), 'MMM d, yyyy')}
                                        <span className="text-xs text-gray-400 font-normal ml-1">({format(new Date(log.date), 'EEE')})</span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-700">{log.subjectName}</td>
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-lg text-xs font-bold",
                                            log.status === 'Present' ? "bg-green-50 text-green-700" :
                                                log.status === 'Absent' ? "bg-red-50 text-red-700" :
                                                    "bg-gray-100 text-gray-600"
                                        )}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">
                                        {format(new Date(log.createdAt), 'h:mm a')}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => onDeleteLog(log.id)}
                                            className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Log"
                                        >
                                            <Icons.Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
