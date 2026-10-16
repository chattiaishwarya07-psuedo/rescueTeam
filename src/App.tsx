// src/App.tsx
import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, ActiveModule } from './components/layout/Sidebar';
import { OperationsOverview } from './components/layout/OperationsOverview';
import { LiveDispatchMapView } from './components/modules/LiveDispatchMapView';
import { RescueUnitsView } from './components/modules/RescueUnitsView';
import { TelemetryView } from './components/modules/TelemetryView';
import { ShelterEvacuationView } from './components/modules/ShelterEvacuationView';
import { CommsRelayView } from './components/modules/CommsRelayView';
import { PostIncidentLogsView } from './components/modules/PostIncidentLogsView';
import { PublicAlertApprovalModal } from './components/alerts/PublicAlertApprovalModal';
import { UnitDispatchModal } from './components/incidents/UnitDispatchModal';
import { AuditTrailModal } from './components/audit/AuditTrailModal';
import { DataFreshnessDrawer } from './components/telemetry/DataFreshnessDrawer';
import { useAuthRole } from './hooks/useAuthRole';
import { useIncidents } from './hooks/useIncidents';
import { INITIAL_FEEDS, INITIAL_RESCUE_UNITS } from './services/mockData';
import { Incident } from './types';

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
    jurisdictionFilter,
    setJurisdictionFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    confirmIncident,
    rejectIncident,
    addAnnotation,
    assignUnit,
    approveAlert,
    resetSimulation
  } = useIncidents(responder.name, responder.role);

  // Active module navigation
  const [activeModule, setActiveModule] = useState<ActiveModule>('incident_overview');

  // Low bandwidth sync mode
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false);

  // Modals state
  const [alertModalIncident, setAlertModalIncident] = useState<Incident | null>(null);
  const [unitDispatchIncident, setUnitDispatchIncident] = useState<Incident | null>(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [freshnessDrawerOpen, setFreshnessDrawerOpen] = useState(false);

  const staleFeedsCount = INITIAL_FEEDS.filter(f => f.status === 'Delayed' || f.status === 'Stale').length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-opbg">
      {/* 1. Header with Persistent Simulation Banner & Role Switcher */}
      <Header
        responder={responder}
        jurisdiction={jurisdiction}
        availableJurisdictions={availableJurisdictions}
        availableRoles={availableRoles}
        onRoleChange={setRole}
        onJurisdictionChange={setJurisdiction}
        pendingReviewCount={stats.awaitingReview}
        staleFeedsCount={staleFeedsCount}
        onResetSimulation={resetSimulation}
        onOpenFreshnessDrawer={() => setFreshnessDrawerOpen(true)}
        lowBandwidthMode={lowBandwidthMode}
        onToggleLowBandwidth={() => setLowBandwidthMode(!lowBandwidthMode)}
      />

      {/* 2. Main Body: Sidebar + Workspace Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          lowBandwidth={lowBandwidthMode}
          onToggleLowBandwidth={() => setLowBandwidthMode(!lowBandwidthMode)}
          pendingReviewCount={stats.awaitingReview}
        />

        {/* Dynamic Module View */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {activeModule === 'incident_overview' && (
            <OperationsOverview
              incidents={incidents}
              filteredIncidents={filteredIncidents}
              selectedIncident={selectedIncident}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={setSelectedIncidentId}
              forecastHorizon={forecastHorizon}
              onForecastHorizonChange={setForecastHorizon}
              rescueUnits={INITIAL_RESCUE_UNITS}
              feeds={INITIAL_FEEDS}
              currentResponder={responder}
              permissions={permissions}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              hazardFilter={hazardFilter}
              onHazardFilterChange={setHazardFilter}
              severityFilter={severityFilter}
              onSeverityFilterChange={setSeverityFilter}
              jurisdictionFilter={jurisdictionFilter}
              onJurisdictionFilterChange={setJurisdictionFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              availableJurisdictions={availableJurisdictions}
              stats={stats}
              onConfirmIncident={confirmIncident}
              onRejectIncident={rejectIncident}
              onAddAnnotation={addAnnotation}
              onOpenAlertModal={(inc) => setAlertModalIncident(inc)}
              onOpenUnitDispatchModal={(inc) => setUnitDispatchIncident(inc)}
              onOpenAuditHistory={() => setAuditModalOpen(true)}
              onOpenFreshnessDrawer={() => setFreshnessDrawerOpen(true)}
            />
          )}

          {activeModule === 'live_dispatch_map' && (
            <LiveDispatchMapView
              incidents={filteredIncidents}
              selectedIncident={selectedIncident}
              onSelectIncident={setSelectedIncidentId}
              forecastHorizon={forecastHorizon}
              onForecastHorizonChange={setForecastHorizon}
              rescueUnits={INITIAL_RESCUE_UNITS}
              onOpenAlertModal={(inc) => setAlertModalIncident(inc)}
            />
          )}

          {activeModule === 'rescue_units' && (
            <RescueUnitsView rescueUnits={INITIAL_RESCUE_UNITS} />
          )}

          {activeModule === 'telemetry_sensors' && (
            <TelemetryView feeds={INITIAL_FEEDS} />
          )}

          {activeModule === 'evacuation_corridors' && (
            <ShelterEvacuationView />
          )}

          {activeModule === 'shelter_management' && (
            <ShelterEvacuationView />
          )}

          {activeModule === 'comms_relay' && (
            <CommsRelayView
              incidents={incidents}
              onOpenAlertModal={(inc) => setAlertModalIncident(inc)}
            />
          )}

          {activeModule === 'post_incident_logs' && (
            <PostIncidentLogsView incidents={incidents} />
          )}
        </main>
      </div>

      {/* 3. Operational Modals & Drawers */}
      {/* CAP Public Alert Approval Modal */}
      {alertModalIncident && (
        <PublicAlertApprovalModal
          incident={alertModalIncident}
          responder={responder}
          onClose={() => setAlertModalIncident(null)}
          onApprove={(id, payload) => {
            approveAlert(id, payload);
          }}
        />
      )}

      {/* Rescue Unit Dispatch Modal */}
      {unitDispatchIncident && (
        <UnitDispatchModal
          incident={unitDispatchIncident}
          rescueUnits={INITIAL_RESCUE_UNITS}
          onClose={() => setUnitDispatchIncident(null)}
          onAssignUnit={(id, callsign) => {
            assignUnit(id, callsign);
          }}
        />
      )}

      {/* Chronological Audit Trail Modal */}
      {selectedIncident && (
        <AuditTrailModal
          isOpen={auditModalOpen}
          onClose={() => setAuditModalOpen(false)}
          incident={selectedIncident}
        />
      )}

      {/* Satellite Telemetry Freshness Drawer */}
      <DataFreshnessDrawer
        isOpen={freshnessDrawerOpen}
        onClose={() => setFreshnessDrawerOpen(false)}
        feeds={INITIAL_FEEDS}
      />
    </div>
  );
}

export default App;
