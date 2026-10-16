// src/components/modules/PostIncidentLogsView.tsx
import React, { useState } from 'react';
import { FileText, Download, Filter, Search, History, CheckCircle2, XCircle, Megaphone } from 'lucide-react';
import { Incident } from '../../types';

interface PostIncidentLogsViewProps {
  incidents: Incident[];
}

export const PostIncidentLogsView: React.FC<PostIncidentLogsViewProps> = ({ incidents }) => {
  const [filterAction, setFilterAction] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Collect all audit entries across all incidents
  const allEntries = incidents.flatMap(inc =>
    inc.auditTrail.map(entry => ({
      ...entry,
      incidentId: inc.id,
      incidentTitle: inc.title,
      hazardType: inc.hazardType,
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredEntries = allEntries.filter(entry => {
    if (filterAction !== 'all' && entry.action !== filterAction) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        entry.incidentId.toLowerCase().includes(q) ||
        entry.actor.toLowerCase().includes(q) ||
        (entry.notes && entry.notes.toLowerCase().includes(q)) ||
        (entry.reason && entry.reason.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ["Timestamp", "Incident ID", "Action", "Actor", "Role", "Previous Status", "New Status", "Rationale / Notes"];
    const rows = filteredEntries.map(e => [
      e.timestamp,
      e.incidentId,
      e.action,
      e.actor,
      e.role,
      e.previousStatus || '',
      e.newStatus || '',
      `"${(e.reason || e.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sentinel_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto select-none">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-navy-800 font-mono uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-brand" />
            <span>Post-Incident Logs & EOC Audit Archive</span>
          </h2>
          <p className="text-xs text-slate-500">
            Immutable chronological transaction log for incident review, statutory compliance, and after-action reporting.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-900 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Download className="w-4 h-4 text-teal-300" />
          <span>Export ICS-209 Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search by incident, actor, or rationale..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-1.5 rounded border border-slate-300 text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-500">Action:</span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="p-1.5 rounded border border-slate-300 bg-white text-slate-800"
          >
            <option value="all">All Actions ({allEntries.length})</option>
            <option value="Detected">Detected</option>
            <option value="Review Started">Review Started</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
            <option value="Annotated">Annotated</option>
            <option value="Unit Assigned">Unit Assigned</option>
            <option value="Alert Approved">Alert Approved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
              <th className="p-3">Timestamp (UTC)</th>
              <th className="p-3">Incident</th>
              <th className="p-3">Action</th>
              <th className="p-3">Actor & Role</th>
              <th className="p-3">State Transition</th>
              <th className="p-3">Operational Notes / Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEntries.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                  {new Date(e.timestamp).toUTCString().replace('GMT', 'UTC')}
                </td>
                <td className="p-3 font-mono font-bold text-navy-900 whitespace-nowrap">
                  {e.incidentId}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    e.action === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                    e.action === 'Rejected' ? 'bg-red-100 text-red-800' :
                    e.action === 'Alert Approved' ? 'bg-purple-100 text-purple-900' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {e.action}
                  </span>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span className="font-semibold text-slate-800">{e.actor}</span>
                  <span className="text-[10px] text-slate-400 font-mono block">[{e.role}]</span>
                </td>
                <td className="p-3 font-mono text-[10px] text-slate-600 whitespace-nowrap">
                  {e.previousStatus && e.newStatus ? `${e.previousStatus} → ${e.newStatus}` : '—'}
                </td>
                <td className="p-3 text-slate-700 text-xs max-w-md">
                  {e.reason || e.notes || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
