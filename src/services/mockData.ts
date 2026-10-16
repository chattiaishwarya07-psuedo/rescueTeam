// src/services/mockData.ts
import { Incident, TelemetryFeed, RescueUnit, ResponderRole } from '../types';

export const INITIAL_RESPONDER = {
  name: "Cmdr. Sarah Vance",
  callsign: "VANCE-01",
  badgeNumber: "EOC-7104",
  role: "Incident Reviewer" as ResponderRole,
  jurisdiction: "Western Basin & Foothills (District 7)",
  organization: "National Emergency Management & Joint Rescue Command",
};

export const AVAILABLE_JURISDICTIONS = [
  "Western Basin & Foothills (District 7)",
  "Cascade Mountain Sector (District 3)",
  "Southern Coastal Delta (District 5)",
  "Metropolitan EOC North (District 1)",
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "INC-2026-FL04",
    title: "Upper Clearwater River Surge & Levee Breach Warning",
    hazardType: "flood",
    severity: "critical",
    status: "under_review",
    locationName: "Clearwater Valley - Sector 4, Rivermile 42",
    jurisdiction: "Western Basin & Foothills (District 7)",
    center: { lat: 45.545, lng: -122.62 },
    observedExtentPolygon: [
      [45.541, -122.632],
      [45.548, -122.628],
      [45.552, -122.615],
      [45.547, -122.605],
      [45.539, -122.618],
    ],
    estimatedAffectedAreaKm2: 14.8,
    populationExposedEstimate: 4250,
    observationTime: "2026-10-16T18:42:00Z",
    ingestionTime: "2026-10-16T18:49:15Z",
    lastUpdatedTime: "2026-10-16T18:55:00Z",
    primarySource: "Copernicus Sentinel-1 SAR (IW VV/VH)",
    confidenceScore: 92,
    uncertaintyRadiusMeters: 180,
    deduplicationCount: 3,
    deduplicationNotes: "Synthesized from Sentinel-1 SAR pass #38914, Clearwater USGS Gauge #14211720, and airborne FLIR reconnaissance.",
    trend: "increasing",
    forecasts: {
      now: {
        horizon: 'now',
        label: 'Current Extent (Observed)',
        polygon: [
          [45.541, -122.632],
          [45.548, -122.628],
          [45.552, -122.615],
          [45.547, -122.605],
          [45.539, -122.618],
        ],
        uncertaintyPolygon: [
          [45.538, -122.637],
          [45.551, -122.633],
          [45.556, -122.612],
          [45.550, -122.599],
          [45.536, -122.614],
        ],
        affectedAreaKm2: 14.8,
        trend: 'increasing',
        speedKmh: 4.2,
        directionDeg: 285,
        directionText: 'WNW along Clearwater alluvial floodplain',
        confidenceScore: 92,
        uncertaintyMarginKm: 0.18,
        modelName: 'Sentinel SAR Backscatter Water Index (BWI) v4',
        generatedAt: '2026-10-16T18:49:15Z',
        notes: 'Calibrated using ground gauge baseline. 0.8m above flood stage at river bend.'
      },
      '+1h': {
        horizon: '+1h',
        label: '+1 Hour Forecast (+0.4m gauge elevation)',
        polygon: [
          [45.538, -122.641],
          [45.551, -122.636],
          [45.557, -122.618],
          [45.551, -122.601],
          [45.536, -122.616],
        ],
        uncertaintyPolygon: [
          [45.534, -122.648],
          [45.555, -122.642],
          [45.562, -122.614],
          [45.555, -122.594],
          [45.532, -122.612],
        ],
        affectedAreaKm2: 18.6,
        trend: 'increasing',
        speedKmh: 3.8,
        directionDeg: 285,
        directionText: 'WNW into agricultural flats & low-lying residential fringe',
        confidenceScore: 86,
        uncertaintyMarginKm: 0.35,
        modelName: 'Hydrodynamic 2D Shallow Water Flow Model (HEC-RAS 6.4)',
        generatedAt: '2026-10-16T18:50:00Z',
        notes: 'Predicts overtopping of Secondary Dike Bravo at 19:40 UTC.'
      },
      '+3h': {
        horizon: '+3h',
        label: '+3 Hour Forecast (Projected Hydrograph Peak)',
        polygon: [
          [45.534, -122.655],
          [45.555, -122.648],
          [45.563, -122.622],
          [45.556, -122.597],
          [45.531, -122.612],
        ],
        uncertaintyPolygon: [
          [45.529, -122.665],
          [45.560, -122.656],
          [45.570, -122.618],
          [45.562, -122.589],
          [45.526, -122.607],
        ],
        affectedAreaKm2: 24.2,
        trend: 'increasing',
        speedKmh: 3.1,
        directionDeg: 280,
        directionText: 'W toward State Route 224 underpass',
        confidenceScore: 78,
        uncertaintyMarginKm: 0.62,
        modelName: 'Hydrodynamic 2D Shallow Water Flow Model (HEC-RAS 6.4)',
        generatedAt: '2026-10-16T18:50:00Z',
        notes: 'Water depth expected to reach 1.2m on access corridor. Pre-evacuation trigger zone.'
      },
      '+6h': {
        horizon: '+6h',
        label: '+6 Hour Forecast (Attenuation & Plateau)',
        polygon: [
          [45.530, -122.668],
          [45.558, -122.658],
          [45.569, -122.628],
          [45.560, -122.592],
          [45.526, -122.608],
        ],
        uncertaintyPolygon: [
          [45.524, -122.682],
          [45.565, -122.669],
          [45.577, -122.622],
          [45.567, -122.582],
          [45.520, -122.602],
        ],
        affectedAreaKm2: 29.5,
        trend: 'stable',
        speedKmh: 1.8,
        directionDeg: 275,
        directionText: 'Downstream ponding and retention reservoir backfill',
        confidenceScore: 68,
        uncertaintyMarginKm: 1.1,
        modelName: 'National Water Model Ensemble Guidance v3.0',
        generatedAt: '2026-10-16T18:50:00Z',
        notes: 'Inflow from upstream dam controlled release will moderate crest rate.'
      }
    },
    observations: [
      {
        id: "OBS-01",
        source: "Copernicus Sentinel-1 SAR (IW mode)",
        sensorType: "satellite_radar",
        timestamp: "2026-10-16T18:42:00Z",
        ingestedAt: "2026-10-16T18:49:15Z",
        groundResolutionMeters: 10,
        cloudCoverPercent: 95, // SAR penetrates clouds
        confidenceScore: 94,
        rawMetricValue: "Backscatter drop -12.4 dB (Specular water reflection across 14.8 km²)",
        qualityNote: "All-weather SAR radar aperture. High coherence; negligible terrain shadowing."
      },
      {
        id: "OBS-02",
        source: "USGS Clearwater Station #14211720",
        sensorType: "river_gauge",
        timestamp: "2026-10-16T18:45:00Z",
        ingestedAt: "2026-10-16T18:46:20Z",
        confidenceScore: 98,
        rawMetricValue: "River Stage: 24.3 ft (+4.3 ft above Major Flood Stage; Rate +0.6 ft/hr)",
        qualityNote: "Physical telemetry probe verified online. Solar battery 13.8V nominal."
      },
      {
        id: "OBS-03",
        source: "AeroScan UAV FLIR Reconnaissance",
        sensorType: "thermal_infrared",
        timestamp: "2026-10-16T18:50:00Z",
        ingestedAt: "2026-10-16T18:52:10Z",
        groundResolutionMeters: 0.5,
        cloudCoverPercent: 10,
        confidenceScore: 91,
        rawMetricValue: "Visual inspection confirms water breaching Dike Bravo crest by 15cm",
        qualityNote: "Low-altitude visual cross-reference confirms radar delineation."
      }
    ],
    assignedTeam: "Swiftwater Taskforce Alpha (Unit ST-12)",
    auditTrail: [
      {
        id: "AUD-01",
        timestamp: "2026-10-16T18:49:15Z",
        actor: "Automated Ingestion Pipeline",
        role: "Viewer",
        action: "Detected",
        previousStatus: undefined,
        newStatus: "detected",
        notes: "Sentinel-1 SAR surface water anomaly threshold exceeded (>10 km²)."
      },
      {
        id: "AUD-02",
        timestamp: "2026-10-16T18:51:30Z",
        actor: "Duty Officer M. Jenkins",
        role: "Analyst",
        action: "Review Started",
        previousStatus: "detected",
        newStatus: "under_review",
        notes: "Correlating USGS gauge #14211720 surge data and radar boundary."
      }
    ],
    responderNotes: [
      {
        author: "Duty Officer M. Jenkins",
        role: "Analyst",
        timestamp: "2026-10-16T18:53:00Z",
        content: "Breach confirmed at Secondary Dike Bravo. Recommend swiftwater team standby at Staging Area Delta."
      }
    ]
  },
  {
    id: "INC-2026-WF09",
    title: "Timberline Ridge Timber Wildfire Ignition",
    hazardType: "wildfire",
    severity: "critical",
    status: "confirmed",
    locationName: "Timberline Ridge, West Cascade Escarpment",
    jurisdiction: "Western Basin & Foothills (District 7)",
    center: { lat: 45.420, lng: -122.38 },
    observedExtentPolygon: [
      [45.412, -122.392],
      [45.425, -122.386],
      [45.428, -122.368],
      [45.419, -122.364],
      [45.409, -122.380],
    ],
    estimatedAffectedAreaKm2: 8.2,
    populationExposedEstimate: 620,
    observationTime: "2026-10-16T18:25:00Z",
    ingestionTime: "2026-10-16T18:31:00Z",
    lastUpdatedTime: "2026-10-16T18:50:00Z",
    primarySource: "NOAA GOES-18 ABI + VIIRS 375m Active Fire",
    confidenceScore: 89,
    uncertaintyRadiusMeters: 250,
    deduplicationCount: 4,
    deduplicationNotes: "Merged GOES-18 rapid scan hotspot with 2 VIIRS active thermal cluster records.",
    trend: "increasing",
    forecasts: {
      now: {
        horizon: 'now',
        label: 'Active Fire Perimeter (Now)',
        polygon: [
          [45.412, -122.392],
          [45.425, -122.386],
          [45.428, -122.368],
          [45.419, -122.364],
          [45.409, -122.380],
        ],
        uncertaintyPolygon: [
          [45.408, -122.398],
          [45.428, -122.391],
          [45.433, -122.362],
          [45.422, -122.358],
          [45.405, -122.376],
        ],
        affectedAreaKm2: 8.2,
        trend: 'increasing',
        speedKmh: 1.4,
        directionDeg: 65,
        directionText: 'ENE driven by 24 kt gusting ridge winds',
        confidenceScore: 89,
        uncertaintyMarginKm: 0.25,
        modelName: 'VIIRS 375m I-Band Thermal Cluster Algorithm',
        generatedAt: '2026-10-16T18:31:00Z',
        notes: 'Heavy fuel load (Douglas fir canopy with dry understory drought stress).'
      },
      '+1h': {
        horizon: '+1h',
        label: '+1h Downwind Spread Projection',
        polygon: [
          [45.414, -122.394],
          [45.431, -122.382],
          [45.438, -122.355],
          [45.425, -122.350],
          [45.410, -122.378],
        ],
        uncertaintyPolygon: [
          [45.410, -122.402],
          [45.436, -122.388],
          [45.444, -122.348],
          [45.429, -122.342],
          [45.405, -122.372],
        ],
        affectedAreaKm2: 12.1,
        trend: 'increasing',
        speedKmh: 1.6,
        directionDeg: 65,
        directionText: 'ENE towards Old Mill Creek residential settlement',
        confidenceScore: 82,
        uncertaintyMarginKm: 0.45,
        modelName: 'Rothermel Surface Fire Spread + BehavePlus 6.0',
        generatedAt: '2026-10-16T18:35:00Z',
        notes: 'Spotting distance potential up to 400m ahead of flame front.'
      },
      '+3h': {
        horizon: '+3h',
        label: '+3h Spread Horizon',
        polygon: [
          [45.416, -122.396],
          [45.438, -122.374],
          [45.449, -122.340],
          [45.432, -122.336],
          [45.412, -122.374],
        ],
        uncertaintyPolygon: [
          [45.411, -122.408],
          [45.445, -122.382],
          [45.457, -122.330],
          [45.438, -122.326],
          [45.406, -122.368],
        ],
        affectedAreaKm2: 19.4,
        trend: 'increasing',
        speedKmh: 1.9,
        directionDeg: 70,
        directionText: 'Advancing along saddle pass towards drainage valley',
        confidenceScore: 74,
        uncertaintyMarginKm: 0.8,
        modelName: 'Rothermel Surface Fire Spread + WindNinja Ensemble',
        generatedAt: '2026-10-16T18:35:00Z',
        notes: 'Diurnal up-valley winds expected to reinforce spread until 21:00 UTC.'
      },
      '+6h': {
        horizon: '+6h',
        label: '+6h Spread Horizon (Evening Wind Shift)',
        polygon: [
          [45.418, -122.398],
          [45.444, -122.368],
          [45.458, -122.325],
          [45.438, -122.320],
          [45.414, -122.368],
        ],
        uncertaintyPolygon: [
          [45.412, -122.414],
          [45.452, -122.378],
          [45.468, -122.312],
          [45.445, -122.308],
          [45.408, -122.360],
        ],
        affectedAreaKm2: 26.8,
        trend: 'increasing',
        speedKmh: 1.2,
        directionDeg: 80,
        directionText: 'Decelerating on eastern rocky ridge spine',
        confidenceScore: 61,
        uncertaintyMarginKm: 1.4,
        modelName: 'FARSITE Coupled Atmosphere-Fire Simulation',
        generatedAt: '2026-10-16T18:35:00Z',
        notes: 'Relative humidity expected to rise above 45% post-sunset.'
      }
    },
    observations: [
      {
        id: "OBS-04",
        source: "NOAA GOES-18 ABI Band 7 (3.9µm Shortwave IR)",
        sensorType: "geostationary" as any,
        timestamp: "2026-10-16T18:25:00Z",
        ingestedAt: "2026-10-16T18:28:10Z",
        groundResolutionMeters: 2000,
        confidenceScore: 88,
        rawMetricValue: "Thermal Brightness Temp: 348 K (Delta +38 K over surrounding canopy)",
        qualityNote: "Rapid 5-min geostationary detection. Coarse pixel geometry."
      },
      {
        id: "OBS-05",
        source: "Suomi NPP / VIIRS 375m I-Band Active Fire",
        sensorType: "thermal_infrared",
        timestamp: "2026-10-16T18:30:00Z",
        ingestedAt: "2026-10-16T18:33:45Z",
        groundResolutionMeters: 375,
        confidenceScore: 94,
        rawMetricValue: "Fire Radiative Power (FRP): 182 MW across 6 contiguous detection pixels",
        qualityNote: "Polar-orbiting high-resolution thermal confirmation."
      }
    ],
    assignedTeam: "Helitack Strike Team 4 (Airborne Recon)",
    auditTrail: [
      {
        id: "AUD-03",
        timestamp: "2026-10-16T18:28:10Z",
        actor: "Automated Satellite Ingestion",
        role: "Viewer",
        action: "Detected",
        newStatus: "detected",
        notes: "GOES-18 thermal signature identified."
      },
      {
        id: "AUD-04",
        timestamp: "2026-10-16T18:40:00Z",
        actor: "Cmdr. Sarah Vance",
        role: "Incident Reviewer",
        action: "Confirmed",
        previousStatus: "under_review",
        newStatus: "confirmed",
        reason: "Dual-satellite confirmation with VIIRS 375m FRP and local lookout visual."
      }
    ],
    responderNotes: [
      {
        author: "Cmdr. Sarah Vance",
        role: "Incident Reviewer",
        timestamp: "2026-10-16T18:41:00Z",
        content: "Confirmed thermal signature. Old Mill Creek residential zone is in direct 1-hour downwind path. Evacuation alert preparation advised."
      }
    ]
  },
  {
    id: "INC-2026-WX14",
    title: "Severe Convective Cell & Flash Flood Threat",
    hazardType: "severe_weather",
    severity: "high",
    status: "under_review",
    locationName: "South Gorge Highland Corridor",
    jurisdiction: "Western Basin & Foothills (District 7)",
    center: { lat: 45.485, lng: -122.51 },
    observedExtentPolygon: [
      [45.472, -122.528],
      [45.495, -122.522],
      [45.498, -122.495],
      [45.482, -122.488],
      [45.469, -122.510],
    ],
    estimatedAffectedAreaKm2: 32.0,
    populationExposedEstimate: 12400,
    observationTime: "2026-10-16T18:50:00Z",
    ingestionTime: "2026-10-16T18:53:00Z",
    lastUpdatedTime: "2026-10-16T18:55:00Z",
    primarySource: "NEXRAD WSR-88D Dual-Pol Radar (KRTX)",
    confidenceScore: 87,
    uncertaintyRadiusMeters: 400,
    deduplicationCount: 2,
    deduplicationNotes: "Doppler radar reflectivity combined with GOES-18 cloud-top cooling trends.",
    trend: "increasing",
    forecasts: {
      now: {
        horizon: 'now',
        label: 'Doppler Radar Reflectivity Core (>55 dBZ)',
        polygon: [
          [45.472, -122.528],
          [45.495, -122.522],
          [45.498, -122.495],
          [45.482, -122.488],
          [45.469, -122.510],
        ],
        uncertaintyPolygon: [
          [45.465, -122.535],
          [45.499, -122.529],
          [45.505, -122.488],
          [45.480, -122.480],
          [45.462, -122.515],
        ],
        affectedAreaKm2: 32.0,
        trend: 'increasing',
        speedKmh: 35.0,
        directionDeg: 45,
        directionText: 'NE at 35 km/h across urban arterial highways',
        confidenceScore: 87,
        uncertaintyMarginKm: 0.4,
        modelName: 'NEXRAD Dual-Pol Quantitative Precipitation Estimation (QPE)',
        generatedAt: '2026-10-16T18:53:00Z',
        notes: 'Precipitation rate 65mm/hr in localized downburst core.'
      },
      '+1h': {
        horizon: '+1h',
        label: '+1h Storm Track Projection',
        polygon: [
          [45.498, -122.485],
          [45.520, -122.478],
          [45.525, -122.445],
          [45.508, -122.438],
          [45.492, -122.465],
        ],
        uncertaintyPolygon: [
          [45.490, -122.495],
          [45.526, -122.486],
          [45.534, -122.436],
          [45.504, -122.428],
          [45.484, -122.472],
        ],
        affectedAreaKm2: 41.5,
        trend: 'increasing',
        speedKmh: 36.0,
        directionDeg: 45,
        directionText: 'NE entering canyon throat with extreme runoff danger',
        confidenceScore: 80,
        uncertaintyMarginKm: 0.9,
        modelName: 'HRRR (High-Resolution Rapid Refresh) Radar Assimilation',
        generatedAt: '2026-10-16T18:53:00Z',
        notes: 'Steep terrain runoff expected to cause rapid flash culvert backups.'
      },
      '+3h': {
        horizon: '+3h',
        label: '+3h Storm Dissipation Horizon',
        polygon: [
          [45.535, -122.435],
          [45.555, -122.420],
          [45.560, -122.385],
          [45.542, -122.380],
          [45.528, -122.412],
        ],
        affectedAreaKm2: 38.0,
        trend: 'decreasing',
        speedKmh: 28.0,
        directionDeg: 50,
        directionText: 'Weakening over eastern foothills',
        confidenceScore: 65,
        uncertaintyMarginKm: 1.8,
        modelName: 'HRRR Ensemble Guidance',
        generatedAt: '2026-10-16T18:53:00Z',
        notes: 'Precipitation intensity decreases to 15-20 mm/hr.'
      },
      '+6h': {
        horizon: '+6h',
        label: '+6h Clearing (Unavailable - beyond convective lifecycle)',
        polygon: [],
        affectedAreaKm2: 0,
        trend: 'decreasing',
        confidenceScore: 40,
        uncertaintyMarginKm: 3.5,
        modelName: 'Unavailable',
        generatedAt: '2026-10-16T18:53:00Z',
        notes: 'Forecast beyond 3 hours unavailable due to cell dissipation.'
      }
    },
    observations: [
      {
        id: "OBS-06",
        source: "NEXRAD WSR-88D Doppler (KRTX)",
        sensorType: "weather_radar",
        timestamp: "2026-10-16T18:50:00Z",
        ingestedAt: "2026-10-16T18:53:00Z",
        groundResolutionMeters: 500,
        confidenceScore: 92,
        rawMetricValue: "Reflectivity: 58 dBZ, Differential Reflectivity (ZDR): +2.4 dB (heavy rain/small hail mix)",
        qualityNote: "Clean beam volume scan; zero ground clutter filter artifacts."
      }
    ],
    auditTrail: [
      {
        id: "AUD-05",
        timestamp: "2026-10-16T18:53:00Z",
        actor: "Weather Radar Auto-Tagger",
        role: "Viewer",
        action: "Detected",
        newStatus: "detected",
        notes: "Severe storm cell cross-track initiated."
      }
    ],
    responderNotes: []
  },
  {
    id: "INC-2026-LS02",
    title: "Mountain Highway 26 Slope Creep & Debris Threat",
    hazardType: "landslide",
    severity: "moderate",
    status: "detected",
    locationName: "Milepost 38, Coastal Pass Ridge",
    jurisdiction: "Cascade Mountain Sector (District 3)",
    center: { lat: 45.612, lng: -122.78 },
    observedExtentPolygon: [
      [45.608, -122.788],
      [45.618, -122.785],
      [45.620, -122.772],
      [45.612, -122.768],
      [45.604, -122.778],
    ],
    estimatedAffectedAreaKm2: 2.1,
    populationExposedEstimate: 140,
    observationTime: "2026-10-16T17:15:00Z",
    ingestionTime: "2026-10-16T17:35:00Z",
    lastUpdatedTime: "2026-10-16T17:35:00Z",
    primarySource: "InSAR Ground Displacement Interferogram (Sentinel-1)",
    confidenceScore: 78,
    uncertaintyRadiusMeters: 120,
    deduplicationCount: 1,
    deduplicationNotes: "Single InSAR interferometric phase shift detection across 12-day repeat orbit.",
    trend: "increasing",
    forecasts: {
      now: {
        horizon: 'now',
        label: 'Surface Displacement Fringe (14 mm/wk)',
        polygon: [
          [45.608, -122.788],
          [45.618, -122.785],
          [45.620, -122.772],
          [45.612, -122.768],
          [45.604, -122.778],
        ],
        affectedAreaKm2: 2.1,
        trend: 'increasing',
        speedKmh: 0.01,
        directionDeg: 190,
        directionText: 'S slope descent toward Highway 26 roadbed',
        confidenceScore: 78,
        uncertaintyMarginKm: 0.12,
        modelName: 'InSAR Differential Phase Analysis (PS-InSAR)',
        generatedAt: '2026-10-16T17:35:00Z',
        notes: 'Recent heavy saturation has accelerated creep rate.'
      },
      '+1h': {
        horizon: '+1h',
        label: '+1h Stability Horizon',
        polygon: [
          [45.607, -122.789],
          [45.618, -122.785],
          [45.620, -122.771],
          [45.611, -122.767],
          [45.603, -122.779],
        ],
        affectedAreaKm2: 2.2,
        trend: 'increasing',
        confidenceScore: 72,
        uncertaintyMarginKm: 0.2,
        modelName: 'Geotechnical Slope Stability Factor of Safety (FoS 1.08)',
        generatedAt: '2026-10-16T17:35:00Z',
        notes: 'Impending slope failure threshold if rainfall exceeds 15mm/hr.'
      },
      '+3h': {
        horizon: '+3h',
        label: '+3h Geotechnical Projection',
        polygon: [
          [45.605, -122.791],
          [45.619, -122.786],
          [45.621, -122.770],
          [45.610, -122.765],
          [45.601, -122.780],
        ],
        affectedAreaKm2: 2.6,
        trend: 'increasing',
        confidenceScore: 60,
        uncertaintyMarginKm: 0.35,
        modelName: 'Geotechnical Slope Stability Guidance',
        generatedAt: '2026-10-16T17:35:00Z',
        notes: 'Potential debris runout into culvert.'
      },
      '+6h': {
        horizon: '+6h',
        label: '+6h Model Horizon (Not Provided)',
        polygon: [],
        affectedAreaKm2: 0,
        trend: 'unknown',
        confidenceScore: 0,
        uncertaintyMarginKm: 0,
        modelName: 'Unavailable',
        generatedAt: '2026-10-16T17:35:00Z',
        notes: 'Forecast unavailable. Continuous geotechnical sensor installation required.'
      }
    },
    observations: [
      {
        id: "OBS-07",
        source: "Copernicus Sentinel-1 Interferometric SAR (InSAR)",
        sensorType: "satellite_radar",
        timestamp: "2026-10-16T17:15:00Z",
        ingestedAt: "2026-10-16T17:35:00Z",
        groundResolutionMeters: 20,
        confidenceScore: 82,
        rawMetricValue: "Line-of-Sight (LOS) velocity: -18 mm/yr with sudden +6 mm impulse",
        qualityNote: "Phase unwrapping coherent along non-vegetated road cut."
      }
    ],
    auditTrail: [
      {
        id: "AUD-06",
        timestamp: "2026-10-16T17:35:00Z",
        actor: "Geological Survey Auto-Ingest",
        role: "Viewer",
        action: "Detected",
        newStatus: "detected",
        notes: "InSAR displacement trigger triggered."
      }
    ],
    responderNotes: []
  },
  {
    id: "INC-2026-FL01",
    title: "Sandy River Slough Drainage Overflow (Resolved)",
    hazardType: "flood",
    severity: "minor",
    status: "confirmed",
    locationName: "East Slough Retention Basin",
    jurisdiction: "Western Basin & Foothills (District 7)",
    center: { lat: 45.518, lng: -122.42 },
    observedExtentPolygon: [
      [45.514, -122.428],
      [45.522, -122.424],
      [45.524, -122.412],
      [45.517, -122.408],
      [45.512, -122.419],
    ],
    estimatedAffectedAreaKm2: 3.4,
    populationExposedEstimate: 210,
    observationTime: "2026-10-16T14:10:00Z",
    ingestionTime: "2026-10-16T14:22:00Z",
    lastUpdatedTime: "2026-10-16T18:00:00Z",
    primarySource: "USGS Station #14139800 + Local CCTV",
    confidenceScore: 96,
    uncertaintyRadiusMeters: 80,
    deduplicationCount: 2,
    deduplicationNotes: "Water level gauge confirmed by local public works culvert sensor.",
    trend: "decreasing",
    forecasts: {
      now: {
        horizon: 'now',
        label: 'Receding Flood Extent',
        polygon: [
          [45.514, -122.428],
          [45.522, -122.424],
          [45.524, -122.412],
          [45.517, -122.408],
          [45.512, -122.419],
        ],
        affectedAreaKm2: 3.4,
        trend: 'decreasing',
        speedKmh: 0.5,
        directionDeg: 300,
        directionText: 'Receding back into retention basin channels',
        confidenceScore: 95,
        uncertaintyMarginKm: 0.08,
        modelName: 'Hydrologic Runoff Attenuation Model',
        generatedAt: '2026-10-16T18:00:00Z',
        notes: 'Pumping operations stabilized containment.'
      },
      '+1h': {
        horizon: '+1h',
        label: '+1h Receding Projection',
        polygon: [
          [45.515, -122.426],
          [45.521, -122.422],
          [45.522, -122.414],
          [45.516, -122.411],
          [45.513, -122.418],
        ],
        affectedAreaKm2: 2.8,
        trend: 'decreasing',
        confidenceScore: 92,
        uncertaintyMarginKm: 0.1,
        modelName: 'Hydrologic Runoff Attenuation Model',
        generatedAt: '2026-10-16T18:00:00Z',
        notes: 'Pumps clearing 45,000 gpm.'
      },
      '+3h': {
        horizon: '+3h',
        label: '+3h Safe Baseline',
        polygon: [
          [45.516, -122.424],
          [45.520, -122.421],
          [45.521, -122.416],
          [45.517, -122.414],
          [45.515, -122.419],
        ],
        affectedAreaKm2: 1.5,
        trend: 'decreasing',
        confidenceScore: 88,
        uncertaintyMarginKm: 0.15,
        modelName: 'Hydrologic Runoff Attenuation Model',
        generatedAt: '2026-10-16T18:00:00Z',
        notes: 'Roadway clear; standing water confined to designated sump.'
      },
      '+6h': {
        horizon: '+6h',
        label: '+6h Fully Drained',
        polygon: [],
        affectedAreaKm2: 0.4,
        trend: 'decreasing',
        confidenceScore: 85,
        uncertaintyMarginKm: 0.2,
        modelName: 'Hydrologic Runoff Attenuation Model',
        generatedAt: '2026-10-16T18:00:00Z',
        notes: 'System returning to dry weather capacity.'
      }
    },
    observations: [
      {
        id: "OBS-08",
        source: "USGS Station #14139800",
        sensorType: "river_gauge",
        timestamp: "2026-10-16T14:10:00Z",
        ingestedAt: "2026-10-16T14:22:00Z",
        confidenceScore: 97,
        rawMetricValue: "Stage 12.2 ft (Receding at -0.4 ft/hr)",
        qualityNote: "Physical ultrasonic transducer verified nominal."
      }
    ],
    assignedTeam: "District Public Works Drainage Div.",
    auditTrail: [
      {
        id: "AUD-07",
        timestamp: "2026-10-16T14:22:00Z",
        actor: "Auto-Ingest",
        role: "Viewer",
        action: "Detected",
        newStatus: "detected"
      },
      {
        id: "AUD-08",
        timestamp: "2026-10-16T15:00:00Z",
        actor: "Capt. Tyler Vance",
        role: "Incident Reviewer",
        action: "Confirmed",
        newStatus: "confirmed",
        notes: "Verified with public works pump truck dispatch."
      }
    ],
    responderNotes: [
      {
        author: "Capt. Tyler Vance",
        role: "Incident Reviewer",
        timestamp: "2026-10-16T15:05:00Z",
        content: "Temporary road barriers removed. Monitoring only."
      }
    ]
  }
];

