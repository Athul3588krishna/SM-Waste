# ECOCLEAN: SMART WASTE REPORTING AND MANAGEMENT SYSTEM
## AGILE SCRUM PLAYBOOK & DOCUMENTATION

---

## 1. INTRODUCTION TO SCRUM IN ECOCLEAN

This document serves as the official **Scrum Playbook** for **EcoClean**, a Smart Waste Reporting and Management System. 

For the development of EcoClean, the **Agile Scrum framework** was chosen to manage the software development life cycle (SDLC). The project requires integrating diverse technologies—such as React.js for the UI, Leaflet.js for interactive geolocated maps, Recharts for administrative analytical charts, and Node.js/Express/MongoDB for the data layer. 

By applying Scrum, we divided the development into time-boxed iterations called **Sprints**, ensuring that functional components were built, reviewed, and improved incrementally.

```
                  [ Product Backlog ]
                           │
                           ▼ (Sprint Planning)
                  [ Sprint Backlog ]
                           │
                           ▼ (2-Week Development Loop)
                   ┌───────────────┐
                   │  Development  │ ◄─── Daily Standup
                   └───────┬───────┘
                           │
                           ▼
                  [ Working Increment ]
                           │
                           ▼ (Sprint Review & Retrospective)
                  [ Feedback / Release ]
```

---

## 2. SCRUM TEAM ROLES

The EcoClean Scrum team is structured with clearly defined roles to ensure accountability, clear communication, and high-quality deliverables.

```
  ┌────────────────────────────────────────────────────────┐
  │                      SCRUM TEAM                        │
  └───────┬───────────────────┬────────────────────┬───────┘
          │                   │                    │
          ▼                   ▼                    ▼
   [ Product Owner ]   [ Scrum Master ]   [ Development Team ]
    - Defines Backlog   - Guides Process   - Writes Code & UI
    - Sets Priorities   - Removes Blocks   - Tests & Deploys
```

### 2.1 Product Owner (PO)
* **Role**: Municipal Representative / Lead Administrator
* **Responsibilities**:
  * Owns, builds, and maintains the Product Backlog.
  * Prioritizes features based on civic and administrative needs (e.g., prioritizing worker allocation algorithms over gamification details).
  * Defines the acceptance criteria for each user story.
  * Inspects and accepts/rejects the working software increment at the end of each sprint.

### 2.2 Scrum Master (SM)
* **Role**: Agile Coach & Facilitator
* **Responsibilities**:
  * Ensures the Scrum team adheres to Scrum theories, practices, and rules.
  * Facilitates Scrum ceremonies (Sprint Planning, Daily Standups, Sprint Reviews, and Retrospectives).
  * Acts as a shield for the Development Team by removing impediments (e.g., server setup issues, database integration delays).
  * Promotes self-organization and cross-functional work within the team.

### 2.3 Development Team
* **Role**: Cross-functional Engineers (e.g., Full-Stack Developer: Athul Krishna R)
* **Responsibilities**:
  * Designs user interfaces (glassmorphic dark UI) and maps components.
  * Implements database collections (MongoDB schemas) and Express APIs.
  * Estimates backlog items using **Story Points** (Fibonacci scale).
  * Delivers a potentially releasable product increment at the end of every sprint.
  * Monitors code quality and conducts unit/integration testing.

---

## 3. PRODUCT BACKLOG

The Product Backlog is a dynamic repository of user stories, features, and technical tasks required to complete the EcoClean platform. Items are categorized by **Epics** and estimated in **Story Points (SP)**.

### Epic 1: Identity & Access Management (IAM)
* **User Story 1.1: User Registration**
  * **As a** Citizen,
  * **I want to** register an account with my name, email, and password,
  * **So that** I can access my personalized dashboard and report waste dumps.
  * **Acceptance Criteria**:
    * Password must be hashed using bcrypt.
    * Email must be unique and validate standard formats.
    * Status code `201 Created` must be returned with a payload confirmation on success.
  * **Estimate**: 3 SP

* **User Story 1.2: Unified Secure Login**
  * **As a** Registered User (Citizen, Admin, or Worker),
  * **I want to** log in with my email and password,
  * **So that** I can be dynamically redirected to my respective role-based dashboard.
  * **Acceptance Criteria**:
    * Generates a secure JSON Web Token (JWT) on success.
    * Invalid logins must return a `401 Unauthorized` status with error explanation.
    * Frontend must store the token in local storage and use Axios request interceptors to auto-attach it.
  * **Estimate**: 3 SP

---

### Epic 2: Citizen Geospatial Reporting (CGR)
* **User Story 2.1: Geolocation Pinning on Interactive Map**
  * **As a** Citizen,
  * **I want to** drop a pin on an interactive map,
  * **So that** I can specify the exact latitude and longitude of a waste dump.
  * **Acceptance Criteria**:
    * Integrate Leaflet Map loaded with OpenStreetMap tiles.
    * Users can drag the marker to adjust coordinates.
    * Coordinates are automatically loaded into the report form submission fields.
  * **Estimate**: 5 SP

