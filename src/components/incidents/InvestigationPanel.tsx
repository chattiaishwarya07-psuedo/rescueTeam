// src/components/incidents/InvestigationPanel.tsx
import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Truck,
  Megaphone,
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  HelpCircle,
  Clock,
  Compass,
  AlertTriangle,
  Eye,
  Satellite,
  FileText,
  Layers,
  Radio,
  Lock,
  ChevronRight,
  Send
} from 'lucide-react';
import { Incident, IncidentStatus, ResponderRole, ForecastStep } from '../../types';

interface InvestigationPanelProps {
  incident: Incident | null;
  forecastHorizon: 'now' | '+1h' | '+3h' | '+6h';
  currentResponder: {
    name: string;
    role: ResponderRole;
    callsign: string;
  };
  permissions: {
    canAnnotate: boolean;
    canConfirmReject: boolean;
    canApprovePublicAlert: boolean;
    canAssignUnits: boolean;
  };
  onConfirm: (incidentId: string, reason?: string) => void;
  onReject: (incidentId: string, reason: string) => void;
  onAddAnnotation: (incidentId: string, content: string) => void;
  onOpenAlertModal: (incident: Incident) => void;
  onOpenUnitDispatchModal: (incident: Incident) => void;
  onOpenAuditHistory: () => void;
}

