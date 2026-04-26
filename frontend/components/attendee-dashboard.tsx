'use client';

import { useEffect, useState } from 'react';
import { StadiumMap } from './stadium-map';
import { VenueMap } from './venue-map';
import { AttendeeTab } from './tab-navigation';
import {
  getGeminiNudge,
  getMessages,
  getZones,
  postMessage,
  postReport,
  type Message as ChatMessage,
} from '@/lib/api';

interface AttendeeTabProps {
  activeTab: AttendeeTab;
}

function formatMessageTime(createdAt: string) {
  return new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function AttendeeDashboard({ activeTab }: AttendeeTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);
  const [sosSuccess, setSosSuccess] = useState('');

  useEffect(() => {
    void loadMessages();
    const interval = setInterval(() => {
      void loadMessages();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      await postMessage({ senderName: 'Guest', senderRole: 'user', text });
      setChatText('');
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAiSubmit = async () => {
    if (!aiPrompt.trim() || aiLoading) return;
    try {
      setAiLoading(true);
      const zones = await getZones();
      const result = await getGeminiNudge(zones);
      setAiResponse(result.nudge);
    } catch (error) {
      console.error('Failed to fetch AI nudge:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSos = async () => {
    try {
      setSosLoading(true);
      await postReport({
        type: 'emergency',
        severity: 'HIGH',
        location: 'Unknown',
        description: 'SOS triggered',
      });
      setSosSuccess('Emergency report submitted. Security team has been notified.');
    } catch (error) {
      console.error('Failed to send SOS:', error);
      setSosSuccess('');
    } finally {
      setSosLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {activeTab === 'home' && (
        <div className="space-y-6 pt-6">
          <div className="px-4">
            <h1 className="text-3xl font-bold text-foreground mb-1">Live Crowd Map</h1>
            <p className="text-muted-foreground text-sm">Real-time density monitoring</p>
          </div>
          <StadiumMap />
        </div>
      )}

      {activeTab === 'venue' && (
        <div className="space-y-4 pt-6 pb-6">
          <div className="px-4">
            <h1 className="text-2xl font-bold">Venue Information</h1>
          </div>
          <VenueMap />
          <div className="px-4">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Gates</p>
                <p className="text-lg font-semibold">Gates A-H Open</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Facilities</p>
                <p className="text-lg font-semibold">Restrooms • Food • Shops</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parking</p>
                <p className="text-lg font-semibold">Lots A-F Available</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="space-y-4 pt-6 px-4 pb-6">
          <h1 className="text-2xl font-bold">Chat Support</h1>
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

      {activeTab === 'ai' && (
        <div className="space-y-4 pt-6 px-4 pb-6">
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg mx-auto flex items-center justify-center mb-3">
                <div className="text-2xl">🤖</div>
              </div>
              <p className="text-sm text-muted-foreground">Ask me anything about the event</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => void handleAiSubmit()}
                disabled={aiLoading}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-70"
              >
                {aiLoading ? 'Thinking...' : 'Ask'}
              </button>
            </div>
            {aiResponse && (
              <div className="mt-4 border border-border rounded-lg p-3 bg-background">
                <p className="text-xs text-muted-foreground mb-1">AI response</p>
                <p className="text-sm text-foreground">{aiResponse}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'sos' && (
        <div className="space-y-4 pt-6 px-4 pb-6">
          <h1 className="text-2xl font-bold text-accent">Emergency SOS</h1>
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center space-y-4">
            <p className="text-sm text-destructive">Need immediate assistance?</p>
            <button
              onClick={() => void handleSos()}
              disabled={sosLoading}
              className="w-full bg-destructive text-destructive-foreground px-4 py-3 rounded-lg font-bold text-lg hover:bg-destructive/90 transition-all disabled:opacity-70"
            >
              {sosLoading ? 'SENDING...' : 'CALL FOR HELP'}
            </button>
            <p className="text-xs text-muted-foreground">Security will be notified instantly</p>
            {sosSuccess && <p className="text-sm text-foreground font-medium">{sosSuccess}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