* **User Story 2.2: Photo Upload & AI Scan Simulation**
  * **As a** Citizen,
  * **I want to** upload a photo of the waste and see an AI scan analysis,
  * **So that** the system can automatically estimate the waste type and severity.
  * **Acceptance Criteria**:
    * File upload handles image files via Multer middleware.
    * Ingestion triggers a sliding green scanning animation overlay.
    * AI scanning simulation labels the waste (e.g., Plastic, Organic) and severity (Low/Medium/High).
  * **Estimate**: 5 SP

* **User Story 2.3: Gamification (Eco-Points & Tiers)**
  * **As a** Active Citizen,
  * **I want to** earn Eco-Points and rank badges for completed cleanups,
  * **So that** I feel motivated to keep reporting sanitation concerns in my neighborhood.
  * **Acceptance Criteria**:
    * Points increase by 50 when the assigned worker completes the cleanup and the admin verifies it.
    * User tier dynamically promotes from "Novice Reporter" to "Eco Warrior" based on point milestones.
  * **Estimate**: 3 SP

---

### Epic 3: Admin Control & Assignment (ACA)
* **User Story 3.1: Live Incident Map Dashboard**
  * **As a** Municipal Administrator,
  * **I want to** view all reported waste dumps on a map color-coded by status,
  * **So that** I can monitor active incidents across the city.
  * **Acceptance Criteria**:
    * Pending incidents marked in red, Assigned in yellow/orange, and Completed in green.
    * Clicking a marker opens a popup displaying before/after photos and incident details.
  * **Estimate**: 5 SP

* **User Story 3.2: Worker Assignment & Deadlines**
  * **As a** Municipal Administrator,
  * **I want to** assign incidents to specific workers or cleaning teams and set target deadlines,
  * **So that** cleanups are scheduled and completed on time.
  * **Acceptance Criteria**:
    * Admin detail view contains a dropdown displaying online sanitation workers or teams.
    * Submitting the assignment changes the ticket status to `assigned` and sets `deadlineAt`.
  * **Estimate**: 3 SP

* **User Story 3.3: Analytics Dashboard**
  * **As a** Municipal Administrator,
  * **I want to** view charts of waste category distribution and monthly incident ingestion trends,
  * **So that** I can optimize city cleaning strategies.
  * **Acceptance Criteria**:
    * Recharts bar/pie charts display dynamic aggregations from the database.
    * Renders metrics such as the most common waste type and average resolution time.
  * **Estimate**: 5 SP

---

### Epic 4: Worker Job Sheets & Proof of Work (WJS)
* **User Story 4.1: Mobile-Responsive Job Sheet**
  * **As a** Sanitation Worker,
  * **I want to** view my assigned tasks sorted by deadline and severity,
  * **So that** I can plan my cleanup routes for the day.
  * **Acceptance Criteria**:
    * Mobile-responsive interface displaying task card layouts.
    * Includes quick links to open map directions.
  * **Estimate**: 5 SP

* **User Story 4.2: Photo-Verified Clean-Up Submission**
  * **As a** Sanitation Worker,
  * **I want to** upload a photo of the cleaned site to submit my task,
  * **So that** I can prove the work is completed without manual paperwork.
  * **Acceptance Criteria**:
    * Worker uploads the "after-cleaning" photo.
    * Submission changes status to `cleaned`, awaiting admin approval.
  * **Estimate**: 5 SP

---

## 4. SPRINT LIFE-CYCLE & BACKLOGS

The project development was divided into 4 consecutive 2-week sprints.

### 📅 Sprint 1: Foundation, DB, & Auth Setup
* **Sprint Goal**: Set up the database, server infrastructure, and unified JWT authentication.
* **Sprint Backlog**:
  * MongoDB database configuration (`db.js`) - **2 SP**
  * Express MVC structure and error handling - **2 SP**
  * Mongoose Schemas (User, Complaint, Team, Otp) - **5 SP**
  * Registration & Hashed Password Login API - **3 SP**
  * AuthContext and JWT storage on Frontend - **3 SP**
  * User Register/Login Glassmorphic Pages - **3 SP**
* **Total Points**: 18 SP
* **Sprint Outcome**: Working backend APIs for authentication and local token routing setup on the client React app.

---

### 📅 Sprint 2: Citizen Portal & Interactive Mapping
* **Sprint Goal**: Develop Leaflet mapping, geo-reporting, and the simulated AI image scanner.
* **Sprint Backlog**:
  * Leaflet map integration & GPS tracking on Citizen page - **5 SP**
  * Multer backend configuration for before-photo upload - **3 SP**
  * Citizen Waste Reporting form & API routing - **5 SP**
  * AI green line scanning visual animation simulation - **3 SP**
  * Citizen Profile page displaying Eco-Points & Badges - **3 SP**
