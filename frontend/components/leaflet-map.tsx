'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  icon: string;
  label: string;
  popup: string;
  layer: string;
  floor?: 'level1' | 'level2' | 'level3';
  color: string;
  isFriend?: boolean;
}

const allMarkers: MarkerData[] = [
  // Washrooms
  { id: 'WR1', lat: 28.93920, lng: 72.77510, icon: 'W', label: 'Washroom', popup: 'Washroom - Gate A Level 1', layer: 'washrooms', floor: 'level1', color: '#2563EB' },
  { id: 'WR2', lat: 28.93850, lng: 72.77580, icon: 'W', label: 'Washroom', popup: 'Washroom - Gate C Level 1', layer: 'washrooms', floor: 'level1', color: '#2563EB' },
  { id: 'WR3', lat: 28.93900, lng: 72.77480, icon: 'W', label: 'Washroom', popup: 'Washroom - North Stand Level 2', layer: 'washrooms', floor: 'level2', color: '#2563EB' },
  { id: 'WR4', lat: 28.93830, lng: 72.77550, icon: 'W', label: 'Washroom', popup: 'Washroom - South Stand Level 1', layer: 'washrooms', floor: 'level1', color: '#2563EB' },
  { id: 'WR5', lat: 28.93870, lng: 72.77520, icon: 'W', label: 'Washroom', popup: 'Washroom - East Concourse', layer: 'washrooms', floor: 'level1', color: '#2563EB' },
  { id: 'WR6', lat: 28.93810, lng: 72.77490, icon: 'W', label: 'Washroom', popup: 'Washroom - West Stand Level 2', layer: 'washrooms', floor: 'level2', color: '#2563EB' },

  // Medical
  { id: 'MD1', lat: 28.93890, lng: 72.77530, icon: 'M', label: 'Medical', popup: 'Medical Bay - Gate B Level 1', layer: 'medical', floor: 'level1', color: '#DC2626' },
  { id: 'MD2', lat: 28.93860, lng: 72.77570, icon: 'M', label: 'Medical', popup: 'Medical Bay - Gate E Level 2', layer: 'medical', floor: 'level2', color: '#DC2626' },

  // Food Courts
  { id: 'FC1', lat: 28.93910, lng: 72.77510, icon: 'F', label: 'Food', popup: 'Food Court - North Concourse', layer: 'food', floor: 'level1', color: '#D97706' },
  { id: 'FC2', lat: 28.93840, lng: 72.77560, icon: 'F', label: 'Food', popup: 'Food Court - South Concourse', layer: 'food', floor: 'level1', color: '#D97706' },
  { id: 'FC3', lat: 28.93880, lng: 72.77490, icon: 'F', label: 'Food', popup: 'Food Stall - East Stand', layer: 'food', floor: 'level2', color: '#D97706' },
  { id: 'FC4', lat: 28.93820, lng: 72.77540, icon: 'F', label: 'Food', popup: 'Food Stall - West Stand', layer: 'food', floor: 'level2', color: '#D97706' },

  // Charging Stations
  { id: 'CH1', lat: 28.93900, lng: 72.77540, icon: 'C', label: 'Charging', popup: 'Charging Station - Section 105', layer: 'charging', floor: 'level1', color: '#16A34A' },
  { id: 'CH2', lat: 28.93870, lng: 72.77500, icon: 'C', label: 'Charging', popup: 'Charging Station - Section 112', layer: 'charging', floor: 'level1', color: '#16A34A' },
  { id: 'CH3', lat: 28.93850, lng: 72.77560, icon: 'C', label: 'Charging', popup: 'Charging Station - Section 119', layer: 'charging', floor: 'level1', color: '#16A34A' },

  // Water Coolers
  { id: 'WC1', lat: 28.93915, lng: 72.77520, icon: 'W', label: 'Water', popup: 'Water Cooler - Gate A Entrance', layer: 'water', floor: 'level1', color: '#0891B2' },
  { id: 'WC2', lat: 28.93845, lng: 72.77555, icon: 'W', label: 'Water', popup: 'Water Cooler - South Stand', layer: 'water', floor: 'level1', color: '#0891B2' },
  { id: 'WC3', lat: 28.93875, lng: 72.77510, icon: 'W', label: 'Water', popup: 'Water Cooler - East Concourse', layer: 'water', floor: 'level1', color: '#0891B2' },
  { id: 'WC4', lat: 28.93825, lng: 72.77545, icon: 'W', label: 'Water', popup: 'Water Cooler - West Concourse', layer: 'water', floor: 'level1', color: '#0891B2' },

  // Parking
  { id: 'PK1', lat: 28.93950, lng: 72.77480, icon: 'P', label: 'Parking', popup: 'Parking Zone A - North', layer: 'parking', color: '#475569' },
  { id: 'PK2', lat: 28.93780, lng: 72.77420, icon: 'P', label: 'Parking', popup: 'Parking Zone B - West', layer: 'parking', color: '#475569' },
  { id: 'PK3', lat: 28.93760, lng: 72.77600, icon: 'P', label: 'Parking', popup: 'Parking Zone C - South', layer: 'parking', color: '#475569' },

  // Gates
  { id: 'GT1', lat: 28.93940, lng: 72.77500, icon: 'G', label: 'Gate', popup: 'Gate A - North Entry', layer: 'gates', color: '#0F172A' },
  { id: 'GT2', lat: 28.93800, lng: 72.77610, icon: 'G', label: 'Gate', popup: 'Gate B - East Entry', layer: 'gates', color: '#0F172A' },
  { id: 'GT3', lat: 28.93760, lng: 72.77520, icon: 'G', label: 'Gate', popup: 'Gate C - South Entry', layer: 'gates', color: '#0F172A' },
  { id: 'GT4', lat: 28.93820, lng: 72.77440, icon: 'G', label: 'Gate', popup: 'Gate D - West Entry', layer: 'gates', color: '#0F172A' },

  // Metro Station
  { id: 'MT1', lat: 28.93700, lng: 72.77450, icon: 'M', label: 'Metro', popup: 'Kasturba Nagar Metro Station - 8 min walk', layer: 'transport', color: '#7C3AED' },

  // Taxi Pickup
  { id: 'TX1', lat: 28.93960, lng: 72.77460, icon: 'T', label: 'Taxi', popup: 'Taxi and Cab Pickup - North Gate', layer: 'transport', color: '#EA580C' },
  { id: 'TX2', lat: 28.93740, lng: 72.77550, icon: 'T', label: 'Taxi', popup: 'Taxi and Cab Pickup - South Gate', layer: 'transport', color: '#EA580C' },

  // Friends
  { id: 'RK', lat: 28.93890, lng: 72.77530, icon: 'RK', label: 'Friend', popup: 'Rahul K - Friend - Section 108', layer: 'friends', color: '#0F172A', isFriend: true },
  { id: 'AS', lat: 28.93870, lng: 72.77550, icon: 'AS', label: 'Friend', popup: 'Amit S - Friend - Section 122', layer: 'friends', color: '#0F172A', isFriend: true },
];

