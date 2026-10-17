// src/components/alerts/AlertComposer.tsx
import React, { useState } from 'react';
import { 
  Megaphone, 
  MapPin, 
  Clock, 
  Globe, 
  CheckSquare, 
  Square, 
  Send, 
  Download, 
  AlertTriangle, 
  FileText, 
  PhoneCall, 
  MessageSquare, 
  Bell, 
  CheckCircle2, 
  RotateCcw,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { Incident, PublicAlert, AlertTier, ResponderRole, PrecautionItem } from '../../types';
import { PRECAUTION_ITEMS } from '../../services/mockData';
import { alertStore } from '../../services/realtimeAlertStore';

interface AlertComposerProps {
  incident: Incident;
  responder: {
    name: string;
    role: ResponderRole;
    badgeNumber: string;
  };
  onAlertDispatched: (alert: PublicAlert) => void;
}

export const AlertComposer: React.FC<AlertComposerProps> = ({
  incident,
  responder,
  onAlertDispatched,
}) => {
  const isApprover = responder.role === 'District Emergency Operations Officer';
  const isConfirmed = incident.status === 'confirmed' || incident.status === 'alert_approved';

  // 1. Tier Selection
  const [tier, setTier] = useState<AlertTier>('Model Estimate');

  // 2. Affected Zones Selection
  const availableZones = [
    { id: 'w4', name: 'Ward 4 (Aluva North / Bank)', pop: 3800 },
    { id: 'w7', name: 'Ward 7 (Desom Lowlands)', pop: 4500 },
    { id: 'w8', name: 'Ward 8 (Companypady Highway Fringe)', pop: 5900 },
    { id: 'wNext', name: 'Next Likely: Marampilly Sector 2', pop: 6200 },
  ];
  const [selectedZones, setSelectedZones] = useState<string[]>([
    'Ward 4 (Aluva North / Bank)',
    'Ward 7 (Desom Lowlands)',
    'Ward 8 (Companypady Highway Fringe)'
  ]);

  // 3. Impact Window
  const [effectiveFrom, setEffectiveFrom] = useState('2026-10-17T01:30:00Z');
  const [effectiveTo, setEffectiveTo] = useState('2026-10-17T07:30:00Z');

  // 4. Multilingual Editor
  const [langTab, setLangTab] = useState<'en' | 'ml' | 'hi' | 'te'>('en');
  const [translations, setTranslations] = useState({
    en: {
      headline: incident.hazardType === 'flood'
        ? `FLASH FLOOD WARNING: Periyar River Surge in ${incident.sector}`
        : incident.hazardType === 'wildfire'
        ? `WILDFIRE SPREAD ADVISORY: Forest Fire Perimeter in ${incident.sector}`
        : `SEVERE WEATHER ADVISORY: Convective Downburst in ${incident.sector}`,
      instruction: incident.hazardType === 'flood'
        ? `Move immediately to higher ground. Water stage is rising at Neeleswaram. Avoid NH 544 service road.`
        : `Evacuate downwind forest boundary. Do not enter Illithodu plantation compartments.`,
    },
    ml: {
      headline: incident.hazardType === 'flood'
        ? `പ്രളയ മുന്നറിയിപ്പ്: പെരിയാർ തീരത്ത് ജലനിരപ്പ് ഉയരുന്നു (${incident.sector})`
        : `കാട്ടുതീ മുന്നറിയിപ്പ്: മലയാറ്റൂർ വനമേഖലയിൽ തീ പടരുന്നു`,
      instruction: `സുരക്ഷിത സ്ഥാനങ്ങളിലേക്ക് മാറുക. താഴ്ന്ന പ്രദേശങ്ങളിൽ വെള്ളം കയറാൻ സാധ്യതയുണ്ട്. വൈദ്യുതി മെയിൻ സ്വിച്ച് ഓഫ് ചെയ്യുക.`,
    },
    hi: {
      headline: `बाढ़ चेतावनी: पेरियार नदी के जलस्तर में तीव्र वृद्धि (${incident.sector})`,
      instruction: `तुरंत ऊंचे स्थानों पर जाएं। निचले इलाकों में जलभराव की गंभीर संभावना है। बिजली के मुख्य स्विच बंद करें।`,
    },
    te: {
      headline: `వరద హెచ్చరిక: పెరియార్ నది వరద ఉధృతి (${incident.sector})`,
      instruction: `వెంటనే ఎత్తైన ప్రాంతాలకు తరలివెళ్లండి. సహాయక మార్గదర్శకాలను పాటించండి. విద్యుత్ సరఫరా నిలిపివేయండి.`,
    }
  });

  const [humanTranslationChecked, setHumanTranslationChecked] = useState(false);

  // 5. Precautions
  const [selectedPrecautions, setSelectedPrecautions] = useState<string[]>([
    'Move to higher ground immediately',
    'Switch off main electrical breakers',
    'Do not walk or drive through flowing water'
  ]);

  // 6. Preview Tab & Delivery Simulation State
  const [previewTab, setPreviewTab] = useState<'app' | 'sms' | 'voice' | 'cap'>('app');
  const [deliveryStatus, setDeliveryStatus] = useState<'Idle' | 'Queued' | 'Sent' | 'Delivered' | 'Failed'>('Idle');
  const [dedupPrompt, setDedupPrompt] = useState(false);

  const toggleZone = (zoneName: string) => {
    if (selectedZones.includes(zoneName)) {
      setSelectedZones(selectedZones.filter(z => z !== zoneName));
    } else {
      setSelectedZones([...selectedZones, zoneName]);
    }
  };

  const togglePrecaution = (label: string) => {
    if (selectedPrecautions.includes(label)) {
      setSelectedPrecautions(selectedPrecautions.filter(p => p !== label));
    } else {
      setSelectedPrecautions([...selectedPrecautions, label]);
    }
  };

  const totalPop = selectedZones.reduce((acc, zName) => {
    const match = availableZones.find(az => az.name === zName);
    return acc + (match?.pop || 4000);
  }, 0);

  const activeTranslation = translations[langTab];

  // SMS character calculation
  const smsText = `${translations[langTab].headline} - ${translations[langTab].instruction}`;
  const isUnicode = langTab !== 'en';
  const charLimit = isUnicode ? 70 : 160;
  const segments = Math.ceil(smsText.length / charLimit) || 1;

  const handleSendAlert = (isAllClear = false) => {
    // Check if an existing alert for same zone & tier exists in store
    const existing = alertStore.getAlerts().find(a => 
      a.incidentId === incident.id && a.tier === tier && !a.isAllClear
    );

    if (existing && !dedupPrompt && !isAllClear) {
      setDedupPrompt(true);
      return;
    }

    setDedupPrompt(false);
    setDeliveryStatus('Queued');

    setTimeout(() => {
      setDeliveryStatus('Sent');

      setTimeout(() => {
        const alertObj: PublicAlert = {
          id: `CAP-KL-${Date.now()}`,
          incidentId: incident.id,
          tier,
          headline: isAllClear ? `ALL CLEAR: Hazard threat resolved for ${incident.sector}` : translations.en.headline,
          instruction: isAllClear ? 'Normal civilian activity may resume under local authority advice.' : translations.en.instruction,
          translations,
          humanTranslationChecked,
          precautions: selectedPrecautions,
          urgency: 'Immediate',
          severity: incident.severity === 'critical' ? 'Extreme' : 'Severe',
          certainty: 'Observed',
          affectedZones: selectedZones,
          targetJurisdiction: incident.jurisdiction,
          zonePolygon: incident.observedExtentPolygon,
          estimatedPopulationReached: totalPop,
          effectiveFrom,
          effectiveTo,
          evidenceSource: incident.primarySource,
          observationTime: incident.observationTime,
          forecastUncertaintyRef: `${incident.forecasts['+1h'].modelName} (±${incident.forecasts['+1h'].uncertaintyMarginKm}km buffer)`,
          officialReference: 'https://ksdma.kerala.gov.in/sentinel-bulletins',
          authorizedBy: `${responder.name} (${responder.badgeNumber})`,
          authorizedRole: responder.role,
          approvedAt: new Date().toISOString(),
          deliveryStatus: 'Delivered',
          channels: ['App Notification', 'SMS', 'Voice Script', 'CAP XML'],
          isAllClear
        };

        alertStore.saveAlert(alertObj);
        setDeliveryStatus('Delivered');
        onAlertDispatched(alertObj);
      }, 700);
    }, 400);
  };

  const handleDownloadCAP = () => {
    const mockAlert: PublicAlert = {
      id: `CAP-KL-${Date.now()}`,
      incidentId: incident.id,
      tier,
      headline: translations.en.headline,
      instruction: translations.en.instruction,
      translations,
      humanTranslationChecked,
      precautions: selectedPrecautions,
      urgency: 'Immediate',
      severity: incident.severity === 'critical' ? 'Extreme' : 'Severe',
      certainty: 'Observed',
      affectedZones: selectedZones,
      targetJurisdiction: incident.jurisdiction,
      zonePolygon: incident.observedExtentPolygon,
      estimatedPopulationReached: totalPop,
      effectiveFrom,
      effectiveTo,
      evidenceSource: incident.primarySource,
      observationTime: incident.observationTime,
      forecastUncertaintyRef: `${incident.forecasts['+1h'].modelName} (±${incident.forecasts['+1h'].uncertaintyMarginKm}km)`,
      officialReference: 'https://ksdma.kerala.gov.in/sentinel-bulletins',
      authorizedBy: `${responder.name} (${responder.badgeNumber})`,
      authorizedRole: responder.role,
      approvedAt: new Date().toISOString(),
      deliveryStatus: 'Delivered',
      channels: ['App Notification', 'SMS', 'Voice Script', 'CAP XML']
    };

    alertStore.downloadCAP12XML(mockAlert);
  };

  return (
    <div className="space-y-4 text-xs select-none">
      {/* Deduplicate update prompt banner */}
      {dedupPrompt && (
        <div className="p-2.5 rounded bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between">
          <span className="font-semibold">An active {tier} alert exists for this zone. Update existing alert instead?</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => handleSendAlert(false)}
              className="px-2 py-0.5 rounded bg-amber-600 text-white font-bold"
            >
              Update Alert
            </button>
            <button
              onClick={() => setDedupPrompt(false)}
              className="px-2 py-0.5 rounded bg-slate-200 text-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Alert Tier Selection */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
        <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono">
          1. Choose Warning Tier *
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['Official Warning', 'Model Estimate', 'Unverified Advisory'] as AlertTier[]).map(t => {
            const isSelected = tier === t;
            const disabled = t === 'Official Warning' && !isApprover;

            return (
              <button
                key={t}
                type="button"
                disabled={disabled}
                onClick={() => setTier(t)}
                className={`p-2 rounded text-left transition-all border ${
                  isSelected
                    ? 'bg-navy-800 text-white font-bold border-navy-900 shadow-xs'
                    : disabled
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title={disabled ? "Requires District Emergency Operations Officer role" : ""}
              >
                <div className="text-[11px] leading-tight truncate">{t}</div>
              </button>
            );
          })}
        </div>

        {/* Tier Specific Warning Note */}
        {tier === 'Model Estimate' && (
          <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
            ⚠️ Automatically watermarked: <b>"Model estimate — not an official warning"</b>.
          </div>
        )}
        {tier === 'Official Warning' && (
          <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 font-medium">
            🛡️ Official Statutory Warning backed by Disaster Management Act 2005 powers.
          </div>
        )}
      </div>

      {/* Step 2: Target Zones & Population Exposure */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-600 uppercase font-mono">
            2. Target Geographic Zones (Wards)
          </label>
          <span className="text-[11px] font-mono text-teal-700 font-bold">
            ~{totalPop.toLocaleString()} people reached
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {availableZones.map(z => {
            const isChecked = selectedZones.includes(z.name);
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => toggleZone(z.name)}
                className={`p-1.5 rounded text-left border flex items-center justify-between transition-colors ${
                  isChecked ? 'bg-purple-50 border-purple-300 text-purple-900 font-semibold' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <span className="truncate text-[11px]">{z.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({(z.pop / 1000).toFixed(1)}k)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Multilingual Message Editor (EN / ML / HI / TE) */}
      <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-700 uppercase font-mono flex items-center gap-1">
            <Languages className="w-3.5 h-3.5 text-teal-brand" />
            <span>3. Multilingual Alert Drafts</span>
          </label>

          {/* Language Tabs */}
          <div className="flex space-x-1 bg-slate-100 p-0.5 rounded text-[11px] font-bold">
            {[
              { id: 'en', label: 'English' },
              { id: 'ml', label: 'മലയാളം' },
              { id: 'hi', label: 'हिन्दी' },
              { id: 'te', label: 'తెలుగు' },
            ].map(l => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLangTab(l.id as any)}
                className={`px-2 py-0.5 rounded transition-all ${
                  langTab === l.id ? 'bg-navy-800 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-0.5">
            Headline ({langTab.toUpperCase()})
          </label>
          <input
            type="text"
            value={translations[langTab].headline}
            onChange={(e) => {
              const val = e.target.value;
              setTranslations(prev => ({
                ...prev,
                [langTab]: { ...prev[langTab], headline: val }
              }));
            }}
            className="w-full p-2 rounded border border-slate-300 text-xs font-semibold text-navy-900"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-0.5">
            Actionable Instruction ({langTab.toUpperCase()})
          </label>
          <textarea
            rows={2}
            value={translations[langTab].instruction}
            onChange={(e) => {
              const val = e.target.value;
              setTranslations(prev => ({
                ...prev,
                [langTab]: { ...prev[langTab], instruction: val }
              }));
            }}
            className="w-full p-2 rounded border border-slate-300 text-xs text-slate-800"
          />
        </div>

        {/* Mandatory Human Checkbox */}
        <label className="flex items-center space-x-2 cursor-pointer pt-1 border-t border-slate-100">
          <input
            type="checkbox"
            checked={humanTranslationChecked}
            onChange={(e) => setHumanTranslationChecked(e.target.checked)}
            className="rounded text-teal-brand h-4 w-4"
          />
          <span className="text-xs font-medium text-slate-800">
            Needs human translation check (verified by bilingual operator) *
          </span>
        </label>
      </div>

      {/* Step 4: Precaution Picker */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
        <label className="block text-[11px] font-bold text-slate-600 uppercase font-mono">
          4. Recommended Practical Precautions
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {PRECAUTION_ITEMS.map(item => {
            const isSelected = selectedPrecautions.includes(item.label);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => togglePrecaution(item.label)}
                className={`p-2 rounded text-left border flex items-center space-x-2 transition-all ${
                  isSelected ? 'bg-teal-50 border-teal-brand text-teal-900 font-semibold' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-[11px] leading-tight truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 5: Multi-Channel Preview Tabs (App Notification | SMS | Voice | CAP XML) */}
      <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-2">
        <div className="flex items-center justify-between border-b pb-1">
          <label className="text-[11px] font-bold text-slate-600 uppercase font-mono">
            5. Broadcast Previews
          </label>
          <div className="flex space-x-1 text-[11px]">
            {(['app', 'sms', 'voice', 'cap'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setPreviewTab(tab)}
                className={`px-2 py-0.5 rounded font-mono uppercase font-bold ${
                  previewTab === tab ? 'bg-navy-800 text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: App Notification Preview */}
        {previewTab === 'app' && (
          <div className="p-2.5 rounded bg-slate-900 text-white space-y-1">
            <div className="flex items-center justify-between text-[10px] text-teal-300 font-mono">
              <span className="flex items-center gap-1">
                <Bell className="w-3 h-3" />
                COMMUNITY APP NOTIFICATION
              </span>
              <span>NOW</span>
            </div>
            <div className="font-bold text-xs">{activeTranslation.headline}</div>
            <div className="text-[11px] text-slate-300 leading-snug">{activeTranslation.instruction}</div>
            <div className="text-[9px] text-slate-400 mt-1">Tier: {tier} • Population: ~{totalPop.toLocaleString()}</div>
          </div>
        )}

        {/* Tab 2: SMS Preview with 160/70 char counter */}
        {previewTab === 'sms' && (
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1 text-slate-700">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>SMS CELL BROADCAST</span>
              <span className={`font-bold ${isUnicode ? 'text-amber-700' : 'text-slate-700'}`}>
                {smsText.length} chars ({segments} segment{segments > 1 ? 's' : ''})
              </span>
            </div>
            <p className="text-xs font-mono bg-white p-2 rounded border border-slate-200">
              {smsText}
            </p>
            {isUnicode && (
              <div className="text-[10px] text-amber-700">
                Notice: Non-Latin characters trigger 70-character SMS segment billing limit.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Automated Voice Script */}
        {previewTab === 'voice' && (
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1 text-slate-700 font-mono text-[11px]">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Loudspeaker / IVR Broadcast Script:</div>
            <p className="bg-white p-2 rounded border border-slate-200 text-slate-800 leading-relaxed">
              "Attention residents of {selectedZones.join(', ')}. {translations.ml.headline}. {translations.ml.instruction}."
            </p>
          </div>
        )}

        {/* Tab 4: CAP 1.2 XML Preview */}
        {previewTab === 'cap' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">OASIS Common Alerting Protocol v1.2</span>
              <button
                type="button"
                onClick={handleDownloadCAP}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-brand hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CAP 1.2 XML</span>
              </button>
            </div>
            <pre className="p-2 rounded bg-slate-900 text-emerald-400 font-mono text-[10px] overflow-x-auto max-h-32">
              {alertStore.generateCAP12XML({
                id: `CAP-KL-${Date.now()}`,
                incidentId: incident.id,
                tier,
                headline: translations.en.headline,
                instruction: translations.en.instruction,
                translations,
                humanTranslationChecked,
                precautions: selectedPrecautions,
                urgency: 'Immediate',
                severity: 'Extreme',
                certainty: 'Observed',
                affectedZones: selectedZones,
                targetJurisdiction: incident.jurisdiction,
                estimatedPopulationReached: totalPop,
                effectiveFrom,
                effectiveTo,
                evidenceSource: incident.primarySource,
                observationTime: incident.observationTime,
                forecastUncertaintyRef: incident.forecasts['+1h'].modelName,
                officialReference: 'https://ksdma.kerala.gov.in',
                authorizedBy: responder.name,
                authorizedRole: responder.role,
                approvedAt: new Date().toISOString(),
                deliveryStatus: 'Delivered',
                channels: ['App Notification', 'SMS', 'Voice Script', 'CAP XML']
              })}
            </pre>
          </div>
        )}
      </div>

      {/* Action Buttons: Save draft | Request approval | Approve and send (TEST) | Send all-clear */}
      <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSendAlert(true)}
            disabled={!isApprover || !isConfirmed}
            className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold disabled:opacity-40"
            title={!isApprover ? "Only DEOO can send all-clear" : ""}
          >
            Send All-Clear
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSendAlert(false)}
            disabled={!isApprover || !isConfirmed || !humanTranslationChecked}
            className="px-4 py-2 rounded bg-teal-brand hover:bg-teal-hover text-white font-bold flex items-center gap-1.5 shadow-md disabled:opacity-40 transition-all"
            title={
              !isConfirmed ? "Incident must be Confirmed before public release" :
              !isApprover ? "Requires District Emergency Operations Officer role" :
              !humanTranslationChecked ? "Must check human translation confirmation box" : "Approve and send broadcast to Community App"
            }
          >
            <Send className="w-3.5 h-3.5" />
            <span>Approve & Send (TEST)</span>
          </button>
        </div>
      </div>

      {/* Delivery Status Indicator */}
      {deliveryStatus !== 'Idle' && (
        <div className="p-2.5 rounded bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between font-mono animate-in fade-in">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Status: <b>{deliveryStatus}</b> to Shared Realtime Store (&lt; 2s sync)</span>
          </span>
          <span className="text-[10px] text-emerald-700">Towers: 18 • Acks: 3,840</span>
        </div>
      )}
    </div>
  );
};
