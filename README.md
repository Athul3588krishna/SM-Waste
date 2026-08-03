# 🌐 EcoClean - Next-Gen AI Powered Smart Waste Management Portal

EcoClean is a state-of-the-art, full-stack smart waste reporting and municipal management platform. It connects citizens, municipal administrators, and sanitation workers in real time using 3D WebGL spherical visualization, interactive geospatial mapping, simulated AI waste category scanning, and gamified eco-rewards.

---

## ✨ Features & Capabilities

### 🌐 3D Interactive WebGL Globe & Geospatial Intelligence
- **Three.js 3D Curved Globe**: Features real-time 3D spherical pitch & yaw controls, atmosphere glow shaders, smooth momentum continuous rotation physics, and 60 FPS animation loops.
- **Projected 3D Location Markers**: Live badges and clickable pins mapped onto real geographic coordinates on the 3D canvas.
- **Leaflet Geospatial Mapping**: Precision coordinate selection for reporting garbage dumps on interactive OpenStreetMap views.

### 👤 Citizen Workspace & AI Scanning
- **Simulated AI Waste Scanner**: Uploading complaint photos triggers a live visual scanning line overlay predicting waste categories (*Plastic*, *Organic*, *Hazardous*, *E-waste*) and severity levels (*Low/Medium/High*).
- **Gamification & Eco-Points**: Earn 50 Eco-Points per verified cleanup, climbing tiers from *Novice Reporter* up to *Eco Warrior*.
- **Resolution Timelines**: Transparent side-by-side Before/After image verification.

### 🛡️ Admin Control Console & Analytics
- **Live Incident Hotspots**: Real-time status color coding (Pending, Assigned, Completed).
- **Recharts Analytics Dashboard**: In-depth visualization of complaint ingestion, waste type distributions, and worker efficiency rankings.
- **Incident Ledger & Dispatch**: Verify, reject, or assign incidents directly to field sanitation workers.

### 👷 Field Sanitation Worker Hub
- **Active Job Sheet**: View assigned municipal cleanup locations.
- **Cleanup Verification**: Upload "after-cleaning" proof photos to resolve complaints and trigger automated reporter rewards.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Three.js, React-Leaflet, Recharts, Lucide Icons, Custom Glassmorphism CSS |
| **Backend** | Node.js, Express.js, Multer (File Storage), Memory Rate Limiter, Error Middleware |
| **Database** | MongoDB & Mongoose ORM |
| **Authentication** | JSON Web Tokens (JWT) & Bcrypt Password Hashing |

---

## 📂 Project Structure

```text
smart-waste-management/
├── backend/
│   ├── config/             # DB Connection Config
│   ├── middleware/         # Auth, Error Handler, Request Logger, Rate Limiter
│   ├── models/             # Mongoose Schemas (User, Complaint)
│   ├── routes/             # Express API Routes (Auth, Complaints, Admin, Worker)
│   ├── uploads/            # Local static image storage fallback
│   ├── index.js            # Express server entry point
│   ├── seed.js             # DB Seeder Script
│   └── .env.example        # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── components/     # InteractiveGlobe (Three.js), EcoCursor, EcoPointCounter, StatusBadge
│   │   ├── context/        # Global AuthContext state
│   │   ├── pages/          # Home, Citizen, Admin, Worker, Login, Details screens
│   │   ├── utils/          # Axios interceptors, constants, formatters, audio feedback
│   │   ├── App.jsx         # SPA Router configuration
│   │   └── index.css       # Custom Glassmorphism dark design system
│   └── .env.example        # Frontend environment variables template
│
└── docs/                   # Platform Documentation
    ├── API_ENDPOINTS.md    # REST API Specification
    ├── ARCHITECTURE.md     # System Architecture & Data Flow
    └── DEPLOYMENT.md       # Production Deployment Guide
```

---

## 🚀 Setup & Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally on `mongodb://localhost:27017/smart-waste` or a MongoDB Atlas URI

### 1. Configure & Seed Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```
*(Backend runs on `http://localhost:5000`)*

### 2. Configure & Launch Frontend

Open a new terminal window:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
*(Frontend runs on `http://localhost:5173`)*

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@waste.com` | `admin123` | Control panel, incident verification, worker dispatch, analytics |
| **Worker** | `worker1@waste.com` | `worker123` | Assigned job sheet, completion photo upload |
| **Citizen** | *(Register via UI)* | *(Custom)* | Report incidents, track cleanup timeline, earn points |

---

## 📄 Documentation Links
- [API Endpoints Specification](docs/API_ENDPOINTS.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)