* **Total Points**: 19 SP
* **Sprint Outcome**: Citizens can drop map pins, upload files, trigger scanner animations, and submit geolocated complaints.

---

### 📅 Sprint 3: Admin Control Panel & Data Visualizations
* **Sprint Goal**: Build the Admin control map, worker selection API, and Recharts analytics dashboard.
* **Sprint Backlog**:
  * Admin Live Hotspot Map with status-colored Leaflet pins - **5 SP**
  * Admin Complaint Detail page & Worker Assign API - **3 SP**
  * Recharts integration for waste categories & monthly reports - **5 SP**
  * Mongoose Aggregation pipelines for admin stats API - **3 SP**
  * Team creation & management dashboard - **3 SP**
* **Total Points**: 19 SP
* **Sprint Outcome**: Admins can view metrics, verify reports, and assign tasks to workers/teams.

---

### 📅 Sprint 4: Worker Workspace & Verification Loops
* **Sprint Goal**: Build mobile job sheets, after-cleaning uploads, points allocation, and end-to-end testing.
* **Sprint Backlog**:
  * Worker Dashboard task cards & directions map - **5 SP**
  * Upload validation photo API & status change to `cleaned` - **5 SP**
  * Admin approval/reject routes & citizen points incrementer - **3 SP**
  * Seed database script (`seed.js`) with Kochi mock coordinates - **2 SP**
  * Automated Unit/Integration tests and validation checks - **3 SP**
* **Total Points**: 18 SP
* **Sprint Outcome**: Complete system workflow allowing citizens to submit complaints, workers to resolve tasks, and admins to close tickets.

---

## 5. SCRUM CEREMONIES

To ensure progress was transparent and blockers were addressed quickly, four primary Scrum ceremonies were performed:

```
  ┌────────────────────────────────────────────────────────┐
  │                    SCRUM CEREMONIES                    │
  └───────┬───────────────────┬────────────────────┬───────┘
          │                   │                    │
          ▼                   ▼                    ▼
   [ Sprint Planning ]  [ Daily Standup ]   [ Review & Retro ]
    - Scope Definition   - 15-Min Syncup     - Demo Increment
    - Commit Backlog     - Block Removal     - Continuous Imp.
```

### 5.1 Sprint Planning
* **When**: Held at the beginning of each 2-week Sprint.
* **Inputs**: Product Backlog, Velocity of previous sprints.
* **Activity**:
  * Product Owner presents the highest-priority backlog items.
  * Development team breaks user stories down into tasks.
  * Estimates are locked, and the team commits to the **Sprint Goal**.

### 5.2 Daily Standup (Daily Scrum)
* **When**: Daily, 15 minutes, held in front of the Scrum board.
* **Questions Answered**:
  1. *What did I accomplish since the last standup?* (e.g., completed Leaflet marker dragging logic).
  2. *What will I work on today?* (e.g., designing the upload button styling).
  3. *Are there any impediments or blockers?* (e.g., Leaflet CSS styles not importing correctly in index.html).

### 5.3 Sprint Review
* **When**: Held at the end of each Sprint.
* **Activity**:
  * The development team demonstrates the working increment (e.g., registering a new citizen, uploading a photo, showing the AI scan animation).
  * Product Owner reviews outcomes against the acceptance criteria to accept or reject stories.
  * Stakeholders provide feedback to shape future sprint planning.

### 5.4 Sprint Retrospective
* **When**: Held after the Sprint Review, before the next Sprint Planning.
* **Activity**: The team discusses:
  * *What went well?* (e.g., custom dark-glassmorphism theme looks modern and premium).
  * *What could be improved?* (e.g., mock seeding coordinates around Kochi took too much manual data entry).
  * *Action items*: Create a generator script for coordinates in future test builds.

---

## 6. AGILE METRICS & QUALITY CONTROLS

### 6.1 Definition of Done (DoD)
A User Story is marked as **Done** only when it meets the following checklist:
- [x] Code is clean, documented, and matches the project's styling.
- [x] All Mongoose schema validations pass.
- [x] Backend routes are protected by JWT auth where required.
- [x] Axios error boundaries capture API failures gracefully.
- [x] Manual user scenarios (UAT checks) are completed.
- [x] Code builds without compilation warnings (e.g., React build compiles).

### 6.2 Team Velocity & Burn-down Simulation
Below is the burn-down representation showing actual vs. planned Story Points completion across a typical sprint cycle (Sprint 2 mapping):

| Day of Sprint | Planned Remaining (SP) | Actual Remaining (SP) |
| :--- | :--- | :--- |
| Day 1 (Planning) | 19 | 19 |
| Day 3 | 16 | 16 |
| Day 5 | 12 | 13 |
| Day 7 (Midway) | 9 | 9 |
| Day 9 | 6 | 5 |
| Day 12 | 2 | 2 |
| Day 14 (Review) | 0 | 0 |

---
*End of Agile Scrum Playbook.*
