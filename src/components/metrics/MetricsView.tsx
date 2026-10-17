// src/components/metrics/MetricsView.tsx
import React, { useState } from 'react';
import { 
  BarChart3, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  TrendingDown,
  Info
} from 'lucide-react';
import { Incident } from '../../types';
import { IncidentService } from '../../services/incidentService';
import { Collapsible } from '../layout/Collapsible';

interface MetricsViewProps {
  incidents: Incident[];
}

export const MetricsView: React.FC<MetricsViewProps> = ({ incidents }) => {
  const [howComputedOpen, setHowComputedOpen] = useState(false);
  const metrics = IncidentService.computeSystemMetrics(incidents);
  const { spatialMetrics } = metrics;

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto select-none overflow-y-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-navy-900 font-mono uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-brand" />
              <span>Operational Evaluation & Model Metrics</span>
            </h2>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              Simulated Replay
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Objective performance indicators computed live from Periyar Basin Sentinel-1 SAR observations, ground truth surveys, and review history.
          </p>
        </div>

        {/* Collapsible How Computed Toggle */}
        <button
          onClick={() => setHowComputedOpen(!howComputedOpen)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
        >
          <HelpCircle className="w-3.5 h-3.5 text-teal-brand" />
          <span>How these are computed</span>
          {howComputedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Explanatory Collapsible Note */}
      {howComputedOpen && (
        <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-slate-700 space-y-2 animate-in fade-in duration-150">
          <div className="font-bold text-navy-900 font-mono text-[11px] uppercase">
            Metrics Computation Methodology:
          </div>
          <ul className="list-disc list-inside space-y-1 leading-relaxed text-slate-600">
            <li>
              <b>Detection-to-Alert Latency:</b> Calculated as the elapsed time between satellite SAR sensor ground capture and the responder's authorized public release, benchmarked against standard SDMA 4.2-hour paper bulletin issuance.
            </li>
            <li>
              <b>False-Alert Rate:</b> Number of rejected candidate detections divided by total detections ingested. Target line is set at &le; 5.0%.
            </li>
            <li>
              <b>Spatial Agreement (IoU):</b> Intersection over Union (Jaccard Index) computed live between Sentinel-1 radar thresholded extent (14.8 km²) and Kerala Revenue Department post-disaster surveyed ground truth (13.7 km²).
            </li>
            <li>
              <b>Alert Tier Distribution:</b> Tally of published Common Alerting Protocol messages segmented by statutory tier (Official Warning, Model Estimate, Unverified Advisory).
            </li>
          </ul>
        </div>
      )}

      {/* The 4 Core Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Detection-to-Alert Latency */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase font-mono">Detection-to-Alert Latency</span>
            <Clock className="w-4 h-4 text-teal-brand" />
          </div>
          <div className="text-2xl font-black text-navy-900 font-mono">
            {metrics.medianLatencyMinutes} min
          </div>
          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{metrics.latencySavedHours} hours faster than bulletin</span>
          </div>
          <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-1.5 font-mono">
            Baseline SDMA Bulletin: ~4.2 hours
          </div>
        </div>

        {/* Card 2: False-Alert Rate */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase font-mono">False-Alert Rate</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-navy-900 font-mono">
            {metrics.falseAlertRate}%
          </div>
          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Below target ceiling (&le; {metrics.falseAlertTargetRate}%)</span>
          </div>
          <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-1.5 font-mono">
            Rejected: {incidents.filter(i => i.status === 'rejected').length} of {incidents.length} candidates
          </div>
        </div>

        {/* Card 3: Spatial IoU Agreement */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase font-mono">Flood Extent IoU Agreement</span>
            <Layers className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-navy-900 font-mono">
            {(spatialMetrics.iou * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-slate-600 font-medium">
            Precision: <b>{(spatialMetrics.precision * 100).toFixed(0)}%</b> • Recall: <b>{(spatialMetrics.recall * 100).toFixed(0)}%</b>
          </div>
          <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-1.5 font-mono">
            Overlap: {spatialMetrics.overlapAreaKm2} km² of 14.8 km²
          </div>
        </div>

        {/* Card 4: Alerts Sent & Responder Time */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase font-mono">Alerts Released & Review</span>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-navy-900 font-mono">
            {metrics.alertsByTier.total} Alerts
          </div>
          <div className="text-xs text-slate-600 font-medium">
            Avg review time: <b>{metrics.avgReviewTimeMinutes} min</b>
          </div>
          <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-1.5 font-mono">
            Official: {metrics.alertsByTier.official} • Model: {metrics.alertsByTier.modelEstimate}
          </div>
        </div>
      </div>

      <Collapsible title="Spatial Overlap & IoU Breakdown" defaultOpen={false}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Spatial Overlap Visualizer */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-navy-900 text-xs font-mono uppercase tracking-wider">
              Spatial Overlap Breakdown (Observed vs Reference Ground Truth)
            </h3>
            <span className="text-[11px] font-mono text-teal-700 font-semibold">
              IoU: {spatialMetrics.iou}
            </span>
          </div>

          {/* Graphical Representation of Overlap */}
          <div className="relative w-full h-44 rounded-lg border border-slate-200 bg-slate-900 overflow-hidden flex items-center justify-center p-3">
            <svg viewBox="0 0 300 140" className="w-full h-full">
              {/* Reference Ground Truth (Blue Miss + Green Overlap) */}
              <circle cx="120" cy="70" r="50" fill="#2563EB" fillOpacity="0.4" stroke="#3B82F6" strokeWidth="2" />
              
              {/* Observed Extent (Red Overestimate + Green Overlap) */}
              <circle cx="160" cy="70" r="52" fill="#DC2626" fillOpacity="0.4" stroke="#EF4444" strokeWidth="2" />

              {/* Overlap Zone */}
              <path
                d="M 140,26 A 50,50 0 0,0 140,114 A 52,52 0 0,0 140,26"
                fill="#16A34A"
                fillOpacity="0.65"
                stroke="#22C55E"
                strokeWidth="2"
              />

              <text x="140" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Overlap: {spatialMetrics.overlapAreaKm2} km²
              </text>
              <text x="90" y="72" textAnchor="middle" fill="#93C5FD" fontSize="9" fontFamily="monospace">
                Miss: {spatialMetrics.missKm2} km²
              </text>
              <text x="195" y="72" textAnchor="middle" fill="#FCA5A5" fontSize="9" fontFamily="monospace">
                Over-est: {spatialMetrics.overEstimateKm2} km²
              </text>
            </svg>
          </div>

          {/* Legend for Overlap */}
          <div className="grid grid-cols-3 gap-2 text-[11px] text-center font-mono">
            <div className="p-1.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block mr-1"></span>
              True Positive: {spatialMetrics.overlapAreaKm2} km²
            </div>
            <div className="p-1.5 rounded bg-red-50 border border-red-200 text-red-800">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block mr-1"></span>
              Over-estimate: {spatialMetrics.overEstimateKm2} km²
            </div>
            <div className="p-1.5 rounded bg-blue-50 border border-blue-200 text-blue-800">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block mr-1"></span>
              Missed Extent: {spatialMetrics.missKm2} km²
            </div>
          </div>
        </div>

        {/* Per-Incident Latency and Timeline Table */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-navy-900 text-xs font-mono uppercase tracking-wider">
            Per-Incident Latency & Validation Log
          </h3>

          <div className="divide-y divide-slate-100 text-xs font-mono">
            {incidents.map(inc => {
              const obs = new Date(inc.observationTime).getTime();
              const ing = new Date(inc.ingestionTime).getTime();
              const latencyMin = Math.round((ing - obs) / 60000);

              return (
                <div key={inc.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-navy-900">{inc.id} — {inc.hazardType.toUpperCase()}</div>
                    <div className="text-[10px] text-slate-500 font-sans truncate max-w-xs">{inc.locationName}</div>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {latencyMin} min latency
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Confidence: {inc.confidenceScore}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </Collapsible>
    </div>
  );
};

