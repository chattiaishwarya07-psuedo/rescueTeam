// src/hooks/useIncidents.ts
import { useState, useMemo, useCallback } from 'react';
import { Incident, HazardType, SeverityLevel, IncidentStatus, PublicAlert, ResponderRole } from '../types';
import { IncidentService } from '../services/incidentService';

export function useIncidents(currentActor: string, currentRole: ResponderRole) {
  const [incidents, setIncidents] = useState<Incident[]>(() => IncidentService.getIncidents());
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(() => incidents[0]?.id || '');
  const [forecastHorizon, setForecastHorizon] = useState<'now' | '+1h' | '+3h' | '+6h'>('now');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [hazardFilter, setHazardFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'severity' | 'recency' | 'confidence'>('severity');

  const selectedIncident = useMemo(() => {
    return incidents.find(inc => inc.id === selectedIncidentId) || incidents[0] || null;
  }, [incidents, selectedIncidentId]);

  // Transparent sorting rank
  const severityRank: Record<SeverityLevel, number> = {
    critical: 4,
    high: 3,
    moderate: 2,
    minor: 1,
  };

  const filteredIncidents = useMemo(() => {
    return incidents
      .filter(inc => {
        // Search query: ID, Title, Location, Source
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            inc.id.toLowerCase().includes(q) ||
            inc.title.toLowerCase().includes(q) ||
            inc.locationName.toLowerCase().includes(q) ||
            inc.primarySource.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Hazard Filter
        if (hazardFilter !== 'all' && inc.hazardType !== hazardFilter) {
          return false;
        }

        // Severity Filter
        if (severityFilter !== 'all' && inc.severity !== severityFilter) {
          return false;
        }

        // Jurisdiction Filter
        if (jurisdictionFilter !== 'all' && inc.jurisdiction !== jurisdictionFilter) {
          return false;
        }

        // Status Filter
        if (statusFilter !== 'all' && inc.status !== statusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'severity') {
          const diff = severityRank[b.severity] - severityRank[a.severity];
          if (diff !== 0) return diff;
          // Tie-break with recency
          return new Date(b.observationTime).getTime() - new Date(a.observationTime).getTime();
        }
        if (sortBy === 'recency') {
          return new Date(b.observationTime).getTime() - new Date(a.observationTime).getTime();
        }
        if (sortBy === 'confidence') {
          return b.confidenceScore - a.confidenceScore;
        }
        return 0;
      });
  }, [incidents, searchQuery, hazardFilter, severityFilter, jurisdictionFilter, statusFilter, sortBy]);

  // Statistics for operational cards
  const stats = useMemo(() => {
    const open = incidents.filter(i => i.status !== 'rejected').length;
    const awaitingReview = incidents.filter(i => i.status === 'detected' || i.status === 'under_review').length;
    const critical = incidents.filter(i => i.severity === 'critical' && i.status !== 'rejected').length;
    return {
      open,
      awaitingReview,
      critical,
    };
  }, [incidents]);

  // Actions
  const confirmIncident = useCallback((incidentId: string, reason?: string) => {
    const updated = IncidentService.updateIncidentStatus(incidentId, 'confirmed', currentActor, currentRole, reason);
    setIncidents(updated);
  }, [currentActor, currentRole]);

  const rejectIncident = useCallback((incidentId: string, reason: string) => {
    const updated = IncidentService.updateIncidentStatus(incidentId, 'rejected', currentActor, currentRole, reason);
    setIncidents(updated);
  }, [currentActor, currentRole]);

  const startReview = useCallback((incidentId: string) => {
    const updated = IncidentService.updateIncidentStatus(incidentId, 'under_review', currentActor, currentRole);
    setIncidents(updated);
  }, [currentActor, currentRole]);

  const addAnnotation = useCallback((incidentId: string, content: string) => {
    const updated = IncidentService.addAnnotation(incidentId, currentActor, currentRole, content);
    setIncidents(updated);
  }, [currentActor, currentRole]);

  const assignUnit = useCallback((incidentId: string, callsign: string) => {
    const updated = IncidentService.assignUnit(incidentId, callsign, currentActor, currentRole);
    setIncidents(updated);
  }, [currentActor, currentRole]);

  const approveAlert = useCallback((
    incidentId: string,
    alertPayload: Omit<PublicAlert, 'id' | 'incidentId' | 'approvedAt' | 'deliveryStatus'>
  ) => {
    const updated = IncidentService.approvePublicAlert(incidentId, alertPayload, currentActor, currentRole);
    setIncidents(updated);
  }, [currentActor, currentRole]);

  const resetSimulation = useCallback(() => {
    const reset = IncidentService.resetToHistoricalSimulation();
    setIncidents(reset);
    setSelectedIncidentId(reset[0]?.id || '');
  }, []);

  return {
    incidents,
    filteredIncidents,
    selectedIncident,
    selectedIncidentId,
    setSelectedIncidentId,
    forecastHorizon,
    setForecastHorizon,
    stats,
    // Filters & Sorting
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
    // Actions
    confirmIncident,
    rejectIncident,
    startReview,
    addAnnotation,
    assignUnit,
    approveAlert,
    resetSimulation
  };
}
