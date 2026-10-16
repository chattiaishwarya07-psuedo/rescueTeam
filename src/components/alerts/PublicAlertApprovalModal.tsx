// src/components/alerts/PublicAlertApprovalModal.tsx
import React, { useState } from 'react';
import {
  Megaphone,
  ShieldAlert,
  Radio,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lock,
  X,
  Send,
  Layers,
  Users
} from 'lucide-react';
import { Incident, PublicAlert, ResponderRole } from '../../types';

interface PublicAlertApprovalModalProps {
  incident: Incident;
  responder: {
    name: string;
    role: ResponderRole;
    callsign: string;
    badgeNumber: string;
  };
  onClose: () => void;
  onApprove: (incidentId: string, alertPayload: Omit<PublicAlert, 'id' | 'incidentId' | 'approvedAt' | 'deliveryStatus'>) => void;
}

export const PublicAlertApprovalModal: React.FC<PublicAlertApprovalModalProps> = ({
  incident,
  responder,
  onClose,
  onApprove,
}) => {
  // Pre-filled standard CAP fields
  const [headline, setHeadline] = useState(
    incident.hazardType === 'flood'
      ? `FLASH FLOOD EMERGENCY: Rapid Inundation Warning for ${incident.locationName}`
      : incident.hazardType === 'wildfire'
      ? `WILDFIRE EVACUATION ORDER: Immediate Downwind Evacuation for ${incident.locationName}`
      : `SEVERE WEATHER WARNING: High-Impact Convective Cell in ${incident.locationName}`
  );

  const [urgency, setUrgency] = useState<'Immediate' | 'Expected' | 'Future'>('Immediate');
  const [severity, setSeverity] = useState<'Extreme' | 'Severe' | 'Moderate' | 'Minor'>(
    incident.severity === 'critical' ? 'Extreme' : 'Severe'
  );
  const [certainty, setCertainty] = useState<'Observed' | 'Likely' | 'Possible'>('Observed');

  const [zoneName, setZoneName] = useState(`${incident.locationName} & Adjacent Lowlands`);
  const [impactWindow, setImpactWindow] = useState('Immediate through 22:00 UTC (Next 3 Hours)');

  const [instruction, setInstruction] = useState(
    incident.hazardType === 'flood'
      ? 'Move immediately to higher ground. Do not drive or walk through flooded roadways. Follow designated evacuation route Highway 224 West.'
      : incident.hazardType === 'wildfire'
      ? 'Evacuate immediately east of Old Mill Road. Close all windows and doors. Proceed to Central Community Shelter.'
      : 'Seek sturdy shelter immediately on lowest interior floor. Stay away from windows.'
  );

  const [precautions, setPrecautions] = useState<string[]>([
    'Avoid riverbanks, dry washes, and low-lying drainage culverts.',
    'Keep mobile devices charged on emergency power banks.',
    'Tune radios to local emergency frequency 162.550 MHz.'
  ]);

  const [channels, setChannels] = useState<('Cell Broadcast' | 'EAS' | 'Resident Relay' | 'Siren Array')[]>([
    'Cell Broadcast',
    'EAS',
    'Resident Relay',
    'Siren Array',
  ]);

  const [explicitAuthConfirmed, setExplicitAuthConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);

  const toggleChannel = (channel: 'Cell Broadcast' | 'EAS' | 'Resident Relay' | 'Siren Array') => {
    if (channels.includes(channel)) {
      setChannels(channels.filter(c => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!explicitAuthConfirmed) return;

    setIsSubmitting(true);

    // Simulate backend delivery protocol handshake
    setTimeout(() => {
      onApprove(incident.id, {
        headline,
        instruction,
        urgency,
        severity,
        certainty,
        affectedZoneName: zoneName,
        targetJurisdiction: incident.jurisdiction,
        zonePolygon: incident.observedExtentPolygon,
        estimatedPopulationExposed: incident.populationExposedEstimate || 2500,
        expectedImpactWindow: impactWindow,
        practicalPrecautions: precautions,
        evidenceSource: incident.primarySource,
        observationTime: incident.observationTime,
        forecastUncertaintyRef: `Based on ${incident.forecasts['+1h'].modelName} (±${incident.forecasts['+1h'].uncertaintyMarginKm}km envelope)`,
        officialReference: 'https://emergency.gov/sentinel/advisories/latest',
        authorizedBy: `${responder.name} [${responder.callsign}]`,
        authorizedRole: responder.role,
        channels,
      });

      setIsSubmitting(false);
      setSimulatedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-2xl w-full my-6 overflow-hidden select-none">
        {/* Header */}
        <div className="bg-navy-800 text-white p-4 flex items-center justify-between border-b border-navy-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-brand/30 border border-teal-brand flex items-center justify-center text-teal-300">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wide uppercase font-mono">
                Common Alerting Protocol (CAP) — Public Warning Approval
              </div>
              <div className="text-[11px] text-teal-300 font-mono">
                Target Incident: {incident.id} • {incident.hazardType.toUpperCase()}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persistent Simulation Warning */}
        <div className="bg-testbanner px-4 py-2 text-xs font-semibold text-testbanner-text border-b border-testbanner-border flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <b>PROTOTYPE SIMULATION MODE:</b> Authorizing will record this decision in the local audit trail and simulate cellular gateway broadcast. No actual radio/SMS towers will be activated.
          </span>
        </div>

        {simulatedSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-base font-bold text-navy-900">
              Public Emergency Alert Dispatched
            </div>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Warning payload successfully broadcasted across simulated cell towers (18 nodes) and emergency alert sirens.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {/* CAP Standard Classification Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                  Urgency
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-semibold text-navy-800"
                >
                  <option value="Immediate">Immediate (Take action now)</option>
                  <option value="Expected">Expected (Within next hour)</option>
                  <option value="Future">Future (Potential threat)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                  Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-semibold text-critical"
                >
                  <option value="Extreme">Extreme (Extraordinary threat)</option>
                  <option value="Severe">Severe (Significant threat)</option>
                  <option value="Moderate">Moderate (Possible threat)</option>
                  <option value="Minor">Minor (Minimal threat)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">
                  Certainty
                </label>
                <select
                  value={certainty}
                  onChange={(e) => setCertainty(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-semibold text-teal-800"
                >
                  <option value="Observed">Observed (Determined)</option>
                  <option value="Likely">Likely (&gt; 50% probability)</option>
                  <option value="Possible">Possible (&lt; 50% probability)</option>
                </select>
              </div>
            </div>

            {/* Headline and Instructions */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                  Emergency Broadcast Headline *
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 font-semibold text-navy-900 focus:outline-none focus:border-teal-brand"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                  Actionable Public Instructions *
                </label>
                <textarea
                  rows={2}
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 text-slate-800 focus:outline-none focus:border-teal-brand"
                  required
                />
              </div>
            </div>

            {/* Geographic Targeting & Impact Window */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-purple-50/60 border border-purple-200">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-purple-900 font-mono mb-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-700" />
                  <span>Targeted Geographic Geofence</span>
                </div>
                <input
                  type="text"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="w-full p-1.5 text-xs rounded bg-white border border-purple-200 font-medium text-slate-800"
                />
                <div className="text-[10px] text-purple-700 mt-1 flex items-center gap-1 font-mono">
                  <Users className="w-3 h-3" />
                  <span>Est. Exposed: ~{incident.populationExposedEstimate?.toLocaleString() || '4,200'} civilians</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-purple-900 font-mono mb-1">
                  <Clock className="w-3.5 h-3.5 text-purple-700" />
                  <span>Expected Impact Window</span>
                </div>
                <input
                  type="text"
                  value={impactWindow}
                  onChange={(e) => setImpactWindow(e.target.value)}
                  className="w-full p-1.5 text-xs rounded bg-white border border-purple-200 font-medium text-slate-800"
                />
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  Jurisdiction: {incident.jurisdiction}
                </div>
              </div>
            </div>

            {/* Evidence & Scientific Attribution */}
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1 text-[11px]">
              <div className="font-bold text-navy-800 font-mono text-[10px] uppercase">
                Satellite Evidence & Model Attribution (Auditable Proof)
              </div>
              <div className="text-slate-600 flex justify-between">
                <span>Primary Sensor Feed:</span>
                <span className="font-mono font-semibold text-navy-900">{incident.primarySource}</span>
              </div>
              <div className="text-slate-600 flex justify-between">
                <span>Observation Timestamp:</span>
                <span className="font-mono">{new Date(incident.observationTime).toUTCString()}</span>
              </div>
              <div className="text-slate-600 flex justify-between">
                <span>Spread Model Envelope:</span>
                <span className="font-mono text-teal-700 font-semibold">
                  {incident.forecasts['+1h'].modelName} (±{incident.forecasts['+1h'].uncertaintyMarginKm}km buffer)
                </span>
              </div>
            </div>

            {/* Broadcast Channels Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1.5">
                Target Broadcast Channels
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Cell Broadcast', label: 'Cell Broadcast (WEA)' },
                  { id: 'EAS', label: 'Emergency Alert (EAS)' },
                  { id: 'Resident Relay', label: 'Resident Push Relay' },
                  { id: 'Siren Array', label: 'Local Siren Array' },
                ].map(item => {
                  const isChecked = channels.includes(item.id as any);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleChannel(item.id as any)}
                      className={`p-2 rounded border text-left flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'bg-teal-50 border-teal-brand text-teal-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      <span className="text-[11px]">{item.label}</span>
                      <span className={`w-2 h-2 rounded-full ${isChecked ? 'bg-teal-brand' : 'bg-slate-300'}`}></span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Statutory Authorization Checkbox */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 space-y-2">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={explicitAuthConfirmed}
                  onChange={(e) => setExplicitAuthConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-teal-brand focus:ring-teal-brand h-4 w-4"
                  required
                />
                <span className="text-xs text-amber-950 leading-snug">
                  <b>Statutory Authorization:</b> I certify that I am authorized as <b>{responder.role}</b> ({responder.name}, Badge #{responder.badgeNumber}) to order this public emergency alert. I confirm that satellite telemetry and model spread boundaries justify immediate public dissemination.
                </span>
              </label>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!explicitAuthConfirmed || channels.length === 0 || isSubmitting}
                className="px-5 py-2 rounded bg-teal-brand hover:bg-teal-hover text-white font-bold flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <span>Broadcasting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Authorize & Broadcast Alert</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
