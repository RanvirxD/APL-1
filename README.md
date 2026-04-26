# ArenaIQ — AI-Powered Smart Stadium Management System

Built for Google Cloud Next · Powered entirely by Google Technology

---

## What is ArenaIQ?

ArenaIQ is a real-time intelligent stadium operations platform designed to
eliminate crowd chaos, improve attendee experience, and give operations
teams AI-powered situational awareness — all from a mobile-first interface.

Built exclusively on Google's technology stack for the Google Cloud hackathon,
ArenaIQ demonstrates how Google's AI, Maps, and Cloud infrastructure can
transform how 50,000+ person venues are managed in real time.

---

## The Problem

Large stadium events face three critical challenges that existing tools fail
to solve:

- **Crowd density blind spots** — Operations teams have no real-time view
  of which zones are reaching dangerous capacity levels
- **Attendee disorientation** — Fans can't find washrooms, medical bays,
  food courts, or their friends inside a massive unfamiliar venue
- **Slow incident response** — Staff communication is fragmented across
  radios, WhatsApp groups, and manual reporting

ArenaIQ solves all three with a single platform.

---

## Google Technology Stack

Every layer of ArenaIQ runs on Google infrastructure. No exceptions.

### Google Cloud Run
Both the frontend (Next.js) and backend (Node.js/Express) are containerized
and deployed on Google Cloud Run — Google's fully managed serverless container
platform. Zero server management, automatic scaling from 0 to 10,000 concurrent
users, and pay-per-request pricing.

- **arenaiq-frontend** — Next.js 16 app served from Cloud Run
- **arenaiq-backend** — Express REST API served from Cloud Run
- Region: asia-south1 (Mumbai) for lowest latency across South Asia

### Google Maps JavaScript API
The venue map is powered entirely by Google Maps JavaScript API with custom
markers, InfoWindows, and real-time layer toggling. Attendees can locate:
- All venue gates with entry status
- Washrooms, medical bays, food courts, charging stations, water coolers
- Parking zones and transport pickup points
- Friends inside the venue (live location layer)

The map uses `@googlemaps/js-api-loader` for dynamic loading with zero
layout shift, restricted API keys with HTTP referrer locking, and
domain-scoped credentials tied to the Cloud Run deployment URL.

### Google Gemini 1.5 Flash (via Google AI Studio)
ArenaIQ integrates two distinct Gemini-powered AI features:

**Attendee AI Assistant**
Every attendee can ask the AI assistant natural language questions about
the event. The assistant receives live zone density data as context and
generates specific, actionable responses. Example:

> "Where should I go to avoid crowds right now?"
> → "Head to Gate D — it's at 34% capacity with a 2-minute wait.
>    Food Court is at 91% so grab food after the match."

**Operations AI Alert System**
The admin dashboard has a one-tap AI operations briefing. Gemini analyzes
all live zone data simultaneously and generates a single plain-English
action for operations staff. Example:

> "Deploy two staff members to the Food Court immediately.
>    Density has hit 91% — redirect incoming crowd to North Stand."

Both features use `gemini-1.5-flash` via the official
`@google/generative-ai` SDK connected through a secure Express backend
that keeps the API key server-side and never exposed to the client.

### MongoDB Atlas on Google Cloud
The database layer runs on MongoDB Atlas deployed on Google Cloud
infrastructure (GCP backend). All messages, incident reports, and zone
data are persisted here with Mongoose ODM on the Node.js backend.

### Google Cloud Artifact Registry
Docker images are built and stored in Google Cloud Artifact Registry
during the Cloud Run `--source` deployment pipeline. The build process
uses Cloud Build under the hood — fully managed, no local Docker daemon
required.

---

## Features

### Attendee Experience
- **Live Crowd Map** — Real-time zone density visualization with color-coded
  heat indicators across 8 stadium zones
- **Google Maps Venue Navigator** — Interactive map with 9 filterable layers,
  3 floor levels, and full-text search across all venue facilities
- **AI Assistant** — Gemini-powered natural language assistant with live
  zone context
- **Live Chat** — Real-time stadium-wide chat with automatic profanity
  filtering
- **SOS Emergency** — One-tap emergency report that instantly creates a
  HIGH severity incident in the operations database
- **Floor-by-Floor Navigation** — Level 1, 2, and 3 facility maps

### Operations Dashboard (Admin)
- **Real-Time KPI Cards** — Total attendees, active alerts, average density,
  peak zone — all updating every 3 seconds
- **Live Stadium Visualization** — SVG stadium map with animated pulse
  rings on critical zones
- **AI Operations Briefing** — One-tap Gemini analysis of all zone data
  with actionable staff directive
- **Incident Reports** — Full CRUD for incident reports stored in MongoDB
- **Staff Communication** — Admin broadcast channel with role-based message
  display
- **Alert Management** — Real-time alert feed with severity classification

### Platform
- Role switcher between Attendee and Admin views
- Mobile-first responsive design optimized for in-stadium use
- Dark/light mode support
- Real-time polling with 3-5 second refresh intervals
- Automatic profanity filtering on all chat messages

---

