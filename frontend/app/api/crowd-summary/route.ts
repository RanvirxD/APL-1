import { NextResponse } from 'next/server';

interface CrowdRecommendation {
  type: 'busiest-entry' | 'recommended-entry' | 'crowd-alert';
  label: string;
  value: string;
  subtext: string;
  color: 'red' | 'green' | 'amber';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { zones } = body;

    const recommendations: CrowdRecommendation[] = [
      {
        type: 'busiest-entry',
        label: 'Busiest Entry',
        value: 'South Gate - 91% capacity',
        subtext: 'Avoid this entry, use Gate C instead',
        color: 'red',
      },
      {
        type: 'recommended-entry',
        label: 'Recommended Entry',
        value: 'Gate C - 34% capacity',
        subtext: 'Shortest wait time right now',
        color: 'green',
      },
      {
        type: 'crowd-alert',
        label: 'Crowd Alert',
        value: 'North Stand filling fast',
        subtext: 'Move to West Stand for better experience',
        color: 'amber',
      },
    ];

    return NextResponse.json(recommendations, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate crowd summary' },
      { status: 500 }
    );
  }
}
