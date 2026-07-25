# ECOUNIT / ECOCLEAN: SMART WASTE REPORTING AND MANAGEMENT SYSTEM
## SCRUM BOOK: SUBMISSION - 1

---

### **STUDENT PROFILE**
* **Name of Student**: ATHUL KRISHNA R
* **Register Number**: MEA24MCA-XXXX
* **Course & Batch**: Master of Computer Applications (MCA)
* **Semester**: S3
* **Department**: Department of Computer Applications
* **College**: MEA Engineering College, Perinthalmanna

### **EVALUATION PROFILE**
* **Submission Date**: 29/07/2026
* **Project Guide**: Ms. Prajina K (Assistant Professor)
* **Project Co-ordinator**: Mrs. Sruti Sudevan (HOD & Assistant Professor)

---

### **EVALUATION & SIGNATURE SHEET**

| Evaluation Criterion | Maximum Marks | Marks Awarded | Remarks |
| :--- | :---: | :---: | :--- |
| **Abstract & Understanding** | 5 | | |
| **Problem Statement (System Analysis)** | 5 | | |
| **Module Description** | 5 | | |
| **Feasibility Study (6 Types)** | 5 | | |
| **Total Marks** | **20** | | |

<br><br>

**Signature of Project Guide:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
**Date of Evaluation:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---
---

## 1. PROJECT ABSTRACT

The rapid growth of urban areas has led to a significant increase in municipal solid waste generation, presenting a major challenge for local administrations. Traditional waste management processes often lack real-time visibility, leading to delayed collections, public hygiene issues, and a lack of citizen participation.

This project presents **EcoClean**, a modern full-stack web application designed to bridge the gap between citizens, municipal administrators, and sanitation workers. Citizens can register securely via **Email OTP verification** and report garbage dumps on an interactive map using geographic coordinates. The system implements a **Gemini AI Vision scanner** (with smart local keyword/hash fallbacks) that analyzes uploaded photos to predict waste category (*Plastic*, *Organic*, *Hazardous*, *E-waste*, *Medical*) and severity level. To incentivize citizen involvement, a gamification model awards "Eco-Points" and virtual badges (from *Novice Reporter* up to *Green Champion*) for verified cleanups. Citizens can also redeem points for municipal discount vouchers and query **EcoBot**, a friendly AI sanitation helper widget.

Administrators monitor active city reports via a real-time dark-glassmorphic control panel. They verify reports and assign tasks to individual sanitation workers or cleaning teams using interactive maps, deadline schedulers, and statistical dashboards built with Recharts. Sanitation workers access a mobile-optimized workspace showing their active targets. Workers upload "after-cleaning" verification photos to mark tasks as completed, triggering automated points reward, leaderboards update, and citizen feedback loops.

Built using the MERN stack (**MongoDB, Express.js, React.js, Node.js**) and styled with custom modern dark-glassmorphic styling, EcoClean demonstrates how community-driven reporting, real-time administration, and gamification can digitalize and optimize municipal sanitation workflows.

---

## 2. PROBLEM STATEMENT (SYSTEM ANALYSIS)

### 2.1 Existing System & Disadvantages
In existing municipal waste management:
- Reports are made via landline telephone complaints or written emails, which suffer from slow processing times and manual logging.
- Lack of geographic tracking (GPS coordinates) makes it difficult for cleanup trucks to locate dumps in complex street networks.
- Citizens receive no confirmation or update regarding report status.
- Sanitation departments lack structural tools to balance and track worker task loads.

**Disadvantages:**
- High latency between reporting and resolving.
- High rate of duplicate or falsified reports.
- Poor resource allocation and accountability.
- Low public interest and community participation.

