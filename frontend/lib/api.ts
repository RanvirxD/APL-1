const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'
const BASE = BACKEND_BASE.endsWith('/api') ? BACKEND_BASE : `${BACKEND_BASE}/api`

export type Zone = {
  id: string
  name: string
  density: number
  waitTime: number
  status: string
}

export type Alert = {
  id: number
  zone: string
  severity: string
  message: string
  time: string
}

export type Match = {
  home: string
  away: string
  score: string
  timeLeft: string
  inning: string
  venue: string
}

export type Message = {
  _id: string
  senderName: string
  senderRole: 'user' | 'admin' | 'ai'
  text: string
  filtered: boolean
  createdAt: string
}

export type Report = {
  _id: string
  type: string
  severity: string
  location: string
  description: string
  status: string
  createdAt: string
}

type PostMessageBody = {
  senderName: string
  senderRole: 'user' | 'admin' | 'ai'
  text: string
}

type PostReportBody = {
  type: string
  severity: string
  location: string
  description: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const data = (await response.json()) as { error?: string }
      if (data?.error) {
        message = data.error
      }
    } catch {
      // No-op: fallback to status message.
    }
    throw new Error(message)
  }

  return (await response.json()) as T
}

export async function getZones(): Promise<Zone[]> {
  return request<Zone[]>('/zones')
}

export async function getAlerts(): Promise<Alert[]> {
  return request<Alert[]>('/alerts')
}

export async function getMatch(): Promise<Match> {
  return request<Match>('/match')
}

export async function getMessages(): Promise<Message[]> {
  return request<Message[]>('/messages')
}

export async function postMessage(
  body: PostMessageBody,
): Promise<{ success: boolean; message: Message }> {
  return request<{ success: boolean; message: Message }>('/messages', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function postReport(
  body: PostReportBody,
): Promise<{ success: boolean; report: Report }> {
  return request<{ success: boolean; report: Report }>('/report', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function getReports(): Promise<Report[]> {
  return request<Report[]>('/reports')
}

export async function getGeminiNudge(
  zones: Zone[],
): Promise<{ nudge: string }> {
  try {
    const response = await fetch(`${BASE}/nudge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zones }),
      cache: 'no-store',
    })
    const data = (await response.json()) as { nudge?: string }
    return { nudge: data.nudge ?? 'Head to Gate C for fastest entry right now.' }
  } catch {
    return { nudge: 'Head to Gate C for fastest entry right now.' }
  }
}

export async function getGeminiOpsAlert(
  zones: Zone[],
): Promise<{ alert: string }> {
  try {
    const response = await fetch(`${BASE}/ops-alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zones }),
      cache: 'no-store',
    })
    const data = (await response.json()) as { alert?: string }
    return { alert: data.alert ?? 'Deploy staff to Food Court immediately. Density critical.' }
  } catch {
    return { alert: 'Deploy staff to Food Court immediately. Density critical.' }
  }
}

