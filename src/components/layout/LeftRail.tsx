// src/components/layout/LeftRail.tsx
import React from 'react';
import { 
  Layers, 
  Map as MapIcon, 
  Megaphone, 
  BarChart3, 
  Satellite, 
  History, 
  Info,
  HelpCircle
} from 'lucide-react';

export type MainNavView = 'incidents' | 'map' | 'alerts' | 'metrics' | 'datasources' | 'audit';

interface LeftRailProps {
  activeView: MainNavView;
  onSelectView: (view: MainNavView) => void;
  pendingReviewsCount: number;
  onOpenAbout: () => void;
}

export const LeftRail: React.FC<LeftRailProps> = ({
  activeView,
  onSelectView,
  pendingReviewsCount,
  onOpenAbout,
}) => {
  const navItems = [
    {
      id: 'incidents' as MainNavView,
      label: 'Incidents',
      icon: Layers,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
    {
      id: 'map' as MainNavView,
      label: 'Operational Map',
      icon: MapIcon,
    },
    {
      id: 'alerts' as MainNavView,
      label: 'Public Warnings',
      icon: Megaphone,
    },
    {
      id: 'metrics' as MainNavView,
      label: 'Model Metrics',
      icon: BarChart3,
    },
    {
      id: 'datasources' as MainNavView,
      label: 'Data Sources',
      icon: Satellite,
    },
    {
      id: 'audit' as MainNavView,
      label: 'Audit Trail',
      icon: History,
    },
  ];

  return (
    <aside className="group w-14 hover:w-56 transition-all duration-200 bg-navy-950 text-slate-300 flex flex-col justify-between py-3 border-r border-navy-800 z-40 select-none shrink-0 shadow-lg overflow-hidden">
      {/* Top Nav Items */}
      <div className="space-y-1 px-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center h-10 px-2.5 rounded-lg text-xs font-semibold transition-all relative ${
                isActive 
                  ? 'bg-teal-brand text-white shadow-md' 
                  : 'hover:bg-navy-800 hover:text-white text-slate-400'
              }`}
              title={item.label}
            >
              <div className="w-5 flex items-center justify-center shrink-0">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              </div>

              {/* Expanding label on hover */}
              <span className="ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.label}
              </span>

              {/* Badge */}
              {item.badge && (
                <span className={`ml-auto px-1.5 py-0.2 text-[10px] font-bold rounded-full font-mono ${
                  isActive ? 'bg-navy-950 text-teal-300' : 'bg-amber-500 text-navy-950'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom info button */}
      <div className="px-2 pt-2 border-t border-navy-900">
        <button
          onClick={onOpenAbout}
          className="w-full flex items-center h-10 px-2.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-navy-800 hover:text-slate-200 transition-all"
          title="System Architecture & Operational Roadmap"
        >
          <div className="w-5 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-slate-400" />
          </div>
          <span className="ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            About & Roadmap
          </span>
        </button>
      </div>
    </aside>
  );
};