export const INITIAL_FEEDS: TelemetryFeed[] = [
  {
    id: "FEED-S1A",
    name: "Copernicus Sentinel-1 SAR (Radar Constellation)",
    sourceType: "Satellite SAR",
    satelliteOrStation: "Sentinel-1A C-Band Synthetic Aperture Radar",
    jurisdiction: "All Jurisdictions (Global Orbit)",
    lastObservationTime: "2026-10-16T18:42:00Z",
    lastSuccessfulUpdate: "2026-10-16T18:49:15Z",
    expectedIntervalMinutes: 60, // 1 hour regional revisit/downlink cycle
    latencyMinutes: 16,
    status: "Current",
    resolutionOrSensors: "10m Pixel / Interferometric Wide (IW VV/VH)",
    operationalNotes: "Cloud-penetrating radar. Nominal downlink via Svalbard Ground Station."
  },
  {
    id: "FEED-GOES18",
    name: "NOAA GOES-18 ABI (Geostationary West)",
    sourceType: "Geostationary",
    satelliteOrStation: "GOES-18 Advanced Baseline Imager (West Pac)",
    jurisdiction: "Western Basin & Foothills (District 7)",
    lastObservationTime: "2026-10-16T18:50:00Z",
    lastSuccessfulUpdate: "2026-10-16T18:52:10Z",
    expectedIntervalMinutes: 5, // 5 min CONUS scan
    latencyMinutes: 3,
    status: "Current",
    resolutionOrSensors: "0.5km - 2km Multi-band VIS/IR (Bands 2, 7, 13)",
    operationalNotes: "Mesoscale sectors scanning active fire and convective storm genesis."
  },
  {
    id: "FEED-NEXRAD",
    name: "NEXRAD WSR-88D Doppler Dual-Pol Network",
    sourceType: "Doppler Radar",
    satelliteOrStation: "KRTX Portland/Columbia Basin Radar Node",
    jurisdiction: "Western Basin & Foothills (District 7)",
    lastObservationTime: "2026-10-16T18:50:00Z",
    lastSuccessfulUpdate: "2026-10-16T18:53:00Z",
    expectedIntervalMinutes: 6,
    latencyMinutes: 4,
    status: "Current",
    resolutionOrSensors: "0.25km Reflectivity & Velocity Volume Scan (VCP 212)",
    operationalNotes: "Tracking severe convective downburst cluster."
  },
  {
    id: "FEED-USGS",
    name: "USGS Hydro & River Telemetry Gauges",
    sourceType: "Hydrometric Gauge",
    satelliteOrStation: "48 Telemetry Station Network (GOES DCS Relay)",
    jurisdiction: "Western Basin & Foothills (District 7)",
    lastObservationTime: "2026-10-16T18:45:00Z",
    lastSuccessfulUpdate: "2026-10-16T18:46:20Z",
    expectedIntervalMinutes: 15,
    latencyMinutes: 9,
    status: "Current",
    resolutionOrSensors: "Acoustic Doppler & Pressure Transducers (Stage + Discharge)",
    operationalNotes: "Gauge #14211720 reporting rapid rising water stage."
  },
  {
    id: "FEED-S2B",
    name: "Copernicus Sentinel-2 MSI (High-Res Optical)",
    sourceType: "Satellite Optical",
    satelliteOrStation: "Sentinel-2B MultiSpectral Instrument",
    jurisdiction: "All Jurisdictions",
    lastObservationTime: "2026-10-16T16:10:00Z",
    lastSuccessfulUpdate: "2026-10-16T16:45:00Z",
    expectedIntervalMinutes: 120,
    latencyMinutes: 140,
    status: "Delayed",
    resolutionOrSensors: "10m-20m 13 Spectral Bands (SWIR/NIR)",
    operationalNotes: "Revisit interval constrained by orbital geometry. Heavy cloud deck restricts optical visibility in Sector 4."
  },
  {
    id: "FEED-VIIRS",
    name: "Suomi NPP / JPSS VIIRS Active Fire",
    sourceType: "Thermal Array",
    satelliteOrStation: "JPSS-1 / NOAA-20 VIIRS Sensor Suite",
    jurisdiction: "All Jurisdictions",
    lastObservationTime: "2026-10-16T14:30:00Z",
    lastSuccessfulUpdate: "2026-10-16T15:15:00Z",
    expectedIntervalMinutes: 180,
    latencyMinutes: 230,
    status: "Stale",
    resolutionOrSensors: "375m I-Band Fire Radiative Power (MW)",
    operationalNotes: "Next scheduled orbital pass over Northwest quadrant: 21:15 UTC."
  }
];

