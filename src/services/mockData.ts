// src/services/mockData.ts
import { Incident, TelemetryFeed, CWCGauge, FIRMSRecord, PrecautionItem, ResponderRole } from '../types';

export const INITIAL_RESPONDER = {
  name: "Dr. K. R. Nambiar",
  badgeNumber: "DEOC-EKM-04",
  role: "District Emergency Operations Officer" as ResponderRole,
  jurisdiction: "Ernakulam District (Periyar Basin)",
  organization: "Kerala State Disaster Management Authority (KSDMA) / NDMA IRS",
};

export const AVAILABLE_JURISDICTIONS = [
  "Ernakulam District (Periyar Basin)",
  "Thrissur District (Chalakudy Basin)",
  "Idukki District (High Range Catchment)",
  "Kottayam District (Meenachil Basin)",
];

export const AVAILABLE_SECTORS = [
  "All Sectors",
  "Aluva / Periyar Rivermile 18",
  "Kalamassery & Kochi North",
  "Paravur / Coastal Delta",
  "Malayattoor Foothills",
  "Kothamangalam Ghat Pass",
];

export const PRECAUTION_ITEMS: PrecautionItem[] = [
  { id: 'prec-higher-ground', icon: '⛰️', label: 'Move to higher ground immediately', code: 'EVAC_HIGH' },
  { id: 'prec-electricity', icon: '⚡', label: 'Switch off main electrical breakers', code: 'POWER_OFF' },
  { id: 'prec-docs', icon: '📄', label: 'Carry waterproof documents & medicines', code: 'KIT_DOCS' },
  { id: 'prec-water', icon: '🚫', label: 'Do not walk or drive through flowing water', code: 'NO_CROSS' },
  { id: 'prec-route', icon: '🛣️', label: 'Follow designated route: NH 544 Aluva bypass', code: 'CORRIDOR_NH' },
  { id: 'prec-livestock', icon: '🐄', label: 'Untie livestock and guide to highland shelters', code: 'LIVESTOCK' },
];

export const CWC_GAUGES: CWCGauge[] = [
  {
    id: "CWC-029",
    stationName: "Neeleswaram Barrage",
    riverName: "Periyar River",
    currentLevelMeters: 8.42,
    warningLevelMeters: 7.80,
    dangerLevelMeters: 9.00,
    trend: "rising",
    sparkline: [7.2, 7.4, 7.8, 8.0, 8.25, 8.42],
    lat: 10.142,
    lng: 76.425,
    lastUpdated: "2026-10-17T01:30:00Z"
  },
  {
    id: "CWC-031",
    stationName: "Kalady Bridge",
    riverName: "Periyar River",
    currentLevelMeters: 6.84,
    warningLevelMeters: 7.20,
    dangerLevelMeters: 8.50,
    trend: "rising",
    sparkline: [5.8, 6.1, 6.3, 6.5, 6.72, 6.84],
    lat: 10.165,
    lng: 76.442,
    lastUpdated: "2026-10-17T01:30:00Z"
  },
  {
    id: "CWC-044",
    stationName: "Ramamangalam",
    riverName: "Muvattupuzha River",
    currentLevelMeters: 5.90,
    warningLevelMeters: 6.80,
    dangerLevelMeters: 7.50,
    trend: "steady",
    sparkline: [5.92, 5.91, 5.90, 5.89, 5.90, 5.90],
    lat: 9.940,
    lng: 76.512,
    lastUpdated: "2026-10-17T01:15:00Z"
  }
];

export const FIRMS_HOTSPOTS: FIRMSRecord[] = [
  { id: "FIRMS-01", lat: 10.198, lng: 76.512, frpMW: 64.2, confidence: 91, satellite: 'SNPP', acquisitionTime: '07h ago' },
  { id: "FIRMS-02", lat: 10.194, lng: 76.518, frpMW: 88.5, confidence: 95, satellite: 'SNPP', acquisitionTime: '07h ago' },
  { id: "FIRMS-03", lat: 10.203, lng: 76.508, frpMW: 42.1, confidence: 84, satellite: 'Aqua', acquisitionTime: '07h ago' },
  { id: "FIRMS-04", lat: 10.189, lng: 76.524, frpMW: 31.0, confidence: 78, satellite: 'Terra', acquisitionTime: '07h ago' },
];

/**
 * Pre-computed Reference Extent for Ernakulam / Periyar Basin
 * (Used for live calculation of IoU, Precision, Recall against Ground Truth)
 */
