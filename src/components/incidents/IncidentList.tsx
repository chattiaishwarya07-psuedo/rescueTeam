// src/components/incidents/IncidentList.tsx
import React, { useRef, useEffect } from 'react';
import {
  Search,
  FilterX,
  Flame,
  Droplets,
  CloudLightning,
  Mountain,
  CheckCircle2,
  XCircle,
  Clock,
  Megaphone,
  Eye,
  Layers,
} from 'lucide-react';
import { Incident, HazardType, SeverityLevel, IncidentStatus } from '../../types';
import { Collapsible } from '../layout/Collapsible';

interface IncidentListProps {
  incidents: Incident[];
  selectedIncidentId: string;
  onSelectIncident: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  hazardFilter: string;
  onHazardFilterChange: (h: string) => void;
  severityFilter: string;
  onSeverityFilterChange: (s: string) => void;
  statusFilter: string;
  onStatusFilterChange: (st: string) => void;
  sectorFilter: string;
  onSectorFilterChange: (sec: string) => void;
  availableSectors: string[];
  sortBy: 'severity' | 'recency' | 'confidence';
  onSortChange: (sort: 'severity' | 'recency' | 'confidence') => void;
  onClearFilters: () => void;
  onQuickConfirm?: (id: string) => void;
  onQuickReject?: (id: string) => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  searchQuery,
  onSearchChange,
  hazardFilter,
  onHazardFilterChange,
  severityFilter,
  onSeverityFilterChange,
  statusFilter,
  onStatusFilterChange,
  sectorFilter,
  onSectorFilterChange,
  availableSectors,
  sortBy,
  onSortChange,
  onClearFilters,
  onQuickConfirm,
  onQuickReject,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener ('/' focuses search, arrows navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIdx = incidents.findIndex(i => i.id === selectedIncidentId);
        if (currentIdx < incidents.length - 1) {
          onSelectIncident(incidents[currentIdx + 1].id);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIdx = incidents.findIndex(i => i.id === selectedIncidentId);
        if (currentIdx > 0) {
          onSelectIncident(incidents[currentIdx - 1].id);
        }
      } else if ((e.key === 'c' || e.key === 'C') && onQuickConfirm && selectedIncidentId) {
        e.preventDefault();
        onQuickConfirm(selectedIncidentId);
      } else if ((e.key === 'r' || e.key === 'R') && onQuickReject && selectedIncidentId) {
        e.preventDefault();
        onQuickReject(selectedIncidentId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [incidents, selectedIncidentId, onSelectIncident, onQuickConfirm, onQuickReject]);

  const getHazardIcon = (type: HazardType) => {
    switch (type) {
      case 'flood':
        return <Droplets className="w-3.5 h-3.5 text-sky-600" />;
      case 'wildfire':
        return <Flame className="w-3.5 h-3.5 text-orange-600" />;
      case 'severe_weather':
        return <CloudLightning className="w-3.5 h-3.5 text-amber-600" />;
      case 'landslide':
        return <Mountain className="w-3.5 h-3.5 text-stone-600" />;
    }
  };

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-critical-bg text-critical border border-critical-border">
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
            HIGH
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            MODERATE
          </span>
        );
      case 'minor':
        return (
          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            MINOR
          </span>
        );
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'detected':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <Eye className="w-2.5 h-2.5 text-slate-500" />
            Detected
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium bg-caution-bg text-caution border border-caution-border">
            <Clock className="w-2.5 h-2.5 text-caution" />
            Under review
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium bg-resolved-bg text-resolved border border-resolved-border">
            <CheckCircle2 className="w-2.5 h-2.5 text-resolved" />
            Confirmed
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-400 border border-slate-200 line-through">
            <XCircle className="w-2.5 h-2.5 text-slate-400" />
            Rejected
          </span>
        );
      case 'alert_approved':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
            <Megaphone className="w-2.5 h-2.5 text-purple-700" />
            Alert sent
          </span>
        );
    }
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const now = new Date('2026-10-17T02:00:00Z').getTime();
      const then = new Date(isoString).getTime();
      const diffMin = Math.max(1, Math.round((now - then) / 60000));
      if (diffMin < 60) return `${diffMin} min ago`;
      const diffHours = Math.floor(diffMin / 60);
      return `${diffHours}h ${diffMin % 60}m ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full select-none shrink-0 overflow-hidden">
      <Collapsible title="Filters & Search" icon={<Search className="w-3 h-3" />} defaultOpen={false}>
        <div className="p-2 space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search incidents (press /)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs bg-white pl-8 pr-7 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-teal-brand text-slate-800 placeholder-slate-400"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-100 px-1 rounded border border-slate-200">
              /
            </kbd>
          </div>

          {/* Compact Filters in Single Row */}
          <div className="grid grid-cols-4 gap-1 text-[11px]">
            {/* Hazard Filter */}
            <select
              value={hazardFilter}
              onChange={(e) => onHazardFilterChange(e.target.value)}
              className="bg-white border border-slate-200 rounded px-1 py-1 text-slate-700 truncate"
              title="Filter by hazard"
            >
              <option value="all">Hazard</option>
              <option value="flood">Flood</option>
              <option value="wildfire">Wildfire</option>
              <option value="severe_weather">Weather</option>
              <option value="landslide">Landslide</option>
            </select>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => onSeverityFilterChange(e.target.value)}
              className="bg-white border border-slate-200 rounded px-1 py-1 text-slate-700 truncate"
              title="Filter by severity"
            >
              <option value="all">Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="minor">Minor</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-white border border-slate-200 rounded px-1 py-1 text-slate-700 truncate"
              title="Filter by review status"
            >
              <option value="all">Status</option>
              <option value="detected">Detected</option>
              <option value="under_review">Review</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
              <option value="alert_approved">Alerted</option>
            </select>

            {/* Sort Switcher */}
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-white border border-slate-200 rounded px-1 py-1 text-slate-700 truncate font-mono text-[10px]"
              title="Sort incidents by severity rank, confidence, or recency"
            >
              <option value="severity">Sort: Sev</option>
              <option value="confidence">Sort: Conf</option>
              <option value="recency">Sort: Recent</option>
            </select>
          </div>
        </div>
      </Collapsible>

      {/* Incident List Rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1.5 space-y-1">
        {incidents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <FilterX className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs font-semibold text-slate-700">No incidents match these filters</div>
            <button
              onClick={onClearFilters}
              className="text-xs font-semibold text-teal-brand hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          incidents.map((inc) => {
            const isSelected = inc.id === selectedIncidentId;

            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc.id)}
                className={`p-2.5 rounded cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-blue-50/80 border-l-4 border-l-teal-brand border-y-slate-200 border-r-slate-200 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80'
                }`}
              >
                {/* Header row: Hazard Icon + ID + Severity + Status */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="p-0.5 rounded bg-slate-100">
                      {getHazardIcon(inc.hazardType)}
                    </span>
                    <span className="font-mono text-xs font-bold text-navy-900">
                      {inc.id}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    {getSeverityBadge(inc.severity)}
                    {getStatusBadge(inc.status)}
                  </div>
                </div>

                {/* Title & Sector */}
                <div className="text-xs font-semibold text-navy-900 line-clamp-1 leading-snug">
                  {inc.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {inc.sector}
                </div>

                {/* Telemetry info row: Source + time + confidence + merged tag */}
                <Collapsible title="Telemetry & Source Details" defaultOpen={false}>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <div className="truncate max-w-[55%] text-slate-600">
                      <span>{inc.primarySource.split(' ')[0]}</span>
                      <span> • {formatTimeAgo(inc.observationTime)}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {/* Merged Detections Tag with Tooltip */}
                      {inc.deduplicationCount > 1 && (
                        <div className="relative group/tip">
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold cursor-help">
                            {inc.deduplicationCount} merged
                          </span>
                          {/* Tooltip on hover */}
                          <div className="absolute right-0 bottom-full mb-1 hidden group-hover/tip:block w-56 p-2 bg-navy-900 text-white text-[10px] rounded shadow-xl z-50 pointer-events-none">
                            <div className="font-bold text-teal-300 mb-1">Merged Source Detections:</div>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                              {inc.mergedSources.map((s, idx) => (
                                <li key={idx} className="truncate">{s}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Confidence % */}
                      <span className={`font-semibold ${
                        inc.confidenceScore >= 90 ? 'text-emerald-700' :
                        inc.confidenceScore >= 75 ? 'text-amber-700' : 'text-slate-600'
                      }`}>
                        {inc.confidenceScore}% conf
                      </span>
                    </div>
                  </div>
                </Collapsible>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
