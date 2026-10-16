// src/components/incidents/UnitDispatchModal.tsx
import React, { useState } from 'react';
import { Truck, X, CheckCircle2, Navigation, Radio, Users, ShieldAlert } from 'lucide-react';
import { Incident, RescueUnit } from '../../types';

interface UnitDispatchModalProps {
  incident: Incident;
  rescueUnits: RescueUnit[];
  onClose: () => void;
  onAssignUnit: (incidentId: string, callsign: string) => void;
}

export const UnitDispatchModal: React.FC<UnitDispatchModalProps> = ({
  incident,
  rescueUnits,
  onClose,
  onAssignUnit,
}) => {
  const [selectedUnitCallsign, setSelectedUnitCallsign] = useState(
    incident.assignedTeam || rescueUnits[0]?.callsign || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitCallsign) return;
    onAssignUnit(incident.id, selectedUnitCallsign);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-lg w-full overflow-hidden select-none">
        {/* Header */}
        <div className="bg-navy-800 text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-teal-300" />
            <div>
              <div className="font-bold text-sm font-mono uppercase">
                Dispatch / Route Rescue Units
              </div>
              <div className="text-[11px] text-teal-300">
                Incident: {incident.id} ({incident.title})
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Units Selector */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div className="text-slate-600">
            Select a specialized tactical team based on hazard type (<b>{incident.hazardType.toUpperCase()}</b>) and proximity:
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {rescueUnits.map((unit) => {
              const isSelected = selectedUnitCallsign === unit.callsign;
              const isAssignedToThis = incident.assignedTeam === unit.callsign;

              return (
                <div
                  key={unit.id}
                  onClick={() => setSelectedUnitCallsign(unit.callsign)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-teal-brand ring-1 ring-teal-brand'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-navy-900 flex items-center gap-1.5">
                      <span>{unit.callsign}</span>
                      {isAssignedToThis && (
                        <span className="text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-mono">
                          Current Assignment
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      unit.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                      unit.status === 'On Scene' ? 'bg-blue-100 text-blue-800' :
                      unit.status === 'Dispatched' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {unit.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mt-1">
                    <div>Type: <b className="text-slate-800">{unit.unitType}</b></div>
                    <div>Comms: <b className="font-mono text-slate-800">{unit.radioFrequency}</b></div>
                    <div>Location: <span>{unit.locationName}</span></div>
                    <div>ETA: <b className="text-teal-700">{unit.etaMinutes !== undefined ? `${unit.etaMinutes} min` : 'Available'}</b></div>
                  </div>

                  <div className="text-[10px] text-slate-500 mt-1.5 pt-1 border-t border-slate-100">
                    Equipment: {unit.equipmentSummary}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-navy-800 hover:bg-navy-900 text-white font-bold"
            >
              Confirm Unit Deployment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