export const REFERENCE_FLOOD_GEOJSON: [number, number][] = [
  [10.102, 76.345],
  [10.118, 76.350],
  [10.128, 76.368],
  [10.119, 76.384],
  [10.098, 76.380],
  [10.090, 76.358],
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "FL-2026-EK01",
    title: "Periyar River Surge & Aluva Lowland Inundation",
    hazardType: "flood",
    severity: "critical",
    status: "under_review",
    sector: "Aluva / Periyar Rivermile 18",
    locationName: "Aluva Bank & Desom-Companypady Belt",
    jurisdiction: "Ernakulam District (Periyar Basin)",
    center: { lat: 10.108, lng: 76.356 },
    observedExtentPolygon: [
      [10.104, 76.348],
      [10.116, 76.352],
      [10.124, 76.366],
      [10.114, 76.380],
      [10.096, 76.376],
      [10.092, 76.355],
    ],
    referenceExtentPolygon: REFERENCE_FLOOD_GEOJSON,
    estimatedAffectedAreaKm2: 14.8,
    uncertaintyAreaKm2: 0.4,
    populationExposedEstimate: 14200,
    methodSentence: "Sentinel-1 VV backscatter change detection vs. pre-event image, threshold applied (-15.2 dB cut-off), speckle-filtered.",
    observationTime: "2026-10-17T01:15:00Z",
    ingestionTime: "2026-10-17T01:22:15Z",
    lastUpdatedTime: "2026-10-17T01:45:00Z",
    primarySource: "Sentinel-1 SAR + CWC Gauge",
    confidenceScore: 92,
    confidenceExplanation: "High backscatter delta (-14.8 dB) corroborated by CWC Neeleswaram +1.2m surge stage and IMD radar accumulation.",
    uncertaintyRadiusMeters: 180,
    deduplicationCount: 3,
    mergedSources: [
      "Copernicus Sentinel-1 SAR pass #41028 (IW VV/VH)",
      "CWC Neeleswaram Hydrometric Gauge Station #029 (8.4m, rising)",
      "Kerala Police Drone FLIR Reconnaissance Track (Sector 4)"
    ],
    isFeedStale: true,
    staleFeedName: "Sentinel-2 Optical (Cloud Obscured)",
    staleFeedDuration: "14 days",
    trend: "increasing",
    timelineSteps: {
      t0: [
        [10.104, 76.348],
        [10.116, 76.352],
        [10.124, 76.366],
        [10.114, 76.380],
        [10.096, 76.376],
        [10.092, 76.355],
      ],
      t6h: [
        [10.101, 76.344],
        [10.118, 76.349],
        [10.128, 76.369],
        [10.118, 76.385],
        [10.094, 76.381],
        [10.088, 76.352],
      ],
      t12h: [
        [10.098, 76.340],
        [10.121, 76.346],
        [10.133, 76.372],
        [10.122, 76.390],
        [10.091, 76.386],
        [10.084, 76.348],
      ],
      t24h: [
        [10.094, 76.335],
        [10.125, 76.342],
        [10.138, 76.376],
        [10.126, 76.395],
        [10.088, 76.391],
        [10.080, 76.344],
      ]
    },
    forecasts: {
      now: {
        horizon: 'now',
        label: 'Current Extent (Observed)',
        polygon: [
          [10.104, 76.348],
          [10.116, 76.352],
          [10.124, 76.366],
          [10.114, 76.380],
          [10.096, 76.376],
          [10.092, 76.355],
        ],
        uncertaintyPolygon: [
          [10.101, 76.344],
          [10.119, 76.348],
          [10.128, 76.370],
          [10.118, 76.385],
          [10.093, 76.381],
          [10.088, 76.351],
        ],
        affectedAreaKm2: 14.8,
        trend: 'increasing',
        speedKmh: 2.4,
        directionText: 'WNW along Periyar alluvial lowlands toward Aluva town',
        confidenceScore: 92,
        uncertaintyMarginKm: 0.18,
        modelName: 'Sentinel-1 SAR BWI Threshold (Otsu method)',
        generatedAt: '2026-10-17T01:22:15Z',
        notes: 'Calibrated against CWC Neeleswaram +1.2m stage level.',
        nextLikelyAffected: 'Marampilly Sector 2, Kalamassery fringe'
      },
      '+1h': {
        horizon: '+1h',
        label: '+1h Forecast (+0.3m stage rise)',
        polygon: [
          [10.102, 76.344],
          [10.119, 76.349],
          [10.128, 76.371],
          [10.118, 76.385],
          [10.094, 76.380],
          [10.089, 76.352],
        ],
        uncertaintyPolygon: [
          [10.099, 76.340],
          [10.122, 76.346],
          [10.132, 76.375],
          [10.121, 76.389],
          [10.091, 76.384],
          [10.086, 76.348],
        ],
        affectedAreaKm2: 17.6,
        trend: 'increasing',
        speedKmh: 2.1,
        directionText: 'WNW into residential fringe of Companypady & Desom',
        confidenceScore: 86,
        uncertaintyMarginKm: 0.32,
        modelName: 'Hydrodynamic 2D Shallow Water Flow Model (HEC-RAS 6.4)',
        generatedAt: '2026-10-17T01:25:00Z',
        notes: 'Forecast confidence decreases with lead time. Inundation crosses NH 544 service lane.',
        nextLikelyAffected: 'Marampilly Sector 2, Kalamassery'
      },
      '+3h': {
        horizon: '+3h',
        label: '+3h Forecast (Projected Dam Spillage Crest)',
        polygon: [
          [10.098, 76.340],
          [10.122, 76.346],
          [10.133, 76.375],
          [10.121, 76.390],
          [10.091, 76.385],
          [10.085, 76.348],
        ],
        uncertaintyPolygon: [
          [10.094, 76.335],
          [10.126, 76.342],
          [10.138, 76.380],
          [10.125, 76.395],
          [10.087, 76.390],
          [10.081, 76.343],
        ],
        affectedAreaKm2: 22.4,
        trend: 'increasing',
        speedKmh: 1.8,
        directionText: 'W toward Eloor industrial belt and Kalamassery bypass',
        confidenceScore: 78,
        uncertaintyMarginKm: 0.55,
        modelName: 'Hydrodynamic 2D Shallow Water Model',
        generatedAt: '2026-10-17T01:25:00Z',
        notes: 'Water depth expected to reach 1.4m in low-lying wards. Pre-evacuation trigger reached.',
        nextLikelyAffected: 'Kalamassery, Eloor Industrial Ward 3'
      },
      '+6h': {
        horizon: '+6h',
        label: '+6h Forecast (Peak Inundation Plateau)',
        polygon: [
          [10.094, 76.335],
          [10.126, 76.342],
          [10.138, 76.380],
          [10.125, 76.395],
          [10.087, 76.390],
          [10.081, 76.343],
        ],
        uncertaintyPolygon: [
          [10.090, 76.330],
          [10.130, 76.338],
          [10.144, 76.386],
          [10.129, 76.402],
          [10.082, 76.396],
          [10.076, 76.338],
        ],
        affectedAreaKm2: 27.8,
        trend: 'stable',
        speedKmh: 1.2,
        directionText: 'Attenuation across Varapuzha backwater basin',
        confidenceScore: 68,
        uncertaintyMarginKm: 0.85,
        modelName: 'Ensemble Flood Routing Guidance',
        generatedAt: '2026-10-17T01:25:00Z',
        notes: 'High tide interaction at Kochi backwaters may slow drainage rate.',
        nextLikelyAffected: 'Varapuzha, North Paravur'
      }
    },
    observations: [
      {
        id: "OBS-KL-01",
        source: "Copernicus Sentinel-1 SAR (IW VV Mode)",
        sensorType: "satellite_sar",
        timestamp: "2026-10-17T01:15:00Z",
        ingestedAt: "2026-10-17T01:22:15Z",
        confidenceScore: 94,
        rawMetricValue: "Backscatter drop -14.8 dB across 14.8 km² specular water mask",
        qualityNote: "Single pass in replay. High coherence; calibrated against baseline.",
        rawPayload: {
          satellite: "Sentinel-1A",
          orbitPass: 41028,
          polarization: "VV+VH",
          incidenceAngleDeg: 38.4,
          thresholdDb: -15.2,
          areaSqKm: 14.8
        }
      },
      {
        id: "OBS-KL-02",
        source: "CWC Neeleswaram Hydrometric Gauge",
        sensorType: "cwc_gauge",
        timestamp: "2026-10-17T01:30:00Z",
        ingestedAt: "2026-10-17T01:32:00Z",
        confidenceScore: 98,
        rawMetricValue: "River Stage: 8.42m (Danger Mark: 9.00m; Rate of rise +0.22m/hr)",
        qualityNote: "Physical ultrasonic sensor reporting via INSAT telemetry link.",
        rawPayload: {
          stationId: "CWC-029",
          levelMeters: 8.42,
          dangerMeters: 9.0,
          status: "RISING"
        }
      },
      {
        id: "OBS-KL-03",
        source: "IMD Doppler Weather Radar (Kochi)",
        sensorType: "imd_doppler",
        timestamp: "2026-10-17T01:20:00Z",
        ingestedAt: "2026-10-17T01:24:00Z",
        confidenceScore: 90,
        rawMetricValue: "Max reflectivity 52 dBZ over Periyar catchment; 78mm rain in 3h",
        qualityNote: "Clean beam volume scan; orographic enhancement over Bhoothathankettu.",
        rawPayload: {
          station: "DWR Kochi",
          accumulatedRainMm: 78.4,
          reflectivityDbz: 52
        }
      }
    ],
    auditTrail: [
      {
        id: "AUD-01",
        timestamp: "2026-10-17T01:22:15Z",
        actor: "Automated SAR Ingest Pipeline",
        role: "Viewer",
        action: "Detected",
        target: "FL-2026-EK01",
        newStatus: "detected",
        note: "Surface water threshold exceeded across Aluva floodplains (>10 km²)."
      },
      {
        id: "AUD-02",
        timestamp: "2026-10-17T01:35:00Z",
        actor: "Inspector Anjali Menon",
        role: "Incident Reviewer",
        action: "Review Started",
        target: "FL-2026-EK01",
        previousStatus: "detected",
        newStatus: "under_review",
        note: "Correlating CWC Neeleswaram stage rise and Sentinel-1 SAR flood footprint."
      }
    ],
    responderNotes: [
      {
        id: "NOTE-01",
        author: "Inspector Anjali Menon",
        role: "Incident Reviewer",
        timestamp: "2026-10-17T01:38:00Z",
        content: "Breach reported along Companypady drainage culvert. Water entering service road of NH 544. Evacuation preparation needed for Ward 4 and Ward 7."
      }
    ]
  },
  {
    id: "WF-2026-KL01",
    title: "Malayattoor Forest Range Canopy Wildfire",
    hazardType: "wildfire",
    severity: "critical",
    status: "under_review",
    sector: "Malayattoor Foothills",
    locationName: "Malayattoor Reserved Forest - Illithodu Compartment",
    jurisdiction: "Ernakulam District (Periyar Basin)",
    center: { lat: 10.198, lng: 76.515 },
    observedExtentPolygon: [
      [10.188, 76.505],
      [10.208, 76.500],
      [10.212, 76.528],
      [10.196, 76.532],
      [10.184, 76.518],
    ],
    estimatedAffectedAreaKm2: 6.4,
    uncertaintyAreaKm2: 0.6,
    populationExposedEstimate: 1850,
    methodSentence: "NASA FIRMS thermal anomaly clustering with Rothermel flame spread buffer adjusted for 18 km/h easterly wind and 24° terrain slope.",
    observationTime: "2026-10-16T18:45:00Z", // 7 hours ago -> Stale feed!
    ingestionTime: "2026-10-16T19:02:00Z",
    lastUpdatedTime: "2026-10-17T01:00:00Z",
    primarySource: "NASA FIRMS (Suomi NPP VIIRS)",
    confidenceScore: 89,
    confidenceExplanation: "Cluster of 4 contiguous VIIRS 375m pixels with max Fire Radiative Power (FRP) of 88.5 MW.",
    uncertaintyRadiusMeters: 250,
    deduplicationCount: 4,
    mergedSources: [
      "NASA FIRMS SNPP VIIRS 375m Active Fire Detection",
      "Aqua MODIS Thermal Anomaly (Band 21/22)",
      "Forest Range Watchtower Illithodu Visual Smoke Report",
      "KSDMA Hotspot Automated Classifier v2"
    ],
    isFeedStale: true,
    staleFeedName: "NASA FIRMS (Suomi NPP / VIIRS)",
    staleFeedDuration: "7h 15m (typical revisit 3h)",
    trend: "increasing",
    forecasts: {
      now: {
        horizon: 'now',
        label: 'Active Flame Perimeter (FIRMS Hotspot Envelope)',
        polygon: [
          [10.188, 76.505],
          [10.208, 76.500],
          [10.212, 76.528],
          [10.196, 76.532],
          [10.184, 76.518],
        ],
        uncertaintyPolygon: [
          [10.184, 76.500],
          [10.212, 76.494],
          [10.218, 76.534],
          [10.199, 76.538],
          [10.180, 76.514],
        ],
        affectedAreaKm2: 6.4,
        trend: 'increasing',
        speedKmh: 1.2,
        directionText: 'WNW toward Illithodu tribal settlement and plantation boundary',
        confidenceScore: 89,
        uncertaintyMarginKm: 0.25,
        modelName: 'Rothermel Surface Fire Model + WindNinja Slope Correction',
        generatedAt: '2026-10-16T19:02:00Z',
        notes: 'Dry teak plantation understory with high fuel load. Data age >7 hours.',
        nextLikelyAffected: 'Illithodu Settlement, Mulamkuzhy Estate'
      },
      '+1h': {
        horizon: '+1h',
        label: '+1h Spread Projection',
        polygon: [
          [10.189, 76.501],
          [10.212, 76.495],
          [10.218, 76.525],
          [10.199, 76.530],
          [10.183, 76.514],
        ],
        affectedAreaKm2: 9.2,
        trend: 'increasing',
        speedKmh: 1.4,
        directionText: 'WNW advancing toward plantation perimeter trench',
        confidenceScore: 81,
        uncertaintyMarginKm: 0.45,
        modelName: 'Rothermel Model',
        generatedAt: '2026-10-16T19:05:00Z',
        notes: 'Forecast confidence decreases with lead time.',
        nextLikelyAffected: 'Illithodu Ward 8'
      },
      '+3h': {
        horizon: '+3h',
        label: '+3h Horizon (Evening Ridge Inversion)',
        polygon: [
          [10.190, 76.496],
          [10.218, 76.488],
          [10.224, 76.520],
          [10.202, 76.526],
          [10.182, 76.510],
        ],
        affectedAreaKm2: 13.8,
        trend: 'increasing',
        speedKmh: 1.1,
        directionText: 'Decelerating on rocky ridge spine',
        confidenceScore: 68,
        uncertaintyMarginKm: 0.8,
        modelName: 'Coupled Atmosphere-Fire Guidance',
        generatedAt: '2026-10-16T19:05:00Z',
        notes: 'Nighttime humidity expected to moderate spread rate.',
        nextLikelyAffected: 'Mulamkuzhy River Crossing'
      },
      '+6h': {
        horizon: '+6h',
        label: '+6h Spread Horizon',
        polygon: [
          [10.192, 76.492],
          [10.222, 76.482],
          [10.228, 76.515],
          [10.205, 76.522],
          [10.180, 76.505],
        ],
        affectedAreaKm2: 17.5,
        trend: 'stable',
        speedKmh: 0.6,
        directionText: 'Natural firebreak formed by Periyar river bend',
        confidenceScore: 55,
        uncertaintyMarginKm: 1.2,
        modelName: 'Fire Growth Simulation',
        generatedAt: '2026-10-16T19:05:00Z',
        notes: 'Expected to stall at river water barrier.',
        nextLikelyAffected: 'Periyar River North Shore'
      }
    },
    observations: [
      {
        id: "OBS-WF-01",
        source: "NASA FIRMS (Suomi NPP VIIRS 375m)",
        sensorType: "firms_thermal",
        timestamp: "2026-10-16T18:45:00Z",
        ingestedAt: "2026-10-16T19:02:00Z",
        confidenceScore: 92,
        rawMetricValue: "Thermal Brightness Temp: 352 K; Total FRP: 88.5 MW across 4 pixels",
        qualityNote: "Polar-orbiting sensor pass. Data is 7 hours old; next pass expected at 03:40 UTC.",
        rawPayload: {
          sensor: "VIIRS I-Band",
          frpMW: 88.5,
          hotspotCount: 4,
          dataLatencyHours: 7.2
        }
      }
    ],
    auditTrail: [
      {
        id: "AUD-WF-01",
        timestamp: "2026-10-16T19:02:00Z",
        actor: "NASA FIRMS Auto-Ingest",
        role: "Viewer",
        action: "Detected",
        target: "WF-2026-KL01",
        newStatus: "detected",
        note: "High FRP thermal hotspot cluster detected in reserved forest."
      }
    ],
    responderNotes: [
      {
        id: "NOTE-WF-01",
        author: "Forest Range Officer V. George",
        role: "Incident Reviewer",
        timestamp: "2026-10-16T20:15:00Z",
        content: "Fire lines being cut along Compartment 14. Requesting aerial helicopter Bambi bucket deployment from Navy INS Garuda."
      }
    ]
  },
  {
    id: "WX-2026-EK03",
    title: "Severe Convective Downburst & Arterial Waterlogging",
    hazardType: "severe_weather",
    severity: "high",
    status: "detected",
    sector: "Kalamassery & Kochi North",
    locationName: "Kalamassery Metro Corridor & NH Bypass",
    jurisdiction: "Ernakulam District (Periyar Basin)",
    center: { lat: 10.052, lng: 76.324 },
    observedExtentPolygon: [
      [10.040, 76.312],
      [10.062, 76.316],
      [10.068, 76.338],
      [10.048, 76.342],
      [10.036, 76.326],
    ],
    estimatedAffectedAreaKm2: 8.5,
    uncertaintyAreaKm2: 0.8,
    populationExposedEstimate: 28000,
    methodSentence: "IMD Doppler Kochi radar reflectivity core (>50 dBZ) combined with INSAT-3DR cloud-top brightness temperature (-68°C).",
    observationTime: "2026-10-17T01:25:00Z",
    ingestionTime: "2026-10-17T01:28:00Z",
    lastUpdatedTime: "2026-10-17T01:30:00Z",
    primarySource: "IMD Doppler Weather Radar (Kochi)",
    confidenceScore: 88,
    confidenceExplanation: "High-resolution volume scan indicates 65 mm/hr localized rain rate.",
    uncertaintyRadiusMeters: 400,
    deduplicationCount: 2,
    mergedSources: [
      "IMD Kochi Radar Node (VCP 212 Reflectivity)",
      "INSAT-3DR Rapid Scan (30 min loop)"
    ],
    trend: "increasing",
    forecasts: {
      now: {
        horizon: 'now',
        label: 'Radar Reflectivity Core (>50 dBZ)',
        polygon: [
          [10.040, 76.312],
          [10.062, 76.316],
          [10.068, 76.338],
          [10.048, 76.342],
          [10.036, 76.326],
        ],
        affectedAreaKm2: 8.5,
        trend: 'increasing',
        speedKmh: 28.0,
        directionText: 'NE at 28 km/h across Kalamassery Metro stations',
        confidenceScore: 88,
        uncertaintyMarginKm: 0.4,
        modelName: 'IMD Nowcasting QPE',
        generatedAt: '2026-10-17T01:28:00Z',
        notes: 'Intense rain causing rapid surface drainage choking at Premier Junction.',
        nextLikelyAffected: 'Edappally Toll, Cusat Junction'
      },
      '+1h': {
        horizon: '+1h',
        label: '+1h Track',
        polygon: [
          [10.055, 76.325],
          [10.075, 76.330],
          [10.082, 76.352],
          [10.062, 76.358],
          [10.050, 76.338],
        ],
        affectedAreaKm2: 11.2,
        trend: 'increasing',
        speedKmh: 25.0,
        directionText: 'NE toward Aluva suburban belt',
        confidenceScore: 82,
        uncertaintyMarginKm: 0.8,
        modelName: 'Radar Tracking Algorithm',
        generatedAt: '2026-10-17T01:28:00Z',
        notes: 'Forecast confidence decreases with lead time.',
        nextLikelyAffected: 'Choornikkara'
      },
      '+3h': {
        horizon: '+3h',
        label: '+3h Dissipation',
        polygon: [
          [10.070, 76.340],
          [10.085, 76.345],
          [10.090, 76.365],
          [10.075, 76.370],
          [10.065, 76.350],
        ],
        affectedAreaKm2: 7.0,
        trend: 'decreasing',
        speedKmh: 15.0,
        directionText: 'Dissipating over Periyar basin',
        confidenceScore: 65,
        uncertaintyMarginKm: 1.5,
        modelName: 'IMD Meso Model',
        generatedAt: '2026-10-17T01:28:00Z',
        notes: 'Precipitation tapering off.',
        nextLikelyAffected: 'Periyar riverbed'
      },
      '+6h': {
        horizon: '+6h',
        label: '+6h Cleared',
        polygon: [],
        affectedAreaKm2: 0,
        trend: 'decreasing',
        confidenceScore: 0,
        uncertaintyMarginKm: 0,
        modelName: 'Unavailable',
        generatedAt: '2026-10-17T01:28:00Z',
        notes: 'Beyond convective cloud cell lifecycle.',
        nextLikelyAffected: 'None'
      }
    },
    observations: [
      {
        id: "OBS-WX-01",
        source: "IMD Kochi Doppler Radar",
        sensorType: "imd_doppler",
        timestamp: "2026-10-17T01:25:00Z",
        ingestedAt: "2026-10-17T01:28:00Z",
        confidenceScore: 88,
        rawMetricValue: "Reflectivity: 54 dBZ (localized severe rain)",
        qualityNote: "Ground clutter suppression nominal."
      }
    ],
    auditTrail: [
      {
        id: "AUD-WX-01",
        timestamp: "2026-10-17T01:28:00Z",
        actor: "IMD Doppler Auto-Tagger",
        role: "Viewer",
        action: "Detected",
        target: "WX-2026-EK03",
        newStatus: "detected",
        note: "Reflectivity threshold exceeded."
      }
    ],
    responderNotes: []
  },
  {
    id: "LS-2026-EK02",
    title: "Neriamangalam Ghat Highway Slope Creep",
    hazardType: "landslide",
    severity: "moderate",
    status: "under_review",
    sector: "Kothamangalam Ghat Pass",
    locationName: "NH 85 (Kochi-Dhanushkodi) Milepost 42",
    jurisdiction: "Ernakulam District (Periyar Basin)",
    center: { lat: 10.082, lng: 76.712 },
    observedExtentPolygon: [
      [10.076, 76.705],
      [10.088, 76.708],
      [10.092, 76.720],
      [10.080, 76.724],
      [10.072, 76.715],
    ],
    estimatedAffectedAreaKm2: 1.8,
    uncertaintyAreaKm2: 0.2,
    populationExposedEstimate: 320,
    methodSentence: "Sentinel-1 InSAR differential phase unwrapping showing 18 mm/week line-of-sight surface displacement on saturated road embankment.",
    observationTime: "2026-10-17T00:40:00Z",
    ingestionTime: "2026-10-17T01:05:00Z",
    lastUpdatedTime: "2026-10-17T01:10:00Z",
    primarySource: "InSAR Ground Displacement (Sentinel-1)",
    confidenceScore: 82,
    confidenceExplanation: "Coherent radar interferometric fringes along rock cutting.",
    uncertaintyRadiusMeters: 120,
    deduplicationCount: 1,
    mergedSources: [
      "Copernicus Sentinel-1 PS-InSAR Ground Displacement Interferogram"
    ],
    trend: "increasing",
    forecasts: {
      now: {
        horizon: 'now',
        label: 'Surface Creep Zone (18 mm/wk)',
        polygon: [
          [10.076, 76.705],
          [10.088, 76.708],
          [10.092, 76.720],
          [10.080, 76.724],
          [10.072, 76.715],
        ],
        affectedAreaKm2: 1.8,
        trend: 'increasing',
        confidenceScore: 82,
        uncertaintyMarginKm: 0.12,
        modelName: 'InSAR Displacement Analysis',
        generatedAt: '2026-10-17T01:05:00Z',
        notes: 'Continuous heavy rainfall has saturated regolith slope.',
        nextLikelyAffected: 'NH 85 Carriage Roadway'
      },
      '+1h': {
        horizon: '+1h',
        label: '+1h Geotechnical Risk',
        polygon: [
          [10.075, 76.704],
          [10.088, 76.707],
          [10.093, 76.721],
          [10.081, 76.725],
          [10.071, 76.714],
        ],
        affectedAreaKm2: 2.0,
        trend: 'increasing',
        confidenceScore: 76,
        uncertaintyMarginKm: 0.2,
        modelName: 'Slope Factor of Safety (FoS 1.08)',
        generatedAt: '2026-10-17T01:05:00Z',
        notes: 'High probability of localized mudslide if rain exceeds 15 mm/hr.',
        nextLikelyAffected: 'Cheeyappara culvert'
      },
      '+3h': {
        horizon: '+3h',
        label: '+3h Projection',
        polygon: [
          [10.073, 76.702],
          [10.090, 76.705],
          [10.095, 76.723],
          [10.082, 76.727],
          [10.070, 76.712],
        ],
        affectedAreaKm2: 2.4,
        trend: 'increasing',
        confidenceScore: 65,
        uncertaintyMarginKm: 0.35,
        modelName: 'Debris Flow Runout Model',
        generatedAt: '2026-10-17T01:05:00Z',
        notes: 'Debris runout into roadside drain.',
        nextLikelyAffected: 'Ghat Pass Checkpoint'
      },
      '+6h': {
        horizon: '+6h',
        label: '+6h (Unavailable)',
        polygon: [],
        affectedAreaKm2: 0,
        trend: 'unknown',
        confidenceScore: 0,
        uncertaintyMarginKm: 0,
        modelName: 'Unavailable',
        generatedAt: '2026-10-17T01:05:00Z',
        notes: 'Geotechnical monitoring required before further prediction.',
        nextLikelyAffected: 'None'
      }
    },
    observations: [
      {
        id: "OBS-LS-01",
        source: "Sentinel-1 InSAR Interferogram",
        sensorType: "satellite_sar",
        timestamp: "2026-10-17T00:40:00Z",
        ingestedAt: "2026-10-17T01:05:00Z",
        confidenceScore: 82,
        rawMetricValue: "Displacement Rate: -18 mm/yr with sudden +6mm rain impulse",
        qualityNote: "Phase coherence good along rocky escarpment."
      }
    ],
    auditTrail: [
      {
        id: "AUD-LS-01",
        timestamp: "2026-10-17T01:05:00Z",
        actor: "Geological Survey Automated Ingest",
        role: "Viewer",
        action: "Detected",
        target: "LS-2026-EK02",
        newStatus: "detected"
      }
    ],
    responderNotes: []
  },
  {
    id: "FL-2026-EK04",
    title: "Chitrapuzha Creek Receding Overflow",
    hazardType: "flood",
    severity: "minor",
    status: "confirmed",
    sector: "Kalamassery & Kochi North",
    locationName: "Tripunithura Spillway Retention",
    jurisdiction: "Ernakulam District (Periyar Basin)",
    center: { lat: 9.952, lng: 76.348 },
    observedExtentPolygon: [
      [9.948, 76.342],
      [9.958, 76.344],
      [9.960, 76.354],
      [9.950, 76.356],
      [9.944, 76.348],
    ],
    estimatedAffectedAreaKm2: 2.6,
    uncertaintyAreaKm2: 0.1,
    populationExposedEstimate: 420,
    methodSentence: "CWC gauge telemetry coupled with municipal storm drain ultrasonic sensor network.",
    observationTime: "2026-10-16T22:30:00Z",
    ingestionTime: "2026-10-16T22:42:00Z",
    lastUpdatedTime: "2026-10-17T01:00:00Z",
    primarySource: "CWC Gauge + Municipal CCTV",
    confidenceScore: 96,
    confidenceExplanation: "Physical gauge confirming continuous drop of -0.3 m/hr.",
    uncertaintyRadiusMeters: 60,
    deduplicationCount: 2,
    mergedSources: [
      "CWC Station #044 (Muvattupuzha River / Chitrapuzha Branch)",
      "Kochi Municipal Drainage Telemetry Node #12"
    ],
    trend: "decreasing",
    forecasts: {
      now: {
        horizon: 'now',
        label: 'Receding Flood Extent',
        polygon: [
          [9.948, 76.342],
          [9.958, 76.344],
          [9.960, 76.354],
          [9.950, 76.356],
          [9.944, 76.348],
        ],
        affectedAreaKm2: 2.6,
        trend: 'decreasing',
        speedKmh: 0.2,
        directionText: 'Receding into drainage channels',
        confidenceScore: 96,
        uncertaintyMarginKm: 0.05,
        modelName: 'Hydrologic Attenuation Model',
        generatedAt: '2026-10-17T01:00:00Z',
        notes: 'Water level below road crest.',
        nextLikelyAffected: 'None'
      },
      '+1h': {
        horizon: '+1h',
        label: '+1h Safe Baseline',
        polygon: [
          [9.949, 76.344],
          [9.956, 76.346],
          [9.958, 76.352],
          [9.951, 76.354],
          [9.946, 76.348],
        ],
        affectedAreaKm2: 1.8,
        trend: 'decreasing',
        confidenceScore: 94,
        uncertaintyMarginKm: 0.08,
        modelName: 'Hydrologic Model',
        generatedAt: '2026-10-17T01:00:00Z',
        notes: 'Pumps clearing retention sump.',
        nextLikelyAffected: 'None'
      },
      '+3h': {
        horizon: '+3h',
        label: '+3h Drained',
        polygon: [],
        affectedAreaKm2: 0.8,
        trend: 'decreasing',
        confidenceScore: 90,
        uncertaintyMarginKm: 0.1,
        modelName: 'Hydrologic Model',
        generatedAt: '2026-10-17T01:00:00Z',
        notes: 'Dry weather baseline restored.',
        nextLikelyAffected: 'None'
      },
      '+6h': {
        horizon: '+6h',
        label: '+6h Normal',
        polygon: [],
        affectedAreaKm2: 0,
        trend: 'decreasing',
        confidenceScore: 88,
        uncertaintyMarginKm: 0.1,
        modelName: 'Hydrologic Model',
        generatedAt: '2026-10-17T01:00:00Z',
        notes: 'Fully resolved.',
        nextLikelyAffected: 'None'
      }
    },
    observations: [
      {
        id: "OBS-KL-04",
        source: "CWC Gauge Station #044",
        sensorType: "cwc_gauge",
        timestamp: "2026-10-16T22:30:00Z",
        ingestedAt: "2026-10-16T22:42:00Z",
        confidenceScore: 96,
        rawMetricValue: "Water Stage 5.90 m (Falling at -0.15 m/hr)",
        qualityNote: "Physical acoustic probe nominal."
      }
    ],
    auditTrail: [
      {
        id: "AUD-04",
        timestamp: "2026-10-16T22:42:00Z",
        actor: "Auto Ingest",
        role: "Viewer",
        action: "Detected",
        target: "FL-2026-EK04",
        newStatus: "detected"
      },
      {
        id: "AUD-05",
        timestamp: "2026-10-17T00:10:00Z",
        actor: "Officer P. Suresh",
        role: "Incident Reviewer",
        action: "Confirmed",
        target: "FL-2026-EK04",
        previousStatus: "under_review",
        newStatus: "confirmed",
        note: "Physical pump deployment verified. Situation de-escalating."
      }
    ],
    responderNotes: [
      {
        id: "NOTE-02",
        author: "Officer P. Suresh",
        role: "Incident Reviewer",
        timestamp: "2026-10-17T00:15:00Z",
        content: "Spillway gates fully operational. Road traffic open."
      }
    ]
  }
];

