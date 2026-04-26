import { NextResponse } from 'next/server'

type BackendZone = {
  id: string
  density: number
}

export async function GET() {
  try {
    const response = await fetch('http://localhost:3001/api/zones', {
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch zones' }, { status: 502 })
    }

    const zones = (await response.json()) as BackendZone[]
    const densities = zones.map((z) => ({
      zone: z.id,
      percentage: z.density,
      count: Math.round((z.density / 100) * 12000),
    }))

    return NextResponse.json(densities, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 500 })
  }
}
