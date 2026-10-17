// src/components/alerts/AlertsListView.tsx
import React, { useState, useEffect } from 'react';
import { Megaphone, Download, Radio, CheckCircle2, AlertTriangle, Users, MapPin, RefreshCw, Send } from 'lucide-react';
import { PublicAlert } from '../../types';
import { alertStore } from '../../services/realtimeAlertStore';
import { Collapsible } from '../layout/Collapsible';

interface AlertsListViewProps {
  onSelectIncidentForAlert?: (incidentId: string) => void;
}

export const AlertsListView: React.FC<AlertsListViewProps> = () => {
  const [alerts, setAlerts] = useState<PublicAlert[]>(() => alertStore.getAlerts());

  useEffect(() => {
    return alertStore.subscribe((updated) => {
      setAlerts(updated);
    });
  }, []);

  const handleDownloadCAP = (alert: PublicAlert) => {
    alertStore.downloadCAP12XML(alert);
  };

  const handleRetryDelivery = (alertId: string) => {
    const target = alerts.find(a => a.id === alertId);
    if (!target) return;
    const updated: PublicAlert = { ...target, deliveryStatus: 'Delivered', retryCount: (target.retryCount || 0) + 1 };
    alertStore.saveAlert(updated);
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-navy-900 font-mono uppercase tracking-wider flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-teal-brand" />
            <span>Common Alerting Protocol (CAP) Dispatched Broadcasts</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active and archived public warnings broadcast to the Community Alert App via the shared realtime contract.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Shared Store Connected (&lt; 2s Sync)</span>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-400 space-y-2">
          <Megaphone className="w-10 h-10 mx-auto text-slate-300" />
          <div className="text-sm font-semibold text-slate-700">No Public Alerts Dispatched Yet</div>
          <p className="text-xs max-w-md mx-auto">
            Authorized District Emergency Operations Officers can compose, review, and dispatch CAP alerts from the incident detail panel.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(a => (
            <div key={a.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-navy-800 text-white px-2 py-0.5 rounded">
                      {a.id}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      a.tier === 'Official Warning' 
                        ? 'bg-red-100 text-red-900 border-red-200' 
                        : 'bg-amber-100 text-amber-900 border-amber-200'
                    }`}>
                      {a.tier}
                    </span>
                    {a.isAllClear && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                        All-Clear Notice
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-navy-900 text-sm mt-1.5">{a.headline}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {a.deliveryStatus}
                  </span>
                  <button
                    onClick={() => handleDownloadCAP(a)}
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Download CAP 1.2 XML Document"
                  >
                    <Download className="w-4 h-4 text-teal-brand" />
                  </button>
                </div>
              </div>

              <Collapsible title="Alert Details" defaultOpen={false}>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <div><b>Civilian Instructions:</b> {a.instruction}</div>
                <div><b>Target Zones:</b> {a.affectedZones.join(', ')} ({a.targetJurisdiction})</div>
              </div>
              </Collapsible>

              <Collapsible title="Translations" defaultOpen={false}>
              {a.translations?.ml?.headline && (
                <div className="p-2.5 rounded bg-blue-50/60 border border-blue-200 text-xs text-blue-950 space-y-0.5">
                  <div className="text-[10px] font-bold uppercase font-mono text-blue-700">Malayalam Broadcast Feed:</div>
                  <div className="font-bold">{a.translations.ml.headline}</div>
                  <div className="text-[11px] text-blue-900">{a.translations.ml.instruction}</div>
                </div>
              )}
              </Collapsible>

              <Collapsible title="Metadata" defaultOpen={false}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded">
                <div>Authorized By: <b className="text-navy-900 block">{a.authorizedBy}</b></div>
                <div>Role: <b className="text-teal-700 block">{a.authorizedRole}</b></div>
                <div>Population Reached: <b className="text-navy-900 block">~{a.estimatedPopulationReached.toLocaleString()}</b></div>
                <div>Approved: <b className="text-slate-700 block">{new Date(a.approvedAt).toLocaleTimeString()} UTC</b></div>
              </div>
              </Collapsible>

              <Collapsible title="Distribution Channels" defaultOpen={false}>
              <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono pt-1">
                <span>Distribution Channels:</span>
                {a.channels.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded bg-slate-100 border text-slate-700 font-semibold">
                    {c}
                  </span>
                ))}
              </div>
              </Collapsible>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


