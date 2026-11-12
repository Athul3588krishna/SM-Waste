# EcoClean — Smart Waste Reporting & Management Portal

EcoClean is a full-stack municipal waste reporting, dispatch, and cleanup verification platform. It connects citizens, municipal administrators, and field sanitation workers in real time using interactive geospatial mapping, AI-assisted waste classification, GPS geofence verification, live Socket.IO notifications, Telegram worker dispatch alerts, and gamified Eco-Points rewards.

---

## Features & Capabilities

### Citizen Portal & AI Waste Reporting
- **AI Waste Photo Analysis (`POST /api/complaints/analyze`)**: Analyzes uploaded waste photos using the Google Gemini Vision API (with an automatic keyword/heuristic fallback when `GEMINI_API_KEY` is not configured) to classify waste into *Plastic*, *Organic*, *E-waste*, *Hazardous*, *Medical*, *Paper*, *Mixed*, or *Unknown*, alongside a severity rating (*Low*, *Medium*, *High*) and explanation.
- **Geospatial Incident Reporting**: Select exact dump coordinates on an interactive **Leaflet / OpenStreetMap** map with photo uploads (stored via Cloudinary or local `/uploads` fallback).
- **Email OTP Registration & Password Recovery**: 6-digit OTP verification on signup and password reset via Nodemailer (with a console email simulator fallback when SMTP is unconfigured).
- **Eco-Points, Badges & Leaderboard**: Citizens earn **+50 Eco-Points** per admin-verified cleanup, progressing through badge tiers (*Novice Reporter* → *Eco Cadet* → *Eco Sentinel* → *Eco Warrior*), competing on the leaderboard, and redeeming points.
- **Before/After Verification & Announcements**: Track complaint status transitions (`pending` → `verified` → `assigned` → `in_progress` → `cleaned` → `completed` / `rejected`), view municipal announcements, and inspect before/after cleanup photos.

### Admin Control Console & Analytics
- **Incident Verification & Dispatch**: Verify or reject incoming reports, set cleanup deadlines, and assign or reassign tasks to individual workers or cleaning teams.
- **Worker & Team Management**: Full CRUD management for sanitation workers and multi-member cleaning teams, plus live worker online/duty status monitoring.
- **Cleanup Audit & Incentives**: Review worker-uploaded after-cleanup photos and geofence verification results, approve completions, and award points or bonus amounts.
- **Analytics & Announcements**: Interactive **Recharts** visualizations for complaint status, waste distribution, and operational metrics, plus role-targeted municipal announcements.

### Field Sanitation Worker Hub
- **Availability & Duty Tracking**: Toggle online/offline availability and accept assigned tasks (`assigned` → `in_progress`).
- **GPS Geofence Verification**: Validates live worker GPS coordinates against the reported dump site using the Haversine formula (enforcing a 150m server-side geofence tolerance / 100m UI check) before accepting cleanup proof photos.
- **Telegram Dispatch Alerts**: Sends formatted task dispatch alerts with Google Maps navigation links to sanitation workers via the Telegram Bot API (supporting both online and offline worker dispatch notices).

### Platform Experience
- **Real-Time Updates**: Powered by **Socket.IO** with user-specific (`user_<id>`) and role-based (`admin`, `worker`, `citizen`) rooms for live notifications and dashboard updates.
- **Bilingual UI & Theme Support**: Built-in **English (`en`)** and **Malayalam (`ml`)** translations (`LanguageContext`) and Dark/Light theme switching (`ThemeContext`).

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router 7, React-Leaflet & Leaflet, Recharts, Lucide Icons, Socket.IO Client, Axios |
| **Backend** | Node.js, Express.js, Socket.IO, Multer, Nodemailer, JWT (`jsonwebtoken`), `bcryptjs` |
| **Database** | MongoDB & Mongoose ODM |
| **Integrations** | Google Gemini Vision API, Cloudinary (optional image storage), Telegram Bot API, SMTP Email |

---

## Project Structure

