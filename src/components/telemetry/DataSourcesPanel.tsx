// src/components/telemetry/DataSourcesPanel.tsx
import React from 'react';
import { Satellite, X, Clock, AlertTriangle, CheckCircle2, RefreshCw, Activity, Radio, AlertOctagon } from 'lucide-react';
import { TelemetryFeed } from '../../types';

interface DataSourcesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  feeds: TelemetryFeed[];
}

export const DataSourcesPanel: React.FC<DataSourcesPanelProps> = ({
  isOpen,
  onClose,
  feeds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-xs flex justify-end z-50 select-none">
      <div className="bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col border-l border-slate-300 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-navy-800 text-white p-4 flex items-center justify-between border-b border-navy-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-brand/20 border border-teal-brand flex items-center justify-center text-teal-300">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm uppercase tracking-wider font-mono">
                Data Sources & Telemetry Revisit Health
              </div>
              <div className="text-[11px] text-teal-300">
                Satellite Orbits, Ground Gauges & Sensor Freshness
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Revisit Policy Notice */}
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-950 leading-relaxed flex items-start space-x-2">
          <AlertOctagon className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <b>Freshness Benchmark:</b> Feeds are classified as <b>Stale</b> when data age exceeds 2× the sensor's typical revisit interval. Whenever an incident relies on a stale feed, an amber warning banner is shown in the detail panel and on the map.
          </span>
        </div>

        {/* Table of Feeds */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                  <th className="p-3">Feed Name</th>
                  <th className="p-3">Satellite / Source</th>
                  <th className="p-3">Last Observed</th>
                  <th className="p-3">Last Ingested</th>
                  <th className="p-3">Typical Revisit</th>
                  <th className="p-3">Next Expected</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feeds.map((feed) => {
                  const isStale = feed.status === 'Stale';
                  const isDelayed = feed.status === 'Delayed';

                  return (
                    <tr 
                      key={feed.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isStale ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <td className="p-3 font-semibold text-navy-900">
                        <div>{feed.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal font-mono">{feed.id}</div>
                      </td>
                      <td className="p-3 text-slate-600 font-mono text-[11px]">
                        {feed.satelliteOrStation}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                        {new Date(feed.lastObservationTime).toLocaleTimeString()} UTC
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                        {new Date(feed.lastIngestedTime).toLocaleTimeString()} UTC
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">
                        {feed.typicalRevisit}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">
                        {feed.nextExpected}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                          feed.status === 'Fresh' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          feed.status === 'Delayed' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          'bg-amber-200 text-amber-900 border-amber-400'
                        }`}>
                          {feed.status === 'Fresh' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {isStale && <AlertTriangle className="w-3 h-3 text-amber-800" />}
                          <span>{feed.status}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Operational Notes Below Table */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-navy-900 text-[11px] uppercase font-mono">
              Constellation Notes & Constraints:
            </div>
            <p>
              • <b>Sentinel-1 SAR:</b> Replay session contains a single high-coherence pass calibrated at T0. In continuous operations, constellation repeat cycle is 6–12 days.
            </p>
            <p>
              • <b>Sentinel-2 MSI:</b> Optical pass currently flagged stale due to 88% cloud cover over Ernakulam catchment.
            </p>
            <p>
              • <b>NASA FIRMS:</b> Last detection pass over Western Ghats was 7 hours ago; next pass scheduled at 03:40 UTC.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <span className="font-mono text-[11px]">System Time: 2026-10-17 02:00:00 UTC</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-navy-800 text-white font-semibold hover:bg-navy-900"
          >
            Close Feed Panel
          </button>
        </div>
      </div>
    </div>
  );
};