## Architecture
┌─────────────────────────────────────────────────────┐
│                   Google Cloud Run                   │
│                                                     │
│  ┌─────────────────┐      ┌─────────────────────┐  │
│  │  Next.js 16     │      │   Express.js API     │  │
│  │  Frontend       │─────▶│   Backend            │  │
│  │  Port 3000      │      │   Port 3001          │  │
│  └─────────────────┘      └──────────┬──────────┘  │
│                                       │              │
└───────────────────────────────────────┼──────────────┘
│
┌───────────────────┼───────────────┐
│                   │               │
▼                   ▼               ▼
MongoDB Atlas        Google Gemini    Google Maps
(Google Cloud)       1.5 Flash API    JavaScript API
(AI Studio)

---

## Project Structure
APL1/
├── frontend/                          # Next.js 16 app
│   ├── app/
│   │   ├── page.tsx                   # Root page with role switcher
│   │   ├── layout.tsx                 # Root layout
│   │   └── api/
│   │       ├── densities/route.ts     # Zone density proxy
│   │       └── alerts/route.ts        # Alerts proxy
│   ├── components/
│   │   ├── tabs/
│   │   │   └── VenueMap.tsx           # Google Maps venue navigator
│   │   ├── attendee-dashboard.tsx     # Attendee view
│   │   ├── admin-dashboard.tsx        # Operations view
│   │   ├── stadium-map.tsx            # SVG live crowd map
│   │   ├── tab-navigation.tsx         # Bottom nav bar
│   │   └── role-switcher.tsx          # Attendee/Admin toggle
│   ├── lib/
│   │   └── api.ts                     # Typed API client
│   ├── Dockerfile                     # Cloud Run container
│   └── next.config.ts                 # Standalone output config
│
├── backend/                           # Express.js API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── gemini.js              # Gemini AI endpoints
│   │   │   ├── messages.js            # Chat with profanity filter
│   │   │   ├── reports.js             # Incident reports
│   │   │   └── zones.js               # Zone and match data
│   │   ├── models/
│   │   │   ├── Message.js             # Chat message schema
│   │   │   ├── Report.js              # Incident report schema
│   │   │   └── Zone.js                # Zone data schema
│   │   └── db/
│   │       └── connect.js             # MongoDB Atlas connection
│   ├── index.js                       # Express app entry point
│   └── Dockerfile                     # Cloud Run container

---

## API Reference

### Zone Data
GET  /api/zones          Returns all zone density and wait time data
GET  /api/alerts         Returns active venue alerts
GET  /api/match          Returns current match metadata

### Chat
GET  /api/messages       Returns all messages sorted by time
POST /api/messages       Send a message (auto profanity filtered)
Body: { senderName, senderRole, text }

### Incidents
POST /api/report         Submit an incident report
GET  /api/reports        Returns all reports sorted newest first
Body: { type, severity, location, description }

### Gemini AI
POST /api/nudge          Returns AI tip for attendees based on live zones
POST /api/ops-alert      Returns AI ops directive based on live zones
Body: { zones: Zone[] }

---

## Local Development

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Google AI Studio API key (free at aistudio.google.com)
- Google Maps API key (Google Cloud Console)

### Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in MONGODB_URI and GEMINI_API_KEY in .env
node index.js
```

### Frontend Setup
```bash
cd frontend
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_GOOGLE_MAPS_API_KEY and NEXT_PUBLIC_BACKEND_URL
npm install
npm run dev
```

App runs at `http://localhost:3000`
API runs at `http://localhost:3001`

---

## Deployment on Google Cloud Run

### Prerequisites
```bash
# Install Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### Deploy Backend
```bash
cd backend
gcloud run deploy arenaiq-backend \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 3001 \
  --set-env-vars MONGODB_URI="your_uri",GEMINI_API_KEY="your_key"
```

### Deploy Frontend
```bash
cd frontend
gcloud run deploy arenaiq-frontend \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars NEXT_PUBLIC_BACKEND_URL="https://your-backend.run.app",NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_key"
```

---

## Environment Variables

### Backend
| Variable | Description |
|---|---|
| MONGODB_URI | MongoDB Atlas connection string |
| GEMINI_API_KEY | Google AI Studio API key |

### Frontend
| Variable | Description |
|---|---|
| NEXT_PUBLIC_BACKEND_URL | Deployed backend Cloud Run URL |
| NEXT_PUBLIC_GOOGLE_MAPS_API_KEY | Google Maps JavaScript API key |

---

## Google Cloud Services Used

| Service | Purpose | Free Tier |
|---|---|---|
| Cloud Run | Host frontend and backend containers | 2M requests/month |
| Cloud Build | Build Docker images on deploy | 120 min/day |
| Artifact Registry | Store container images | 0.5 GB free |
| Maps JavaScript API | Interactive venue map | $200 credit/month |
| Gemini 1.5 Flash | AI assistant and ops alerts | Free via AI Studio |
| MongoDB Atlas (GCP) | Database for messages and reports | 512 MB free |

Total infrastructure cost for a hackathon demo: $0

---

## Built With

- **Next.js 16** — React framework with App Router
- **TypeScript** — Full type safety across frontend
- **Tailwind CSS** — Utility-first styling
- **Express.js** — Lightweight Node.js API server
- **Mongoose** — MongoDB object modeling
- **Google Maps JS API** — Interactive maps via @googlemaps/js-api-loader
- **Google Gemini 1.5 Flash** — AI via @google/generative-ai
- **Google Cloud Run** — Serverless container deployment
- **MongoDB Atlas** — Cloud database on Google Cloud
