# Production Deployment & Environment Guide

This document outlines deployment procedures for host environments like Render, Vercel, Railway, or AWS EC2.

---

## 🌐 1. Backend Deployment (Render / Railway / Node Server)

1. **Environment Variables Config**:
   Set the following variables in your hosting dashboard:
   - `PORT`: `5000` (or dynamic host port)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas cluster connection string
   - `JWT_SECRET`: A strong 64-character secret key

2. **Build & Start Commands**:
   - Build Command: `npm install`
   - Start Command: `npm start`

---

## 🎨 2. Frontend Deployment (Vercel / Netlify / Cloudflare Pages)

1. **Root Directory**: Select `frontend/` as the project root.
2. **Framework Preset**: `Vite`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: Your deployed backend production domain (e.g. `https://ecoclean-api.onrender.com`)

---

## 🔒 3. Security Check List
- Ensure `CORS` is restricted to your production frontend domain.
- Use HTTPS for both API and frontend clients.
- Verify environment variables are secret and not checked into source control.
