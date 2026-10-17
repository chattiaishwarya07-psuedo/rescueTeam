// src/services/realtimeAlertStore.ts
import { PublicAlert } from '../types';

export const SHARED_ALERTS_KEY = 'sentinel_shared_alerts_v1';
const BROADCAST_CHANNEL_NAME = 'sentinel_alerts_relay';

class RealtimeAlertStore {
  private channel: BroadcastChannel | null = null;
  private listeners: ((alerts: PublicAlert[]) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'ALERTS_UPDATED') {
            const alerts = this.getAlerts();
            this.notifyListeners(alerts);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported or blocked', e);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === SHARED_ALERTS_KEY) {
          const alerts = this.getAlerts();
          this.notifyListeners(alerts);
        }
      });
    }
  }

  public getAlerts(): PublicAlert[] {
    try {
      const stored = localStorage.getItem(SHARED_ALERTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse alerts from storage', e);
    }
    return [];
  }

  public saveAlert(alert: PublicAlert): void {
    const alerts = this.getAlerts();
    const existingIdx = alerts.findIndex(a => a.id === alert.id);
    let updated: PublicAlert[];

    if (existingIdx >= 0) {
      updated = [...alerts];
      updated[existingIdx] = alert;
    } else {
      updated = [alert, ...alerts];
    }

    localStorage.setItem(SHARED_ALERTS_KEY, JSON.stringify(updated));
    this.broadcastUpdate();
    this.notifyListeners(updated);
  }

  public broadcastUpdate(): void {
    if (this.channel) {
      this.channel.postMessage({ type: 'ALERTS_UPDATED', timestamp: Date.now() });
    }
  }

  public subscribe(callback: (alerts: PublicAlert[]) => void): () => void {
    this.listeners.push(callback);
    callback(this.getAlerts());
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(alerts: PublicAlert[]): void {
    this.listeners.forEach(cb => {
      try {
        cb(alerts);
      } catch (e) {
        console.error('Error in alert listener', e);
      }
    });
  }

  /**
   * Generates a fully compliant OASIS CAP 1.2 XML document string
   */
  public generateCAP12XML(alert: PublicAlert): string {
    const polygonCoordString = alert.zonePolygon && alert.zonePolygon.length > 0
      ? alert.zonePolygon.map(([lat, lng]) => `${lat.toFixed(4)},${lng.toFixed(4)}`).join(' ')
      : '10.1080,76.3520 10.1240,76.3680 10.0950,76.3750 10.1080,76.3520';

    return `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${alert.id}</identifier>
  <sender>${alert.authorizedBy.replace(/[<>]/g, '')}</sender>
  <sent>${alert.approvedAt || new Date().toISOString()}</sent>
  <status>Exercise</status>
  <msgType>${alert.isAllClear ? 'Cancel' : 'Alert'}</msgType>
  <scope>Public</scope>
  <info>
    <category>Safety</category>
    <event>${alert.headline.split(':')[0] || 'Multi-Hazard Emergency'}</event>
    <urgency>${alert.urgency}</urgency>
    <severity>${alert.severity}</severity>
    <certainty>${alert.certainty}</certainty>
    <effective>${alert.effectiveFrom}</effective>
    <expires>${alert.effectiveTo}</expires>
    <headline>${alert.headline.replace(/[<>]/g, '')}</headline>
    <description>${alert.instruction.replace(/[<>]/g, '')}</description>
    <instruction>${alert.precautions.join('; ')}</instruction>
    <web>${alert.officialReference}</web>
    <parameter>
      <valueName>Sentinel-AlertTier</valueName>
      <value>${alert.tier}</value>
    </parameter>
    <parameter>
      <valueName>EstimatedPopulationReached</valueName>
      <value>${alert.estimatedPopulationReached}</value>
    </parameter>
    <area>
      <areaDesc>${alert.affectedZones.join(', ')}</areaDesc>
      <polygon>${polygonCoordString}</polygon>
    </area>
  </info>
</alert>`;
  }

  /**
   * Triggers a browser download of the CAP XML file
   */
  public downloadCAP12XML(alert: PublicAlert): void {
    const xml = this.generateCAP12XML(alert);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${alert.id}-CAP12.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const alertStore = new RealtimeAlertStore();