```text
SM-Waste/
├── backend/
│   ├── config/                 # MongoDB connection (db.js)
│   ├── controllers/            # Auth, Complaint, Admin, Worker, Notification logic
│   ├── middleware/             # JWT auth, error handler, rate limiter, request logger, Multer/Cloudinary upload
│   ├── models/                 # Mongoose schemas (User, Complaint, Team, Announcement, Notification, Otp)
│   ├── routes/                 # Express routes (/api/auth, /api/complaints, /api/admin, /api/worker, /api/notifications)
│   ├── uploads/                # Local static image storage fallback
│   ├── utils/                  # Email service, Telegram alert bot, validators, response formatter
│   ├── index.js                # Express + Socket.IO server entry point
│   ├── seed.js                 # Database seeder with demo users, teams, announcements, and complaints
│   └── .env.example            # Backend environment template
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, EcoCreditCard, EcoPointCounter, StatusBadge, ThemeToggle, LanguageToggle, etc.
│   │   ├── context/            # AuthContext, SocketContext, ThemeContext, LanguageContext
│   │   ├── pages/              # Home, Login, Register, CitizenDashboard, AdminDashboard, WorkerDashboard, ReportWaste, ComplaintDetail, Profile
│   │   ├── utils/              # Axios API client, constants, formatters, imageCompressor, translations (en/ml), audioHelper
│   │   ├── App.jsx             # SPA routing, protected routes, and role hash shortcuts (#admin, #worker, #citizen)
│   │   └── index.css           # Global styling and theme variables
│   └── .env.example            # Frontend environment template
│
├── docs/
│   ├── API_ENDPOINTS.md        # REST API endpoint reference
│   ├── ARCHITECTURE.md         # System architecture and lifecycle flow
│   └── DEPLOYMENT.md           # Production deployment checklist
│
├── CONTRIBUTING.md             # Contribution guidelines
└── README.md
```

---

## Setup & Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally (`mongodb://localhost:27017/smart-waste`) or a MongoDB Atlas connection string

### 1. Configure & Seed Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update `backend/.env` with your MongoDB URI and JWT secret (and any optional integrations). Then seed sample data and start the server:

```bash
npm run seed
npm run dev
```

*(With `PORT=5000` in `.env`, the backend runs on `http://localhost:5000`; `index.js` falls back to port `5002` if `PORT` is unset.)*

### 2. Configure & Launch Frontend

Open a new terminal window:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

*(The frontend runs on `http://localhost:5173` and connects to `VITE_API_URL` from `frontend/.env`.)*

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Required | Description |
| :--- | :--- | :--- |
| `PORT` | No | Server port (`5000` in `.env.example`, defaults to `5002` in `index.js`) |
| `MONGO_URI` | Yes | MongoDB connection URI |
| `JWT_SECRET` | Yes | Secret key used to sign JWT tokens |
| `GEMINI_API_KEY` | No | Google Gemini API key for AI waste photo classification (falls back to filename heuristic if omitted) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | No | Cloudinary credentials for cloud image hosting (falls back to `backend/uploads/` if omitted) |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | No | Telegram bot token and default chat ID for worker dispatch alerts |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL` | No | SMTP settings for OTP and resolution emails (logs to console if omitted) |
| `FRONTEND_URL` | No | Base URL used in Telegram portal links (defaults to `http://localhost:5173/worker`) |

### Frontend (`frontend/.env`)
| Variable | Required | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | Yes | Backend API base URL (e.g. `http://localhost:5000`) |

---

## Demo Credentials (`npm run seed`)

| Role | Email | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@waste.com` | `admin123` | Verify complaints, manage workers/teams, dispatch tasks, view analytics |
| **Worker** | `worker1@waste.com` | `worker123` | Online worker (`Anil Kumar`) — also `worker2@waste.com` (online) & `worker3@waste.com` (offline) |
| **Citizen** | `citizen@waste.com` | `citizen123` | Seeded citizen (`Adarsh Nair`, 100 pts) — also `citizen2@waste.com` / `citizen123` |

---

## Documentation Links
- [API Endpoints Specification](docs/API_ENDPOINTS.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)
