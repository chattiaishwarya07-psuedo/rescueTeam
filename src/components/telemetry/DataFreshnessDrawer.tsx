// src/components/telemetry/DataFreshnessDrawer.tsx
import React from 'react';
import { Satellite, X, Clock, AlertTriangle, CheckCircle2, RefreshCw, Activity, Radio } from 'lucide-react';
import { TelemetryFeed } from '../../types';

interface DataFreshnessDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  feeds: TelemetryFeed[];
}

export const DataFreshnessDrawer: React.FC<DataFreshnessDrawerProps> = ({
  isOpen,
  onClose,
  feeds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-end z-50">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-300 select-none animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-navy-800 text-white p-4 flex items-center justify-between border-b border-navy-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-brand/20 border border-teal-brand flex items-center justify-center text-teal-300">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm uppercase tracking-wider font-mono">
                Satellite & Telemetry Ingestion Health
              </div>
              <div className="text-[11px] text-slate-300">
                Data Freshness, Sensor Orbit Latency & Pipeline Status
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice on Real Satellite Geometry vs Continuous Streaming */}
        <div className="p-3 bg-blue-50 border-b border-blue-200 text-xs text-blue-900 leading-relaxed">
          <b>Operational Data Model:</b> Polar-orbiting SAR and optical satellites do not stream continuously; their observations are tied to sun-synchronous revisit intervals (typically 1–12 days or 1 hour regional downlinks). Data age is benchmarked against expected sensor pass schedules.
        </div>

        {/* Feeds List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {feeds.map((feed) => {
            const isDelayedOrStale = feed.status === 'Delayed' || feed.status === 'Stale';

            return (
              <div
                key={feed.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  isDelayedOrStale
                    ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <div className="font-bold text-navy-900 text-xs flex items-center gap-1.5">
                      <span>{feed.name}</span>
                      <span className="text-[10px] font-mono font-normal text-slate-500">
                        [{feed.sourceType}]
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      {feed.satelliteOrStation}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                    feed.status === 'Current' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    feed.status === 'Delayed' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    feed.status === 'Stale' ? 'bg-orange-100 text-orange-900 border-orange-300' :
                    'bg-red-100 text-red-800 border-red-300'
                  }`}>
                    {feed.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mt-2 bg-slate-50/80 p-2 rounded">
                  <div>
                    <span className="text-slate-400">Last Observation:</span>
                    <div className="font-mono text-slate-800">
                      {new Date(feed.lastObservationTime).toUTCString().replace('GMT', 'UTC')}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Ingested At:</span>
                    <div className="font-mono text-slate-800">
                      {new Date(feed.lastSuccessfulUpdate).toLocaleTimeString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Expected Interval:</span>
                    <div className="font-mono text-slate-800">
                      Every {feed.expectedIntervalMinutes} mins
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Calculated Latency:</span>
                    <div className={`font-mono font-bold ${isDelayedOrStale ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {feed.latencyMinutes} minutes
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">Resolution / Mode:</span> {feed.resolutionOrSensors}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 italic">
                  Notes: {feed.operationalNotes}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <span className="font-mono text-[11px]">Time Anchor: 2026-10-16 19:05:00 UTC</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-navy-800 text-white font-semibold hover:bg-navy-900"
          >
            Close Feed Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
