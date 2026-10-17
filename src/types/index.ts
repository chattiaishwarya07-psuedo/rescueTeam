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

export type FreshnessStatus = 'Fresh' | 'Delayed' | 'Stale' | 'Unavailable';

export type ResponderRole = 
  | 'Viewer' 
  | 'Incident Reviewer' 
  | 'District Emergency Operations Officer';

export type AlertTier = 'Official Warning' | 'Model Estimate' | 'Unverified Advisory';

export interface CWCGauge {
  id: string;
  stationName: string;
  riverName: string;
  currentLevelMeters: number;
  warningLevelMeters: number;
  dangerLevelMeters: number;
  trend: 'rising' | 'falling' | 'steady';
  sparkline: number[];
  lat: number;
  lng: number;
  lastUpdated: string;
}

export interface FIRMSRecord {
  id: string;
  lat: number;
  lng: number;
  frpMW: number; // Fire Radiative Power (MW)
  confidence: number;
  satellite: 'Aqua' | 'Terra' | 'SNPP';
  acquisitionTime: string;
}

export interface ForecastStep {
  horizon: 'now' | '+1h' | '+3h' | '+6h';
  label: string;
  polygon: [number, number][]; // coordinates for predicted spread boundary
  uncertaintyPolygon?: [number, number][]; // coordinates for uncertainty envelope
  affectedAreaKm2: number;
  trend: TrendDirection;
  speedKmh?: number;
  directionText?: string;
  confidenceScore: number; // 0-100%
  uncertaintyMarginKm: number;
  modelName: string;
  generatedAt: string;
  notes: string;
  nextLikelyAffected?: string;
}

export interface ObservationRecord {
  id: string;
  source: string;
  sensorType: 'satellite_sar' | 'satellite_optical' | 'geostationary_ir' | 'cwc_gauge' | 'firms_thermal' | 'imd_doppler';
  timestamp: string;
  ingestedAt: string;
  confidenceScore: number;
  rawMetricValue?: string;
  qualityNote: string;
  rawPayload?: Record<string, any>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: ResponderRole;
  action: 'Detected' | 'Review Started' | 'Confirmed' | 'Rejected' | 'Annotated' | 'Alert Drafted' | 'Alert Approved' | 'Alert Sent' | 'All-Clear Sent' | 'Status Change';
  target: string;
  previousStatus?: IncidentStatus;
  newStatus?: IncidentStatus;
  reason?: string;
  note?: string;
  details?: Record<string, any>;
}

export interface PrecautionItem {
  id: string;
  icon: string;
  label: string;
  code: string;
}

export interface PublicAlert {
  id: string;
  incidentId: string;
  tier: AlertTier;
  headline: string;
  instruction: string;
  translations: {
    en: { headline: string; instruction: string };
    hi: { headline: string; instruction: string };
    te: { headline: string; instruction: string };
    ml: { headline: string; instruction: string };
  };
  humanTranslationChecked: boolean;
  precautions: string[];
  urgency: 'Immediate' | 'Expected' | 'Future';
  severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor';
  certainty: 'Observed' | 'Likely' | 'Possible';
  affectedZones: string[];
  targetJurisdiction: string;
  zonePolygon?: [number, number][];
  estimatedPopulationReached: number;
  effectiveFrom: string;
  effectiveTo: string;
  evidenceSource: string;
  observationTime: string;
  forecastUncertaintyRef: string;
  officialReference: string;
  authorizedBy: string;
  authorizedRole: ResponderRole;
  approvedAt: string;
  deliveryStatus: 'Queued' | 'Sent' | 'Delivered' | 'Failed';
  channels: ('App Notification' | 'SMS' | 'Voice Script' | 'CAP XML')[];
  retryCount?: number;
  isAllClear?: boolean;
}

export interface Incident {
  id: string;
  title: string;
  hazardType: HazardType;
  severity: SeverityLevel;
  status: IncidentStatus;
  sector: string;
  locationName: string;
  jurisdiction: string;
  center: { lat: number; lng: number };
  
  // Polygons & Geometry
  observedExtentPolygon: [number, number][];
  referenceExtentPolygon?: [number, number][]; // Ground truth comparison for metrics
  estimatedAffectedAreaKm2: number;
  uncertaintyAreaKm2: number;
  populationExposedEstimate: number;
  
  // Method statement
  methodSentence: string;
  
  // Timestamps
  observationTime: string;
  ingestionTime: string;
  lastUpdatedTime: string;
  
  // Feeds & Confidence
  primarySource: string;
  confidenceScore: number;
  confidenceExplanation: string;
  uncertaintyRadiusMeters: number;
  deduplicationCount: number;
  mergedSources: string[];
  isFeedStale?: boolean;
  staleFeedName?: string;
  staleFeedDuration?: string;
  
  // Replay timeline
  timelineSteps?: {
    t0: [number, number][];
    t6h: [number, number][];
    t12h: [number, number][];
    t24h: [number, number][];
  };
  
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
  auditTrail: AuditLogEntry[];
  publicAlert?: PublicAlert;
  responderNotes: {
    id: string;
    author: string;
    role: string;
    timestamp: string;
    content: string;
  }[];
}

export interface TelemetryFeed {
  id: string;
  name: string;
  source: string;
  satelliteOrStation: string;
  lastObservationTime: string;
  lastIngestedTime: string;
  typicalRevisit: string;
  typicalRevisitMinutes: number;
  nextExpected: string;
  latencyMinutes: number;
  status: FreshnessStatus;
  operationalNotes: string;
}
