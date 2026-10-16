// src/services/incidentService.ts
import { Incident, IncidentStatus, AuditLogEntry, PublicAlert, ResponderRole } from '../types';
import { INITIAL_INCIDENTS } from './mockData';

const STORAGE_KEY = 'sentinel_rescue_incidents_v1';

export class IncidentService {
  private static loadFromStorage(): Incident[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read local storage, using initial seed data", e);
    }
    return INITIAL_INCIDENTS;
  }

  private static saveToStorage(incidents: Incident[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    } catch (e) {
      console.warn("Failed to persist incident changes", e);
    }
  }

  public static getIncidents(): Incident[] {
    return this.loadFromStorage();
  }

  public static resetToHistoricalSimulation(): Incident[] {
    localStorage.removeItem(STORAGE_KEY);
    return INITIAL_INCIDENTS;
  }

  public static updateIncidentStatus(
    incidentId: string,
    newStatus: IncidentStatus,
    actor: string,
    role: ResponderRole,
    reason?: string
  ): Incident[] {
    const incidents = this.loadFromStorage();
    const updated = incidents.map(inc => {
      if (inc.id !== incidentId) return inc;

      const previousStatus = inc.status;
      const now = new Date().toISOString();

      const auditEntry: AuditLogEntry = {
        id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: now,
        actor,
        role,
        action: newStatus === 'confirmed' ? 'Confirmed' :
                newStatus === 'rejected' ? 'Rejected' :
                newStatus === 'under_review' ? 'Review Started' : 'Status Change',
        previousStatus,
        newStatus,
        reason: reason || undefined,
        notes: `Status transitioned from ${previousStatus} to ${newStatus}.`
      };

      return {
        ...inc,
        status: newStatus,
        lastUpdatedTime: now,
        auditTrail: [auditEntry, ...inc.auditTrail]
      };
    });

    this.saveToStorage(updated);
    return updated;
  }

  public static addAnnotation(
    incidentId: string,
    author: string,
    role: string,
    content: string
  ): Incident[] {
    const incidents = this.loadFromStorage();
    const now = new Date().toISOString();

    const updated = incidents.map(inc => {
      if (inc.id !== incidentId) return inc;

      const auditEntry: AuditLogEntry = {
        id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: now,
        actor: author,
        role: role as ResponderRole,
        action: 'Annotated',
        notes: content
      };

      return {
        ...inc,
        lastUpdatedTime: now,
        responderNotes: [
          {
            author,
            role,
            timestamp: now,
            content
          },
          ...inc.responderNotes
        ],
        auditTrail: [auditEntry, ...inc.auditTrail]
      };
    });

    this.saveToStorage(updated);
    return updated;
  }

  public static assignUnit(
    incidentId: string,
    unitCallsign: string,
    actor: string,
    role: ResponderRole
  ): Incident[] {
    const incidents = this.loadFromStorage();
    const now = new Date().toISOString();

    const updated = incidents.map(inc => {
      if (inc.id !== incidentId) return inc;

      const auditEntry: AuditLogEntry = {
        id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: now,
        actor,
        role,
        action: 'Unit Assigned',
        notes: `Assigned unit ${unitCallsign} to incident ${inc.id}.`
      };

      return {
        ...inc,
        assignedTeam: unitCallsign,
        lastUpdatedTime: now,
        auditTrail: [auditEntry, ...inc.auditTrail]
      };
    });

    this.saveToStorage(updated);
    return updated;
  }

  public static approvePublicAlert(
    incidentId: string,
    alertPayload: Omit<PublicAlert, 'id' | 'incidentId' | 'approvedAt' | 'deliveryStatus'>,
    author: string,
    role: ResponderRole
  ): Incident[] {
    const incidents = this.loadFromStorage();
    const now = new Date().toISOString();
    const alertId = `CAP-ALERT-${Date.now()}`;

    const updated = incidents.map(inc => {
      if (inc.id !== incidentId) return inc;

      const fullAlert: PublicAlert = {
        ...alertPayload,
        id: alertId,
        incidentId,
        approvedAt: now,
        deliveryStatus: 'Simulated Broadcast',
        deliveryMetrics: {
          towersTriggered: 18,
          receiptAcks: 3840
        }
      };

      const auditEntry: AuditLogEntry = {
        id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: now,
        actor: author,
        role,
        action: 'Alert Approved',
        previousStatus: inc.status,
        newStatus: 'alert_approved',
        reason: `Authorized public warning approved under jurisdiction: ${alertPayload.targetJurisdiction}. Urgency: ${alertPayload.urgency}, Severity: ${alertPayload.severity}. Broadcast via: ${alertPayload.channels.join(', ')}`,
        details: {
          alertId,
          headline: alertPayload.headline,
          channels: alertPayload.channels,
          zone: alertPayload.affectedZoneName
        }
      };

      return {
        ...inc,
        status: 'alert_approved' as IncidentStatus,
        lastUpdatedTime: now,
        publicAlert: fullAlert,
        auditTrail: [auditEntry, ...inc.auditTrail]
      };
    });

    this.saveToStorage(updated);
    return updated;
  }
}
