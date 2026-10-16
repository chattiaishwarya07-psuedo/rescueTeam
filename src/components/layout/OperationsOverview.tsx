// src/components/layout/OperationsOverview.tsx
import React, { useState } from 'react';
import { PanelRightClose, PanelRightOpen, Map as MapIcon, List, FileSearch, Layers } from 'lucide-react';
import { IncidentList } from '../incidents/IncidentList';
import { OperationsMap } from '../map/OperationsMap';
import { InvestigationPanel } from '../incidents/InvestigationPanel';
import { StatusCards } from './StatusCards';
import { Incident, RescueUnit, TelemetryFeed, ResponderRole } from '../../types';

interface OperationsOverviewProps {
  incidents: Incident[];
  filteredIncidents: Incident[];
  selectedIncident: Incident | null;
  selectedIncidentId: string;
  onSelectIncident: (id: string) => void;
  forecastHorizon: 'now' | '+1h' | '+3h' | '+6h';
  onForecastHorizonChange: (horizon: 'now' | '+1h' | '+3h' | '+6h') => void;
  rescueUnits: RescueUnit[];
  feeds: TelemetryFeed[];
  currentResponder: {
    name: string;
    role: ResponderRole;
    callsign: string;
    badgeNumber: string;
  };
  permissions: {
    canAnnotate: boolean;
    canConfirmReject: boolean;
    canApprovePublicAlert: boolean;
    canAssignUnits: boolean;
  };
  searchQuery: string;
  onSearchChange: (q: string) => void;
  hazardFilter: string;
  onHazardFilterChange: (h: string) => void;
  severityFilter: string;
  onSeverityFilterChange: (s: string) => void;
  jurisdictionFilter: string;
  onJurisdictionFilterChange: (j: string) => void;
  statusFilter: string;
  onStatusFilterChange: (st: string) => void;
  sortBy: 'severity' | 'recency' | 'confidence';
  onSortChange: (sort: 'severity' | 'recency' | 'confidence') => void;
  availableJurisdictions: string[];
  stats: {
    open: number;
    awaitingReview: number;
    critical: number;
  };
  onConfirmIncident: (id: string, reason?: string) => void;
  onRejectIncident: (id: string, reason: string) => void;
  onAddAnnotation: (id: string, content: string) => void;
  onOpenAlertModal: (inc: Incident) => void;
  onOpenUnitDispatchModal: (inc: Incident) => void;
  onOpenAuditHistory: () => void;
  onOpenFreshnessDrawer: () => void;
}

