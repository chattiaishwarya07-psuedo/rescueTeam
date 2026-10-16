// src/components/modules/ShelterEvacuationView.tsx
import React from 'react';
import { Navigation, Home, AlertTriangle, CheckCircle2, Users, MapPin } from 'lucide-react';

export const ShelterEvacuationView: React.FC = () => {
  const corridors = [
    {
      id: "CORR-01",
      name: "Highway 224 Westbound Evacuation Arterial",
      status: "Open & Clear",
      capacityRate: "1,200 vehicles/hr",
      hazardProximity: "0.8 km north of Clearwater flood inundation",
      evacZone: "Clearwater Sector 4 Lowlands",
    },
    {
      id: "CORR-02",
      name: "Mountain Pass 26 Highway",
      status: "Restricted (One Lane)",
      capacityRate: "350 vehicles/hr (Escorted Convoy)",
      hazardProximity: "Adjacent to active slope creep MP 38",
      evacZone: "Cascade Mountain Escarpment",
    },
    {
      id: "CORR-03",
      name: "Old Mill Creek Ridge Access Road",
      status: "Closed (Fire Threat)",
      capacityRate: "0 vehicles/hr",
      hazardProximity: "Inside Timberline Wildfire 1-hour spread projection",
      evacZone: "Timberline Sector 9",
    }
  ];

  const shelters = [
    {
      id: "SHELTER-A",
      name: "Clearwater High School Regional Gym & Fieldhouse",
      location: "1240 High School Way, Clearwater",
      capacity: 850,
      occupied: 312,
      supplies: "Adequate (Water, MREs, Cots, Red Cross Staff on site)",
      status: "Accepting Evacuees",
    },
    {
      id: "SHELTER-B",
      name: "Western County Fairgrounds Pavilion",
      location: "800 Fairgrounds Rd, Cascade Basin",
      capacity: 1500,
      occupied: 640,
      supplies: "Adequate (Pet Accommodations & Large Animal Corrals Available)",
      status: "Accepting Evacuees",
    },
    {
      id: "SHELTER-C",
      name: "Timberline Community Recreation Center",
      location: "310 Ridge Ave, Timberline",
      capacity: 400,
      occupied: 0,
      supplies: "Pre-positioned",
      status: "Standby (Pre-Evacuation Staging)",
    }
  ];

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto select-none">
      <div>
        <h2 className="text-lg font-bold text-navy-800 font-mono uppercase tracking-wider flex items-center gap-2">
          <Navigation className="w-5 h-5 text-teal-brand" />
          <span>Evacuation Corridors & Mass Shelter Management</span>
        </h2>
        <p className="text-xs text-slate-500">
          Emergency egress route clearance status, traffic chokepoints, and congregate shelter capacities.
        </p>
      </div>

      {/* Corridors Grid */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-navy-800 uppercase font-mono tracking-wider">
          Designated Evacuation Corridors
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {corridors.map(c => (
            <div key={c.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-navy-900 text-sm flex items-center gap-2">
                  <span>{c.name}</span>
                  <span className="font-mono text-[10px] text-slate-500">[{c.id}]</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Route clearance for {c.evacZone}</div>
                <div className="text-[11px] text-slate-600 mt-1">Hazard Proximity: <b className="text-navy-800">{c.hazardProximity}</b></div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-600 font-mono">{c.capacityRate}</span>
                <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                  c.status.includes('Open') ? 'bg-emerald-100 text-emerald-800' :
                  c.status.includes('Restricted') ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {shelters.map(s => {
          const occupancyPct = Math.round((s.occupied / s.capacity) * 100);
          return (
            <div key={s.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-navy-900 text-sm">{s.name}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-teal-brand" />
                    <span>{s.location}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Shelter Occupancy:</span>
                  <span className="font-bold font-mono text-navy-800">{s.occupied} / {s.capacity} ({occupancyPct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      occupancyPct > 80 ? 'bg-critical' : occupancyPct > 40 ? 'bg-amber-500' : 'bg-teal-brand'
                    }`}
                    style={{ width: `${occupancyPct}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded">
                <div>Status: <b className="text-emerald-700">{s.status}</b></div>
                <div className="mt-0.5 text-slate-500">{s.supplies}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