export const INITIAL_RESCUE_UNITS: RescueUnit[] = [
  {
    id: "UNIT-ST12",
    callsign: "Swiftwater Taskforce Alpha (ST-12)",
    unitType: "Swiftwater Rescue",
    personnelCount: 8,
    status: "Dispatched",
    currentLocation: { lat: 45.535, lng: -122.61 },
    locationName: "Clearwater Staging Area Bravo",
    assignedIncidentId: "INC-2026-FL04",
    equipmentSummary: "3x Zodiac Inflatables, 2x High-Clearance LMTV Transporters, Technical Rigging",
    radioFrequency: "TAC-4 (154.280 MHz)",
    etaMinutes: 14
  },
  {
    id: "UNIT-HL04",
    callsign: "Helitack Strike Team 4 (Airborne Recon)",
    unitType: "Helitack Search & Rescue",
    personnelCount: 4,
    status: "On Scene",
    currentLocation: { lat: 45.425, lng: -122.37 },
    locationName: "Timberline Sector Skyline Orbit",
    assignedIncidentId: "INC-2026-WF09",
    equipmentSummary: "Bell 412EP with FLIR Star SAFIRE HD Gimbal & Bambi Bucket (1,200 L)",
    radioFrequency: "AIR-TO-GROUND 1 (168.650 MHz)",
    etaMinutes: 0
  },
  {
    id: "UNIT-WF07",
    callsign: "Cascadia Wildland Hotshots (Crew 7)",
    unitType: "Wildland Firefighting",
    personnelCount: 20,
    status: "Dispatched",
    currentLocation: { lat: 45.405, lng: -122.40 },
    locationName: "Old Mill Access Cutoff",
    assignedIncidentId: "INC-2026-WF09",
    equipmentSummary: "Type-3 Engines (2x), Bulldozer Transport, Chainsaws & Line Digging Equipment",
    radioFrequency: "TAC-2 (154.265 MHz)",
    etaMinutes: 22
  },
  {
    id: "UNIT-MED03",
    callsign: "Critical Care Evac Transport 3",
    unitType: "Medical Evac",
    personnelCount: 4,
    status: "Standby",
    currentLocation: { lat: 45.510, lng: -122.58 },
    locationName: "Providence Regional Staging Pad",
    assignedIncidentId: undefined,
    equipmentSummary: "Mobile Trauma Resuscitation ICU, 4x Patient Litters, Decontamination Tent",
    radioFrequency: "MED-NET 9 (155.340 MHz)",
    etaMinutes: undefined
  },
  {
    id: "UNIT-ENG02",
    callsign: "Geotechnical Infrastructure Assessment Team",
    unitType: "Structural Assessment",
    personnelCount: 3,
    status: "Available",
    currentLocation: { lat: 45.580, lng: -122.70 },
    locationName: "State Highway Maintenance Yard 6",
    assignedIncidentId: "INC-2026-LS02",
    equipmentSummary: "Terrestrial LiDAR Scanner, Inclinometers, Culvert Inspection Drone",
    radioFrequency: "DOT-OPS (151.100 MHz)",
    etaMinutes: 35
  }
];
