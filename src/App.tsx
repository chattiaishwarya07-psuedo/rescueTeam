// src/App.tsx
import React, { useState } from 'react';
import { TopBar } from './components/layout/TopBar';
import { LeftRail, MainNavView } from './components/layout/LeftRail';
import { OperationsOverview } from './components/layout/OperationsOverview';
import { OperationsMap } from './components/map/OperationsMap';
import { AlertsListView } from './components/alerts/AlertsListView';
import { MetricsView } from './components/metrics/MetricsView';
import { DataSourcesPanel } from './components/telemetry/DataSourcesPanel';
import { AuditLogView } from './components/audit/AuditLogView';
import { AboutModal } from './components/layout/AboutModal';
import { useAuthRole } from './hooks/useAuthRole';
import { useIncidents } from './hooks/useIncidents';
import { INITIAL_FEEDS, AVAILABLE_SECTORS } from './services/mockData';

export function App() {
  // Auth & Roles
  const {
    responder,
    jurisdiction,
    setJurisdiction,
    setRole,
    permissions,
    availableJurisdictions,
    availableRoles
  } = useAuthRole();

  // Incidents management
  const {
    incidents,
    filteredIncidents,
    areaFilteredIncidents,
    selectedIncident,
    selectedIncidentId,
    setSelectedIncidentId,
    forecastHorizon,
    setForecastHorizon,
    stats,
    searchQuery,
    setSearchQuery,
    hazardFilter,
    setHazardFilter,
    severityFilter,
    setSeverityFilter,
    statusFilter,
    setStatusFilter,
    sectorFilter,
    setSectorFilter,
    areaFilter,
    setAreaFilter,
    clearAreaFilter,
    sortBy,
    setSortBy,
    clearFilters,
    confirmIncident,
    rejectIncident,
    addAnnotation,
    approveAlert,
    resetSimulation
  } = useIncidents(responder.name, responder.role);

  // Active navigation view on left rail
  const [activeNavView, setActiveNavView] = useState<MainNavView>('incidents');

  // Modals state
  const [dataSourcesOpen, setDataSourcesOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-opbg select-none font-sans">
      {/* 1. Top Bar (56px) + Slim Amber Simulation Banner */}
      <TopBar
        responder={responder}
        jurisdiction={jurisdiction}
        selectedSector={sectorFilter}
        availableJurisdictions={availableJurisdictions}
        availableSectors={AVAILABLE_SECTORS}
        onJurisdictionChange={setJurisdiction}
        onSectorChange={setSectorFilter}
        onRoleChange={setRole}
        pendingReviewsCount={stats.awaitingReview}
        feeds={INITIAL_FEEDS}
        onOpenDataSources={() => setDataSourcesOpen(true)}
        onResetDemo={resetSimulation}
        onOpenAbout={() => setAboutModalOpen(true)}
      />

      {/* 2. Main Workspace: Left Rail + Dynamic Center Views */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Rail (Icon-only, expands on hover) */}
        <LeftRail
          activeView={activeNavView}
          onSelectView={(view) => {
            if (view === 'datasources') {
              setDataSourcesOpen(true);
            } else {
              setActiveNavView(view);
            }
          }}
          pendingReviewsCount={stats.awaitingReview}
          onOpenAbout={() => setAboutModalOpen(true)}
        />

        {/* Dynamic Center Stage */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
          {activeNavView === 'incidents' && (
            <OperationsOverview
              incidents={incidents}
              areaFilteredIncidents={areaFilteredIncidents}
              filteredIncidents={filteredIncidents}
              selectedIncident={selectedIncident}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={setSelectedIncidentId}
              areaFilter={areaFilter}
              setAreaFilter={setAreaFilter}
              clearAreaFilter={clearAreaFilter}
              forecastHorizon={forecastHorizon}
              onForecastHorizonChange={setForecastHorizon}
              feeds={INITIAL_FEEDS}
              currentResponder={responder}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              hazardFilter={hazardFilter}
              onHazardFilterChange={setHazardFilter}
              severityFilter={severityFilter}
              onSeverityFilterChange={setSeverityFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              sectorFilter={sectorFilter}
              onSectorFilterChange={setSectorFilter}
              availableSectors={AVAILABLE_SECTORS}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onClearFilters={clearFilters}
              stats={stats}
              onConfirmIncident={confirmIncident}
              onRejectIncident={rejectIncident}
              onAddAnnotation={addAnnotation}
              onOpenDataSources={() => setDataSourcesOpen(true)}
            />
          )}

          {activeNavView === 'map' && (
            <div className="flex-1 h-full w-full relative">
              <OperationsMap
                incidents={filteredIncidents}
                selectedIncident={selectedIncident}
                onSelectIncident={setSelectedIncidentId}
                forecastHorizon={forecastHorizon}
                onForecastHorizonChange={setForecastHorizon}
              />
            </div>
          )}

          {activeNavView === 'alerts' && (
            <AlertsListView
              onSelectIncidentForAlert={(incId) => {
                setSelectedIncidentId(incId);
                setActiveNavView('incidents');
              }}
            />
          )}

          {activeNavView === 'metrics' && (
            <MetricsView incidents={incidents} />
          )}

          {activeNavView === 'audit' && (
            <AuditLogView incidents={incidents} />
          )}
        </main>
      </div>

      {/* 3. Global Drawers / Modals */}
      <DataSourcesPanel
        isOpen={dataSourcesOpen}
        onClose={() => setDataSourcesOpen(false)}
        feeds={INITIAL_FEEDS}
      />

      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />
    </div>
  );
}

export default App;
