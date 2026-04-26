'use client';

import { useState, useEffect } from 'react';
import { LiveBadge } from './live-badge';

interface ZoneDensity {
  zone: string;
  percentage: number;
  count: number;
}

const ZONE_COLORS = {
  A: '#ff8c42',
  B: '#ff3c38',
  C: '#ff8c42',
  D: '#ff8c42',
  E: '#fff275',
  F: '#ff3c38',
  G: '#a23e48',
  H: '#6c8ead',
};

export function StadiumMap() {
  const [densities, setDensities] = useState<ZoneDensity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchDensities();
    const interval = setInterval(fetchDensities, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDensities = async () => {
    try {
      const response = await fetch('/api/densities');
      if (response.ok) {
        const data = await response.json();
        setDensities(data);
      }
    } catch (error) {
      console.error('Failed to fetch densities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <LiveBadge />
      <svg
        suppressHydrationWarning
        width="280"
        height="280"
        viewBox="0 0 300 300"
        className="drop-shadow-lg"
      >
        {/* Stadium Circle Background */}
        <circle cx="150" cy="150" r="140" fill="#f0ede6" stroke="#ff8c42" strokeWidth="2" />

        {/* 8 Zones */}
        {Object.entries(ZONE_COLORS).map(([zone, baseColor], idx) => {
          const angle = (idx * 45 - 90) * (Math.PI / 180);
          const nextAngle = ((idx + 1) * 45 - 90) * (Math.PI / 180);

          const x1 = 150 + 100 * Math.cos(angle);
          const y1 = 150 + 100 * Math.sin(angle);
          const x2 = 150 + 100 * Math.cos(nextAngle);
          const y2 = 150 + 100 * Math.sin(nextAngle);

          const density = densities.find((d) => d.zone === zone);
          const percentage = density?.percentage ?? 0;
          const isHighDensity = percentage > 75;
          const pulseClass = mounted && isHighDensity ? 'animate-pulse-dense' : '';

          return (
            <g key={zone}>
              {/* Zone Path */}
              <path
                suppressHydrationWarning
                d={`M 150 150 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                fill={baseColor}
                fillOpacity="0.6"
                stroke="#ff8c42"
                strokeWidth="1.5"
                className={pulseClass}
              />

              {/* Zone Label */}
              <text
                x={150 + 85 * Math.cos((angle + nextAngle) / 2)}
                y={150 + 85 * Math.sin((angle + nextAngle) / 2)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#2d2d2d"
                fontSize="16"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {zone}
              </text>

              {/* Density Percentage */}
              {density && (
                <text
                  x={150 + 60 * Math.cos((angle + nextAngle) / 2)}
                  y={150 + 60 * Math.sin((angle + nextAngle) / 2)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#6c8ead"
                  fontSize="11"
                  className="pointer-events-none"
                >
                  {percentage}%
                </text>
              )}

              {/* Pulse Rings for High-Density Red Zones */}
              {(zone === 'B' || zone === 'F') && isHighDensity && (
                <>
                  <circle
                    cx={150 + 85 * Math.cos((angle + nextAngle) / 2)}
                    cy={150 + 85 * Math.sin((angle + nextAngle) / 2)}
                    r="20"
                    fill="none"
                    stroke="#ff3c38"
                    strokeWidth="2"
                    className="animate-pulse-ring"
                  />
                  <circle
                    cx={150 + 85 * Math.cos((angle + nextAngle) / 2)}
                    cy={150 + 85 * Math.sin((angle + nextAngle) / 2)}
                    r="15"
                    fill="none"
                    stroke="#ff3c38"
                    strokeWidth="1.5"
                    opacity="0.4"
                    className="animate-pulse-secondary"
                  />
                </>
              )}
            </g>
          );
        })}

        {/* Center Field */}
        <circle cx="150" cy="150" r="30" fill="#fff9f3" stroke="#ff8c42" strokeWidth="2" />
        <text
          x="150"
          y="145"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ff8c42"
          fontSize="12"
          fontWeight="bold"
          className="pointer-events-none"
        >
          FIELD
        </text>
        <text
          x="150"
          y="160"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#a23e48"
          fontSize="10"
          className="pointer-events-none"
        >
          Live
        </text>
      </svg>

      {/* Quick Stats */}
      <div className="w-full max-w-md px-4 space-y-3">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-2">HIGHEST DENSITY</div>
          <div className="text-2xl font-bold text-accent">
            {densities.length > 0
              ? `${Math.max(...densities.map((d) => d.percentage))}%`
              : '—'}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {densities.find((d) => d.percentage === Math.max(...densities.map((d) => d.percentage)))?.zone || 'N/A'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-2">TOTAL ATTENDEES</div>
            <div className="text-2xl font-bold text-primary">
              {densities.reduce((sum, d) => sum + d.count, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-2">AVG DENSITY</div>
            <div className="text-2xl font-bold text-primary">
              {densities.length > 0
                ? Math.round(
                    densities.reduce((sum, d) => sum + d.percentage, 0) / densities.length
                  )
                : 0}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
