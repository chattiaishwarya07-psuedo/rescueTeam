// src/components/map/OperationsMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Eye,
  EyeOff,
  Crosshair,
  Maximize2,
  Compass,
  ShieldAlert,
  MapPin,
  Navigation,
  Clock,
  AlertCircle,
  Truck
} from 'lucide-react';
import { Incident, RescueUnit, ForecastStep } from '../../types';

interface OperationsMapProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (id: string) => void;
  forecastHorizon: 'now' | '+1h' | '+3h' | '+6h';
  onForecastHorizonChange: (horizon: 'now' | '+1h' | '+3h' | '+6h') => void;
  rescueUnits: RescueUnit[];
  targetAlertZonePolygon?: [number, number][];
  isGeofenceSelectionActive?: boolean;
  onGeofencePolygonCreated?: (polygon: [number, number][]) => void;
}

export const OperationsMap: React.FC<OperationsMapProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  forecastHorizon,
  onForecastHorizonChange,
  rescueUnits,
  targetAlertZonePolygon,
  isGeofenceSelectionActive = false,
  onGeofencePolygonCreated,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer groups refs
  const markersLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const observedExtentLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const forecastLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const uncertaintyLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const rescueUnitsLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const geofenceTargetLayerRef = useRef<L.LayerGroup>(L.layerGroup());

  // Layer Visibility state
  const [layersOpen, setLayersOpen] = useState(false);
  const [showSourceObs, setShowSourceObs] = useState(true);
  const [showObservedExtent, setShowObservedExtent] = useState(true);
  const [showPredictedSpread, setShowPredictedSpread] = useState(true);
  const [showUncertaintyBuffer, setShowUncertaintyBuffer] = useState(true);
  const [showRescueUnits, setShowRescueUnits] = useState(true);
  const [showJurisdictionBorders, setShowJurisdictionBorders] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered around Pacific Northwest / Clearwater River Valley coordinates
    const map = L.map(mapContainerRef.current, {
      center: [45.52, -122.58],
      zoom: 11,
      zoomControl: false,
    });

    // High clarity CartoDB Positron / OSM tiles designed for emergency maps
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Zoom control at top-left
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Add Layer Groups
    markersLayerRef.current.addTo(map);
    observedExtentLayerRef.current.addTo(map);
    forecastLayerRef.current.addTo(map);
    uncertaintyLayerRef.current.addTo(map);
    rescueUnitsLayerRef.current.addTo(map);
    geofenceTargetLayerRef.current.addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Incident Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersLayerRef.current.clearLayers();

    if (!showSourceObs) return;

    incidents.forEach((inc) => {
      const isSelected = selectedIncident?.id === inc.id;

      // Color scheme according to severity & hazard
      const color =
        inc.severity === 'critical' ? '#B42318' :
        inc.severity === 'high' ? '#EA580C' :
        inc.severity === 'moderate' ? '#D97706' : '#087F8C';

      const hazardGlyph =
        inc.hazardType === 'flood' ? '🌊' :
        inc.hazardType === 'wildfire' ? '🔥' :
        inc.hazardType === 'severe_weather' ? '⛈️' : '⛰️';

      const customIcon = L.divIcon({
        className: 'custom-hazard-marker',
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            ${isSelected ? `
              <div class="pulse-hazard" style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: ${color}; opacity: 0.35;"></div>
            ` : ''}
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: ${color};
              border: 2px solid #FFFFFF;
              box-shadow: 0 3px 8px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: white;
              cursor: pointer;
              transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
              transition: transform 0.2s ease;
            ">
              ${hazardGlyph}
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([inc.center.lat, inc.center.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectIncident(inc.id);
      });

      marker.bindTooltip(`
        <div style="font-family: sans-serif; font-size: 11px;">
          <div style="font-weight: 700; color: #142D4E;">${inc.id}: ${inc.hazardType.toUpperCase()}</div>
          <div style="color: #475569;">${inc.locationName}</div>
          <div style="font-size: 10px; color: ${color}; font-weight: 600;">${inc.severity.toUpperCase()} • ${inc.confidenceScore}% CONFIDENCE</div>
        </div>
      `, { offset: [0, -14], direction: 'top' });

      markersLayerRef.current.addLayer(marker);
    });
  }, [incidents, selectedIncident, showSourceObs, onSelectIncident]);

  // Update Polygons for Selected Incident: Observed Extent, Predicted Spread, Uncertainty Envelope
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    observedExtentLayerRef.current.clearLayers();
    forecastLayerRef.current.clearLayers();
    uncertaintyLayerRef.current.clearLayers();

    if (!selectedIncident) return;

    // 1. Observed Hazard Extent Layer (Solid boundary, distinct hatch pattern)
    if (showObservedExtent && selectedIncident.observedExtentPolygon.length > 2) {
      const color = selectedIncident.hazardType === 'wildfire' ? '#DC2626' :
                    selectedIncident.hazardType === 'flood' ? '#0284C7' : '#D97706';

      const observedPoly = L.polygon(selectedIncident.observedExtentPolygon as any, {
        color: color,
        weight: 2.5,
        fillColor: color,
        fillOpacity: 0.25,
        dashArray: 'none',
      });

      observedPoly.bindPopup(`
        <div style="padding: 10px; font-size: 12px; font-family: sans-serif;">
          <div style="font-weight: 800; color: #142D4E; margin-bottom: 4px;">Observed Hazard Perimeter</div>
          <div style="color: #475569; margin-bottom: 2px;">Sensor: <b>${selectedIncident.primarySource}</b></div>
          <div style="color: #475569; margin-bottom: 2px;">Observed Extent: <b>${selectedIncident.estimatedAffectedAreaKm2} km²</b></div>
          <div style="color: #475569; margin-bottom: 2px;">Observation Time: <b>${new Date(selectedIncident.observationTime).toUTCString()}</b></div>
          <div style="margin-top: 6px; font-size: 10px; background: #F1F5F9; padding: 4px; border-radius: 4px;">
            Delineated via calibrated SAR backscatter thresholding / thermal radiometry.
          </div>
        </div>
      `, { className: 'custom-tactical-popup' });

      observedExtentLayerRef.current.addLayer(observedPoly);
    }

    // 2. Predicted Spread Zone for active forecast horizon (Dashed outline, translucent fill)
    const currentForecast: ForecastStep = selectedIncident.forecasts[forecastHorizon];

    if (showPredictedSpread && currentForecast && currentForecast.polygon && currentForecast.polygon.length > 2) {
      const isNow = forecastHorizon === 'now';
      const forecastColor = selectedIncident.hazardType === 'wildfire' ? '#B91C1C' :
                            selectedIncident.hazardType === 'flood' ? '#0369A1' : '#B45309';

      const forecastPoly = L.polygon(currentForecast.polygon as any, {
        color: forecastColor,
        weight: 2,
        dashArray: isNow ? 'none' : '6, 6', // Dashed line to unmistakably differentiate predicted vs observed
        fillColor: forecastColor,
        fillOpacity: isNow ? 0.15 : 0.22,
      });

      forecastPoly.bindPopup(`
        <div style="padding: 10px; font-size: 12px; font-family: sans-serif;">
          <div style="font-weight: 800; color: #142D4E;">${currentForecast.label}</div>
          <div style="color: #64748B; font-size: 11px; margin-bottom: 6px;">Horizon: <b>${currentForecast.horizon.toUpperCase()}</b></div>
          <div style="color: #334155;">Model: <b>${currentForecast.modelName}</b></div>
          <div style="color: #334155;">Projected Area: <b>${currentForecast.affectedAreaKm2} km²</b></div>
          <div style="color: #334155;">Confidence: <b>${currentForecast.confidenceScore}%</b> (±${currentForecast.uncertaintyMarginKm} km margin)</div>
          <div style="margin-top: 6px; font-size: 11px; color: #087F8C; font-weight: 600;">
            Vector: ${currentForecast.directionText || 'Downstream'}
          </div>
        </div>
      `, { className: 'custom-tactical-popup' });

      forecastLayerRef.current.addLayer(forecastPoly);
    }

    // 3. Uncertainty Envelope Buffer (Dotted outer perimeter, pale hue)
    if (showUncertaintyBuffer && currentForecast && currentForecast.uncertaintyPolygon && currentForecast.uncertaintyPolygon.length > 2) {
      const uncertaintyPoly = L.polygon(currentForecast.uncertaintyPolygon as any, {
        color: '#64748B',
        weight: 1.5,
        dashArray: '3, 6',
        fillColor: '#94A3B8',
        fillOpacity: 0.1,
      });

      uncertaintyPoly.bindTooltip(`
        <span style="font-size: 10px; font-family: sans-serif; font-weight: 600;">
          Uncertainty Margin Envelope (±${currentForecast.uncertaintyMarginKm} km)
        </span>
      `);

      uncertaintyLayerRef.current.addLayer(uncertaintyPoly);
    }
  }, [selectedIncident, forecastHorizon, showObservedExtent, showPredictedSpread, showUncertaintyBuffer]);

  // Update Rescue Units Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    rescueUnitsLayerRef.current.clearLayers();

    if (!showRescueUnits) return;

    rescueUnits.forEach(unit => {
      const unitIcon = L.divIcon({
        className: 'custom-unit-marker',
        html: `
          <div style="
            background: #142D4E;
            color: #38BDF8;
            border: 2px solid #FFFFFF;
            border-radius: 6px;
            padding: 2px 6px;
            font-size: 10px;
            font-family: monospace;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 3px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            white-space: nowrap;
          ">
            <span>🚨</span>
            <span>${unit.callsign.split(' ')[0]}</span>
          </div>
        `,
        iconSize: [80, 24],
        iconAnchor: [40, 12],
      });

      const marker = L.marker([unit.currentLocation.lat, unit.currentLocation.lng], { icon: unitIcon });

      marker.bindPopup(`
        <div style="padding: 8px; font-size: 11px; font-family: sans-serif;">
          <div style="font-weight: bold; color: #142D4E;">${unit.callsign}</div>
          <div style="color: #64748B;">Role: ${unit.unitType}</div>
          <div style="color: #64748B;">Status: <b style="color: #087F8C;">${unit.status}</b></div>
          <div style="color: #64748B;">Comms: ${unit.radioFrequency}</div>
          <div style="margin-top: 4px; font-size: 10px; color: #334155;">Equipment: ${unit.equipmentSummary}</div>
        </div>
      `, { className: 'custom-tactical-popup' });

      rescueUnitsLayerRef.current.addLayer(marker);
    });
  }, [rescueUnits, showRescueUnits]);

  // Update Target Alert Geofence Zone overlay
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    geofenceTargetLayerRef.current.clearLayers();

    if (targetAlertZonePolygon && targetAlertZonePolygon.length > 2) {
      const geofencePoly = L.polygon(targetAlertZonePolygon as any, {
        color: '#7C3AED',
        weight: 3,
        dashArray: '4, 4',
        fillColor: '#8B5CF6',
        fillOpacity: 0.28,
      });

      geofencePoly.bindTooltip(`
        <div style="font-size: 11px; font-family: sans-serif; font-weight: 700; color: #6D28D9;">
          PROPOSED PUBLIC ALERT GEOFENCE ZONE
        </div>
      `, { permanent: true, direction: 'center', className: 'geofence-tooltip' });

      geofenceTargetLayerRef.current.addLayer(geofencePoly);
    }
  }, [targetAlertZonePolygon]);

  // Center on Selected Incident when changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedIncident) return;

    map.flyTo([selectedIncident.center.lat, selectedIncident.center.lng], 12, {
      duration: 1.2,
    });
  }, [selectedIncident?.id]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current || !selectedIncident) return;
    mapInstanceRef.current.setView([selectedIncident.center.lat, selectedIncident.center.lng], 12);
  };

  return (
    <div className="relative w-full h-full bg-slate-100 flex flex-col overflow-hidden">
      {/* 1. Top Map Toolbar */}
      <div className="absolute top-3 left-14 z-[400] flex items-center space-x-2">
        {/* Forecast Timeline Horizontal Selector */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-300 shadow-md p-1 flex items-center space-x-1 select-none">
          <div className="px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-teal-brand" />
            <span>Horizon:</span>
          </div>

          {(['now', '+1h', '+3h', '+6h'] as const).map((h) => {
            const isActive = forecastHorizon === h;
            const hasData = selectedIncident?.forecasts[h]?.modelName !== 'Unavailable';

            return (
              <button
                key={h}
                onClick={() => onForecastHorizonChange(h)}
                disabled={!hasData}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-navy-800 text-white shadow-sm ring-1 ring-navy-900'
                    : hasData
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-slate-300 cursor-not-allowed line-through'
                }`}
                title={hasData ? `View ${h} predicted spread horizon` : 'Prediction unavailable for this step'}
              >
                {h === 'now' ? 'Observed / Now' : h}
              </button>
            );
          })}
        </div>

        {/* Selected Incident Quick Coordinate Badge */}
        {selectedIncident && (
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-navy-800/90 text-white text-[11px] font-mono shadow-md border border-navy-700 backdrop-blur-sm">
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            <span>{selectedIncident.center.lat.toFixed(3)}°N, {Math.abs(selectedIncident.center.lng).toFixed(3)}°W</span>
            <span className="text-slate-400">•</span>
            <span className="text-teal-300 font-bold">{selectedIncident.estimatedAffectedAreaKm2} km²</span>
          </div>
        )}
      </div>

      {/* 2. Top-Right Layer Toggle & Controls */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col items-end space-y-2">
        {/* Layers Button */}
        <div className="relative">
          <button
            onClick={() => setLayersOpen(!layersOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm border border-slate-300 shadow-md text-xs font-semibold text-navy-800 hover:bg-white transition-colors"
          >
            <Layers className="w-4 h-4 text-teal-brand" />
            <span>Operational Layers</span>
          </button>

          {/* Layer Controls Dropdown */}
          {layersOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg border border-slate-300 shadow-2xl p-3 space-y-2.5 text-xs z-50">
              <div className="font-bold text-navy-800 text-[11px] uppercase tracking-wider font-mono border-b pb-1 flex items-center justify-between">
                <span>Display Overlays</span>
                <span className="text-[10px] text-slate-400">Tactical GIS</span>
              </div>

              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1 rounded">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-3 h-3 rounded-full bg-critical inline-block"></span>
                  Source Detections / Centers
                </span>
                <input
                  type="checkbox"
                  checked={showSourceObs}
                  onChange={(e) => setShowSourceObs(e.target.checked)}
                  className="rounded text-teal-brand"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1 rounded">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-3 h-3 border border-sky-600 bg-sky-200 inline-block"></span>
                  Observed Hazard Extent
                </span>
                <input
                  type="checkbox"
                  checked={showObservedExtent}
                  onChange={(e) => setShowObservedExtent(e.target.checked)}
                  className="rounded text-teal-brand"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1 rounded">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-3 h-3 border border-dashed border-red-600 bg-red-200 inline-block"></span>
                  Predicted Spread Horizon
                </span>
                <input
                  type="checkbox"
                  checked={showPredictedSpread}
                  onChange={(e) => setShowPredictedSpread(e.target.checked)}
                  className="rounded text-teal-brand"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1 rounded">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-3 h-3 border border-dotted border-slate-500 bg-slate-200 inline-block"></span>
                  Uncertainty Margin Envelope
                </span>
                <input
                  type="checkbox"
                  checked={showUncertaintyBuffer}
                  onChange={(e) => setShowUncertaintyBuffer(e.target.checked)}
                  className="rounded text-teal-brand"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1 rounded">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="text-xs">🚨</span>
                  Active Rescue Units
                </span>
                <input
                  type="checkbox"
                  checked={showRescueUnits}
                  onChange={(e) => setShowRescueUnits(e.target.checked)}
                  className="rounded text-teal-brand"
                />
              </label>
            </div>
          )}
        </div>

        {/* Recenter button */}
        <button
          onClick={handleRecenter}
          className="p-2 rounded-lg bg-white/95 backdrop-blur-sm border border-slate-300 shadow-md text-slate-700 hover:text-navy-800 hover:bg-white transition-colors"
          title="Recenter on active incident"
        >
          <Crosshair className="w-4 h-4 text-teal-brand" />
        </button>
      </div>

      {/* 3. The Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* 4. Bottom Map Legend (Distinguishing Observed vs Estimated vs Predicted vs Uncertainty) */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm rounded-lg border border-slate-300 shadow-lg px-3 py-2 text-xs select-none max-w-sm">
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono mb-1.5 flex items-center justify-between">
          <span>Map Symbology & Legend</span>
          <span className="text-[9px] text-teal-brand font-semibold">Standard ICS-209</span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-700">
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-2.5 rounded-sm bg-sky-500/40 border border-sky-600"></span>
            <span>Observed Extent (SAR/IR)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-2.5 rounded-sm bg-red-500/30 border border-dashed border-red-600"></span>
            <span>Predicted Spread (+1 to +6h)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-2.5 rounded-sm bg-slate-400/20 border border-dotted border-slate-500"></span>
            <span>Uncertainty Envelope</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-2.5 rounded-sm bg-purple-500/30 border border-purple-600"></span>
            <span>Alert Geofence Target</span>
          </div>
        </div>

        {/* Prediction horizon methodology reminder */}
        {selectedIncident && (
          <div className="mt-1.5 pt-1.5 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between font-mono">
            <span>Model: {selectedIncident.forecasts[forecastHorizon]?.modelName || 'Baseline'}</span>
            <span className="text-teal-700 font-bold">{selectedIncident.forecasts[forecastHorizon]?.confidenceScore}% Conf</span>
          </div>
        )}
      </div>
    </div>
  );
};
