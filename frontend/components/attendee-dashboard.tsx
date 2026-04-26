'use client';

import { StadiumMap } from './stadium-map';
import { AttendeeTab } from './tab-navigation';

interface AttendeeTabProps {
  activeTab: AttendeeTab;
}

export function AttendeeDashboard({ activeTab }: AttendeeTabProps) {


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
        <div className="space-y-4 pt-6 px-4">
          <h1 className="text-2xl font-bold">Venue Information</h1>
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
      )}

      {activeTab === 'chat' && (
        <div className="space-y-4 pt-6 px-4 pb-6">
          <h1 className="text-2xl font-bold">Chat Support</h1>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-muted-foreground mb-4">No messages yet</p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
              Start Chat
            </button>
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
            <input
              type="text"
              placeholder="Ask a question..."
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {activeTab === 'sos' && (
        <div className="space-y-4 pt-6 px-4 pb-6">
          <h1 className="text-2xl font-bold text-accent">Emergency SOS</h1>
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center space-y-4">
            <p className="text-sm text-destructive">Need immediate assistance?</p>
            <button className="w-full bg-destructive text-destructive-foreground px-4 py-3 rounded-lg font-bold text-lg hover:bg-destructive/90 transition-all">
              CALL FOR HELP
            </button>
            <p className="text-xs text-muted-foreground">Security will be notified instantly</p>
          </div>
        </div>
      )}
    </div>
  );
}
