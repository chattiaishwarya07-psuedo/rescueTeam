// src/components/layout/Sidebar.tsx
import React from 'react';
import {
  ShieldAlert,
  Map,
  Truck,
  Activity,
  Navigation,
  Home,
  Radio,
  FileText,
  Wifi,
  Lock,
  Layers
} from 'lucide-react';

export type ActiveModule =
  | 'incident_overview'
  | 'live_dispatch_map'
  | 'rescue_units'
  | 'telemetry_sensors'
  | 'evacuation_corridors'
  | 'shelter_management'
  | 'comms_relay'
  | 'post_incident_logs';

interface SidebarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  lowBandwidth: boolean;
  onToggleLowBandwidth: () => void;
  pendingReviewCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  lowBandwidth,
  onToggleLowBandwidth,
  pendingReviewCount,
}) => {
  const commandCenterNav = [
    {
      id: 'incident_overview' as ActiveModule,
      label: 'Incident Overview',
      icon: Layers,
      badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
    },
    {
      id: 'live_dispatch_map' as ActiveModule,
      label: 'Live Dispatch Map',
      icon: Map,
    },
    {
      id: 'rescue_units' as ActiveModule,
      label: 'Rescue Units',
      icon: Truck,
      badge: '5 Units',
    },
    {
      id: 'telemetry_sensors' as ActiveModule,
      label: 'Telemetry & Sensors',
      icon: Activity,
    },
  ];

  const logisticsNav = [
    {
      id: 'evacuation_corridors' as ActiveModule,
      label: 'Evacuation Corridors',
      icon: Navigation,
    },
    {
      id: 'shelter_management' as ActiveModule,
      label: 'Shelter Management',
      icon: Home,
    },
    {
      id: 'comms_relay' as ActiveModule,
      label: 'Comms & SOS Relay',
      icon: Radio,
    },
    {
      id: 'post_incident_logs' as ActiveModule,
      label: 'Post-Incident Logs',
      icon: FileText,
    },
  ];

  return (
    <aside className="w-64 bg-card border-r border-slate-200 flex flex-col justify-between shrink-0 select-none hidden md:flex">
      {/* Top Branding / Node Status */}
      <div>
        <div className="p-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-navy-800 flex items-center justify-center text-teal-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-navy-800 tracking-tight leading-none font-mono">
                SENTINEL RESCUE
              </div>
              <div className="text-[10px] text-slate-500 font-mono tracking-wider mt-0.5">
                OP COMMAND V4.1
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-mono text-[10px] tracking-wider uppercase font-semibold">
              Node Status
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SECURE EOC
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 py-4 space-y-6">
          {/* Command Center */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              Command Center
            </div>
            <nav className="space-y-1">
              {commandCenterNav.map(item => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectModule(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-navy-800 font-semibold shadow-sm border border-blue-100'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-teal-brand' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Logistics & Evacuation */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              Logistics & Evacuation
            </div>
            <nav className="space-y-1">
              {logisticsNav.map(item => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectModule(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-navy-800 font-semibold shadow-sm border border-blue-100'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-teal-brand' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Data Mode Card matching reference image */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80">
        <button
          onClick={onToggleLowBandwidth}
          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-colors text-left"
        >
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              Data Mode
            </div>
            <div className="text-xs font-semibold text-navy-800">
              {lowBandwidth ? 'Low-Bandwidth Sync' : 'High-Speed Broadband'}
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
            lowBandwidth
              ? 'bg-teal-50 border-teal-300 text-teal-brand'
              : 'bg-emerald-50 border-emerald-300 text-emerald-600'
          }`}>
            <Wifi className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>
    </aside>
  );
};
