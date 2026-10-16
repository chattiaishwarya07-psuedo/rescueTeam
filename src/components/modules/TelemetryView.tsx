// src/components/modules/TelemetryView.tsx
import React from 'react';
import { Satellite, Activity, Radio, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { TelemetryFeed } from '../../types';

interface TelemetryViewProps {
  feeds: TelemetryFeed[];
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({ feeds }) => {
  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto select-none">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-navy-800 font-mono uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-brand" />
            <span>Telemetry, Satellite Ingestion & Sensor Networks</span>
          </h2>
          <p className="text-xs text-slate-500">
            Sensor telemetry status, constellation downlink health, and ground hydro-meteorological sensors.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-white p-1.5 rounded border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-teal-brand" />
          <span>System Sync: 2026-10-16 19:05 UTC</span>
        </div>
      </div>

      {/* Orbit Schedule Banner */}
      <div className="p-3 bg-navy-800 text-white rounded-lg border border-navy-700 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <Satellite className="w-6 h-6 text-teal-400 shrink-0" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider font-mono">
              Next Scheduled Constellation Pass
            </div>
            <div className="text-sm font-semibold text-teal-200">
              JPSS-2 / NOAA-21 VIIRS Thermal Pass at 21:14 UTC (1h 09m remaining)
            </div>
          </div>
        </div>
        <div className="text-xs font-mono bg-navy-900 px-3 py-1.5 rounded border border-navy-700 text-slate-300">
          Downlink Node: Fairbanks CDA Station (Alaska)
        </div>
      </div>

      {/* Feeds Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-navy-800 uppercase font-mono tracking-wider">
          Configured Sensor Feeds ({feeds.length})
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {feeds.map(feed => (
            <div key={feed.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
              <div className="space-y-1 md:max-w-md">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-navy-900 text-sm">{feed.name}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                    {feed.sourceType}
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-mono">{feed.satelliteOrStation}</div>
                <div className="text-[11px] text-slate-500">{feed.operationalNotes}</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[11px] text-slate-600 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Last Obs:</span>
                  <span>{new Date(feed.lastObservationTime).toLocaleTimeString()} UTC</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Latency:</span>
                  <span className={`font-bold ${feed.status === 'Current' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {feed.latencyMinutes}m (Exp: {feed.expectedIntervalMinutes}m)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Status:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    feed.status === 'Current' ? 'bg-emerald-100 text-emerald-800' :
                    feed.status === 'Delayed' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {feed.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
