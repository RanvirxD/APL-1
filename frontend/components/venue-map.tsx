'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin } from 'lucide-react';

const LeafletMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-muted">
      <div className="text-muted-foreground">Loading map...</div>
    </div>
  ),
});

// Jawaharlal Nehru Stadium, New Delhi
const STADIUM_LAT = 28.5665;
const STADIUM_LNG = 77.2431;

export function VenueMap() {
  const [selectedFloor, setSelectedFloor] = useState<'level1' | 'level2' | 'level3'>('level1');
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    gates: true,
    washrooms: true,
    medical: true,
    food: true,
    charging: true,
    water: true,
    parking: true,
    transport: true,
    friends: true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleLayerToggle = (layer: string) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      });
    }
  };

  const layers = [
    { id: 'gates', label: 'Gates', color: '#0F172A' },
    { id: 'washrooms', label: 'Washrooms', color: '#2563EB' },
    { id: 'medical', label: 'Medical', color: '#DC2626' },
    { id: 'food', label: 'Food', color: '#D97706' },
    { id: 'charging', label: 'Charging', color: '#16A34A' },
    { id: 'water', label: 'Water', color: '#0891B2' },
    { id: 'parking', label: 'Parking', color: '#475569' },
    { id: 'transport', label: 'Transport', color: '#EA580C' },
    { id: 'friends', label: 'Friends', color: '#7C3AED' },
  ];

  const statistics = [
    { icon: 'W', label: 'Washrooms', count: 6, color: '#2563EB', layer: 'washrooms' },
    { icon: 'M', label: 'Medical', count: 2, color: '#DC2626', layer: 'medical' },
    { icon: 'F', label: 'Food Courts', count: 4, color: '#D97706', layer: 'food' },
    { icon: 'C', label: 'Charging', count: 3, color: '#16A34A', layer: 'charging' },
    { icon: 'F', label: 'Friends nearby', count: 2, color: '#0F172A', layer: 'friends' },
    { icon: 'G', label: 'Gates', count: 4, color: '#0F172A', layer: 'gates' },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Search Bar */}
      <div className="p-4 border-b border-border bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search venue locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Layer Toggle Bar */}
      <div className="overflow-x-auto border-b border-border bg-card">
        <div className="flex gap-2 p-3 min-w-max">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => handleLayerToggle(layer.id)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                activeLayers[layer.id as keyof typeof activeLayers]
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-border text-muted-foreground border border-border'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: layer.color }}
              />
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floor Selector */}
      <div className="flex gap-2 p-3 border-b border-border bg-card">
        {['level1', 'level2', 'level3'].map((level, idx) => (
          <button
            key={level}
            onClick={() => setSelectedFloor(level as any)}
            className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              selectedFloor === level
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground border border-border'
            }`}
          >
            Level {idx + 1}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <LeafletMap
          activeLayers={activeLayers}
          selectedFloor={selectedFloor}
          searchQuery={searchQuery}
          userLocation={userLocation}
        />
        
        {/* My Location Button */}
        <button
          onClick={handleMyLocation}
          className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow z-40"
        >
          <MapPin className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Bottom Summary Card */}
      <div className="bg-card border-t border-border p-4">
        <div className="grid grid-cols-3 gap-3">
          {statistics.slice(0, 3).map((stat, idx) => (
            <button
              key={idx}
              onClick={() => handleLayerToggle(stat.layer)}
              className="flex flex-col items-center p-3 bg-background rounded-lg border border-border hover:border-primary transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full mb-2"
                style={{ backgroundColor: stat.color }}
              />
              <div className="text-sm font-bold text-foreground">{stat.count}</div>
              <div className="text-xs text-muted-foreground text-center">{stat.label}</div>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          {statistics.slice(3).map((stat, idx) => (
            <button
              key={idx + 3}
              onClick={() => handleLayerToggle(stat.layer)}
              className="flex flex-col items-center p-3 bg-background rounded-lg border border-border hover:border-primary transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full mb-2"
                style={{ backgroundColor: stat.color }}
              />
              <div className="text-sm font-bold text-foreground">{stat.count}</div>
              <div className="text-xs text-muted-foreground text-center">{stat.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
