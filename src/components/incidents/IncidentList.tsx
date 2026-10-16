// src/components/incidents/IncidentList.tsx
import React from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
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
  AlertTriangle
} from 'lucide-react';
import { Incident, HazardType, SeverityLevel, IncidentStatus } from '../../types';

interface IncidentListProps {
  incidents: Incident[];
  selectedIncidentId: string;
  onSelectIncident: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hazardFilter: string;
  onHazardFilterChange: (hazard: string) => void;
  severityFilter: string;
  onSeverityFilterChange: (severity: string) => void;
  jurisdictionFilter: string;
  onJurisdictionFilterChange: (jurisdiction: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: 'severity' | 'recency' | 'confidence';
  onSortChange: (sort: 'severity' | 'recency' | 'confidence') => void;
  availableJurisdictions: string[];
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
  jurisdictionFilter,
  onJurisdictionFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  availableJurisdictions,
}) => {
  const getHazardIcon = (type: HazardType) => {
    switch (type) {
      case 'flood':
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'wildfire':
        return <Flame className="w-4 h-4 text-orange-600" />;
      case 'severe_weather':
        return <CloudLightning className="w-4 h-4 text-amber-600" />;
      case 'landslide':
        return <Mountain className="w-4 h-4 text-stone-600" />;
    }
  };

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-critical-bg text-critical border border-critical-border">
            <span className="w-1.5 h-1.5 rounded-full bg-critical"></span>
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
            HIGH
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            MODERATE
          </span>
        );
      case 'minor':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            MINOR
          </span>
        );
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'detected':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Eye className="w-3 h-3 text-slate-500" />
            Detected
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-caution-bg text-caution border border-caution-border">
            <Clock className="w-3 h-3 text-caution" />
            Under Review
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-resolved-bg text-resolved border border-resolved-border">
            <CheckCircle2 className="w-3 h-3 text-resolved" />
            Confirmed
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 line-through">
            <XCircle className="w-3 h-3 text-slate-400" />
            Rejected
          </span>
        );
      case 'alert_approved':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
            <Megaphone className="w-3 h-3 text-purple-700" />
            Alert Released
          </span>
        );
    }
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const now = new Date('2026-10-16T19:05:00Z').getTime(); // anchored to system simulation time
      const then = new Date(isoString).getTime();
      const diffMin = Math.max(1, Math.round((now - then) / 60000));
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      return `${diffHours}h ${diffMin % 60}m ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-slate-200 flex flex-col h-full shadow-sm overflow-hidden">
      {/* Top Controls Header */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/70 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-teal-brand" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-navy-800 font-mono">
              Incidents ({incidents.length})
            </h2>
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center space-x-1 text-xs">
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="text-[11px] bg-white border border-slate-200 rounded px-1.5 py-0.5 font-medium text-slate-700 focus:outline-none focus:border-teal-brand"
            >
              <option value="severity">Severity Rank</option>
              <option value="recency">Observation Recency</option>
              <option value="confidence">Sensor Confidence</option>
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, sector, location, or sensor..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-xs bg-white pl-8 pr-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-teal-brand text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Compact Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
          {/* Hazard Type Filter */}
          <select
            value={hazardFilter}
            onChange={(e) => onHazardFilterChange(e.target.value)}
            className="bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-700 truncate"
          >
            <option value="all">All Hazards</option>
            <option value="flood">Flood</option>
            <option value="wildfire">Wildfire</option>
            <option value="severe_weather">Severe Weather</option>
            <option value="landslide">Landslide</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => onSeverityFilterChange(e.target.value)}
            className="bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-700 truncate"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="minor">Minor</option>
          </select>

          {/* Review Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-700 truncate"
          >
            <option value="all">All Statuses</option>
            <option value="detected">Detected</option>
            <option value="under_review">Under Review</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
            <option value="alert_approved">Alert Released</option>
          </select>

          {/* Jurisdiction Filter */}
          <select
            value={jurisdictionFilter}
            onChange={(e) => onJurisdictionFilterChange(e.target.value)}
            className="bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-700 truncate"
          >
            <option value="all">All Jurisdictions</option>
            {availableJurisdictions.map(jur => (
              <option key={jur} value={jur}>{jur}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Incident List Rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1.5 space-y-1">
        {incidents.length === 0 ? (
          <div className="p-8 text-center">
            <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-600">No matching incidents</div>
            <p className="text-[11px] text-slate-400 mt-1">Try resetting or broadening your search filters</p>
          </div>
        ) : (
          incidents.map((inc) => {
            const isSelected = inc.id === selectedIncidentId;
            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc.id)}
                className={`p-2.5 rounded-md cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-blue-50/80 border-teal-brand/70 shadow-sm ring-1 ring-teal-brand/30'
                    : 'bg-white hover:bg-slate-50/90 border-slate-200/70'
                }`}
              >
                {/* Header row: ID + Hazard + Severity + Status */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <div className="p-1 rounded bg-slate-100">
                      {getHazardIcon(inc.hazardType)}
                    </div>
                    <span className="font-mono text-xs font-bold text-navy-800">
                      {inc.id}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      • {inc.hazardType.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {getSeverityBadge(inc.severity)}
                    {getStatusBadge(inc.status)}
                  </div>
                </div>

                {/* Title & Location */}
                <div className="text-xs font-semibold text-navy-900 line-clamp-1">
                  {inc.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {inc.locationName}
                </div>

                {/* Footer telemetry summary: Source, Latency/Observation time, Confidence, Deduplication */}
                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <div className="flex items-center space-x-1.5 truncate max-w-[65%]">
                    <span className="truncate text-slate-600 font-medium">
                      {inc.primarySource}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">
                      {formatTimeAgo(inc.observationTime)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {/* Deduplication badge */}
                    {inc.deduplicationCount > 1 && (
                      <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-semibold" title={inc.deduplicationNotes}>
                        {inc.deduplicationCount} merged
                      </span>
                    )}

                    {/* Sensor Confidence */}
                    <span className={`font-semibold ${
                      inc.confidenceScore >= 90 ? 'text-emerald-700' :
                      inc.confidenceScore >= 75 ? 'text-amber-700' : 'text-slate-600'
                    }`}>
                      {inc.confidenceScore}% conf
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