export const OperationsOverview: React.FC<OperationsOverviewProps> = ({
  incidents,
  filteredIncidents,
  selectedIncident,
  selectedIncidentId,
  onSelectIncident,
  forecastHorizon,
  onForecastHorizonChange,
  rescueUnits,
  feeds,
  currentResponder,
  permissions,
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
  stats,
  onConfirmIncident,
  onRejectIncident,
  onAddAnnotation,
  onOpenAlertModal,
  onOpenUnitDispatchModal,
  onOpenAuditHistory,
  onOpenFreshnessDrawer,
}) => {
  // Desktop side panel collapsed toggle
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(true);

  // Mobile / Tablet Tab switch
  const [mobileTab, setMobileTab] = useState<'map' | 'list' | 'investigation'>('map');

  const staleFeedsCount = feeds.filter(f => f.status === 'Delayed' || f.status === 'Stale').length;

  return (
    <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
      {/* 1. Status Summary Cards */}
      <StatusCards
        openIncidentsCount={stats.open}
        awaitingReviewCount={stats.awaitingReview}
        criticalIncidentsCount={stats.critical}
        staleFeedsCount={staleFeedsCount}
        totalFeedsCount={feeds.length}
        onFilterAwaitingReview={() => onStatusFilterChange('under_review')}
        onFilterCritical={() => onSeverityFilterChange('critical')}
        onOpenFeeds={onOpenFreshnessDrawer}
      />

      {/* Mobile/Tablet Screen View Mode Switcher */}
      <div className="flex xl:hidden bg-white rounded-lg border border-slate-200 p-1 text-xs select-none">
        <button
          onClick={() => setMobileTab('map')}
          className={`flex-1 py-1.5 font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'map' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Operational Map</span>
        </button>
        <button
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-1.5 font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'list' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>Incidents ({filteredIncidents.length})</span>
        </button>
        <button
          onClick={() => setMobileTab('investigation')}
          className={`flex-1 py-1.5 font-bold rounded flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'investigation' ? 'bg-navy-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileSearch className="w-3.5 h-3.5" />
          <span>Investigation Panel</span>
        </button>
      </div>

      {/* 2. Main Workspace 3-Part Desktop Layout */}
      <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
        {/* Part 1: Incident List (Left Column) */}
        <div className={`w-80 md:w-96 shrink-0 h-full ${
          mobileTab !== 'list' ? 'hidden xl:flex flex-col' : 'flex flex-col w-full'
        }`}>
          <IncidentList
            incidents={filteredIncidents}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={(id) => {
              onSelectIncident(id);
              // On mobile, auto-jump to map or investigation
              if (window.innerWidth < 1280) {
                setMobileTab('investigation');
              }
            }}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            hazardFilter={hazardFilter}
            onHazardFilterChange={onHazardFilterChange}
            severityFilter={severityFilter}
            onSeverityFilterChange={onSeverityFilterChange}
            jurisdictionFilter={jurisdictionFilter}
            onJurisdictionFilterChange={onJurisdictionFilterChange}
            statusFilter={statusFilter}
            onStatusFilterChange={onStatusFilterChange}
            sortBy={sortBy}
            onSortChange={onSortChange}
            availableJurisdictions={availableJurisdictions}
          />
        </div>

        {/* Part 2: Interactive Hazard Map (Center Column - Largest Visual Area) */}
        <div className={`flex-1 rounded-lg border border-slate-200 overflow-hidden shadow-sm relative h-full ${
          mobileTab !== 'map' ? 'hidden xl:flex flex-col' : 'flex flex-col w-full'
        }`}>
          <OperationsMap
            incidents={filteredIncidents}
            selectedIncident={selectedIncident}
            onSelectIncident={onSelectIncident}
            forecastHorizon={forecastHorizon}
            onForecastHorizonChange={onForecastHorizonChange}
            rescueUnits={rescueUnits}
          />

          {/* Collapsible toggle for details panel on desktop */}
          <button
            onClick={() => setDetailsPanelOpen(!detailsPanelOpen)}
            className="hidden xl:flex absolute top-3 right-3 z-[410] items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-navy-800 text-white text-xs font-semibold shadow-lg hover:bg-navy-900 border border-navy-700 transition-all"
            title={detailsPanelOpen ? "Collapse investigation panel" : "Expand investigation panel"}
          >
            {detailsPanelOpen ? (
              <>
                <PanelRightClose className="w-3.5 h-3.5 text-teal-300" />
                <span>Hide Investigation</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-3.5 h-3.5 text-teal-300" />
                <span>Show Investigation</span>
              </>
            )}
          </button>
        </div>

        {/* Part 3: Selected Incident Investigation Panel (Right Column) */}
        {detailsPanelOpen && (
          <div className={`w-96 lg:w-[410px] shrink-0 h-full ${
            mobileTab !== 'investigation' ? 'hidden xl:flex flex-col' : 'flex flex-col w-full'
          }`}>
            <InvestigationPanel
              incident={selectedIncident}
              forecastHorizon={forecastHorizon}
              currentResponder={currentResponder}
              permissions={permissions}
              onConfirm={onConfirmIncident}
              onReject={onRejectIncident}
              onAddAnnotation={onAddAnnotation}
              onOpenAlertModal={onOpenAlertModal}
              onOpenUnitDispatchModal={onOpenUnitDispatchModal}
              onOpenAuditHistory={onOpenAuditHistory}
            />
          </div>
        )}
      </div>
    </div>
  );
};
