'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Map as LeafletMap, LayerGroup, Marker } from 'leaflet'

const LAYER_TYPES = [
  'Gates',
  'Washrooms',
  'Medical',
  'Food',
  'Charging',
  'Water',
  'Parking',
  'Transport',
  'Friends',
] as const

const LAYER_META: Record<string, { color: string; label: string }> = {
  Gates: { color: '#0F172A', label: 'G' },
  Washrooms: { color: '#2563EB', label: 'W' },
  Medical: { color: '#DC2626', label: 'M' },
  Food: { color: '#D97706', label: 'F' },
  Charging: { color: '#16A34A', label: 'C' },
  Water: { color: '#0891B2', label: 'W' },
  Parking: { color: '#475569', label: 'P' },
  Transport: { color: '#7C3AED', label: 'T' },
  Friends: { color: '#0F172A', label: 'RK' },
}

type MarkerData = {
  title: string
  coords: [number, number]
  subtitle: string
  distance: string
  layer: string
  iconLabel: string
  isFriend?: boolean
}

const MARKER_DATA: MarkerData[] = [
  {
    layer: 'Gates',
    title: 'Gate A North',
    coords: [28.5673, 77.2424],
    subtitle: 'Gate A - North Entry',
    distance: '~120m away',
    iconLabel: 'G',
  },
  {
    layer: 'Gates',
    title: 'Gate B East',
    coords: [28.5666, 77.2442],
    subtitle: 'Gate B - East Entry',
    distance: '~80m away',
    iconLabel: 'G',
  },
  {
    layer: 'Gates',
    title: 'Gate C South',
    coords: [28.5657, 77.2431],
    subtitle: 'Gate C - South Entry',
    distance: '~200m away',
    iconLabel: 'G',
  },
  {
    layer: 'Gates',
    title: 'Gate D West',
    coords: [28.5666, 77.2420],
    subtitle: 'Gate D - West Entry',
    distance: '~150m away',
    iconLabel: 'G',
  },
  {
    layer: 'Gates',
    title: 'Gate E VIP',
    coords: [28.5671, 77.2437],
    subtitle: 'Gate E - VIP Entry',
    distance: '~60m away',
    iconLabel: 'G',
  },
  {
    layer: 'Washrooms',
    title: 'Washroom - Gate A Level 1',
    coords: [28.5672, 77.2426],
    subtitle: 'Male and female facilities',
    distance: '~110m away',
    iconLabel: 'W',
  },
  {
    layer: 'Washrooms',
    title: 'Washroom - Gate B Level 1',
    coords: [28.5668, 77.2440],
    subtitle: 'Male and female facilities',
    distance: '~75m away',
    iconLabel: 'W',
  },
  {
    layer: 'Washrooms',
    title: 'Washroom - South Stand Level 1',
    coords: [28.5660, 77.2433],
    subtitle: 'Male and female facilities',
    distance: '~190m away',
    iconLabel: 'W',
  },
  {
    layer: 'Washrooms',
    title: 'Washroom - West Stand Level 1',
    coords: [28.5664, 77.2422],
    subtitle: 'Male and female facilities',
    distance: '~140m away',
    iconLabel: 'W',
  },
  {
    layer: 'Washrooms',
    title: 'Washroom - North Concourse Level 2',
    coords: [28.5669, 77.2430],
    subtitle: 'Male and female facilities',
    distance: '~55m away',
    iconLabel: 'W',
  },
  {
    layer: 'Washrooms',
    title: 'Washroom - East Concourse Level 2',
    coords: [28.5663, 77.2438],
    subtitle: 'Male and female facilities',
    distance: '~95m away',
    iconLabel: 'W',
  },
  {
    layer: 'Medical',
    title: 'Medical Bay - Gate A',
    coords: [28.5670, 77.2428],
    subtitle: 'First aid and emergency care',
    distance: '~100m away',
    iconLabel: 'M',
  },
  {
    layer: 'Medical',
    title: 'Medical Bay - Gate E Level 2',
    coords: [28.5662, 77.2436],
    subtitle: 'First aid and emergency care',
    distance: '~110m away',
    iconLabel: 'M',
  },
  {
    layer: 'Food',
    title: 'Food Court - North Concourse',
    coords: [28.5671, 77.2430],
    subtitle: 'Full food and beverage service',
    distance: '~90m away',
    iconLabel: 'F',
  },
  {
    layer: 'Food',
    title: 'Food Court - South Concourse',
    coords: [28.5661, 77.2432],
    subtitle: 'Full food and beverage service',
    distance: '~185m away',
    iconLabel: 'F',
  },
  {
    layer: 'Food',
    title: 'Food Stall - East Stand',
    coords: [28.5667, 77.2439],
    subtitle: 'Snacks and beverages',
    distance: '~85m away',
    iconLabel: 'F',
  },
  {
    layer: 'Food',
    title: 'Food Stall - West Stand',
    coords: [28.5665, 77.2423],
    subtitle: 'Snacks and beverages',
    distance: '~145m away',
    iconLabel: 'F',
  },
  {
    layer: 'Charging',
    title: 'Charging Station - Section 105',
    coords: [28.5670, 77.2432],
    subtitle: '10 USB and Type-C ports',
    distance: '~85m away',
    iconLabel: 'C',
  },
  {
    layer: 'Charging',
    title: 'Charging Station - Section 112',
    coords: [28.5666, 77.2427],
    subtitle: '10 USB and Type-C ports',
    distance: '~115m away',
    iconLabel: 'C',
  },
  {
    layer: 'Charging',
    title: 'Charging Station - Section 119',
    coords: [28.5663, 77.2435],
    subtitle: '10 USB and Type-C ports',
    distance: '~105m away',
    iconLabel: 'C',
  },
  {
    layer: 'Water',
    title: 'Water Cooler - Gate A Entrance',
    coords: [28.5672, 77.2429],
    subtitle: 'Free drinking water',
    distance: '~105m away',
    iconLabel: 'W',
  },
  {
    layer: 'Water',
    title: 'Water Cooler - South Stand',
    coords: [28.5662, 77.2433],
    subtitle: 'Free drinking water',
    distance: '~188m away',
    iconLabel: 'W',
  },
  {
    layer: 'Water',
    title: 'Water Cooler - East Concourse',
    coords: [28.5668, 77.2437],
    subtitle: 'Free drinking water',
    distance: '~80m away',
    iconLabel: 'W',
  },
  {
    layer: 'Water',
    title: 'Water Cooler - West Concourse',
    coords: [28.5664, 77.2424],
    subtitle: 'Free drinking water',
    distance: '~138m away',
    iconLabel: 'W',
  },
  {
    layer: 'Parking',
    title: 'Parking Zone A - North',
    coords: [28.5678, 77.2425],
    subtitle: '450 vehicle capacity',
    distance: '~280m away',
    iconLabel: 'P',
  },
  {
    layer: 'Parking',
    title: 'Parking Zone B - West',
    coords: [28.5655, 77.2418],
    subtitle: '320 vehicle capacity',
    distance: '~380m away',
    iconLabel: 'P',
  },
  {
    layer: 'Parking',
    title: 'Parking Zone C - South',
    coords: [28.5652, 77.2438],
    subtitle: '280 vehicle capacity',
    distance: '~420m away',
    iconLabel: 'P',
  },
  {
    layer: 'Transport',
    title: 'JLN Metro Station',
    coords: [28.5648, 77.2420],
    subtitle: 'Blue Line - 10 min walk',
    distance: '~500m away',
    iconLabel: 'T',
  },
  {
    layer: 'Transport',
    title: 'Taxi Pickup - North Gate',
    coords: [28.5678, 77.2418],
    subtitle: 'Uber and Ola available',
    distance: '~290m away',
    iconLabel: 'T',
  },
  {
    layer: 'Transport',
    title: 'Taxi Pickup - South Gate',
    coords: [28.5650, 77.2440],
    subtitle: 'Uber and Ola available',
    distance: '~450m away',
    iconLabel: 'T',
  },
  {
    layer: 'Transport',
    title: 'Auto Stand - West Gate',
    coords: [28.5660, 77.2415],
    subtitle: 'Prepaid auto rickshaw',
    distance: '~320m away',
    iconLabel: 'T',
  },
  {
    layer: 'Friends',
    title: 'Rahul K',
    coords: [28.5668, 77.2431],
    subtitle: 'Friend - Section 108',
    distance: '~45m away',
    iconLabel: 'RK',
    isFriend: true,
  },
  {
    layer: 'Friends',
    title: 'Amit S',
    coords: [28.5664, 77.2435],
    subtitle: 'Friend - Section 122',
    distance: '~95m away',
    iconLabel: 'AS',
    isFriend: true,
  },
]

