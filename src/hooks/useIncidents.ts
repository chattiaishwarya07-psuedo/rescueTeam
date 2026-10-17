import { useState, useMemo, useCallback, useEffect } from 'react';
import { Incident, SeverityLevel, ResponderRole, PublicAlert } from '../types';
import { IncidentService } from '../services/incidentService';

export function useIncidents(currentActor: string, currentRole: ResponderRole) {
  const [incidents, setIncidents] = useState<Incident[]>(() => IncidentService.getIncidents());
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');
  const [forecastHorizon, setForecastHorizon] = useState<'now' | '+1h' | '+3h' | '+6h'>('now');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [hazardFilter, setHazardFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('All Sectors');
  const [sortBy, setSortBy] = useState<'severity' | 'recency' | 'confidence'>('severity');
  const [areaFilter, setAreaFilter] = useState<string>('all');

  const selectedIncident = useMemo(() => {
    if (!selectedIncidentId) return null;
    return incidents.find(inc => inc.id === selectedIncidentId) || null;
  }, [incidents, selectedIncidentId]);

  // When an incident is selected, auto-scope the view to its sector (area).
  // This makes the list, map, and detail panel show only that area's information.
  useEffect(() => {
    if (selectedIncidentId) {
      const inc = incidents.find(i => i.id === selectedIncidentId);
      if (inc && areaFilter !== inc.sector) {
        setAreaFilter(inc.sector);
      }
    }
  }, [selectedIncidentId, incidents, areaFilter]);

  const severityRank: Record<SeverityLevel, number> = {
    critical: 4,
    high: 3,
    moderate: 2,
    minor: 1,
  };

  const filteredIncidents = useMemo(() => {
    return incidents
      .filter(inc => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match = 
            inc.id.toLowerCase().includes(q) ||
            inc.title.toLowerCase().includes(q) ||
            inc.sector.toLowerCase().includes(q) ||
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

        // Status Filter
        if (statusFilter !== 'all' && inc.status !== statusFilter) {
          return false;
        }

        // Sector Filter
        if (sectorFilter !== 'All Sectors' && inc.sector !== sectorFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'severity') {
          const diff = severityRank[b.severity] - severityRank[a.severity];
          if (diff !== 0) return diff;
          // Tie-break with confidence then recency
          const confDiff = b.confidenceScore - a.confidenceScore;
          if (confDiff !== 0) return confDiff;
          return new Date(b.observationTime).getTime() - new Date(a.observationTime).getTime();
        }
        if (sortBy === 'confidence') {
          return b.confidenceScore - a.confidenceScore;
        }
        if (sortBy === 'recency') {
          return new Date(b.observationTime).getTime() - new Date(a.observationTime).getTime();
        }
        return 0;
      });
  }, [incidents, searchQuery, hazardFilter, severityFilter, statusFilter, sectorFilter, sortBy]);

  // Incidents scoped to the currently selected area (sector). When areaFilter is 'all',
  // every incident is shown; otherwise only incidents in that sector are shown.
  const areaFilteredIncidents = useMemo(() => {
    if (areaFilter === 'all') return incidents;
    return incidents.filter(inc => inc.sector === areaFilter);
  }, [incidents, areaFilter]);

  const stats = useMemo(() => {
    const active = incidents.filter(i => i.status !== 'rejected').length;
    const awaitingReview = incidents.filter(i => i.status === 'detected' || i.status === 'under_review').length;
    const critical = incidents.filter(i => i.severity === 'critical' && i.status !== 'rejected').length;
    return {
      active,
      awaitingReview,
      critical,
    };
  }, [incidents]);

  const confirmIncident = useCallback((incidentId: string, reason?: string) => {
    const updated = IncidentService.updateIncidentStatus(incidentId, 'confirmed', currentActor, currentRole, reason);
    setIncidents(updated);
  }, [currentActor, currentRole]);

  const rejectIncident = useCallback((incidentId: string, reason: string) => {
    const updated = IncidentService.updateIncidentStatus(incidentId, 'rejected', currentActor, currentRole, reason);
    setIncidents(updated);
  }, [currentActor, currentRole]);

  const addAnnotation = useCallback((incidentId: string, content: string) => {
    const updated = IncidentService.addAnnotation(incidentId, currentActor, currentRole, content);
    setIncidents(updated);
  }, [currentActor, currentRole]);

  const approveAlert = useCallback((
    incidentId: string,
    alertPayload: Omit<PublicAlert, 'id' | 'incidentId' | 'approvedAt' | 'deliveryStatus'>,
    isAllClear?: boolean
  ) => {
    const updated = IncidentService.approveAndSendAlert(incidentId, alertPayload, currentActor, currentRole, isAllClear);
    setIncidents(updated);
  }, [currentActor, currentRole]);

  const resetSimulation = useCallback(() => {
    const reset = IncidentService.resetToHistoricalSimulation();
    setIncidents(reset);
    setSelectedIncidentId('');
    setAreaFilter('all');
    setHazardFilter('all');
    setSeverityFilter('all');
    setStatusFilter('all');
    setSectorFilter('All Sectors');
    setSearchQuery('');
  }, []);

  const clearFilters = useCallback(() => {
    setHazardFilter('all');
    setSeverityFilter('all');
    setStatusFilter('all');
    setSectorFilter('All Sectors');
    setSearchQuery('');
    setAreaFilter('all');
    setSelectedIncidentId('');
  }, []);

  const clearAreaFilter = useCallback(() => {
    setAreaFilter('all');
    setSelectedIncidentId('');
  }, []);

  return {
    incidents,
    filteredIncidents,
    areaFilteredIncidents,
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
    // Actions
    confirmIncident,
    rejectIncident,
    addAnnotation,
    approveAlert,
    resetSimulation
  };
}
