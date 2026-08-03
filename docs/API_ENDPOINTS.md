# EcoClean API Specification & Endpoints Guide

The EcoClean backend is built with Express.js, Node.js, and MongoDB. It exposes JSON REST endpoints for user authentication, report management, admin controls, and worker task completion.

---

## 🔐 Base URL
`http://localhost:5000/api`

---

## 🔑 Authentication Endpoints (`/api/auth`)

### 1. Register Citizen Account
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "phone": "9876543210"
  }
  ```

### 2. Login User
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "admin@waste.com",
    "password": "admin123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "id": "64f1a2b3c4...",
      "name": "Admin User",
      "email": "admin@waste.com",
      "role": "admin"
    }
  }
  ```

---

## 🗑️ Waste Complaints Endpoints (`/api/complaints`)

### 1. Create Garbage Report
- **Endpoint**: `POST /api/complaints`
- **Access**: Citizen (JWT Protected)
- **Headers**: `Authorization: Bearer <token>`
- **Form Data**:
  - `category`: `Plastic` | `Organic` | `Hazardous` | `E-waste`
  - `address`: `MG Road, Kochi, Kerala`
  - `latitude`: `9.9312`
  - `longitude`: `76.2673`
  - `image`: `(file payload)`

### 2. Get User's Reported Complaints
- **Endpoint**: `GET /api/complaints/my-reports`
- **Access**: Citizen (JWT Protected)

---

## 🛡️ Admin Endpoints (`/api/admin`)

### 1. Get All Reports
- **Endpoint**: `GET /api/admin/complaints`
- **Access**: Admin Only

### 2. Assign Report to Sanitation Worker
- **Endpoint**: `PUT /api/admin/assign/:id`
- **Access**: Admin Only
- **Body**:
  ```json
  {
    "workerId": "64f1a2b3c4..."
  }
  ```

---

## 👷 Worker Endpoints (`/api/worker`)

### 1. Get Assigned Cleanup Tasks
- **Endpoint**: `GET /api/worker/tasks`
- **Access**: Worker Only

### 2. Complete Task & Upload Cleaned Image
- **Endpoint**: `PUT /api/worker/complete/:id`
- **Access**: Worker Only
- **Form Data**:
  - `afterImage`: `(file payload)`
