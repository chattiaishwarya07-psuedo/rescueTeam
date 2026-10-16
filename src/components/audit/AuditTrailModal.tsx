// src/components/audit/AuditTrailModal.tsx
import React from 'react';
import { History, X, Shield, Clock, User, CheckCircle2, XCircle, Megaphone, FileText, Lock } from 'lucide-react';
import { Incident } from '../../types';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  incident,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden select-none">
        {/* Header */}
        <div className="bg-navy-800 text-white p-4 flex items-center justify-between border-b border-navy-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-brand/30 border border-teal-brand flex items-center justify-center text-teal-300">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide uppercase font-mono">
                Immutable Incident Activity Log & Audit Trail
              </div>
              <div className="text-[11px] text-teal-300 font-mono">
                Incident: {incident.id} • {incident.title}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype disclaimer banner as instructed */}
        <div className="p-2.5 bg-slate-100 border-b border-slate-200 text-[11px] text-slate-600 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>
            <b>Security Note:</b> Prototype records changes in local component state & browser storage. In production, this audit log connects to an append-only cryptographic event store.
          </span>
        </div>

        {/* Audit Trail Timeline */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {incident.auditTrail.length === 0 ? (
            <div className="text-center py-8 text-slate-400 italic">
              No audit entries recorded.
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {incident.auditTrail.map((entry) => {
                const isConfirmed = entry.action === 'Confirmed';
                const isRejected = entry.action === 'Rejected';
                const isAlert = entry.action === 'Alert Approved';

                return (
                  <div key={entry.id} className="relative">
                    {/* Dot on timeline */}
                    <div className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                      isConfirmed ? 'bg-emerald-600' :
                      isRejected ? 'bg-red-600' :
                      isAlert ? 'bg-purple-600' : 'bg-teal-brand'
                    }`} />

                    <div className="bg-slate-50/80 rounded-lg border border-slate-200 p-3 space-y-1.5 hover:border-slate-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                            isConfirmed ? 'bg-emerald-100 text-emerald-800' :
                            isRejected ? 'bg-red-100 text-red-800' :
                            isAlert ? 'bg-purple-100 text-purple-900' : 'bg-slate-200 text-slate-800'
                          }`}>
                            {entry.action}
                          </span>
                          <span className="font-semibold text-navy-900">
                            {entry.actor}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ({entry.role})
                          </span>
                        </div>

                        <span className="font-mono text-[11px] text-slate-500">
                          {new Date(entry.timestamp).toLocaleTimeString()} UTC
                        </span>
                      </div>

                      {entry.previousStatus && entry.newStatus && (
                        <div className="text-[11px] text-slate-600 font-mono flex items-center gap-1">
                          <span>Transition:</span>
                          <span className="px-1.5 py-0.2 bg-slate-200 rounded">{entry.previousStatus}</span>
                          <span>→</span>
                          <span className="px-1.5 py-0.2 bg-teal-100 text-teal-900 rounded font-bold">{entry.newStatus}</span>
                        </div>
                      )}

                      {entry.reason && (
                        <div className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-200 mt-1">
                          <b>Rationale / Explanation:</b> {entry.reason}
                        </div>
                      )}

                      {entry.notes && !entry.reason && (
                        <p className="text-slate-600 text-xs mt-1">
                          {entry.notes}
                        </p>
                      )}

                      {entry.details && (
                        <div className="mt-2 text-[10px] bg-slate-100 p-2 rounded font-mono text-slate-700 space-y-0.5">
                          <div>Alert ID: <b>{entry.details.alertId}</b></div>
                          <div>Target Zone: <b>{entry.details.zone}</b></div>
                          <div>Broadcast Channels: <b>{entry.details.channels?.join(', ')}</b></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-navy-800 text-white font-semibold hover:bg-navy-900"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
