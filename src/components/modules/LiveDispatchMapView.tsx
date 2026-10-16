// src/components/modules/LiveDispatchMapView.tsx
import React, { useState } from 'react';
import { Map, Layers, Truck, AlertTriangle, Radio, Navigation, Compass } from 'lucide-react';
import { OperationsMap } from '../map/OperationsMap';
import { Incident, RescueUnit } from '../../types';

interface LiveDispatchMapViewProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (id: string) => void;
  forecastHorizon: 'now' | '+1h' | '+3h' | '+6h';
  onForecastHorizonChange: (h: 'now' | '+1h' | '+3h' | '+6h') => void;
  rescueUnits: RescueUnit[];
  onOpenAlertModal: (inc: Incident) => void;
}

export const LiveDispatchMapView: React.FC<LiveDispatchMapViewProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  forecastHorizon,
  onForecastHorizonChange,
  rescueUnits,
  onOpenAlertModal,
}) => {
  const [targetGeofenceActive, setTargetGeofenceActive] = useState(false);

  return (
    <div className="flex-1 relative w-full h-full bg-slate-100 flex flex-col overflow-hidden">
      {/* Full Operational Map */}
      <OperationsMap
        incidents={incidents}
        selectedIncident={selectedIncident}
        onSelectIncident={onSelectIncident}
        forecastHorizon={forecastHorizon}
        onForecastHorizonChange={onForecastHorizonChange}
        rescueUnits={rescueUnits}
        targetAlertZonePolygon={
          targetGeofenceActive && selectedIncident
            ? selectedIncident.forecasts[forecastHorizon]?.polygon
            : undefined
        }
      />

      {/* Floating Tactical Heads-Up Display (HUD) */}
      <div className="absolute top-16 left-3 z-[400] bg-navy-900/90 backdrop-blur-md rounded-lg border border-navy-700 shadow-2xl p-3 text-white max-w-xs space-y-2 select-none">
        <div className="flex items-center justify-between border-b border-navy-800 pb-1.5">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-teal-300">
              Live Tactical HUD
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">GRID 45.5°N</span>
        </div>

        {selectedIncident ? (
          <div className="space-y-1.5 text-xs">
            <div className="font-bold text-slate-100">{selectedIncident.title}</div>
            <div className="text-[11px] text-slate-300 font-mono">
              Sector: {selectedIncident.locationName}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-slate-300">
              <div>Footprint: <b className="text-teal-300">{selectedIncident.estimatedAffectedAreaKm2} km²</b></div>
              <div>Confidence: <b className="text-emerald-400">{selectedIncident.confidenceScore}%</b></div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setTargetGeofenceActive(!targetGeofenceActive)}
                className={`flex-1 py-1 px-2 rounded text-[11px] font-semibold border transition-all ${
                  targetGeofenceActive
                    ? 'bg-purple-600 border-purple-400 text-white shadow-sm'
                    : 'bg-navy-800 hover:bg-navy-700 border-navy-600 text-slate-200'
                }`}
              >
                {targetGeofenceActive ? 'Geofence Active' : 'Target Geofence'}
              </button>

              <button
                onClick={() => onOpenAlertModal(selectedIncident)}
                className="py-1 px-2.5 rounded bg-teal-brand hover:bg-teal-hover text-white text-[11px] font-bold shadow-sm"
              >
                Issue Warning
              </button>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic">
            Click any hazard marker on the map to bind tactical telemetry.
          </div>
        )}
      </div>
    </div>
  );
};
