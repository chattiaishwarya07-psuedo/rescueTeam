// src/components/layout/SummaryStrip.tsx
import React from 'react';
import { AlertCircle, Clock, AlertTriangle, Satellite } from 'lucide-react';

interface SummaryStripProps {
  activeCount: number;
  awaitingReviewCount: number;
  criticalCount: number;
  staleFeedsCount: number;
  onFilterAll?: () => void;
  onFilterAwaitingReview?: () => void;
  onFilterCritical?: () => void;
  onOpenDataSources?: () => void;
}

export const SummaryStrip: React.FC<SummaryStripProps> = ({
  activeCount,
  awaitingReviewCount,
  criticalCount,
  staleFeedsCount,
  onFilterAll,
  onFilterAwaitingReview,
  onFilterCritical,
  onOpenDataSources,
}) => {
  return (
    <div className="h-10 bg-white border-b border-slate-200 px-3 flex items-center justify-between text-xs select-none shrink-0 overflow-x-auto">
      <div className="flex items-center space-x-3 text-slate-700 font-medium">
        {/* Active Incidents */}
        <button
          onClick={onFilterAll}
          className="flex items-center space-x-1.5 hover:text-navy-900 transition-colors"
          title="Show all active incidents"
        >
          <span className="w-2 h-2 rounded-full bg-teal-brand"></span>
          <span><b>{activeCount}</b> active</span>
        </button>

        <span className="text-slate-300">•</span>

        {/* Awaiting Review */}
        <button
          onClick={onFilterAwaitingReview}
          className="flex items-center space-x-1.5 text-caution hover:text-amber-800 transition-colors"
          title="Filter to incidents awaiting review"
        >
          <Clock className="w-3.5 h-3.5 text-caution" />
          <span><b>{awaitingReviewCount}</b> awaiting review</span>
        </button>

        <span className="text-slate-300">•</span>

        {/* Critical */}
        <button
          onClick={onFilterCritical}
          className="flex items-center space-x-1.5 text-critical hover:text-red-800 transition-colors"
          title="Filter to critical severity incidents"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-critical" />
          <span><b>{criticalCount}</b> critical</span>
        </button>

        <span className="text-slate-300">•</span>

        {/* Stale Feeds */}
        <button
          onClick={onOpenDataSources}
          className={`flex items-center space-x-1.5 transition-colors ${
            staleFeedsCount > 0 ? 'text-amber-700 hover:text-amber-900' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Open Data Sources inspection panel"
        >
          <Satellite className="w-3.5 h-3.5" />
          <span><b>{staleFeedsCount}</b> feeds stale</span>
        </button>
      </div>

      <div className="text-[11px] text-slate-400 font-mono hidden lg:block">
        NDMA Incident Response System • IRS Level 2
      </div>
    </div>
  );
};
