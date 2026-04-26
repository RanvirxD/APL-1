'use client';

import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface GateInfo {
  id: string;
  letter: string;
  density: number;
  waitTime: number;
  lat: number;
  lng: number;
}

const GATES: GateInfo[] = [
  { id: 'gate-a', letter: 'A', density: 45, waitTime: 8, lat: 28.5680, lng: 77.2415 },
  { id: 'gate-b', letter: 'B', density: 78, waitTime: 15, lat: 28.5660, lng: 77.2450 },
  { id: 'gate-c', letter: 'C', density: 34, waitTime: 2, lat: 28.5650, lng: 77.2410 },
  { id: 'gate-d', letter: 'D', density: 62, waitTime: 6, lat: 28.5670, lng: 77.2380 },
  { id: 'gate-e', letter: 'E', density: 28, waitTime: 3, lat: 28.5655, lng: 77.2425 },
];

const getGateColor = (density: number) => {
  if (density > 70) return '#EF4444';
  if (density > 50) return '#FCD34D';
  return '#4ADE80';
};

const getDensityLabel = (density: number) => {
  if (density > 70) return 'High';
  if (density > 50) return 'Moderate';
  return 'Low';
};

export default function EntryMapPreview() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const [selectedGate, setSelectedGate] = useState<string>('gate-c');

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([28.5665, 77.2431], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);

      // Add gate markers
      GATES.forEach((gate) => {
        const color = getGateColor(gate.density);
        const html = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: ${color};
            color: white;
            font-weight: bold;
            font-size: 14px;
            border: 2px solid white;
            cursor: pointer;
          ">
            ${gate.letter}
          </div>
        `;

        const marker = L.marker([gate.lat, gate.lng], {
          icon: L.divIcon({
            html,
            iconSize: [28, 28],
            className: '',
          }),
        })
          .bindPopup(
            `<div style="font-size: 12px">
            <strong>Gate ${gate.letter}</strong><br/>
            Density: ${gate.density}% (${getDensityLabel(gate.density)})<br/>
            Wait: ${gate.waitTime} min
          </div>`
          )
          .addTo(map.current!);

        markersRef.current[gate.id] = marker;
      });
    }

    // Highlight selected gate
    Object.entries(markersRef.current).forEach(([gateId, marker]) => {
      const element = marker.getElement();
      if (element) {
        if (gateId === selectedGate) {
          element.style.transform = 'scale(1.3)';
          element.style.zIndex = '1000';
        } else {
          element.style.transform = 'scale(1)';
          element.style.zIndex = '100';
        }
      }
    });
  }, [selectedGate]);

  return (
    <div className="space-y-3">
      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full h-44 rounded-2xl overflow-hidden shadow-sm bg-muted"
        style={{ position: 'relative' }}
      />

      {/* Gate Status Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {GATES.map((gate) => {
          const color = getGateColor(gate.density);
          return (
            <button
              key={gate.id}
              onClick={() => setSelectedGate(gate.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedGate === gate.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border text-foreground hover:bg-muted'
              }`}
            >
              <span className="font-bold">Gate {gate.letter}</span>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span>{gate.waitTime} min</span>
            </button>
          );
        })}
      </div>

      {/* Recommendation Text */}
      <p className="text-xs text-center text-primary font-medium">Gate C has the shortest wait. Head there now.</p>
    </div>
  );
}
