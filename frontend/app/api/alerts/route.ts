import { NextResponse } from 'next/server'

type BackendAlert = {
  id: number
  zone: string
  severity: 'HIGH' | 'MED' | 'LOW'
  message: string
  time: string
}

type FrontendAlert = {
  id: string
  zone: string
  type: 'overcrowd' | 'incident' | 'structural'
  timestamp: string
  status: 'active' | 'resolved'
}

function mapSeverityToType(severity: BackendAlert['severity']): FrontendAlert['type'] {
  if (severity === 'HIGH') return 'overcrowd'
  if (severity === 'MED') return 'incident'
  return 'structural'
}

export async function GET() {
  try {
    const response = await fetch('http://localhost:3001/api/alerts', {
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 502 })
    }

    const alerts = (await response.json()) as BackendAlert[]
    const mappedAlerts: FrontendAlert[] = alerts.map((alert) => ({
      id: String(alert.id),
      zone: alert.zone,
      type: mapSeverityToType(alert.severity),
      timestamp: alert.time,
      status: alert.severity === 'LOW' ? 'resolved' : 'active',
    }))

    return NextResponse.json(mappedAlerts, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 500 })
  }
}
