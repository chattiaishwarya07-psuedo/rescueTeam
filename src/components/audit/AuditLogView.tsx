// src/components/audit/AuditLogView.tsx
import React, { useState } from 'react';
import { History, Download, Search, Filter, Lock, CheckCircle2, XCircle, Megaphone } from 'lucide-react';
import { Incident } from '../../types';

interface AuditLogViewProps {
  incidents: Incident[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ incidents }) => {
  const [filterAction, setFilterAction] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Collect all audit entries across all incidents
  const allEntries = incidents.flatMap(inc => 
    inc.auditTrail.map(entry => ({
      ...entry,
      incidentId: inc.id,
      incidentTitle: inc.title,
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filtered = allEntries.filter(e => {
    if (filterAction !== 'all' && e.action !== filterAction) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        e.incidentId.toLowerCase().includes(q) ||
        e.actor.toLowerCase().includes(q) ||
        (e.note && e.note.toLowerCase().includes(q)) ||
        (e.reason && e.reason.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ["Timestamp (UTC)", "Incident ID", "Action", "Actor", "Role", "Target", "Previous Status", "New Status", "Note / Rationale"];
    const rows = filtered.map(e => [
      e.timestamp,
      e.incidentId,
      e.action,
      `"${e.actor}"`,
      e.role,
      e.target,
      e.previousStatus || '',
      e.newStatus || '',
      `"${(e.reason || e.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sentinel_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-navy-900 font-mono uppercase tracking-wider flex items-center gap-2">
            <History className="w-5 h-5 text-teal-brand" />
            <span>Immutable Emergency Operations Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic ledger tracking all responder reviews, status transitions, and public emergency warning releases.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-900 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Download className="w-4 h-4 text-teal-300" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center gap-3 text-xs shadow-xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, responder, or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-teal-brand"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-medium">Filter Action:</span>
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
            <option value="Alert Approved">Alert Approved</option>
            <option value="All-Clear Sent">All-Clear Sent</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
              <th className="p-3">Time (UTC)</th>
              <th className="p-3">Actor & Role</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target</th>
              <th className="p-3">Note / Recorded Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                  No audit entries found matching filters.
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    {new Date(e.timestamp).toUTCString().replace('GMT', 'UTC')}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="font-semibold text-navy-900">{e.actor}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">[{e.role}]</span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      e.action === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      e.action === 'Rejected' ? 'bg-red-100 text-red-800' :
                      e.action === 'Alert Approved' ? 'bg-purple-100 text-purple-900' :
                      e.action === 'All-Clear Sent' ? 'bg-blue-100 text-blue-900' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {e.action}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-navy-900 whitespace-nowrap">
                    {e.target}
                  </td>
                  <td className="p-3 text-slate-700 leading-snug max-w-md">
                    {e.reason || e.note || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