export const TELEMETRY_FEEDS: TelemetryFeed[] = [
  {
    id: "FEED-S1A",
    name: "Sentinel-1 SAR (Radar Constellation)",
    source: "ESA / Copernicus",
    satelliteOrStation: "Sentinel-1A C-SAR (IW Mode)",
    lastObservationTime: "2026-10-17T01:15:00Z",
    lastIngestedTime: "2026-10-17T01:22:15Z",
    typicalRevisit: "6–12 days",
    typicalRevisitMinutes: 8640,
    nextExpected: "2026-10-23 01:15 UTC (Single pass in replay)",
    latencyMinutes: 7,
    status: "Fresh",
    operationalNotes: "Cloud-penetrating radar. All-weather flood delineation. Replay pass calibrated."
  },
  {
    id: "FEED-S2B",
    name: "Sentinel-2 MSI (High-Res Optical)",
    source: "ESA / Copernicus",
    satelliteOrStation: "Sentinel-2B MultiSpectral Instrument",
    lastObservationTime: "2026-10-03T05:20:00Z", // 14 days ago (>2x revisit of 5 days)
    lastIngestedTime: "2026-10-03T06:10:00Z",
    typicalRevisit: "5 days",
    typicalRevisitMinutes: 7200,
    nextExpected: "2026-10-18 05:20 UTC (Heavy Monsoon Clouds >85%)",
    latencyMinutes: 20160,
    status: "Stale",
    operationalNotes: "Optical feed is stale (>2x revisit). Persistent monsoon cloud deck obscures Periyar lowlands."
  },
  {
    id: "FEED-INSAT",
    name: "INSAT-3DR Rapid Scan (Geostationary)",
    source: "ISRO / MOSDAC",
    satelliteOrStation: "INSAT-3DR Imager (74°E orbital slot)",
    lastObservationTime: "2026-10-17T01:30:00Z",
    lastIngestedTime: "2026-10-17T01:34:00Z",
    typicalRevisit: "30 mins",
    typicalRevisitMinutes: 30,
    nextExpected: "2026-10-17 02:00 UTC",
    latencyMinutes: 4,
    status: "Fresh",
    operationalNotes: "Thermal infrared cloud-top temperature (-68°C convective core over Ernakulam)."
  },
  {
    id: "FEED-IMD",
    name: "IMD Rainfall Forecast & DWR Kochi",
    source: "India Meteorological Department",
    satelliteOrStation: "DWR Kochi Radar & WRF Meso Guidance",
    lastObservationTime: "2026-10-17T01:30:00Z",
    lastIngestedTime: "2026-10-17T01:32:00Z",
    typicalRevisit: "Hourly",
    typicalRevisitMinutes: 60,
    nextExpected: "2026-10-17 02:30 UTC",
    latencyMinutes: 2,
    status: "Fresh",
    operationalNotes: "Red Alert active for Ernakulam catchment. Extremely heavy rainfall (204mm/24h)."
  },
  {
    id: "FEED-CWC",
    name: "CWC River Hydrometric Gauges",
    source: "Central Water Commission (CWC)",
    satelliteOrStation: "Neeleswaram, Kalady & Ramamangalam Telemetry Stations",
    lastObservationTime: "2026-10-17T01:30:00Z",
    lastIngestedTime: "2026-10-17T01:32:00Z",
    typicalRevisit: "Hourly",
    typicalRevisitMinutes: 60,
    nextExpected: "2026-10-17 02:30 UTC",
    latencyMinutes: 2,
    status: "Fresh",
    operationalNotes: "Neeleswaram gauge at 8.42m (Danger Mark 9.0m, rising +0.22m/hr)."
  },
  {
    id: "FEED-FIRMS",
    name: "NASA FIRMS Active Fire Thermal Array",
    source: "NASA / LANCE",
    satelliteOrStation: "Suomi NPP / JPSS VIIRS & MODIS",
    lastObservationTime: "2026-10-16T18:45:00Z", // 7 hours ago (>2x revisit of 3 hours)
    lastIngestedTime: "2026-10-16T19:02:00Z",
    typicalRevisit: "~3 hours",
    typicalRevisitMinutes: 180,
    nextExpected: "2026-10-17 03:40 UTC",
    latencyMinutes: 435,
    status: "Stale",
    operationalNotes: "Hotspot feed is stale (>2x revisit cycle). Last active pass over Western Ghats was 7h ago."
  },
  {
    id: "FEED-WORLDPOP",
    name: "WorldPop Population Exposure Grid",
    source: "WorldPop / University of Southampton",
    satelliteOrStation: "High-Resolution 100m Population Density Map (Kerala)",
    lastObservationTime: "2026-01-01T00:00:00Z",
    lastIngestedTime: "2026-01-01T00:00:00Z",
    typicalRevisit: "Static Baseline",
    typicalRevisitMinutes: 525600,
    nextExpected: "Annual update",
    latencyMinutes: 0,
    status: "Fresh",
    operationalNotes: "Spatial demographic model calibrated with 2026 panchayat/ward census projection."
  }
];

export const INITIAL_FEEDS: TelemetryFeed[] = TELEMETRY_FEEDS;
