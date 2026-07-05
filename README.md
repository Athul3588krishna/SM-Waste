# EcoClean - Smart Waste Reporting & Management System

EcoClean is a modern, premium full-stack web application designed to improve public cleanliness by connecting citizens, municipal administrators, and sanitation workers. Citizens can report garbage dumps on an interactive map; administrators review, verify, and assign tasks; and sanitation workers mark tasks as completed by uploading "after-cleaning" verification photos.

---

## 🌟 Key Features

### 👤 Citizen Workspace
- **Interactive Mapping**: Pin exact garbage dump coordinates on an OpenStreetMap using Leaflet.
- **Simulated AI Waste Scanner**: Uploading photos triggers a visual scanning line animation that predicts waste category (*Plastic*, *Organic*, *Hazardous*, *E-waste*) and severity (*Low/Medium/High*).
- **Gamification (Eco-Points)**: Citizens earn 50 Eco-Points for verified cleanups and rank up through badges (from *Novice Reporter* up to *Eco Warrior*).
- **Resolution Timelines**: Track report lifecycles visually with side-by-side Before/After image comparisons.

### 🛡️ Admin Control Panel
- **Real-Time Map Hotspots**: View all active city reports color-coded by status (Pending, Assigned, Completed).
- **Interactive Analytics Panels**: Visual dashboards (built with Recharts) showing report ingestion trends, waste type distribution, and worker performance rankings.
- **Incident Ledger**: Verify, reject, or assign reports to specific workers using dynamic dropdowns.

### 👷 Worker Workspace
- **Jobs Sheet**: View active clean-up assignments.
- **Target Navigation Map**: Highlights targets relative to worker coordinates.
- **Clean-Up Validation**: Upload an "after-cleaning" photo and submit completion status, immediately rewarding the reporter.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, React Router DOM, Leaflet, Recharts, Lucide Icons
- **Backend**: Node.js, Express.js, Multer (File upload handler)
- **Database**: MongoDB & Mongoose
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt password hashing
- **Design System**: Modern Custom Dark-Glassmorphism CSS styling

---

## 🚀 Setup & Installation Instructions

Follow these steps to run the application locally:

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v16+ recommended).
- [MongoDB](https://www.mongodb.com/) server running locally on `localhost:27017` OR a MongoDB Atlas cloud database link.

---

### Step 1: Configure the Backend

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Open the `.env` file and configure your database URI:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/smart-waste
   JWT_SECRET=super_secret_jwt_token_for_smart_waste_management_123456
   ```
   *(Note: Cloudinary keys are optional. If left blank, the backend will automatically save and serve uploaded images locally via a static fallback configuration).*

---

### Step 2: Seed Hardcoded Admin & Worker Accounts

To register the official Admin, sanitation workers, and set up sample reports around Kochi, Kerala, run the seed script:
```bash
npm run seed
```
*(This script clears the database, seeds the administrative and worker accounts, and generates sample before/after images).*

---

### Step 3: Run the Services

#### Start the Backend Server:
Navigate to the `backend/` folder and run:
```bash
npm run dev
```
*(Runs on `http://localhost:5000`)*

#### Start the Frontend Server:
Open a separate terminal window, navigate to the `frontend/` directory, and run:
```bash
npm install
npm run dev
```
*(Runs on `http://localhost:5173` or similar Vite local port)*

---

## 🔑 Login & testing credentials

The login page contains a single secure email/password form. When you log in, the system dynamically checks your database account to load the correct workspace:

| Role | Email | Password | Access Details |
| :--- | :--- | :--- | :--- |
| **Admin (Hardcoded)** | `admin@waste.com` | `admin123` | Manage complaints, assign tasks, view charts. |
| **Worker (Pre-created)** | `worker1@waste.com` | `worker123` | View assigned cleanup targets, upload finished images. |
| **Citizen (Public Signup)**| *(Create via register screen)* | *(Choose password)* | Report waste, view timelines, check points. |

---

## 📂 Project Directory Structure

```
smart-waste-management/
├── backend/
│   ├── config/             # DB Connection Config
│   ├── middleware/         # JWT Auth & Upload Fallback middleware
│   ├── models/             # Mongoose Schemas (User, Complaint)
│   ├── routes/             # Express Route handlers (Auth, Complaints, Admin, Worker)
│   ├── uploads/            # Static serving folder for uploaded images
│   ├── index.js            # Main backend entry point
│   ├── seed.js             # DB Seeder Script
│   └── .env                # Config environment variables
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI Elements (Navbar)
    │   ├── context/        # AuthContext globally managing user state
    │   ├── pages/          # Workspace screens (Citizen, Admin, Worker, Login, Details)
    │   ├── utils/          # Axios interceptors configuration
    │   ├── App.jsx         # SPA Router configuration
    │   ├── index.css       # Dark glassmorphism global CSS theme styles
    │   └── main.jsx        # App bootstrapper
    └── index.html          # Shell (Leaflet stylesheets and Google fonts imports)
```