### 2.2 Proposed System & Advantages
The proposed **EcoClean** system provides a web-based portal mapping reports, tasks, and achievements.
- **Geographic Pinpointing**: Citizens drop pins on an OpenStreetMap interface, recording precise coordinates.
- **AI Image Scanner**: Real Gemini API Vision integration validates images, assessing severity and type.
- **Visual Accountability**: Workers must upload a verified "after" photo to close the ticket.
- **Eco-Points & Vouchers**: Citizens receive points, climb leadership tiers, and redeem them for rewards.

**Advantages:**
- Direct, map-driven target location for workers.
- Side-by-side before/after comparison to check worker performance.
- Active community involvement through gamified rewards.
- Analytical charts mapping waste distribution hotspots for planning.

---

## 3. MODULE DESCRIPTION

The system consists of three major functional modules:

### A. Citizen Module
* **Registration & Authentication**: Safe signup, email OTP validation, secure login, and forgot/reset password routes.
* **Report Waste**: Map pinning, description input, and "Before" image upload to create complaints.
* **Gemini AI Scanning**: Vision scanner analyzes images, predicting waste category (Organic, Plastic, E-waste, Medical, Hazardous) and severity.
* **Eco Dashboard & Leaderboard**: View logged reports, active points, badge tier, and citizen ranking leaderboard.
* **Redeem Vouchers**: Allows citizens to redeem earned points for municipal tax discounts and utility vouchers.
* **EcoBot AI Assistant**: Floating chatbot widget answering sorting queries and portal-related guidelines using generative AI.

### B. Admin Module
* **Live Monitoring Map**: Real-time map displaying pending, assigned, and completed reports color-coded by status.
* **Incident Assign Panel**: Assign complaints to specific workers or cleaning teams, and set resolution deadlines.
* **Analytics Panel**: Interactive charts showing waste category distribution, worker performance, and monthly ingestion trends.
* **Announcements**: Broadcast notices to all users, citizens, or sanitation workers.

### C. Worker Module
* **Active Job Sheet**: Mobile-friendly dashboard displaying assigned tasks with deadlines, severity levels, and route directions.
* **Online Status Toggle**: Allows workers to toggle their availability status (online/offline).
* **Validation Upload**: Capture and upload a validation image ("After-cleaning" photo) of the cleaned spot to submit.

---

## 4. FEASIBILITY STUDY

A feasibility study is carried out to check the feasibility of the system from various perspectives, ensuring that the project is beneficial and implementable.

### 4.1 Economical Feasibility
EcoClean is highly cost-effective. It uses open-source software stacks (Node.js, Express, React, MongoDB) that do not require commercial licensing fees. Hosting on standard cloud systems is inexpensive compared to manual logging centers. The reduction in fuel costs achieved by geolocating garbage dumps directly translates into operational savings.

### 4.2 Technical Feasibility
The technologies used represent standard, stable web frameworks. MongoDB handles unstructured complaint schemas, Express and Node serve high-performance JSON endpoints, and React provides a fast single-page app (SPA) interface. Leaflet mapping and Recharts are lightweight and run smoothly on modern web browsers, demonstrating strong technical feasibility.

### 4.3 Operational Feasibility
EcoClean offers user-friendly layouts. Citizens require no training, as mapping interfaces are widely understood. Sanitation workers access a simplified dashboard built for touch interfaces on mobile screens. Admins utilize standard analytics representations, making the platform operationally viable.

### 4.5 Behavioral Feasibility
People are generally resistant to complex reporting structures. By implementing a gamification model with badges and points, the system transforms civic reporting into an engaging habit. Workers receive clear task lists and visual proof of completion, reducing friction between administrators and collection teams.

### 4.5 Software Feasibility
The software components are platform-independent. Users only require a web browser (Chrome, Firefox, Safari) on any operating system (Windows, Android, iOS, macOS) to access the system, ensuring high software adaptability.

### 4.6 Hardware Feasibility
No specialized hardware is required. Citizens and workers use standard mobile phone cameras and GPS chips. Admins access the control panel from standard desktop computers or tablets, making deployment highly feasible.

---
*End of Scrum Book Submission - 1*
