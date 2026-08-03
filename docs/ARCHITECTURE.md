# EcoClean System Architecture & Data Flow Guide

EcoClean follows a decoupled Client-Server architecture with RESTful services and real-time Socket.io bi-directional communications for live map updates.

---

## 🏗️ High-Level System Architecture

```
+-------------------------------------------------------------------+
|                        CLIENT LAYER                               |
|                                                                   |
|  +------------------+   +------------------+   +---------------+  |
|  | Citizen Portal   |   | Admin Dashboard  |   | Worker Portal |  |
|  | (React + Maps)   |   | (Analytics/Maps) |   | (Task Hub)    |  |
|  +--------+---------+   +--------+---------+   +-------+-------+  |
+-----------|----------------------|---------------------|----------+
            |                      |                     |
            +----------------------+---------------------+
                                   | HTTP / WebSocket
                                   v
+-------------------------------------------------------------------+
|                        SERVER LAYER                               |
|                                                                   |
|  +-------------------------------------------------------------+  |
|  | Node.js + Express REST API Engine                           |  |
|  |                                                             |  |
|  | - JWT Middleware        - Multer Image Uploader         |  |
|  | - Auth Controller       - Complaint Lifecycle Controller  |  |
|  | - Socket.io Gateway     - DB Seeder Service             |  |
|  +-------------------------------+-----------------------------+  |
+----------------------------------|--------------------------------+
                                   | Mongoose ODM
                                   v
+-------------------------------------------------------------------+
|                       DATA & STORAGE LAYER                        |
|                                                                   |
|  +-----------------------------+   +---------------------------+  |
|  | MongoDB Database            |   | Static Image Storage      |  |
|  | (Users, Complaints Collections) |   | (backend/uploads/)        |  |
|  +-----------------------------+   +---------------------------+  |
+-------------------------------------------------------------------+
```

---

## 🔄 Complaint Lifecycle Flow

1. **Reporting Phase**: Citizen uploads a photo and sets location coordinates on the Leaflet map.
2. **AI Simulation Phase**: The frontend triggers a visual scanning effect and tags predicted waste category and severity level.
3. **Ingestion Phase**: Express server validates the payload, saves the raw photo into `/uploads`, and persists the complaint record in MongoDB with status `Pending`.
4. **Assignment Phase**: Admin reviews complaint hotspots on the administrative dashboard map and assigns a sanitation worker.
5. **Resolution Phase**: Sanitation worker navigates to the target, cleans up the waste, uploads an "after-cleaning" verification photo, and marks the task as `Completed`.
6. **Reward Phase**: The system updates the reporter's account with 50 Eco-Points and recalculates leaderboard standings.