interface LeafletMapProps {
  activeLayers: Record<string, boolean>;
  selectedFloor: 'level1' | 'level2' | 'level3';
  searchQuery: string;
  userLocation: { lat: number; lng: number } | null;
}

export default function LeafletMapComponent({
  activeLayers,
  selectedFloor,
  searchQuery,
  userLocation,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      mapRef.current = L.map('map').setView([28.5665, 77.2431], 17);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .custom-marker {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: bold;
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          cursor: pointer;
        }
        .custom-marker.friend {
          width: 40px;
          height: 40px;
          animation: pulse-friend 1.5s infinite;
        }
        @keyframes pulse-friend {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }
        .leaflet-popup {
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 0;
          min-width: 160px;
        }
        .leaflet-popup-content {
          margin: 12px;
          font-size: 12px;
        }
        .popup-title {
          font-weight: bold;
          color: #0F172A;
          font-size: 14px;
        }
        .popup-subtitle {
          color: #6B7280;
          margin-top: 4px;
          font-size: 12px;
        }
        .popup-distance {
          background-color: #DBEAFE;
          color: #1E40AF;
          border-radius: 999px;
          padding: 4px 8px;
          font-size: 11px;
          display: inline-block;
          margin-top: 8px;
        }
        .leaflet-popup-tip {
          display: none;
        }
      `;
      document.head.appendChild(style);
    }

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    // Add user location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="width: 100%; height: 100%; background-color: #3B82F6; border-radius: 50%;"></div>',
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
      markersRef.current.push(userMarker);

      // Add accuracy circle
      L.circle([userLocation.lat, userLocation.lng], {
        radius: 50,
        color: '#3B82F6',
        fillColor: '#3B82F6',
        fillOpacity: 0.1,
        weight: 1,
      }).addTo(map);
    }

    // Filter and add markers
    const filteredMarkers = allMarkers.filter((marker) => {
      // Layer filter
      if (!activeLayers[marker.layer]) return false;

      // Floor filter (only for inside stadium markers with floor property)
      if (marker.floor && marker.floor !== selectedFloor) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          marker.popup.toLowerCase().includes(query) ||
          marker.label.toLowerCase().includes(query) ||
          marker.id.toLowerCase().includes(query)
        );
      }

      return true;
    });

    filteredMarkers.forEach((marker) => {
      const icon = L.divIcon({
        className: `custom-marker ${marker.isFriend ? 'friend' : ''}`,
        html: `<div style="background-color: ${marker.color};">${marker.icon}</div>`,
      });

      const markerElement = L.marker([marker.lat, marker.lng], { icon }).addTo(map);

      // Custom popup
      const popupContent = `
        <div class="popup-title">${marker.popup.split(' - ')[0]}</div>
        <div class="popup-subtitle">${marker.popup.split(' - ')[1] || ''}</div>
        <div class="popup-distance">~${Math.floor(Math.random() * 100) + 20}m away</div>
      `;

      markerElement.bindPopup(popupContent);
      markersRef.current.push(markerElement);
    });
  }, [activeLayers, selectedFloor, searchQuery, userLocation]);

  return (
    <div
      id="map"
      className="w-full h-full"
      style={{ position: 'relative' }}
    />
  );
}
