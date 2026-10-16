// src/components/layout/Header.tsx
import React, { useState } from 'react';
import {
  ShieldAlert,
  Satellite,
  UserCheck,
  MapPin,
  Clock,
  AlertTriangle,
  RotateCcw,
  Radio,
  Wifi,
  WifiOff,
  ChevronDown,
  Layers
} from 'lucide-react';
import { ResponderRole } from '../../types';

interface HeaderProps {
  responder: {
    name: string;
    callsign: string;
    role: ResponderRole;
    badgeNumber: string;
  };
  jurisdiction: string;
  availableJurisdictions: string[];
  availableRoles: ResponderRole[];
  onRoleChange: (role: ResponderRole) => void;
  onJurisdictionChange: (jurisdiction: string) => void;
  pendingReviewCount: number;
  staleFeedsCount: number;
  onResetSimulation: () => void;
  onOpenFreshnessDrawer: () => void;
  lowBandwidthMode: boolean;
  onToggleLowBandwidth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  responder,
  jurisdiction,
  availableJurisdictions,
  availableRoles,
  onRoleChange,
  onJurisdictionChange,
  pendingReviewCount,
  staleFeedsCount,
  onResetSimulation,
  onOpenFreshnessDrawer,
  lowBandwidthMode,
  onToggleLowBandwidth,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [jurMenuOpen, setJurMenuOpen] = useState(false);

  return (
    <header className="bg-navy-800 text-white border-b border-navy-700 select-none">
      {/* 1. Persistent TEST / HISTORICAL SIMULATION Banner */}
      <div className="bg-testbanner px-4 py-1.5 text-xs font-semibold text-testbanner-text border-b border-testbanner-border flex items-center justify-between shadow-inner">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-200 text-amber-900 uppercase tracking-wider">
            Simulated Environment
          </span>
          <span className="flex items-center gap-1 font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>TEST / HISTORICAL SIMULATION — Not Connected to Live Public EAS Broadcast</span>
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="text-amber-800 hidden md:inline">Ground Truth Run: Oct 16, 2026 UTC</span>
          <button
            onClick={onResetSimulation}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 transition-colors"
            title="Reset simulation incidents and audit logs to initial seed state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* 2. Main Operational Command Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
        {/* Brand & System Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-teal-brand/20 border border-teal-brand/40 flex items-center justify-center text-teal-400 shadow-sm">
            <ShieldAlert className="w-6 h-6 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black tracking-wider text-base uppercase text-white font-mono">
                SENTINEL RESCUE OP COMMAND
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-navy-700 text-teal-300 border border-navy-600">
                EOC v4.1
              </span>
            </div>
            <p className="text-[11px] text-slate-300 tracking-tight hidden sm:block">
              Satellite-Assisted Multi-Hazard Monitoring & Early-Warning System
            </p>
          </div>
        </div>

        {/* Center Indicators: Telemetry Freshness & Pending Alerts */}
        <div className="flex items-center space-x-2 md:space-x-3 text-xs">
          {/* Data Freshness Button */}
          <button
            onClick={onOpenFreshnessDrawer}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-navy-900/80 hover:bg-navy-900 border border-navy-600 text-slate-200 transition-colors"
            title="View satellite telemetry latency and sensor freshness"
          >
            <Satellite className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline text-slate-400">Feeds:</span>
            {staleFeedsCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-amber-400 font-semibold font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                {staleFeedsCount} Delayed / Stale
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Nominal Latency
              </span>
            )}
            <Clock className="w-3 h-3 text-slate-400 ml-1" />
          </button>

          {/* Pending Review Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-navy-900/80 border border-navy-600">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300 hidden md:inline">Reviews:</span>
            <span className="font-mono font-bold text-amber-300 bg-amber-950/60 px-1.5 rounded border border-amber-800">
              {pendingReviewCount} Pending
            </span>
          </div>

          {/* Low Bandwidth Mode Toggle */}
          <button
            onClick={onToggleLowBandwidth}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-colors ${
              lowBandwidthMode
                ? 'bg-amber-950/70 border-amber-600 text-amber-300'
                : 'bg-navy-900/80 border-navy-600 text-slate-300 hover:text-white'
            }`}
            title="Toggle Low-Bandwidth compressed vector telemetry mode for field operations"
          >
            {lowBandwidthMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="text-[11px] font-medium hidden lg:inline">
              {lowBandwidthMode ? 'Field Low-BW Active' : 'High-Bandwidth Sync'}
            </span>
          </button>
        </div>

        {/* Right Section: Assigned Jurisdiction & Responder Role Switcher */}
        <div className="flex items-center space-x-2">
          {/* Jurisdiction Selector */}
          <div className="relative">
            <button
              onClick={() => { setJurMenuOpen(!jurMenuOpen); setRoleMenuOpen(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-navy-700/80 hover:bg-navy-700 border border-navy-600 text-xs text-slate-100 max-w-[210px] truncate"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span className="truncate text-left">{jurisdiction}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {jurMenuOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-navy-900 border border-navy-700 rounded-md shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px] border-b border-navy-800">
                  Assigned Operational Jurisdiction
                </div>
                {availableJurisdictions.map(jur => (
                  <button
                    key={jur}
                    onClick={() => { onJurisdictionChange(jur); setJurMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-navy-800 ${
                      jur === jurisdiction ? 'text-teal-300 font-semibold bg-navy-800/60' : 'text-slate-300'
                    }`}
                  >
                    <span>{jur}</span>
                    {jur === jurisdiction && <span className="text-[10px] bg-teal-900/60 text-teal-300 px-1 rounded">Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Responder Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => { setRoleMenuOpen(!roleMenuOpen); setJurMenuOpen(false); }}
              className="flex items-center gap-2 px-2.5 py-1 rounded bg-teal-brand/15 hover:bg-teal-brand/25 border border-teal-brand/40 text-xs text-white transition-colors"
              title="Click to switch responder role to test role-based permissions"
            >
              <div className="w-6 h-6 rounded-full bg-teal-brand flex items-center justify-center font-bold text-[11px] text-white">
                {responder.callsign.substring(0, 2)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-semibold text-white leading-tight flex items-center gap-1">
                  <span>{responder.name}</span>
                  <span className="text-[10px] font-mono text-teal-300">[{responder.callsign}]</span>
                </div>
                <div className="text-[10px] text-teal-200/80 leading-none">
                  Role: <span className="font-bold underline text-white">{responder.role}</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-72 bg-navy-900 border border-navy-700 rounded-md shadow-2xl py-1 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-navy-800">
                  <div className="font-bold text-white text-xs">{responder.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Badge: {responder.badgeNumber} • {responder.callsign}</div>
                  <div className="text-[10px] text-teal-400 mt-1">
                    Select a role to test operational permissions:
                  </div>
                </div>

                <div className="py-1">
                  {availableRoles.map(role => (
                    <button
                      key={role}
                      onClick={() => { onRoleChange(role); setRoleMenuOpen(false); }}
                      className={`w-full text-left px-3 py-2 flex flex-col hover:bg-navy-800 transition-colors ${
                        role === responder.role ? 'bg-navy-800 text-teal-300 font-bold border-l-2 border-teal-400' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{role}</span>
                        {role === responder.role && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {role === 'Viewer' && 'Read-only access to incidents and telemetry'}
                        {role === 'Analyst' && 'Inspect observations, add operational annotations'}
                        {role === 'Incident Reviewer' && 'Confirm or reject detections, assign field units'}
                        {role === 'Authorized Approver' && 'Full authority to approve and broadcast public warnings'}
                        {role === 'Administrator' && 'Master authority across all system controls'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
