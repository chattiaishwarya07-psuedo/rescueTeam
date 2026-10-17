// src/components/layout/OperationsOverview.tsx
import React, { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, MapPin } from 'lucide-react';
import { IncidentList } from '../incidents/IncidentList';
import { OperationsMap } from '../map/OperationsMap';
import { DetailPanel } from '../incidents/DetailPanel';
import { SummaryStrip } from './SummaryStrip';
import { Incident, TelemetryFeed, ResponderRole } from '../../types';

interface OperationsOverviewProps {
  incidents: Incident[];
  areaFilteredIncidents: Incident[];
  filteredIncidents: Incident[];
  selectedIncident: Incident | null;
  selectedIncidentId: string;
  onSelectIncident: (id: string) => void;
  forecastHorizon: 'now' | '+1h' | '+3h' | '+6h';
  onForecastHorizonChange: (h: 'now' | '+1h' | '+3h' | '+6h') => void;
  feeds: TelemetryFeed[];
  currentResponder: {
    name: string;
    role: ResponderRole;
    badgeNumber: string;
  };
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
  areaFilter: string;
  setAreaFilter: (a: string) => void;
  clearAreaFilter: () => void;
  availableSectors: string[];
  sortBy: 'severity' | 'recency' | 'confidence';
  onSortChange: (sort: 'severity' | 'recency' | 'confidence') => void;
  onClearFilters: () => void;
  stats: {
    active: number;
    awaitingReview: number;
    critical: number;
  };
  onConfirmIncident: (id: string, reason?: string) => void;
  onRejectIncident: (id: string, reason: string) => void;
  onAddAnnotation: (id: string, content: string) => void;
  onOpenDataSources: () => void;
}

export const OperationsOverview: React.FC<OperationsOverviewProps> = ({
  incidents,
  areaFilteredIncidents,
  filteredIncidents,
  selectedIncident,
  selectedIncidentId,
  onSelectIncident,
  forecastHorizon,
  onForecastHorizonChange,
  feeds,
  currentResponder,
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
  areaFilter,
  setAreaFilter,
  clearAreaFilter,
  availableSectors,
  sortBy,
  onSortChange,
  onClearFilters,
  stats,
  onConfirmIncident,
  onRejectIncident,
  onAddAnnotation,
  onOpenDataSources,
}) => {
  const [listCollapsed, setListCollapsed] = useState(false);
  const [detailCollapsed, setDetailCollapsed] = useState(false);

  const staleFeedsCount = feeds.filter(f => f.status === 'Delayed' || f.status === 'Stale').length;

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-opbg select-none">
      {/* 40px Summary Strip */}
      <SummaryStrip
        activeCount={stats.active}
        awaitingReviewCount={stats.awaitingReview}
        criticalCount={stats.critical}
        staleFeedsCount={staleFeedsCount}
        onFilterAll={onClearFilters}
        onFilterAwaitingReview={() => onStatusFilterChange('under_review')}
        onFilterCritical={() => onSeverityFilterChange('critical')}
        onOpenDataSources={onOpenDataSources}
      />

      {/* Active Area Filter Indicator (shown when an incident/area is clicked) */}
      {areaFilter !== 'all' && (
        <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 flex items-center justify-between gap-2 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-xs font-semibold text-amber-900 font-mono">Viewing Area:</span>
            <span className="text-xs font-bold text-navy-900 truncate max-w-xs">{areaFilter}</span>
          </div>
          <button
            onClick={clearAreaFilter}
            className="text-[10px] font-semibold text-amber-700 hover:text-amber-900 hover:underline px-1.5"
            title="Show all areas"
          >
            Clear area filter
          </button>
        </div>
      )}

      {/* Main 3-Column Area: Incident list 320px | Map (flex) | Detail panel 400px */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Column 1: Incident List (320px, Collapsible) */}
        {!listCollapsed ? (
          <div className="w-80 shrink-0 h-full flex flex-col relative z-10 border-r border-slate-200">
            <IncidentList
              incidents={areaFilteredIncidents}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={onSelectIncident}
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              hazardFilter={hazardFilter}
              onHazardFilterChange={onHazardFilterChange}
              severityFilter={severityFilter}
              onSeverityFilterChange={onSeverityFilterChange}
              statusFilter={statusFilter}
              onStatusFilterChange={onStatusFilterChange}
              sectorFilter={sectorFilter}
              onSectorFilterChange={onSectorFilterChange}
              availableSectors={availableSectors}
              sortBy={sortBy}
              onSortChange={onSortChange}
              onClearFilters={onClearFilters}
              onQuickConfirm={onConfirmIncident}
              onQuickReject={(id) => onRejectIncident(id, 'Rejected via quick action')}
            />
          </div>
        ) : (
          <button
            onClick={() => setListCollapsed(false)}
            className="w-7 h-12 bg-white border-y border-r border-slate-300 text-slate-600 rounded-r shadow-md self-center z-20 flex items-center justify-center hover:bg-slate-50 transition-colors"
            title="Expand incident list"
          >
            <PanelLeftOpen className="w-4 h-4 text-teal-brand" />
          </button>
        )}

        {/* Toggle button to collapse list */}
        {!listCollapsed && (
          <button
            onClick={() => setListCollapsed(true)}
            className="absolute left-80 top-1/2 -translate-y-1/2 z-20 w-5 h-10 bg-white border border-slate-300 text-slate-500 rounded-r shadow-xs flex items-center justify-center hover:text-navy-900"
            title="Collapse incident list"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Column 2: Map (Flex, at least 50% width) */}
        <div className="flex-1 h-full min-w-[50%] relative z-0">
          <OperationsMap
            incidents={filteredIncidents}
            selectedIncident={selectedIncident}
            onSelectIncident={onSelectIncident}
            forecastHorizon={forecastHorizon}
            onForecastHorizonChange={onForecastHorizonChange}
          />
        </div>

        {/* Column 3: Detail Panel (400px, Slides in on selection, Collapsible) */}
        {!detailCollapsed ? (
          selectedIncident ? (
            <div className="w-[400px] shrink-0 h-full flex flex-col relative z-10 border-l border-slate-200 animate-in slide-in-from-right duration-150">
              <DetailPanel
                incident={selectedIncident}
                forecastHorizon={forecastHorizon}
                currentResponder={currentResponder}
                onConfirm={onConfirmIncident}
                onReject={onRejectIncident}
                onAddAnnotation={onAddAnnotation}
                onClose={() => setDetailCollapsed(true)}
              />
            </div>
          ) : (
            <div className="w-[400px] shrink-0 h-full flex flex-col relative z-10 border-l border-slate-200 bg-white p-6 justify-center items-center text-center select-none shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600 mb-3 shadow-xs">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm text-navy-900 mb-1 font-mono uppercase tracking-wide">
                No Area Selected
              </h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-4">
                Click on any hazard zone or marker on the map, or select an incident from the list to display satellite evidence, observations, and forecasts for that specific area.
              </p>
              <div className="text-[11px] font-mono text-teal-800 bg-teal-50/70 border border-teal-200/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span>Select an area to view details</span>
              </div>
            </div>
          )
        ) : (
          selectedIncident && (
            <button
              onClick={() => setDetailCollapsed(false)}
              className="w-7 h-12 bg-white border-y border-l border-slate-300 text-slate-600 rounded-l shadow-md self-center z-20 flex items-center justify-center hover:bg-slate-50 transition-colors"
              title="Expand investigation panel"
            >
              <PanelRightOpen className="w-4 h-4 text-teal-brand" />
            </button>
          )
        )}
      </div>
    </div>
  );
};
