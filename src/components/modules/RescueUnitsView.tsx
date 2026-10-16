// src/components/modules/RescueUnitsView.tsx
import React, { useState } from 'react';
import { Truck, Radio, Navigation, Users, ShieldAlert, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { RescueUnit } from '../../types';

interface RescueUnitsViewProps {
  rescueUnits: RescueUnit[];
  onSelectUnit?: (unit: RescueUnit) => void;
}

export const RescueUnitsView: React.FC<RescueUnitsViewProps> = ({ rescueUnits }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = rescueUnits.filter(u => filterType === 'all' || u.unitType === filterType);

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto select-none">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-navy-800 font-mono uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-5 h-5 text-teal-brand" />
            <span>Operational Rescue Units & Strike Teams</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time readiness, apparatus equipment status, field tactical communications, and unit assignments.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">Filter Capability:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-1.5 rounded border border-slate-300 bg-white text-slate-800"
          >
            <option value="all">All Tactical Units ({rescueUnits.length})</option>
            <option value="Swiftwater Rescue">Swiftwater Rescue</option>
            <option value="Wildland Firefighting">Wildland Firefighting</option>
            <option value="Helitack Search & Rescue">Helitack SAR</option>
            <option value="Medical Evac">Medical Evac</option>
            <option value="Structural Assessment">Structural Assessment</option>
          </select>
        </div>
      </div>

      {/* Grid of Unit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(unit => (
          <div key={unit.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:border-slate-300 transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-navy-900 text-sm">{unit.callsign}</div>
                <div className="text-[11px] text-teal-700 font-medium">{unit.unitType}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                unit.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                unit.status === 'On Scene' ? 'bg-blue-100 text-blue-800' :
                unit.status === 'Dispatched' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {unit.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded">
              <div>
                <span className="text-[10px] text-slate-400 block">Personnel:</span>
                <span className="font-semibold text-slate-800">{unit.personnelCount} Responders</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Comms Channel:</span>
                <span className="font-mono font-semibold text-slate-800">{unit.radioFrequency}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Staging Base:</span>
                <span className="text-slate-800 truncate block">{unit.locationName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Target Incident:</span>
                <span className="font-mono text-teal-700 font-bold">{unit.assignedIncidentId || 'Standby'}</span>
              </div>
            </div>

            <div className="text-xs text-slate-600">
              <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-0.5">
                Onboard Apparatus & Rigging:
              </span>
              <p className="text-[11px] text-slate-700 leading-snug">{unit.equipmentSummary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
