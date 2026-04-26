import { NextResponse } from 'next/server';

interface Alert {
  id: string;
  zone: string;
  type: 'overcrowd' | 'incident' | 'structural';
  timestamp: string;
  status: 'active' | 'resolved';
}

export async function GET() {
  const now = new Date();
  const alerts: Alert[] = [];

  // Simulate dynamic alerts based on time
  const minute = now.getMinutes();
  
  // Alert 1: Red zone B overcrowding (every 3 minutes)
  if (minute % 3 === 0) {
    alerts.push({
      id: 'alert-1',
      zone: 'B',
      type: 'overcrowd',
      timestamp: now.toISOString(),
      status: 'active',
    });
  }

  // Alert 2: Red zone F structural monitoring (every 4 minutes)
  if (minute % 4 === 0) {
    alerts.push({
      id: 'alert-2',
      zone: 'F',
      type: 'structural',
      timestamp: new Date(now.getTime() - 5 * 60000).toISOString(),
      status: minute % 4 === 0 ? 'active' : 'resolved',
    });
  }

  // Alert 3: General incident (every 7 minutes)
  if (minute % 7 === 0) {
    alerts.push({
      id: 'alert-3',
      zone: 'D',
      type: 'incident',
      timestamp: new Date(now.getTime() - 10 * 60000).toISOString(),
      status: 'resolved',
    });
  }

  return NextResponse.json(alerts, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
