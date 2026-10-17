// src/components/map/OperationsMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Crosshair, 
  Compass, 
  Clock, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  AlertTriangle, 
  Flame, 
  Droplets, 
  MapPin, 
  Activity,
  Maximize2
} from 'lucide-react';
import { Incident, CWCGauge, FIRMSRecord, ForecastStep } from '../../types';
import { CWC_GAUGES, FIRMS_HOTSPOTS } from '../../services/mockData';
import { Collapsible } from '../layout/Collapsible';

interface OperationsMapProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (id: string) => void;
  forecastHorizon: 'now' | '+1h' | '+3h' | '+6h';
  onForecastHorizonChange: (horizon: 'now' | '+1h' | '+3h' | '+6h') => void;
  targetGeofencePolygon?: [number, number][];
}

export const OperationsMap: React.FC<OperationsMapProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  forecastHorizon,
  onForecastHorizonChange,
  targetGeofencePolygon,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Basemap Tile Layer
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const [basemap, setBasemap] = useState<'streets' | 'topo'>('streets');

  // Layer groups
  const markersLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const observedExtentLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const forecastLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const uncertaintyLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const cwcGaugesLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const firmsLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const geofenceLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const rainfallLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const worldPopLayerRef = useRef<L.LayerGroup>(L.layerGroup());

  // Layer controls toggles (Defaults: observed, predicted, uncertainty ON)
  const [layersOpen, setLayersOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(true);
  const [showObserved, setShowObserved] = useState(true);
  const [showPredicted, setShowPredicted] = useState(true);
  const [showUncertainty, setShowUncertainty] = useState(true);
  const [showGeofence, setShowGeofence] = useState(true);
  const [showGauges, setShowGauges] = useState(true);
  const [showFirms, setShowFirms] = useState(true);
  const [showRainfall, setShowRainfall] = useState(false);
  const [showWorldPop, setShowWorldPop] = useState(false);

  // Replay scrub slider state (T0, T+6h, T+12h, T+24h)
  const [replayStep, setReplayStep] = useState<number>(0); // 0=T0, 1=T+6h, 2=T+12h, 3=T+24h
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const replayTimestamps = [
    '2026-10-17 01:15 UTC (T0)',
    '2026-10-17 07:15 UTC (T+6h)',
    '2026-10-17 13:15 UTC (T+12h)',
    '2026-10-18 01:15 UTC (T+24h)',
  ];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered around Periyar River Basin, Aluva / Ernakulam
    const map = L.map(mapContainerRef.current, {
      center: [10.108, 76.356],
      zoom: 12,
      zoomControl: false,
    });

    // Standard OpenStreetMap tiles (Keeps proper attribution, NO API-key watermarks)
    const streetsTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    });
    streetsTile.addTo(map);
    baseTileLayerRef.current = streetsTile;

    // Zoom control at top-left
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Scale bar at bottom-left
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    // Add Layer Groups to map
    observedExtentLayerRef.current.addTo(map);
    forecastLayerRef.current.addTo(map);
    uncertaintyLayerRef.current.addTo(map);
    geofenceLayerRef.current.addTo(map);
    cwcGaugesLayerRef.current.addTo(map);
    firmsLayerRef.current.addTo(map);
    rainfallLayerRef.current.addTo(map);
    worldPopLayerRef.current.addTo(map);
    markersLayerRef.current.addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Basemap Switch
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !baseTileLayerRef.current) return;

    map.removeLayer(baseTileLayerRef.current);

    if (basemap === 'topo') {
      // Clean OpenTopoMap tiles without API keys
      const topoTile = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
        maxZoom: 17,
      });
      topoTile.addTo(map);
      baseTileLayerRef.current = topoTile;
    } else {
      const streetsTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });
      streetsTile.addTo(map);
      baseTileLayerRef.current = streetsTile;
    }
  }, [basemap]);

  // Automated Replay loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setReplayStep(prev => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Render Incident Center Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersLayerRef.current.clearLayers();

    incidents.forEach((inc) => {
      const isSelected = selectedIncident?.id === inc.id;
      const color = inc.severity === 'critical' ? '#B42318' :
                    inc.severity === 'high' ? '#EA580C' :
                    inc.severity === 'moderate' ? '#D97706' : '#087F8C';

      const iconEmoji = inc.hazardType === 'flood' ? '🌊' :
                        inc.hazardType === 'wildfire' ? '🔥' :
                        inc.hazardType === 'severe_weather' ? '⛈️' : '⛰️';

      const customIcon = L.divIcon({
        className: 'custom-hazard-marker',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            ${isSelected ? `
              <div class="pulse-hazard" style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: ${color}; opacity: 0.35;"></div>
            ` : ''}
            <div style="
              width: 30px; 
              height: 30px; 
              border-radius: 50%; 
              background: ${color}; 
              border: 2px solid #FFFFFF; 
              box-shadow: 0 2px 6px rgba(0,0,0,0.35); 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 13px;
              color: white;
              cursor: pointer;
              transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
              transition: transform 0.2s ease;
            ">
              ${iconEmoji}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([inc.center.lat, inc.center.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectIncident(inc.id);
      });

      marker.bindTooltip(`
        <div style="font-family: Inter, sans-serif; font-size: 11px; padding: 2px;">
          <div style="font-weight: 700; color: #142D4E;">${inc.id}: ${inc.hazardType.toUpperCase()}</div>
          <div style="color: #475569;">${inc.title}</div>
          <div style="font-size: 10px; color: ${color}; font-weight: 600; margin-top: 2px;">
            ${inc.severity.toUpperCase()} • ${inc.confidenceScore}% CONFIDENCE
          </div>
        </div>
      `, { offset: [0, -14], direction: 'top' });

      markersLayerRef.current.addLayer(marker);
    });
  }, [incidents, selectedIncident, onSelectIncident]);

  // Render Observed Extent, Predicted Spread & Uncertainty Envelopes for Selected Incident
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    observedExtentLayerRef.current.clearLayers();
    forecastLayerRef.current.clearLayers();
    uncertaintyLayerRef.current.clearLayers();

    // 1. Observed Hazard Extents for ALL incidents (clickable hazard zones)
    if (showObserved) {
      incidents.forEach(inc => {
        const isSelected = selectedIncident?.id === inc.id;

        let currentPoly = inc.observedExtentPolygon;
        if (isSelected && inc.timelineSteps) {
          if (replayStep === 0) currentPoly = inc.timelineSteps.t0;
          if (replayStep === 1) currentPoly = inc.timelineSteps.t6h;
          if (replayStep === 2) currentPoly = inc.timelineSteps.t12h;
          if (replayStep === 3) currentPoly = inc.timelineSteps.t24h;
        }

        if (currentPoly && currentPoly.length > 2) {
          const color = inc.hazardType === 'wildfire' ? '#DC2626' : 
                        inc.hazardType === 'flood' ? '#0284C7' : 
                        inc.hazardType === 'landslide' ? '#92400E' : '#D97706';

          const observedPoly = L.polygon(currentPoly as any, {
            color: color,
            weight: isSelected ? 3.5 : 1.8,
            dashArray: isSelected ? 'none' : '4, 4',
            fillColor: color,
            fillOpacity: isSelected ? 0.38 : 0.12,
          });

          observedPoly.on('click', () => onSelectIncident(inc.id));

          observedPoly.bindTooltip(`
            <div style="font-family: Inter, sans-serif; font-size: 11px;">
              <div style="font-weight: bold; color: #142D4E;">${inc.title}</div>
              <div>Area: <b>${inc.sector}</b> (${inc.estimatedAffectedAreaKm2} km²)</div>
              <div>Source: <b>${inc.primarySource}</b></div>
              <div style="font-size: 10px; color: ${color}; font-weight: 700; margin-top: 2px;">
                ${isSelected ? '● CURRENTLY SELECTED AREA' : '👉 CLICK TO VIEW THIS AREA'}
              </div>
            </div>
          `, { sticky: true });

          observedExtentLayerRef.current.addLayer(observedPoly);
        }
      });
    }

    // 2. Predicted Spread Zone & Uncertainty Envelope for the active/selected incident
    if (selectedIncident) {
      const currentForecast: ForecastStep = selectedIncident.forecasts[forecastHorizon];

      if (showPredicted && currentForecast && currentForecast.polygon && currentForecast.polygon.length > 2) {
        const isNow = forecastHorizon === 'now';
        const forecastColor = selectedIncident.hazardType === 'wildfire' ? '#B91C1C' : 
                              selectedIncident.hazardType === 'flood' ? '#0369A1' : '#B45309';

        const forecastPoly = L.polygon(currentForecast.polygon as any, {
          color: forecastColor,
          weight: 2,
          dashArray: isNow ? 'none' : '5, 5',
          fillColor: forecastColor,
          fillOpacity: isNow ? 0.18 : 0.25,
        });

        forecastPoly.bindTooltip(`
          <div style="font-family: Inter, sans-serif; font-size: 11px;">
            <div style="font-weight: bold; color: #142D4E;">${currentForecast.label}</div>
            <div>Horizon: <b>${currentForecast.horizon.toUpperCase()}</b></div>
            <div>Projected Area: <b>${currentForecast.affectedAreaKm2} km²</b></div>
            <div>Confidence: <b>${currentForecast.confidenceScore}%</b> (±${currentForecast.uncertaintyMarginKm}km)</div>
            <div style="color: #087F8C; font-weight: 600; margin-top: 2px;">Vector: ${currentForecast.directionText}</div>
          </div>
        `, { sticky: true });

        forecastLayerRef.current.addLayer(forecastPoly);
      }

      // 3. Uncertainty Envelope Buffer
      if (showUncertainty && currentForecast && currentForecast.uncertaintyPolygon && currentForecast.uncertaintyPolygon.length > 2) {
        const uncertaintyPoly = L.polygon(currentForecast.uncertaintyPolygon as any, {
          color: '#64748B',
          weight: 1.5,
          dashArray: '3, 5',
          fillColor: '#94A3B8',
          fillOpacity: 0.1,
        });

        uncertaintyPoly.bindTooltip(`
          <span style="font-family: Inter, sans-serif; font-size: 10px; font-weight: 600;">
            Uncertainty Envelope (±${currentForecast.uncertaintyMarginKm} km buffer)
          </span>
        `);

        uncertaintyLayerRef.current.addLayer(uncertaintyPoly);
      }
    }
  }, [incidents, selectedIncident, forecastHorizon, replayStep, showObserved, showPredicted, showUncertainty, onSelectIncident]);

  // Render CWC River Gauges with live-style sparklines
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    cwcGaugesLayerRef.current.clearLayers();

    if (!showGauges) return;

    CWC_GAUGES.forEach(g => {
      const isDanger = g.currentLevelMeters >= g.dangerLevelMeters;
      const isWarning = g.currentLevelMeters >= g.warningLevelMeters;
      const badgeColor = isDanger ? '#B42318' : isWarning ? '#D97706' : '#087F8C';

      // Inline mini sparkline SVG
      const minVal = Math.min(...g.sparkline) - 0.2;
      const maxVal = Math.max(...g.sparkline) + 0.2;
      const range = maxVal - minVal || 1;
      const points = g.sparkline.map((val, idx) => {
        const x = (idx / (g.sparkline.length - 1)) * 36;
        const y = 14 - ((val - minVal) / range) * 12;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');

      const gaugeIcon = L.divIcon({
        className: 'cwc-gauge-marker',
        html: `
          <div style="
            background: #FFFFFF; 
            border: 1.5px solid ${badgeColor}; 
            border-radius: 6px; 
            padding: 3px 6px; 
            box-shadow: 0 2px 6px rgba(0,0,0,0.18); 
            display: flex; 
            align-items: center; 
            gap: 5px;
            font-family: monospace;
            cursor: pointer;
            white-space: nowrap;
          ">
            <div>
              <div style="font-size: 9px; font-weight: 800; color: #142D4E;">${g.stationName}</div>
              <div style="font-size: 11px; font-weight: bold; color: ${badgeColor};">
                ${g.currentLevelMeters}m <span style="font-size: 9px; font-weight: normal; color: #64748B;">/ ${g.dangerLevelMeters}m</span>
              </div>
            </div>
            <svg width="36" height="14" style="overflow: visible;">
              <polyline fill="none" stroke="${badgeColor}" stroke-width="1.8" points="${points}" />
            </svg>
          </div>
        `,
        iconSize: [110, 26],
        iconAnchor: [55, 13],
      });

      const marker = L.marker([g.lat, g.lng], { icon: gaugeIcon });

      marker.bindPopup(`
        <div style="padding: 6px; font-family: Inter, sans-serif; font-size: 11px;">
          <div style="font-weight: bold; color: #142D4E;">${g.stationName} — ${g.riverName}</div>
          <div style="color: #64748B; margin-top: 2px;">Current Stage: <b>${g.currentLevelMeters} m</b> (${g.trend})</div>
          <div style="color: #64748B;">Warning Mark: <b>${g.warningLevelMeters} m</b> | Danger Mark: <b style="color: #B42318;">${g.dangerLevelMeters} m</b></div>
          <div style="font-size: 10px; color: #94A3B8; margin-top: 4px;">Telemetry: Central Water Commission (CWC) • Hourly</div>
        </div>
      `, { className: 'custom-tactical-popup' });

      cwcGaugesLayerRef.current.addLayer(marker);
    });
  }, [showGauges]);

  // Render NASA FIRMS Hotspots
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    firmsLayerRef.current.clearLayers();

    if (!showFirms) return;

    FIRMS_HOTSPOTS.forEach(f => {
      const marker = L.circleMarker([f.lat, f.lng], {
        radius: 6,
        color: '#DC2626',
        fillColor: '#EF4444',
        fillOpacity: 0.85,
        weight: 1.5,
      });

      marker.bindTooltip(`
        <div style="font-family: Inter, sans-serif; font-size: 11px;">
          <div style="font-weight: bold; color: #DC2626;">NASA FIRMS Active Thermal Hotspot</div>
          <div>FRP: <b>${f.frpMW} MW</b> • Confidence: <b>${f.confidence}%</b></div>
          <div>Satellite: ${f.satellite} • Acquired: ${f.acquisitionTime}</div>
        </div>
      `);

      firmsLayerRef.current.addLayer(marker);
    });
  }, [showFirms]);

  // Render Geofence Overlay if active
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    geofenceLayerRef.current.clearLayers();

    if (showGeofence && targetGeofencePolygon && targetGeofencePolygon.length > 2) {
      const poly = L.polygon(targetGeofencePolygon as any, {
        color: '#7C3AED',
        weight: 2.5,
        dashArray: '4, 4',
        fillColor: '#8B5CF6',
        fillOpacity: 0.25,
      });

      poly.bindTooltip('<b>Public Alert Geofence Zone</b>', { permanent: true, direction: 'center' });
      geofenceLayerRef.current.addLayer(poly);
    }
  }, [targetGeofencePolygon, showGeofence]);

  // Fly-to when selected incident changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedIncident) return;
    map.flyTo([selectedIncident.center.lat, selectedIncident.center.lng], 12, { duration: 1.0 });
  }, [selectedIncident?.id]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current || !selectedIncident) return;
    mapInstanceRef.current.setView([selectedIncident.center.lat, selectedIncident.center.lng], 12);
  };

  const handleLocateMe = () => {
    if (!mapInstanceRef.current) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapInstanceRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 13);
        },
        () => {
          mapInstanceRef.current?.setView([10.108, 76.356], 12);
        }
      );
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-100 flex flex-col overflow-hidden select-none">
      {/* 1. Stale Data Banner on Map when Feed is Stale */}
      {selectedIncident?.isFeedStale && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[400] bg-amber-500 text-navy-950 font-bold px-3 py-1 rounded-full shadow-lg border border-amber-600 text-xs flex items-center space-x-1.5 animate-in fade-in duration-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-950 shrink-0" />
          <span>Data may be out of date (Feed: {selectedIncident.staleFeedName} — last update {selectedIncident.staleFeedDuration} ago)</span>
        </div>
      )}

      {/* 2. Top-Right Basemap & Layers Control */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col items-end space-y-2">
        {/* Basemap Switcher (Streets vs Topo) */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-300 shadow-sm p-1 flex items-center space-x-1 text-xs">
          <button
            onClick={() => setBasemap('streets')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              basemap === 'streets' ? 'bg-navy-800 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            OSM Standard
          </button>
          <button
            onClick={() => setBasemap('topo')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              basemap === 'topo' ? 'bg-navy-800 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Terrain / Topo
          </button>
        </div>

        {/* Operational Layers Toggle */}
        <div className="relative">
          <button
            onClick={() => setLayersOpen(!layersOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm border border-slate-300 shadow-md text-xs font-semibold text-navy-900 hover:bg-white transition-colors"
          >
            <Layers className="w-4 h-4 text-teal-brand" />
            <span>Layers</span>
          </button>

          {layersOpen && (
            <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-lg border border-slate-300 shadow-xl p-3 space-y-2 text-xs z-50">
              <div className="font-bold text-navy-900 uppercase tracking-wider text-[10px] font-mono border-b pb-1">
                IRS Operational Layers
              </div>

              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1 rounded">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-2 rounded bg-sky-500 border border-sky-600 inline-block"></span>
                  Observed Extent (Sentinel-1)
                </span>
                <input
                  type="checkbox"
                  checked={showObserved}
                  onChange={(e) => setShowObserved(e.target.checked)}
                  className="rounded text-teal-brand"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1 rounded">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-2 rounded bg-red-400 border border-dashed border-red-600 inline-block"></span>
                  Predicted Spread (+1h/+3h/+6h)
                </span>
                <input
                  type="checkbox"
                  checked={showPredicted}
                  onChange={(e) => setShowPredicted(e.target.checked)}
                  className="rounded text-teal-brand"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1 rounded">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-2 rounded border border-dotted border-slate-500 bg-slate-200 inline-block"></span>
                  Uncertainty Envelope
                </span>
                <input
                  type="checkbox"
                  checked={showUncertainty}
                  onChange={(e) => setShowUncertainty(e.target.checked)}
                  className="rounded text-teal-brand"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1 rounded">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-2 rounded bg-purple-400 border border-purple-600 inline-block"></span>
                  Alert Geofence
                </span>
                <input
                  type="checkbox"
                  checked={showGeofence}
                  onChange={(e) => setShowGeofence(e.target.checked)}
                  className="rounded text-teal-brand"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1 rounded">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="text-[10px]">💧</span>
                  River Gauges (CWC)
                </span>
                <input
                  type="checkbox"
                  checked={showGauges}
                  onChange={(e) => setShowGauges(e.target.checked)}
                  className="rounded text-teal-brand"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1 rounded">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="text-[10px]">🔥</span>
                  Fire Hotspots (FIRMS)
                </span>
                <input
                  type="checkbox"
                  checked={showFirms}
                  onChange={(e) => setShowFirms(e.target.checked)}
                  className="rounded text-teal-brand"
                />
              </label>
            </div>
          )}
        </div>

        {/* Locate me button */}
        <button
          onClick={handleLocateMe}
          className="p-2 rounded-lg bg-white/95 backdrop-blur-sm border border-slate-300 shadow-md text-slate-700 hover:text-navy-900 transition-colors"
          title="Locate my position"
        >
          <Crosshair className="w-4 h-4 text-teal-brand" />
        </button>

        {/* Recenter button */}
        <button
          onClick={handleRecenter}
          className="p-2 rounded-lg bg-white/95 backdrop-blur-sm border border-slate-300 shadow-md text-slate-700 hover:text-navy-900 transition-colors"
          title="Recenter on active incident"
        >
          <Compass className="w-4 h-4 text-navy-800" />
        </button>
      </div>

      {/* 3. The Leaflet Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* 4. Docked Bottom Time Replay & Horizon Controls Bar */}
      <div className="absolute bottom-2 left-2 right-2 md:left-24 md:right-24 z-[400] select-none">
        <Collapsible title="Timeline Replay & Forecast Horizon" defaultOpen={true} className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-300 shadow-xl">
          <div className="p-2 flex flex-col md:flex-row items-center justify-between gap-3 text-xs select-none">
            {/* Replay Scrubbing Controls */}
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-7 h-7 rounded-full bg-navy-800 text-white flex items-center justify-center hover:bg-navy-900 shadow-xs"
                title={isPlaying ? "Pause replay" : "Play timeline replay"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>

              <button
                onClick={() => setReplayStep(prev => Math.max(0, prev - 1))}
                className="p-1 rounded text-slate-600 hover:bg-slate-100"
                title="Step back"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              {/* Scrub Slider */}
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={replayStep}
                onChange={(e) => setReplayStep(Number(e.target.value))}
                className="w-28 accent-teal-brand cursor-pointer"
              />

              <button
                onClick={() => setReplayStep(prev => Math.min(3, prev + 1))}
                className="p-1 rounded text-slate-600 hover:bg-slate-100"
                title="Step forward"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono text-[11px] font-semibold text-navy-900 truncate">
                {replayTimestamps[replayStep]}
              </span>
            </div>

            {/* Forecast Horizon Switcher: [Observed now | +1h | +3h | +6h] */}
            <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {(['now', '+1h', '+3h', '+6h'] as const).map(h => {
                const isActive = forecastHorizon === h;
                const hasData = selectedIncident?.forecasts[h]?.modelName !== 'Unavailable';

                return (
                  <button
                    key={h}
                    onClick={() => onForecastHorizonChange(h)}
                    disabled={!hasData}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                      isActive 
                        ? 'bg-navy-800 text-white shadow-xs' 
                        : hasData 
                        ? 'text-slate-700 hover:bg-white' 
                        : 'text-slate-300 line-through cursor-not-allowed'
                    }`}
                  >
                    {h === 'now' ? 'Observed now' : h}
                  </button>
                );
              })}
            </div>
          </div>
        </Collapsible>
      </div>

      {/* 5. NDMA IRS Collapsible Legend (Bottom-Left) */}
      <div className="absolute bottom-14 left-3 z-[400] bg-white/95 backdrop-blur-sm rounded-lg border border-slate-300 shadow-md p-2 text-xs select-none max-w-xs">
        <div 
          onClick={() => setLegendOpen(!legendOpen)}
          className="flex items-center justify-between cursor-pointer font-bold text-slate-700 text-[10px] uppercase font-mono tracking-wider"
        >
          <span>IRS Map Symbology</span>
          <span className="text-[10px] text-teal-brand ml-2">{legendOpen ? '▾' : '▸'}</span>
        </div>

        {legendOpen && (
          <div className="mt-1.5 pt-1.5 border-t border-slate-200 space-y-1 text-[11px] text-slate-700">
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-2.5 rounded-sm bg-sky-500/40 border border-sky-600"></span>
              <span>Observed Extent (Sentinel-1 SAR)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-2.5 rounded-sm bg-red-500/30 border border-dashed border-red-600"></span>
              <span>Predicted Spread (+1h/+3h/+6h)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-2.5 rounded-sm bg-slate-400/20 border border-dotted border-slate-500"></span>
              <span>Uncertainty Envelope</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-2.5 rounded-sm bg-purple-500/30 border border-purple-600"></span>
              <span>Public Alert Geofence Zone</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


