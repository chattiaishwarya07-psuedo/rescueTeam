// src/components/modules/CommsRelayView.tsx
import React from 'react';
import { Radio, Megaphone, CheckCircle2, Clock, Users, ShieldAlert, Wifi } from 'lucide-react';
import { Incident } from '../../types';

interface CommsRelayViewProps {
  incidents: Incident[];
  onOpenAlertModal: (incident: Incident) => void;
}

export const CommsRelayView: React.FC<CommsRelayViewProps> = ({ incidents, onOpenAlertModal }) => {
  const alertsList = incidents
    .filter(i => i.publicAlert)
    .map(i => i.publicAlert!);

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto select-none">
      <div>
        <h2 className="text-lg font-bold text-navy-800 font-mono uppercase tracking-wider flex items-center gap-2">
          <Radio className="w-5 h-5 text-teal-brand" />
          <span>Emergency Communications & Public Warning Relay</span>
        </h2>
        <p className="text-xs text-slate-500">
          Dispatched Common Alerting Protocol (CAP) broadcasts, cellular transmission nodes, and EAS status.
        </p>
      </div>

      {alertsList.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-400 space-y-2">
          <Megaphone className="w-10 h-10 mx-auto text-slate-300" />
          <div className="text-sm font-semibold text-slate-700">No Public Alerts Dispatched Yet</div>
          <p className="text-xs max-w-md mx-auto">
            Authorized Approvers can approve and release CAP emergency alerts from the Incident Overview or Investigation Panel.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertsList.map(alert => (
            <div key={alert.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-navy-800 text-white px-2 py-0.5 rounded">
                      {alert.id}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
                      {alert.urgency} / {alert.severity}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy-900 text-sm mt-1.5">{alert.headline}</h3>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {alert.deliveryStatus}
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <div><b>Actionable Instruction:</b> {alert.instruction}</div>
                <div><b>Target Zone:</b> {alert.affectedZoneName} ({alert.targetJurisdiction})</div>
                <div><b>Impact Window:</b> {alert.expectedImpactWindow}</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded">
                <div>Authorized By: <b className="text-navy-900 block">{alert.authorizedBy}</b></div>
                <div>Role: <b className="text-teal-700 block">{alert.authorizedRole}</b></div>
                <div>Towers Triggered: <b className="text-navy-900 block">{alert.deliveryMetrics?.towersTriggered} Nodes</b></div>
                <div>Acks Received: <b className="text-emerald-700 block">{alert.deliveryMetrics?.receiptAcks?.toLocaleString()} Clients</b></div>
              </div>

              <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono pt-1">
                <span>Broadcast Distribution Channels:</span>
                {alert.channels.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded bg-slate-100 border text-slate-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
