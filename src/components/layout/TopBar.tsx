// src/components/layout/TopBar.tsx
import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Satellite, 
  Clock, 
  ChevronDown, 
  RotateCcw, 
  AlertTriangle, 
  Radio, 
  Check, 
  UserCheck, 
  Info,
  Layers
} from 'lucide-react';
import { ResponderRole, TelemetryFeed } from '../../types';

interface TopBarProps {
  responder: {
    name: string;
    badgeNumber: string;
    role: ResponderRole;
    jurisdiction: string;
  };
  jurisdiction: string;
  selectedSector: string;
  availableJurisdictions: string[];
  availableSectors: string[];
  onJurisdictionChange: (j: string) => void;
  onSectorChange: (s: string) => void;
  onRoleChange: (r: ResponderRole) => void;
  pendingReviewsCount: number;
  feeds: TelemetryFeed[];
  onOpenDataSources: () => void;
  onResetDemo: () => void;
  onOpenAbout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  responder,
  jurisdiction,
  selectedSector,
  availableJurisdictions,
  availableSectors,
  onJurisdictionChange,
  onSectorChange,
  onRoleChange,
  pendingReviewsCount,
  feeds,
  onOpenDataSources,
  onResetDemo,
  onOpenAbout,
}) => {
  const [jurMenuOpen, setJurMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const staleCount = feeds.filter(f => f.status === 'Delayed' || f.status === 'Stale').length;
  const totalFeeds = feeds.length;

  return (
    <div className="select-none flex flex-col z-30 shrink-0">
      {/* 1. Main 56px Top Bar */}
      <header className="h-14 bg-navy-800 text-white px-4 border-b border-navy-700 flex items-center justify-between gap-2 shadow-sm">
        {/* Left: Brand + Prototype Tag */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <div className="w-8 h-8 rounded bg-teal-brand/20 border border-teal-brand/50 flex items-center justify-center text-teal-300">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-black text-sm tracking-wide text-white font-mono">
              Sentinel Rescue Ops
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-navy-700 text-teal-300 border border-navy-600">
              Prototype
            </span>
          </div>
        </div>

        {/* Centre: Jurisdiction & Sector Filter */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Jurisdiction Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setJurMenuOpen(!jurMenuOpen); setRoleMenuOpen(false); }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-navy-900/90 hover:bg-navy-900 border border-navy-600 text-xs text-slate-200 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="font-semibold text-slate-100">{jurisdiction}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {jurMenuOpen && (
              <div className="absolute left-0 mt-1 w-72 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-100">
                  Select Disaster Jurisdiction (KSDMA)
                </div>
                {availableJurisdictions.map(jur => (
                  <button
                    key={jur}
                    onClick={() => { onJurisdictionChange(jur); setJurMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                      jur === jurisdiction ? 'text-teal-brand font-bold bg-teal-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span>{jur}</span>
                    {jur === jurisdiction && <Check className="w-3.5 h-3.5 text-teal-brand" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sector Sub-Filter */}
          <div className="flex items-center space-x-1 bg-navy-900/90 border border-navy-600 rounded-md px-2 py-1 text-xs">
            <span className="text-slate-400 text-[11px]">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => onSectorChange(e.target.value)}
              className="bg-transparent text-slate-100 text-xs font-medium focus:outline-none cursor-pointer pr-1"
            >
              {availableSectors.map(s => (
                <option key={s} value={s} className="bg-navy-900 text-slate-100">{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Data Freshness Pill, Pending Count, Role Badge & User Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          {/* Data Freshness Pill */}
          <button
            onClick={onOpenDataSources}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border transition-all ${
              staleCount > 0 
                ? 'bg-amber-950/80 border-amber-600 text-amber-300 hover:bg-amber-900' 
                : 'bg-navy-900/90 border-navy-600 text-emerald-300 hover:bg-navy-900'
            }`}
            title="Inspect sensor revisit intervals and data latency"
          >
            <Satellite className={`w-3.5 h-3.5 ${staleCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span className="font-mono text-[11px] font-semibold">
              Data: {staleCount > 0 ? `${staleCount} of ${totalFeeds} feeds stale` : 'All feeds nominal'}
            </span>
          </button>

          {/* Pending Reviews Count */}
          <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded bg-navy-900/80 border border-navy-600 text-slate-300 text-[11px]">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-bold text-amber-300">{pendingReviewsCount}</span>
            <span>awaiting review</span>
          </div>

          {/* User Menu & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => { setRoleMenuOpen(!roleMenuOpen); setJurMenuOpen(false); }}
              className="flex items-center space-x-2 px-2.5 py-1 rounded bg-teal-brand/15 hover:bg-teal-brand/25 border border-teal-brand/40 text-white transition-colors"
              title="Click to switch role (Viewer, Incident Reviewer, District Emergency Operations Officer)"
            >
              <div className="w-6 h-6 rounded-full bg-teal-brand text-white flex items-center justify-center font-bold text-[10px]">
                {responder.role === 'District Emergency Operations Officer' ? 'DEO' : responder.role === 'Incident Reviewer' ? 'REV' : 'VW'}
              </div>
              <div className="text-left hidden lg:block">
                <div className="font-semibold text-xs leading-tight text-white flex items-center gap-1">
                  <span>{responder.name}</span>
                  <span className="text-[10px] text-teal-300 font-mono">[{responder.badgeNumber}]</span>
                </div>
                <div className="text-[10px] text-slate-300 leading-none">
                  Role: <span className="text-teal-200 font-bold">{responder.role}</span>
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-72 bg-white text-slate-800 rounded-lg shadow-2xl border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <div className="font-bold text-slate-900">{responder.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">ID: {responder.badgeNumber}</div>
                  <div className="text-[10px] text-teal-700 font-semibold mt-1">
                    Select operational role to test authorization controls:
                  </div>
                </div>

                <div className="py-1">
                  {(['Viewer', 'Incident Reviewer', 'District Emergency Operations Officer'] as ResponderRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => { onRoleChange(role); setRoleMenuOpen(false); }}
                      className={`w-full text-left px-3 py-2 flex flex-col hover:bg-slate-50 transition-colors ${
                        role === responder.role ? 'bg-teal-50/70 border-l-2 border-teal-brand text-teal-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{role}</span>
                        {role === responder.role && <Check className="w-3.5 h-3.5 text-teal-brand" />}
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal mt-0.5">
                        {role === 'Viewer' && 'Read-only access to map, incidents, and metrics.'}
                        {role === 'Incident Reviewer' && 'Confirm or reject detections, append tactical notes.'}
                        {role === 'District Emergency Operations Officer' && 'Statutory authority to approve & release public warnings.'}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-1 px-2">
                  <button
                    onClick={() => { onOpenAbout(); setRoleMenuOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 text-[11px] text-slate-600 flex items-center space-x-1.5"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>System Architecture & Roadmap</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Slim Amber Banner with Simulation Text and Reset Button */}
      <div className="bg-testbanner px-4 py-1 text-xs text-testbanner-text border-b border-testbanner-border flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-200 text-amber-900 uppercase tracking-wider font-mono">
            Exercise Mode
          </span>
          <span className="flex items-center gap-1.5 text-amber-900 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>TEST / SIMULATION — Replay data calibrated for Ernakulam / Periyar Basin. Not connected to active public EAS sirens.</span>
          </span>
        </div>
        <button
          onClick={onResetDemo}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 text-[11px] font-semibold transition-colors"
          title="Reset incidents, forecasts and audit logs to initial seed replay state"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset demo state</span>
        </button>
      </div>
    </div>
  );
};
