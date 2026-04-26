'use client';

import { useState, useEffect } from 'react';
import { StadiumMap } from './stadium-map';
import { AdminTab } from './tab-navigation';
import { AlertTriangle, TrendingUp, Users, Zap } from 'lucide-react';

interface ZoneDensity {
  zone: string;
  percentage: number;
  count: number;
}

interface AlertEvent {
  id: string;
  zone: string;
  type: 'overcrowd' | 'incident' | 'structural';
  timestamp: string;
  status: 'active' | 'resolved';
}

interface AdminDashboardProps {
  activeTab: AdminTab;
}

export function AdminDashboard({ activeTab }: AdminDashboardProps) {
  const [densities, setDensities] = useState<ZoneDensity[]>([]);
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [densitiesRes, alertsRes] = await Promise.all([
        fetch('/api/densities'),
        fetch('/api/alerts'),
      ]);

      if (densitiesRes.ok) {
        const data = await densitiesRes.json();
        setDensities(data);
      }

      if (alertsRes.ok) {
        const data = await alertsRes.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {activeTab === 'dashboard' && (
        <div className="space-y-6 pt-6">
          <div className="px-4">
            <h1 className="text-3xl font-bold text-foreground mb-1">Operations Dashboard</h1>
            <p className="text-muted-foreground text-sm">Real-time stadium operations control</p>
          </div>

          {/* KPI Cards */}
          <div className="px-4 grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary animate-pulse">LIVE</span>
              </div>
              <div className="text-sm text-muted-foreground mb-1">Total Capacity</div>
              <div className="text-2xl font-bold text-primary">
                {densities.reduce((sum, d) => sum + d.count, 0).toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium text-accent">
                  {alerts.filter((a) => a.status === 'active').length}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mb-1">Active Alerts</div>
              <div className="text-2xl font-bold text-accent">
                {alerts.filter((a) => a.status === 'active').length}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-sm text-muted-foreground mb-1">Avg Density</div>
              <div className="text-2xl font-bold text-green-500">
                {densities.length > 0
                  ? Math.round(
                      densities.reduce((sum, d) => sum + d.percentage, 0) / densities.length
                    )
                  : 0}
                %
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-sm text-muted-foreground mb-1">Peak Zone</div>
              <div className="text-2xl font-bold text-blue-500">
                {densities.length > 0
                  ? densities.reduce((max, d) => (d.percentage > max.percentage ? d : max)).zone
                  : 'N/A'}
              </div>
            </div>
          </div>

          {/* Stadium Visualization */}
          <div className="px-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Real-Time Stadium View</h2>
            <StadiumMap />
          </div>

          {/* AI Alert */}
          {alerts.some((a) => a.status === 'active' && a.zone === 'B' || a.zone === 'F') && (
            <div className="mx-4 bg-accent/10 border border-accent/50 rounded-lg p-4 animate-slide-up">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5 animate-pulse" />
                <div>
                  <p className="text-sm font-semibold text-accent mb-1">AI Alert: High Density Warning</p>
                  <p className="text-xs text-muted-foreground">
                    Sections B and F approaching capacity thresholds. Consider flow adjustments.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4 pt-6 px-4 pb-6">
          <h1 className="text-2xl font-bold">Active Alerts</h1>
          {alerts.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">No active alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-4 ${
                    alert.status === 'active'
                      ? 'bg-accent/10 border-accent/50'
                      : 'bg-card border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {alert.type.replace(/([A-Z])/g, ' $1').toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Section {alert.zone}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        alert.status === 'active'
                          ? 'bg-accent/20 text-accent'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {alert.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-4 pt-6 px-4 pb-6">
          <h1 className="text-2xl font-bold">Reports</h1>
          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <div className="pb-3 border-b border-border">
              <p className="text-sm text-muted-foreground mb-1">Crowd Flow Analysis</p>
              <p className="font-semibold text-foreground">Generated Today</p>
            </div>
            <div className="pb-3 border-b border-border">
              <p className="text-sm text-muted-foreground mb-1">Incident Report</p>
              <p className="font-semibold text-foreground">0 Major Incidents</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Peak Occupancy</p>
              <p className="font-semibold text-foreground">68% (2.5 hours ago)</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="space-y-4 pt-6 px-4 pb-6">
          <h1 className="text-2xl font-bold">Staff Communication</h1>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-muted-foreground mb-4">No messages</p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
              Start Broadcast
            </button>
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="space-y-4 pt-6 px-4 pb-6">
          <h1 className="text-2xl font-bold">Staff Map</h1>
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground mb-4">Staff GPS tracking enabled</p>
            <p className="text-sm text-muted-foreground">8 Staff members on duty</p>
          </div>
        </div>
      )}
    </div>
  );
}
