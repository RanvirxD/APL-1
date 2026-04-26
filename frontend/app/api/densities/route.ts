import { NextResponse } from 'next/server';

export async function GET() {
  // Simulated real-time density data with variations
  const zones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
  // Generate deterministic but varied data based on time
  const now = Date.now();
  const baseValue = 50 + (now % 30); // Varies between 50-80
  
  const densities = zones.map((zone, index) => {
    // Red zones (B, F) have higher density patterns
    const isRedZone = zone === 'B' || zone === 'F';
    const variance = isRedZone ? 15 : 10;
    const basePercentage = isRedZone ? baseValue + variance : baseValue - (index % 3) * 5;
    const percentage = Math.max(20, Math.min(95, basePercentage + (index % 7) - 3));
    
    return {
      zone,
      percentage: Math.round(percentage),
      count: Math.round((percentage / 100) * 12000 + Math.random() * 500),
    };
  });

  return NextResponse.json(densities, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