export const InvestigationPanel: React.FC<InvestigationPanelProps> = ({
  incident,
  forecastHorizon,
  currentResponder,
  permissions,
  onConfirm,
  onReject,
  onAddAnnotation,
  onOpenAlertModal,
  onOpenUnitDispatchModal,
  onOpenAuditHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'forecast' | 'notes'>('evidence');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmReason, setConfirmReason] = useState('');

  if (!incident) {
    return (
      <div className="bg-card rounded-lg border border-slate-200 h-full p-8 flex flex-col items-center justify-center text-center text-slate-400">
        <ShieldAlert className="w-12 h-12 text-slate-300 mb-3" />
        <div className="text-sm font-semibold text-slate-600">No Incident Selected</div>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Select an incident from the operational list or map markers to investigate observations and execute responder workflows.
        </p>
      </div>
    );
  }

  const currentForecast: ForecastStep = incident.forecasts[forecastHorizon];

  // Pipeline stages
  const stages: { key: IncidentStatus; label: string }[] = [
    { key: 'detected', label: 'Detected' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'alert_approved', label: 'Public Alert' },
  ];

  const getStageIndex = (status: IncidentStatus) => {
    if (status === 'detected') return 0;
    if (status === 'under_review') return 1;
    if (status === 'confirmed') return 2;
    if (status === 'alert_approved') return 3;
    if (status === 'rejected') return -1;
    return 0;
  };

  const currentStageIdx = getStageIndex(incident.status);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-critical" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-emerald-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-amber-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(incident.id, confirmReason || "Confirmed via multi-sensor correlation and field observation.");
    setConfirmModalOpen(false);
    setConfirmReason('');
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    onReject(incident.id, rejectReason);
    setRejectModalOpen(false);
    setRejectReason('');
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    onAddAnnotation(incident.id, newNoteContent.trim());
    setNewNoteContent('');
  };

  return (
    <div className="bg-card rounded-lg border border-slate-200 flex flex-col h-full shadow-sm overflow-hidden select-none">
      {/* 1. Header with Incident Identity & Status Pipeline */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50/80">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold bg-navy-800 text-white px-2 py-0.5 rounded">
              {incident.id}
            </span>
            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
              incident.severity === 'critical' ? 'bg-critical-bg text-critical border-critical-border' :
              incident.severity === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
              incident.severity === 'moderate' ? 'bg-amber-100 text-amber-800 border-amber-200' :
              'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {incident.severity} SEVERITY
            </span>
          </div>

          <button
            onClick={onOpenAuditHistory}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-navy-800 bg-white border border-slate-200 rounded px-2 py-1 shadow-sm transition-colors"
            title="Inspect complete chronological audit trail"
          >
            <History className="w-3.5 h-3.5 text-teal-brand" />
            <span>Audit History ({incident.auditTrail.length})</span>
          </button>
        </div>

        <h3 className="text-sm font-bold text-navy-900 leading-snug">
          {incident.title}
        </h3>
        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
          <span>{incident.locationName}</span>
          <span>•</span>
          <span className="font-mono text-[11px]">{incident.jurisdiction}</span>
        </div>

        {/* Operational Review Pipeline Visualization */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/80">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5 flex items-center justify-between">
            <span>Workflow Sequence</span>
            <span className="text-[9px] text-teal-brand font-semibold">
              Current: {incident.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {incident.status === 'rejected' ? (
            <div className="p-2 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1">
                <XCircle className="w-4 h-4 text-red-600" />
                Detections Rejected as False Positive
              </span>
              <span className="text-[10px] text-red-600 font-mono">Preserved in Archive</span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1 text-center">
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                return (
                  <div
                    key={stage.key}
                    className={`p-1.5 rounded text-[10px] font-semibold transition-all border ${
                      isCurrent
                        ? 'bg-navy-800 text-white border-navy-900 shadow-sm'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    <div className="truncate">{stage.label}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 2. Responder Action Workflow Buttons */}
      <div className="p-2.5 bg-white border-b border-slate-200 grid grid-cols-2 gap-1.5 text-xs">
        {/* Confirm Action */}
        <button
          onClick={() => setConfirmModalOpen(true)}
          disabled={!permissions.canConfirmReject || incident.status === 'confirmed' || incident.status === 'alert_approved'}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-semibold transition-all border ${
            incident.status === 'confirmed' || incident.status === 'alert_approved'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 cursor-default'
              : permissions.canConfirmReject
              ? 'bg-resolved hover:bg-emerald-800 text-white border-emerald-900 shadow-sm'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
          title={permissions.canConfirmReject ? 'Confirm detection as verified hazard' : 'Requires Incident Reviewer role'}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{incident.status === 'confirmed' ? 'Hazard Confirmed' : 'Confirm Hazard'}</span>
        </button>

        {/* Reject Action */}
        <button
          onClick={() => setRejectModalOpen(true)}
          disabled={!permissions.canConfirmReject || incident.status === 'rejected'}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-semibold transition-all border ${
            incident.status === 'rejected'
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
              : permissions.canConfirmReject
              ? 'bg-white hover:bg-red-50 text-critical border-critical-border'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
          title={permissions.canConfirmReject ? 'Reject as false positive with recorded rationale' : 'Requires Incident Reviewer role'}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Reject / Archive</span>
        </button>

        {/* Assign Rescue Units */}
        <button
          onClick={() => onOpenUnitDispatchModal(incident)}
          disabled={!permissions.canAssignUnits}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-semibold transition-all border ${
            permissions.canAssignUnits
              ? 'bg-slate-100 hover:bg-slate-200 text-navy-800 border-slate-300'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
          title={permissions.canAssignUnits ? 'Dispatch or route rescue units to incident' : 'Requires Incident Reviewer role'}
        >
          <Truck className="w-3.5 h-3.5 text-teal-brand" />
          <span className="truncate">{incident.assignedTeam ? 'Reassign Unit' : 'Assign Unit'}</span>
        </button>

        {/* Public Warning Approval */}
        <button
          onClick={() => onOpenAlertModal(incident)}
          disabled={!permissions.canApprovePublicAlert || incident.status === 'rejected'}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-semibold transition-all border ${
            incident.status === 'alert_approved'
              ? 'bg-purple-700 text-white border-purple-800 shadow-sm'
              : permissions.canApprovePublicAlert
              ? 'bg-teal-brand hover:bg-teal-hover text-white border-teal-800 shadow-sm'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
          title={
            !permissions.canApprovePublicAlert
              ? 'Requires Authorized Approver or Administrator role'
              : 'Approve and dispatch CAP public emergency alert'
          }
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span className="truncate">
            {incident.status === 'alert_approved' ? 'Alert Released' : 'Approve Warning'}
          </span>
        </button>
      </div>

      {/* Role permission hint when restricted */}
      {!permissions.canApprovePublicAlert && (
        <div className="px-3 py-1 bg-amber-50 border-b border-amber-200 text-[10px] text-amber-900 flex items-center justify-between">
          <span className="flex items-center gap-1 font-mono">
            <Lock className="w-3 h-3 text-amber-700" />
            Current Role: <b>{currentResponder.role}</b> (Public release restricted)
          </span>
          <span className="text-[9px] underline">Switch role in header</span>
        </div>
      )}

      {/* 3. Investigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-100/70 text-xs">
        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex-1 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'evidence'
              ? 'border-teal-brand text-navy-800 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Evidence & Sensors ({incident.observations.length})
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={`flex-1 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'forecast'
              ? 'border-teal-brand text-navy-800 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Spread Forecast ({forecastHorizon})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'notes'
              ? 'border-teal-brand text-navy-800 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Tactical Notes ({incident.responderNotes.length})
        </button>
      </div>

      {/* 4. Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
        {/* Tab 1: Evidence & Source Observations */}
        {activeTab === 'evidence' && (
          <div className="space-y-3">
            {/* Vital Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                  Primary Telemetry
                </div>
                <div className="font-semibold text-navy-800 text-xs mt-0.5">
                  {incident.primarySource}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Confidence: <b className="text-teal-700">{incident.confidenceScore}%</b> (±{incident.uncertaintyRadiusMeters}m)
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                  Affected Footprint
                </div>
                <div className="font-semibold text-navy-800 text-xs mt-0.5">
                  {incident.estimatedAffectedAreaKm2} km²
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Est. Exposed: <b className="text-navy-800">{incident.populationExposedEstimate ? `${incident.populationExposedEstimate.toLocaleString()} residents` : 'Not provided'}</b>
                </div>
              </div>
            </div>

            {/* Timestamps & Pipeline Latency */}
            <div className="p-2.5 rounded bg-blue-50/50 border border-blue-100 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Observation Timestamp:</span>
                <span className="font-mono text-navy-800 font-semibold">{new Date(incident.observationTime).toUTCString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ingestion Timestamp:</span>
                <span className="font-mono text-navy-800">{new Date(incident.ingestionTime).toUTCString()}</span>
              </div>
              <div className="flex justify-between border-t border-blue-100 pt-1 text-[10px]">
                <span className="text-slate-500">Data Freshness / Latency:</span>
                <span className="font-mono text-teal-800 font-bold">14 minutes (Nominal for polar SAR pass)</span>
              </div>
            </div>

            {/* Deduplication synthesis explanation */}
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                Detection Synthesis ({incident.deduplicationCount} merged records)
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {incident.deduplicationNotes}
              </p>
            </div>

            {/* Underlying Observations Records */}
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">
                Underlying Sensor Records
              </div>
              <div className="space-y-2">
                {incident.observations.map((obs) => (
                  <div key={obs.id} className="p-2.5 rounded bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-navy-900">{obs.source}</span>
                      <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                        {obs.confidenceScore}% Quality Score
                      </span>
                    </div>
                    {obs.rawMetricValue && (
                      <div className="text-[11px] font-mono text-slate-700 bg-slate-50 p-1.5 rounded border border-slate-100">
                        {obs.rawMetricValue}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500">
                      Quality Note: {obs.qualityNote}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono">
                      Observed: {new Date(obs.timestamp).toLocaleTimeString()} • Resolution: {obs.groundResolutionMeters ? `${obs.groundResolutionMeters}m` : 'Point gauge'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Spread Forecast & Trend */}
        {activeTab === 'forecast' && (
          <div className="space-y-3">
            {/* Trend Summary */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                  Hazard Dynamics Trend
                </div>
                <div className="text-sm font-black text-navy-900 uppercase flex items-center gap-1.5 mt-0.5">
                  {getTrendIcon(incident.trend)}
                  <span>{incident.trend}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                  Spread Vector
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-0.5">
                  {currentForecast.directionText || 'Downstream drainage'}
                </div>
              </div>
            </div>

            {/* Active Horizon Forecast Card */}
            <div className="p-3 rounded-lg bg-white border border-teal-brand/40 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="font-bold text-navy-900">{currentForecast.label}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-navy-800 text-white">
                  Horizon: {currentForecast.horizon}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Projected Extent:</span>
                  <div className="font-semibold text-navy-800 font-mono">
                    {currentForecast.affectedAreaKm2 > 0 ? `${currentForecast.affectedAreaKm2} km²` : 'Unavailable'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Model Confidence:</span>
                  <div className="font-semibold text-teal-700 font-mono">
                    {currentForecast.confidenceScore > 0 ? `${currentForecast.confidenceScore}% (±${currentForecast.uncertaintyMarginKm}km)` : 'Unavailable'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Spread Velocity:</span>
                  <div className="font-semibold text-slate-700 font-mono">
                    {currentForecast.speedKmh ? `${currentForecast.speedKmh} km/h` : 'Slow / Creep'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Generated At:</span>
                  <div className="font-mono text-slate-600 text-[10px]">
                    {new Date(currentForecast.generatedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                <span className="font-semibold text-slate-700">Methodology & Limitations:</span>
                <p className="mt-0.5">{currentForecast.notes}</p>
              </div>

              <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[10px] text-amber-900">
                <b>Operational Warning:</b> Predicted boundaries are hydrodynamic/surface spread projections and must not be treated as surveyed ground boundaries.
              </div>
            </div>

            {/* Assigned Unit Status */}
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                Assigned Emergency Response Unit
              </div>
              {incident.assignedTeam ? (
                <div className="flex items-center justify-between text-xs font-semibold text-navy-900">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-teal-brand" />
                    {incident.assignedTeam}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Dispatched
                  </span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic">
                  No unit assigned yet. Use the Assign Unit button above.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Tactical Notes & Annotations */}
        {activeTab === 'notes' && (
          <div className="space-y-3">
            {/* New Annotation Form */}
            {permissions.canAnnotate ? (
              <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                <textarea
                  rows={3}
                  placeholder="Record tactical observation or responder instruction..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-slate-200 focus:outline-none focus:border-teal-brand text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!newNoteContent.trim()}
                  className="w-full py-1.5 px-3 rounded bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-3 h-3 text-teal-300" />
                  <span>Append Field Note ({currentResponder.name})</span>
                </button>
              </form>
            ) : (
              <div className="p-2.5 rounded bg-slate-100 text-slate-500 text-xs">
                Annotating notes requires Analyst, Reviewer, or Approver role.
              </div>
            )}

            {/* Notes List */}
            <div className="space-y-2 mt-3">
              {incident.responderNotes.length === 0 ? (
                <div className="text-center py-4 text-slate-400 text-xs italic">
                  No tactical notes added yet.
                </div>
              ) : (
                incident.responderNotes.map((note, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-white border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span className="font-bold text-navy-800">{note.author} ({note.role})</span>
                      <span>{new Date(note.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5. Reject Modal Dialog */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-md w-full p-4 space-y-3">
            <div className="flex items-center space-x-2 text-critical font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Reject Incident Detection ({incident.id})</span>
            </div>
            <p className="text-xs text-slate-600">
              Per standard operations protocol, rejected detections are <b>not deleted</b> from the database; they remain in the permanent audit trail with your recorded rationale.
            </p>
            <form onSubmit={handleRejectSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                  Reason for Rejection *
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-slate-200 bg-white"
                  required
                >
                  <option value="">Select operational reason...</option>
                  <option value="False positive: Sensor artifact or radar side-lobe clutter">Sensor artifact / radar side-lobe clutter</option>
                  <option value="Controlled agricultural burn or authorized burn operation">Authorized controlled burn</option>
                  <option value="Water anomaly within normal seasonal reservoir bounds">Within normal seasonal reservoir bounds</option>
                  <option value="Physical ground inspection confirmed no active threat">Ground reconnaissance confirmed no active hazard</option>
                  <option value="Duplicate of higher-resolution detection record">Duplicate detection record</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rejectReason}
                  className="px-3 py-1.5 rounded bg-critical hover:bg-red-800 text-white font-semibold text-xs disabled:opacity-50"
                >
                  Confirm Rejection & Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Confirm Modal Dialog */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-md w-full p-4 space-y-3">
            <div className="flex items-center space-x-2 text-resolved font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirm Verified Hazard ({incident.id})</span>
            </div>
            <p className="text-xs text-slate-600">
              Confirming transitions this hazard from initial detection to verified operational status across all rescue team dashboards.
            </p>
            <form onSubmit={handleConfirmSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                  Confirmation Notes / Justification
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Confirmed by multi-sensor correlation and local river gauge telemetry..."
                  value={confirmReason}
                  onChange={(e) => setConfirmReason(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-resolved hover:bg-emerald-800 text-white font-semibold text-xs"
                >
                  Confirm & Update Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