const FLOOR_LEVELS = ['Level 1', 'Level 2', 'Level 3'] as const

const SUMMARY_CELLS = [
  { layer: 'Washrooms', label: '6 Washrooms', color: '#2563EB' },
  { layer: 'Medical', label: '2 Medical', color: '#DC2626' },
  { layer: 'Food', label: '4 Food', color: '#D97706' },
  { layer: 'Charging', label: '3 Charging', color: '#16A34A' },
  { layer: 'Friends', label: '2 Friends', color: '#0F172A' },
  { layer: 'Gates', label: '5 Gates', color: '#475569' },
]

export default function VenueMap() {
  const [activeLayer, setActiveLayer] = useState<string[]>([...LAYER_TYPES])
  const [activeFloor, setActiveFloor] = useState<string>('Level 1')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedGate, setSelectedGate] = useState<string | null>(null)
  const [leafletReady, setLeafletReady] = useState<boolean>(false)
  const mapRef = useRef<LeafletMap | null>(null)
  const initializedRef = useRef<boolean>(false)
  const markersRef = useRef<
    Record<
      string,
      {
        group: LayerGroup
        items: Array<{ marker: Marker; popupHtml: string }>
      }
    >
  >({})
  const userMarkerRef = useRef<Marker | null>(null)
  const leafletRef = useRef<any>(null)

  const filteredQuery = searchQuery.trim().toLowerCase()

  const handleLayerToggle = (layer: string) => {
    const groupEntry = markersRef.current[layer]
    if (!groupEntry || !mapRef.current) return

    const isActive = activeLayer.includes(layer)
    if (isActive) {
      mapRef.current.removeLayer(groupEntry.group)
      setActiveLayer((prev) => prev.filter((item) => item !== layer))
      return
    }

    mapRef.current.addLayer(groupEntry.group)
    setActiveLayer((prev) => [...prev, layer])
  }

  const filterLayer = (layer: string) => {
    if (!activeLayer.includes(layer)) {
      handleLayerToggle(layer)
      return
    }
    setActiveLayer((prev) => prev.filter((item) => item !== layer))
    const groupEntry = markersRef.current[layer]
    if (mapRef.current && groupEntry) {
      mapRef.current.removeLayer(groupEntry.group)
    }
  }

  const createMarkerIcon = (
    color: string,
    label: string,
    isFriend = false,
    size = 36,
  ) => {
    const content = isFriend
      ? `
      <div style="position:relative;width:${size}px;height:${size}px;">
        <div style="position:absolute;inset:-4px;border:2px solid #16A34A;border-radius:50%;animation:pulse 1.5s ease-in-out infinite;"></div>
        <div style="width:${size}px;height:${size}px;background:${color};border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;color:white;font-size:13px;font-weight:bold;font-family:Inter,sans-serif;">
          ${label}
        </div>
      </div>
      <style>@keyframes pulse{0%{opacity:1;transform:scale(1);}100%{opacity:0;transform:scale(1.3);}}</style>
      `
      : `
      <div style="width:${size}px;height:${size}px;background:${color};border-radius:50%;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;color:white;font-size:13px;font-weight:bold;font-family:Inter,sans-serif;">
        ${label}
      </div>
      `

    return {
      html: content,
      className: '',
      iconSize: [size, size] as [number, number],
      iconAnchor: [size / 2, size / 2] as [number, number],
      popupAnchor: [0, -(size / 2)] as [number, number],
    }
  }

  const createPopup = (title: string, subtitle: string, distance: string) =>
    `
      <div style="min-width:150px;font-family:Inter,sans-serif;">
        <p style="margin:0;font-weight:700;color:#0F172A;font-size:14px;">${title}</p>
        <p style="margin:0;margin-top:4px;color:#475569;font-size:12px;">${subtitle}</p>
        <span style="display:inline-block;margin-top:8px;background:#EFF6FF;color:#2563EB;border-radius:999px;padding:4px 8px;font-size:11px;">${distance}</span>
      </div>
    `

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    let isMounted = true

    const initMap = async () => {
      const leafletModule = await import('leaflet')
      const L = (leafletModule as any).default ?? leafletModule
      leafletRef.current = L

      if (!isMounted) return

      const map = L.map('venue-map', {
        center: [28.5665, 77.2431],
        zoom: 17,
        zoomControl: false,
        attributionControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
      mapRef.current = map

      const layerGroups: Record<
        string,
        {
          group: LayerGroup
          items: Array<{ marker: Marker; popupHtml: string }>
        }
      > = {}

      LAYER_TYPES.forEach((layer) => {
        layerGroups[layer] = { group: L.layerGroup(), items: [] }
      })

      MARKER_DATA.forEach((markerItem) => {
        const meta = LAYER_META[markerItem.layer]
        const markerIcon = createMarkerIcon(
          markerItem.isFriend ? '#0F172A' : meta.color,
          markerItem.iconLabel,
          markerItem.isFriend,
          markerItem.isFriend ? 40 : 36,
        )
        const marker = L.marker(markerItem.coords, {
          icon: L.divIcon(markerIcon),
        })

        const popupHtml = createPopup(markerItem.title, markerItem.subtitle, markerItem.distance)
        marker.bindPopup(popupHtml)
        marker.on('click', () => {
          setSelectedGate(markerItem.title)
        })

        const entry = layerGroups[markerItem.layer]
        entry.items.push({ marker, popupHtml })
        entry.group.addLayer(marker)
      })

      Object.values(layerGroups).forEach((entry) => {
        entry.group.addTo(map)
      })

      markersRef.current = layerGroups
      setLeafletReady(true)
    }

    initMap()

    return () => {
      isMounted = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    Object.entries(markersRef.current).forEach(([layer, entry]) => {
      const layerActive = activeLayer.includes(layer)
      entry.items.forEach(({ marker, popupHtml }) => {
        const matchesSearch =
          !filteredQuery || popupHtml.toLowerCase().includes(filteredQuery)
        if (matchesSearch && layerActive) {
          if (!entry.group.hasLayer(marker)) {
            entry.group.addLayer(marker)
          }
        } else {
          if (entry.group.hasLayer(marker)) {
            entry.group.removeLayer(marker)
          }
        }
      })
      if (mapRef.current) {
        if (layerActive && !mapRef.current.hasLayer(entry.group)) {
          mapRef.current.addLayer(entry.group)
        }
        if (!layerActive && mapRef.current.hasLayer(entry.group)) {
          mapRef.current.removeLayer(entry.group)
        }
      }
    })
  }, [filteredQuery, activeLayer])

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapRef.current || !leafletRef.current) return

    const L = leafletRef.current
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords

        if (userMarkerRef.current && mapRef.current.hasLayer(userMarkerRef.current)) {
          mapRef.current.removeLayer(userMarkerRef.current)
        }

        const marker = L.circleMarker([latitude, longitude], {
          radius: 10,
          color: '#2563EB',
          fillColor: '#2563EB',
          fillOpacity: 0.9,
        })
          .addTo(mapRef.current)
          .bindPopup('You are here')
          .openPopup()

        userMarkerRef.current = marker as unknown as Marker
        mapRef.current.panTo([latitude, longitude])
        mapRef.current.setZoom(18)
      },
      (error: GeolocationPositionError) => {
        console.error('Geolocation error:', error.message)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col bg-white">
      <div className="z-10 bg-white">
        <div className="mx-4 mt-3 mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search venue locations..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] outline-none"
          />
        </div>

        <div className="flex flex-row flex-wrap gap-2 px-4 mb-2">
          {FLOOR_LEVELS.map((floor) => {
            const active = activeFloor === floor
            return (
              <button
                key={floor}
                type="button"
                onClick={() => setActiveFloor(floor)}
                className={`rounded-full px-4 py-1.5 text-[13px] ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                {floor}
              </button>
            )
          })}
        </div>

        <div className="overflow-x-auto flex flex-row gap-2 px-4 pb-2 scrollbar-hide">
          {LAYER_TYPES.map((layer) => {
            const active = activeLayer.includes(layer)
            const meta = LAYER_META[layer]
            return (
              <button
                key={layer}
                type="button"
                onClick={() => handleLayerToggle(layer)}
                className={`flex items-center gap-2 rounded-full px-3 py-1 text-[12px] ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
                {layer}
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        {!leafletReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-13px text-gray-500">Loading map...</p>
            </div>
          </div>
        )}
        <div id="venue-map" className="h-full w-full z-0" />
        <button
          type="button"
          onClick={handleLocateMe}
          className="absolute bottom-4 right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg"
          aria-label="Locate me"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 8V4M12 20v-4M8 12H4M20 12h-4M16.24 7.76l2.83-2.83M4.93 19.07l2.83-2.83M16.24 16.24l2.83 2.83M4.93 4.93l2.83 2.83"
              stroke="#0F172A"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="3" stroke="#0F172A" strokeWidth="1.8" />
          </svg>
        </button>
      </div>

      <div className="mx-4 mb-3 mt-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="grid grid-cols-3 gap-2">
          {SUMMARY_CELLS.map((cell) => (
            <button
              key={cell.layer}
              type="button"
              onClick={() => filterLayer(cell.layer)}
              className="flex items-center gap-2 rounded-2xl border border-transparent bg-white px-3 py-3 text-left"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: cell.color }}
              />
              <div>
                <p className="text-[14px] font-bold text-slate-900">{cell.label}</p>
                <p className="text-[11px] text-gray-500">{cell.layer}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
