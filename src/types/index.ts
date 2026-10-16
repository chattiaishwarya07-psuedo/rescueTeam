// src/types/index.ts

export type HazardType = 'flood' | 'wildfire' | 'severe_weather' | 'landslide';

export type SeverityLevel = 'critical' | 'high' | 'moderate' | 'minor';

export type IncidentStatus =
  | 'detected'
  | 'under_review'
  | 'confirmed'
  | 'rejected'
  | 'alert_approved';

export type TrendDirection = 'increasing' | 'stable' | 'decreasing' | 'unknown';

export type FreshnessStatus = 'Current' | 'Delayed' | 'Stale' | 'Unavailable';

export type ResponderRole =
  | 'Viewer'
  | 'Analyst'
  | 'Incident Reviewer'
  | 'Authorized Approver'
  | 'Administrator';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: [number, number][]; // [lat, lng] array
}

export interface ForecastStep {
  horizon: 'now' | '+1h' | '+3h' | '+6h';
  label: string;
  polygon: [number, number][]; // coordinates for predicted spread boundary
  uncertaintyPolygon?: [number, number][]; // coordinates for uncertainty envelope
  affectedAreaKm2: number;
  trend: TrendDirection;
  projectedPeakTime?: string;
  speedKmh?: number;
  directionDeg?: number;
  directionText?: string;
  confidenceScore: number; // 0-100%
  uncertaintyMarginKm: number;
  modelName: string;
  generatedAt: string;
  notes: string;
}

export interface ObservationRecord {
  id: string;
  source: string; // e.g., 'Copernicus Sentinel-1 SAR', 'NOAA GOES-18 ABI'
  sensorType: 'satellite_radar' | 'satellite_optical' | 'weather_radar' | 'river_gauge' | 'thermal_infrared';
  timestamp: string; // ISO string
  ingestedAt: string; // ISO string
  groundResolutionMeters?: number;
  cloudCoverPercent?: number;
  confidenceScore: number; // 0-100%
  rawMetricValue?: string; // e.g. "Water gauge: +3.8m above flood stage"
  qualityNote: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: ResponderRole;
  action: 'Detected' | 'Review Started' | 'Confirmed' | 'Rejected' | 'Annotated' | 'Unit Assigned' | 'Alert Approved' | 'Alert Dispatched' | 'Status Change';
  previousStatus?: IncidentStatus;
  newStatus?: IncidentStatus;
  reason?: string;
  notes?: string;
  details?: Record<string, any>;
}

export interface PublicAlert {
  id: string;
  incidentId: string;
  headline: string;
  instruction: string;
  urgency: 'Immediate' | 'Expected' | 'Future';
  severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor';
  certainty: 'Observed' | 'Likely' | 'Possible';
  affectedZoneName: string;
  targetJurisdiction: string;
  zonePolygon?: [number, number][];
  estimatedPopulationExposed?: number;
  expectedImpactWindow: string;
  practicalPrecautions: string[];
  evidenceSource: string;
  observationTime: string;
  forecastUncertaintyRef: string;
  officialReference: string;
  authorizedBy: string;
  authorizedRole: ResponderRole;
  approvedAt: string;
  deliveryStatus: 'Drafted' | 'Queued' | 'Transmitting' | 'Delivered' | 'Simulated Broadcast';
  channels: ('Cell Broadcast' | 'EAS' | 'Resident Relay' | 'Siren Array')[];
  deliveryMetrics?: {
    towersTriggered: number;
    receiptAcks: number;
  };
}

export interface Incident {
  id: string; // e.g., 'INC-2026-FL04'
  title: string;
  hazardType: HazardType;
  severity: SeverityLevel;
  status: IncidentStatus;
  locationName: string;
  jurisdiction: string;
  center: LatLng;
  observedExtentPolygon: [number, number][];
  estimatedAffectedAreaKm2: number;
  populationExposedEstimate?: number;

  // Timestamps
  observationTime: string;
  ingestionTime: string;
  lastUpdatedTime: string;

  // Source telemetry
  primarySource: string;
  confidenceScore: number; // e.g. 91%
  uncertaintyRadiusMeters: number;
  deduplicationCount: number; // number of underlying detections merged
  deduplicationNotes: string;

  // Forecast & Trend
  trend: TrendDirection;
  forecasts: {
    now: ForecastStep;
    '+1h': ForecastStep;
    '+3h': ForecastStep;
    '+6h': ForecastStep;
  };

  // Observations chain
  observations: ObservationRecord[];

  // Operations & Workflow
  assignedTeam?: string;
  auditTrail: AuditLogEntry[];
  publicAlert?: PublicAlert;
  responderNotes: {
    author: string;
    role: string;
    timestamp: string;
    content: string;
  }[];
}

export interface TelemetryFeed {
  id: string;
  name: string;
  sourceType: 'Satellite SAR' | 'Satellite Optical' | 'Geostationary' | 'Doppler Radar' | 'Hydrometric Gauge' | 'Thermal Array';
  satelliteOrStation: string;
  jurisdiction: string;
  lastObservationTime: string;
  lastSuccessfulUpdate: string;
  expectedIntervalMinutes: number;
  latencyMinutes: number;
  status: FreshnessStatus;
  resolutionOrSensors: string;
  operationalNotes: string;
}

export interface RescueUnit {
  id: string;
  callsign: string;
  unitType: 'Swiftwater Rescue' | 'Wildland Firefighting' | 'Helitack Search & Rescue' | 'Medical Evac' | 'Structural Assessment';
  personnelCount: number;
  status: 'Available' | 'Dispatched' | 'On Scene' | 'Standby' | 'Restricted';
  currentLocation: LatLng;
  locationName: string;
  assignedIncidentId?: string;
  equipmentSummary: string;
  radioFrequency: string;
  etaMinutes?: number;
}
