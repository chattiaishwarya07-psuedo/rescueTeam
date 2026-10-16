// src/components/layout/StatusCards.tsx
import React from 'react';
import { AlertCircle, Clock, AlertTriangle, Satellite, CheckCircle2 } from 'lucide-react';

interface StatusCardsProps {
  openIncidentsCount: number;
  awaitingReviewCount: number;
  criticalIncidentsCount: number;
  staleFeedsCount: number;
  totalFeedsCount: number;
  onFilterAwaitingReview?: () => void;
  onFilterCritical?: () => void;
  onOpenFeeds?: () => void;
}

export const StatusCards: React.FC<StatusCardsProps> = ({
  openIncidentsCount,
  awaitingReviewCount,
  criticalIncidentsCount,
  staleFeedsCount,
  totalFeedsCount,
  onFilterAwaitingReview,
  onFilterCritical,
  onOpenFeeds,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {/* 1. Open Incidents */}
      <div className="bg-card p-3 rounded-lg border border-slate-200/90 shadow-sm flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
            Active Incidents
          </div>
          <div className="text-2xl font-black text-navy-800 font-mono mt-0.5">
            {openIncidentsCount}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-brand"></span>
            Operational Geo-Detections
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-teal-brand">
          <AlertCircle className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Incidents Awaiting Review */}
      <button
        onClick={onFilterAwaitingReview}
        className="bg-card p-3 rounded-lg border border-caution-border/60 hover:border-caution shadow-sm flex items-center justify-between text-left transition-all group"
      >
        <div>
          <div className="text-[11px] font-semibold text-caution uppercase tracking-wider flex items-center gap-1">
            <span>Awaiting Review</span>
            {awaitingReviewCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-caution animate-ping"></span>
            )}
          </div>
          <div className="text-2xl font-black text-caution font-mono mt-0.5">
            {awaitingReviewCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 group-hover:text-caution transition-colors">
            Requires Responder Action →
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-caution-bg border border-caution-border flex items-center justify-center text-caution">
          <Clock className="w-5 h-5" />
        </div>
      </button>

      {/* 3. Critical Incidents */}
      <button
        onClick={onFilterCritical}
        className="bg-card p-3 rounded-lg border border-critical-border/70 hover:border-critical shadow-sm flex items-center justify-between text-left transition-all group"
      >
        <div>
          <div className="text-[11px] font-semibold text-critical uppercase tracking-wider flex items-center gap-1">
            <span>Critical Severity</span>
          </div>
          <div className="text-2xl font-black text-critical font-mono mt-0.5">
            {criticalIncidentsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 group-hover:text-critical transition-colors">
            Immediate Evac / Threat Zones →
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-critical-bg border border-critical-border flex items-center justify-center text-critical">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </button>

      {/* 4. Telemetry Feeds Health */}
      <button
        onClick={onOpenFeeds}
        className="bg-card p-3 rounded-lg border border-slate-200/90 hover:border-teal-brand/50 shadow-sm flex items-center justify-between text-left transition-all group"
      >
        <div>
          <div className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
            Satellite & Sensor Feeds
          </div>
          <div className="text-2xl font-black text-navy-800 font-mono mt-0.5 flex items-baseline gap-1">
            <span>{totalFeedsCount - staleFeedsCount}</span>
            <span className="text-xs font-normal text-slate-400">/{totalFeedsCount} Nominal</span>
          </div>
          <div className="text-[11px] mt-0.5">
            {staleFeedsCount > 0 ? (
              <span className="text-amber-600 font-medium">
                {staleFeedsCount} Delayed / Stale (Inspect)
              </span>
            ) : (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> All Feeds Active
              </span>
            )}
          </div>
        </div>
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
          staleFeedsCount > 0
            ? 'bg-amber-50 border-amber-200 text-amber-600'
            : 'bg-emerald-50 border-emerald-200 text-emerald-600'
        }`}>
          <Satellite className="w-5 h-5" />
        </div>
      </button>
    </div>
  );
};
