// src/components/incidents/DetailPanel.tsx
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Megaphone, 
  AlertTriangle, 
  FileCode, 
  Sliders, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Send, 
  X, 
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Incident, IncidentStatus, ResponderRole } from '../../types';
import { AlertComposer } from '../alerts/AlertComposer';
import { Collapsible } from '../layout/Collapsible';

interface DetailPanelProps {
  incident: Incident | null;
  forecastHorizon: 'now' | '+1h' | '+3h' | '+6h';
  currentResponder: {
    name: string;
    role: ResponderRole;
    badgeNumber: string;
  };
  onConfirm: (id: string, reason?: string) => void;
  onReject: (id: string, reason: string) => void;
  onAddAnnotation: (id: string, content: string) => void;
  onClose?: () => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  incident,
  forecastHorizon,
  currentResponder,
  onConfirm,
  onReject,
  onAddAnnotation,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'forecast' | 'alert' | 'notes'>('overview');
  
  // Modals state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmReason, setConfirmReason] = useState('');
  const [newNote, setNewNote] = useState('');
  const [rawJsonModalOpen, setRawJsonModalOpen] = useState(false);
  const [selectedRawData, setSelectedRawData] = useState<any>(null);

  // Before/after image slider state
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  if (!incident) {
    return (
      <div className="w-[400px] bg-white border-l border-slate-200 h-full p-8 flex flex-col items-center justify-center text-center text-slate-400 select-none">
        <Clock className="w-10 h-10 text-slate-300 mb-2" />
        <div className="text-sm font-semibold text-slate-700">No incident selected</div>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Select an incident from the list or map to inspect evidence, spread forecasts, or release public alerts.
        </p>
      </div>
    );
  }

  const isDEOO = currentResponder.role === 'District Emergency Operations Officer';
  const isConfirmed = incident.status === 'confirmed' || incident.status === 'alert_approved';
  const isRejected = incident.status === 'rejected';

  // 4-step workflow tracker
  const steps: { key: IncidentStatus; label: string }[] = [
    { key: 'detected', label: 'Detected' },
    { key: 'under_review', label: 'Under review' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'alert_approved', label: 'Public alert sent' },
  ];

  const getStepIndex = (st: IncidentStatus) => {
    if (st === 'detected') return 0;
    if (st === 'under_review') return 1;
    if (st === 'confirmed') return 2;
    if (st === 'alert_approved') return 3;
    return -1;
  };
  const currentStepIdx = getStepIndex(incident.status);

  // Latency calculation (Ingestion - Observation)
  const calcLatency = () => {
    try {
      const obs = new Date(incident.observationTime).getTime();
      const ing = new Date(incident.ingestionTime).getTime();
      const diffSec = Math.max(0, Math.round((ing - obs) / 1000));
      const min = Math.floor(diffSec / 60);
      const sec = diffSec % 60;
      return `${min} min ${sec} s`;
    } catch {
      return '7 min 15 s';
    }
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(incident.id, confirmReason || "Confirmed via multi-sensor correlation and field inspection.");
    setConfirmModalOpen(false);
    setConfirmReason('');
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    onReject(incident.id, rejectReason.trim());
    setRejectModalOpen(false);
    setRejectReason('');
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddAnnotation(incident.id, newNote.trim());
    setNewNote('');
  };

