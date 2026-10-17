// src/components/layout/AboutModal.tsx
import React from 'react';
import { Info, X, ShieldAlert, Layers, MapPin, CheckCircle2, Clock } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-xl w-full p-5 space-y-4 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-teal-brand/20 border border-teal-brand flex items-center justify-center text-teal-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-navy-900 font-mono">
                Sentinel Rescue Ops — System Architecture
              </div>
              <div className="text-[11px] text-slate-500">
                Satellite-Assisted Multi-Hazard Early-Warning Operations
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Principles */}
        <div className="space-y-2 text-slate-700 leading-relaxed">
          <div className="font-bold text-navy-900 text-xs font-mono uppercase">
            Operational Doctrine & Scope:
          </div>
          <p>
            Sentinel Rescue Ops is engineered exclusively for authorized disaster management personnel under the <b>NDMA Incident Response System (IRS)</b> guidelines. It provides evidence-backed situational awareness answering three critical questions:
          </p>
          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center pt-1">
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-teal-700 block">1. What is happening?</span>
              <span className="text-slate-500 text-[10px]">SAR backscatter & telemetry</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-teal-700 block">2. How sure are we?</span>
              <span className="text-slate-500 text-[10px]">Confidence & uncertainty envelopes</span>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-200">
              <span className="font-bold text-teal-700 block">3. What next?</span>
              <span className="text-slate-500 text-[10px]">Targeted public alerts</span>
            </div>
          </div>
        </div>

        {/* Operational Roadmap (Out-of-Scope Modules) */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="font-bold text-navy-900 font-mono text-xs uppercase flex items-center justify-between">
            <span>Operational Roadmap (Next Phases)</span>
            <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">Phase 2.0</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Per architectural scope guidelines, field execution modules are decoupled from the EOC command dashboard and scheduled for Phase 2:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 font-mono">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Rescue Units AVL Tracking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Evacuation Corridor Telemetry</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Shelter Capacity Sensor Network</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Direct Citizen SOS Relay</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-navy-800 text-white font-semibold hover:bg-navy-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
