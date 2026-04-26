'use client';

import { useEffect, useMemo, useState } from 'react';
import { StadiumMap } from './stadium-map';
import { AdminTab } from './tab-navigation';
import { AlertTriangle, TrendingUp, Users, Zap } from 'lucide-react';
import {
  getGeminiOpsAlert,
  getMessages,
  getReports,
  getZones,
  postMessage,
  type Message as ChatMessage,
  type Report,
} from '@/lib/api';

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

function formatMessageTime(createdAt: string) {
  return new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatReportDate(createdAt: string) {
  return new Date(createdAt).toLocaleString();
}

export function AdminDashboard({ activeTab }: AdminDashboardProps) {
  const [densities, setDensities] = useState<ZoneDensity[]>([]);
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [aiAlertText, setAiAlertText] = useState('Sections B and F approaching capacity thresholds. Consider flow adjustments.');
  const [aiAlertLoading, setAiAlertLoading] = useState(false);

  const hasHighRiskAlert = useMemo(
    () => alerts.some((a) => a.status === 'active' && (a.zone === 'B' || a.zone === 'F')),
    [alerts],
  );

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    void loadReports();
  }, []);

  useEffect(() => {
    void loadMessages();
    const interval = setInterval(() => {
      void loadMessages();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [densitiesRes, alertsRes] = await Promise.all([
        fetch('/api/densities', { cache: 'no-store' }),
        fetch('/api/alerts', { cache: 'no-store' }),
      ]);

      if (densitiesRes.ok) {
        const data = (await densitiesRes.json()) as ZoneDensity[];
        setDensities(data);
      }

      if (alertsRes.ok) {
        const data = (await alertsRes.json()) as AlertEvent[];
        setAlerts(data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReports = async () => {
    try {
      setReportsLoading(true);
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setReportsLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    const text = chatText.trim();
    if (!text || sendingMessage) return;

    try {
      setSendingMessage(true);
      await postMessage({ senderName: 'Admin', senderRole: 'admin', text });
      setChatText('');
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleGetAiAlert = async () => {
    try {
      setAiAlertLoading(true);
      const zones = await getZones();
      const result = await getGeminiOpsAlert(zones);
      setAiAlertText(result.alert);
    } catch (error) {
      console.error('Failed to get AI alert:', error);
    } finally {
      setAiAlertLoading(false);
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
                      densities.reduce((sum, d) => sum + d.percentage, 0) / densities.length,
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

          <div className="px-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Real-Time Stadium View</h2>
            <StadiumMap />
          </div>

          {(hasHighRiskAlert || aiAlertText) && (
            <div className="mx-4 bg-accent/10 border border-accent/50 rounded-lg p-4 animate-slide-up">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5 animate-pulse" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-accent">AI Alert: High Density Warning</p>
                    <button
                      onClick={handleGetAiAlert}
                      disabled={aiAlertLoading}
                      className="bg-accent text-accent-foreground text-xs px-3 py-1.5 rounded-md disabled:opacity-70"
                    >
                      {aiAlertLoading ? 'Loading...' : 'Get AI Alert'}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">{aiAlertText}</p>
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
          {reportsLoading ? (
            <div className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground">
              Loading reports...
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground">
              No reports yet
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report._id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      {report.type.toUpperCase()} - {report.severity}
                    </p>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mt-2">{report.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {report.location} - {formatReportDate(report.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="space-y-4 pt-6 px-4 pb-6">
          <h1 className="text-2xl font-bold">Staff Communication</h1>
          <div className="bg-card border border-border rounded-lg p-4 h-[60vh] flex flex-col">
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No messages yet
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message._id} className="border border-border rounded-lg p-3 bg-background">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{message.senderName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary/15 text-primary uppercase">
                        {message.senderRole}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatMessageTime(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{message.text}</p>
                    {message.filtered && (
                      <p className="text-xs text-muted-foreground mt-1">(filtered)</p>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="pt-3 mt-3 border-t border-border flex gap-2">
              <input
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    void handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => void handleSendMessage()}
                disabled={sendingMessage}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-70"
              >
                {sendingMessage ? 'Sending...' : 'Send'}
              </button>
            </div>
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