  return (
    <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col h-full shadow-lg select-none shrink-0 overflow-hidden">
      {/* 1. Header with ID, Title, Chips, and 4-Step Workflow Tracker */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold bg-navy-800 text-white px-2 py-0.5 rounded">
              {incident.id}
            </span>
            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded border ${
              incident.severity === 'critical' ? 'bg-critical-bg text-critical border-critical-border' :
              incident.severity === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
              incident.severity === 'moderate' ? 'bg-amber-100 text-amber-800 border-amber-200' :
              'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {incident.severity}
            </span>
          </div>

          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <h3 className="text-sm font-bold text-navy-900 leading-snug">
          {incident.title}
        </h3>

        {/* 4-Step Workflow Tracker */}
        <div className="pt-2 border-t border-slate-200">
          <div className="text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
            Workflow Sequence
          </div>
          {isRejected ? (
            <div className="p-2 rounded bg-red-50 text-red-800 border border-red-200 text-xs font-semibold flex items-center justify-between">
              <span>Rejected / Archived Detection</span>
              <span className="font-mono text-[10px]">Permanent Log</span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={st.key}
                    className={`py-1 px-0.5 rounded font-semibold border transition-all ${
                      isCurrent
                        ? 'bg-navy-800 text-white border-navy-900 shadow-xs'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    <div className="truncate">{st.label}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Stale Data Warning Banner if applicable */}
      {incident.isFeedStale && (
        <div className="bg-amber-500 text-navy-950 font-bold px-3 py-1.5 text-xs flex items-center space-x-1.5 border-b border-amber-600">
          <AlertTriangle className="w-4 h-4 text-amber-950 shrink-0" />
          <span>Data may be out of date (last update {incident.staleFeedDuration} ago)</span>
        </div>
      )}

      {/* 2. Sub-Tabs: Overview | Evidence | Forecast | Alert | Notes */}
      <div className="flex border-b border-slate-200 bg-slate-100/70 text-xs font-semibold shrink-0">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'evidence', label: 'Evidence' },
          { id: 'forecast', label: 'Forecast' },
          { id: 'alert', label: 'Alert' },
          { id: 'notes', label: 'Notes' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-1 py-2 text-center border-b-2 transition-all ${
              activeTab === t.id
                ? 'border-teal-brand text-navy-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 3. Tab Body Container */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            {/* One-line summary */}
            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-2.5 rounded border border-slate-200">
              {incident.hazardType === 'flood'
                ? `Rapid surface water accumulation along the lower Periyar basin following persistent monsoon rainfall and controlled spillage.`
                : `Active thermal canopy fire spreading downwind along teak plantation compartments with spot fires detected.`}
            </p>

            {/* Affected Area & Uncertainty */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Affected Area</span>
                <span className="font-bold text-navy-900 text-sm font-mono">
                  {incident.estimatedAffectedAreaKm2} km² <span className="text-xs font-normal text-slate-500">± {incident.uncertaintyAreaKm2}</span>
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Exposed Population</span>
                <span className="font-bold text-navy-900 text-sm font-mono">
                  ~{incident.populationExposedEstimate.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">WorldPop 100 m grid (estimate)</span>
              </div>
            </div>

            {/* Method Sentence */}
            <div className="p-2.5 rounded bg-blue-50/60 border border-blue-200 text-slate-700 text-xs">
              <span className="font-bold text-navy-900 block mb-0.5 font-mono text-[10px] uppercase">
                Extraction Method:
              </span>
              <p className="leading-snug">{incident.methodSentence}</p>
            </div>

            {/* Timestamps & Pipeline Latency */}
            <Collapsible title="Timestamps & Pipeline Latency" defaultOpen={false}>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1 font-mono text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Observation Time:</span>
                  <span className="font-bold text-slate-800">{new Date(incident.observationTime).toUTCString().replace('GMT', 'UTC')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ingestion Time:</span>
                  <span>{new Date(incident.ingestionTime).toLocaleTimeString()} UTC</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 text-teal-800 font-bold">
                  <span>Sensor-to-Ingest Latency:</span>
                  <span>{calcLatency()}</span>
                </div>
              </div>
            </Collapsible>

            {/* Confidence with Tooltip */}
            <Collapsible title="Detection Confidence" defaultOpen={false}>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">
                    Detection Confidence
                  </span>
                  <span className="font-bold text-teal-700 font-mono text-sm">{incident.confidenceScore}%</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{incident.confidenceExplanation}</p>
              </div>
            </Collapsible>
          </div>
        )}

        {/* TAB 2: EVIDENCE */}
        {activeTab === 'evidence' && (
          <div className="space-y-3.5">
            {/* Contributing Feeds List */}
            <Collapsible title="Contributing Feeds & Telemetry" defaultOpen={false}>
              <div className="space-y-2">
                {incident.observations.map((obs) => (
                  <div key={obs.id} className="p-2.5 rounded bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-navy-900">{obs.source}</span>
                      <span className="text-[10px] font-mono text-teal-700 font-bold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                        {obs.confidenceScore}% conf
                      </span>
                    </div>
                    {obs.rawMetricValue && (
                      <div className="font-mono text-[11px] text-slate-700 bg-slate-50 p-1.5 rounded border border-slate-100">
                        {obs.rawMetricValue}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                      <span>Observed: {new Date(obs.timestamp).toLocaleTimeString()} UTC</span>
                      {obs.rawPayload && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRawData(obs.rawPayload);
                            setRawJsonModalOpen(true);
                          }}
                          className="text-teal-brand font-bold hover:underline flex items-center gap-0.5"
                        >
                          <FileCode className="w-3 h-3" />
                          <span>View raw JSON</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Collapsible>

            {/* Before / After Sentinel Comparison Slider */}
            <Collapsible title="Sentinel-1 Pre/Post Backscatter Slider" defaultOpen={false}>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600 uppercase font-mono">
                    Sentinel-1 Pre/Post Backscatter Slider
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Drag to compare</span>
                </div>

                {/* Interactive Visual Comparison Slider */}
                <div className="relative w-full h-36 rounded-md overflow-hidden border border-slate-300 shadow-inner bg-slate-800">
                  {/* Pre-event baseline background */}
                  <div
                    className="absolute inset-0 bg-cover bg-center flex items-end p-2 text-white font-mono text-[10px] font-bold bg-slate-700"
                    style={{
                      backgroundImage: `linear-gradient(rgba(20,45,78,0.4), rgba(20,45,78,0.7)), radial-gradient(circle, #334155 0%, #0F172A 100%)`,
                    }}
                  >
                    <span className="bg-navy-900/80 px-1.5 py-0.5 rounded">
                      Pre-Flood Baseline (Dry Periyar Channel)
                    </span>
                  </div>

                  {/* Post-event SAR Inundation overlay clipped by slider */}
                  <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
                    <div
                      className="w-full h-full bg-cover bg-center flex items-end p-2 text-white font-mono text-[10px] font-bold"
                      style={{
                        backgroundImage: `linear-gradient(rgba(2,132,199,0.5), rgba(2,132,199,0.8)), radial-gradient(circle, #0284C7 0%, #0C4A6E 100%)`,
                        width: '400px',
                      }}
                    >
                      <span className="bg-sky-950/90 px-1.5 py-0.5 rounded text-sky-200">
                        Post-Flood SAR Surface Water (-15.2 dB)
                      </span>
                    </div>
                  </div>

                  {/* Slider divider line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white text-navy-900 flex items-center justify-center text-[8px] font-bold shadow-md">
                      ⇄
                    </div>
                  </div>

                  {/* Range input */}
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-10"
                  />
                </div>
              </div>
            </Collapsible>
          </div>
        )}

        {/* TAB 3: FORECAST */}
        {activeTab === 'forecast' && (
          <div className="space-y-3">
            {/* Plain Sentence Forecast */}
            <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
              ⚠️ Next likely affected: <b>{incident.forecasts['+1h'].nextLikelyAffected || 'Marampilly Sector 2, Kalamassery'}</b>
            </div>

            {/* Note: Forecast confidence decreases with lead time */}
            <div className="text-[11px] text-slate-500 italic">
              Notice: Forecast confidence decreases with lead time as hydraulic friction and local culvert capacities vary.
            </div>

            {/* +1h, +3h, +6h Cards */}
            <Collapsible title="Forecast Steps (+1h / +3h / +6h)" defaultOpen={false}>
              {(['+1h', '+3h', '+6h'] as const).map((horizon) => {
                const f = incident.forecasts[horizon];
                if (!f || f.modelName === 'Unavailable') return null;

                return (
                  <div key={horizon} className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between border-b pb-1">
                      <span className="font-bold text-navy-900">{f.label}</span>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {f.confidenceScore}% confidence
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-mono">
                      <div>Area: <b>{f.affectedAreaKm2} km²</b></div>
                      <div>Uncertainty: <b>±{f.uncertaintyMarginKm} km</b></div>
                    </div>

                    <div className="text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-700">Spread Direction:</span> {f.directionText}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Method: {f.modelName}
                    </div>
                  </div>
                );
              })}
            </Collapsible>
          </div>
        )}

        {/* TAB 4: ALERT COMPOSER */}
        {activeTab === 'alert' && (
          <AlertComposer
            incident={incident}
            responder={currentResponder}
            onAlertDispatched={() => {
              setActiveTab('overview');
            }}
          />
        )}

        {/* TAB 5: NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-3">
            <form onSubmit={handleAddNoteSubmit} className="space-y-2">
              <textarea
                rows={3}
                placeholder="Record tactical field annotation..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full text-xs p-2 rounded border border-slate-300 focus:outline-none focus:border-teal-brand text-slate-800"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="w-full py-1.5 px-3 rounded bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs disabled:opacity-40"
              >
                Append Note ({currentResponder.name})
              </button>
            </form>

            <Collapsible title="Responder Notes" defaultOpen={false}>
              <div className="space-y-2 mt-2">
                {incident.responderNotes.map((n) => (
                  <div key={n.id} className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span className="font-bold text-slate-800">{n.author} ({n.role})</span>
                      <span>{new Date(n.timestamp).toLocaleTimeString()} UTC</span>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed">{n.content}</p>
                  </div>
                ))}
              </div>
            </Collapsible>
          </div>
        )}
      </div>

      {/* 4. Sticky Footer Actions (Confirm, Reject, Annotate, Approve Alert) */}
      <div className="p-3 border-t border-slate-200 bg-white grid grid-cols-2 gap-2 text-xs shrink-0">
        {/* Confirm Action */}
        <button
          onClick={() => setConfirmModalOpen(true)}
          disabled={isConfirmed || isRejected}
          className={`py-2 px-3 rounded font-semibold border flex items-center justify-center gap-1.5 transition-all ${
            isConfirmed 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 cursor-default' 
              : 'bg-resolved hover:bg-emerald-800 text-white border-emerald-900 shadow-xs'
          }`}
          title={isConfirmed ? "Hazard already confirmed" : "Confirm observed hazard"}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isConfirmed ? 'Confirmed' : 'Confirm Hazard'}</span>
        </button>

        {/* Reject / Archive Action */}
        <button
          onClick={() => setRejectModalOpen(true)}
          disabled={isRejected}
          className={`py-2 px-3 rounded font-semibold border flex items-center justify-center gap-1.5 transition-all ${
            isRejected
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
              : 'bg-white hover:bg-red-50 text-critical border-critical-border'
          }`}
          title="Reject detection with mandatory reason"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Reject / Archive</span>
        </button>

        {/* Annotate Shortcut */}
        <button
          onClick={() => setActiveTab('notes')}
          className="py-2 px-3 rounded font-semibold border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700"
        >
          Annotate
        </button>

        {/* Approve Alert Button (Enabled only for DEOO and only after Confirm) */}
        <button
          onClick={() => setActiveTab('alert')}
          disabled={!isDEOO || !isConfirmed}
          className={`py-2 px-3 rounded font-bold border flex items-center justify-center gap-1.5 shadow-xs transition-all ${
            isDEOO && isConfirmed
              ? 'bg-teal-brand hover:bg-teal-hover text-white border-teal-800'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
          title={
            !isConfirmed
              ? "Requires Confirmed status before alert approval"
              : !isDEOO
              ? "Requires District Emergency Operations Officer role"
              : "Compose and approve public alert"
          }
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Approve Alert</span>
        </button>
      </div>

      {/* Raw JSON Modal */}
      {rawJsonModalOpen && selectedRawData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-lg w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="font-bold text-navy-900 font-mono text-xs flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-teal-brand" />
                <span>Raw Ingestion Telemetry Record</span>
              </div>
              <button onClick={() => setRawJsonModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded overflow-x-auto max-h-64">
              {JSON.stringify(selectedRawData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Confirm Reason Dialog */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-md w-full p-4 space-y-3 text-xs">
            <div className="font-bold text-sm text-navy-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-resolved" />
              <span>Confirm Hazard: {incident.id}</span>
            </div>
            <p className="text-slate-600">
              Confirming moves this incident into the active hazard registry, authorizing response teams and public warning preparation.
            </p>
            <form onSubmit={handleConfirmSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                  Optional Confirmation Note / Gauge Reference
                </label>
                <textarea
                  rows={2}
                  value={confirmReason}
                  onChange={(e) => setConfirmReason(e.target.value)}
                  placeholder="e.g. Verified against CWC Neeleswaram rising water stage..."
                  className="w-full p-2 rounded border border-slate-300 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-resolved hover:bg-emerald-800 text-white font-bold"
                >
                  Confirm Hazard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Reason Dialog */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-md w-full p-4 space-y-3 text-xs">
            <div className="font-bold text-sm text-critical flex items-center gap-1.5">
              <XCircle className="w-5 h-5 text-critical" />
              <span>Reject Detection: {incident.id}</span>
            </div>
            <p className="text-slate-600">
              Rejected detections remain permanently preserved in the audit log with your recorded reason.
            </p>
            <form onSubmit={handleRejectSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                  Rejection Reason *
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 bg-white"
                  required
                >
                  <option value="">Select reason...</option>
                  <option value="Sensor side-lobe artifact or radar specular reflection">Sensor side-lobe artifact / radar reflection</option>
                  <option value="Normal seasonal agricultural irrigation paddy flooding">Seasonal agricultural paddy flooding</option>
                  <option value="Controlled burn authorized by Forest Department">Authorized controlled burn</option>
                  <option value="Physical ground inspection confirmed no active threat">Ground reconnaissance confirmed no active threat</option>
                  <option value="Duplicate detection record merged into master incident">Duplicate detection record</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rejectReason}
                  className="px-4 py-1.5 rounded bg-critical hover:bg-red-800 text-white font-bold disabled:opacity-50"
                >
                  Reject & Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
