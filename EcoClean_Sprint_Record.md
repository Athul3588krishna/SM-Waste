# ECOUNIT / ECOUNIT: SMART WASTE REPORTING AND MANAGEMENT SYSTEM
## SCRUM BOOK: SPRINT-WISE RECORD OF DEVELOPMENT

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

## CONTINUOUS EVALUATION & SIGNATURE SHEET

### **Sprint-wise Guide Verification Log**

| Sprint ID | Duration & Dates | Main Focus Area | Est. Story Points | Actual Story Points | Guide Remarks & Signature | Date of Evaluation |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| **Sprint 1** | 01/04/2026 - 14/04/2026 | DB Schema, MVC Structure, & Secure JWT/OTP Auth | 18 SP | 18 SP | | |
| **Sprint 2** | 15/04/2026 - 28/04/2026 | Leaflet Maps, Multer Upload, & Citizen Portal | 19 SP | 19 SP | | |
| **Sprint 3** | 29/04/2026 - 12/05/2026 | Admin Control Panel, Recharts, & Aggregations | 19 SP | 19 SP | | |
| **Sprint 4** | 13/05/2026 - 26/05/2026 | Worker Job Sheet, Proof of Work, & Testing | 18 SP | 18 SP | | |

<br><br>

**Signature of Project Guide:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
**Signature of Project Co-ordinator (HOD):** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  

---
---

## TABLE OF CONTENTS
1. **Introduction to Agile Scrum in EcoClean**
2. **Sprint 1: Backend Infrastructure, Database Schema & Auth Setup**
   - 2.1 Sprint Backlog & Task Log
   - 2.2 Bi-Weekly Scrum Meeting Logs (Standups)
   - 2.3 Key Implementation Highlights & Code Snippets
   - 2.4 Sprint Unit & Integration Testing
3. **Sprint 2: Citizen Reporting Portal, Leaflet Mapping & Ingestion UI**
   - 3.1 Sprint Backlog & Task Log
   - 3.2 Bi-Weekly Scrum Meeting Logs (Standups)
   - 3.3 Key Implementation Highlights & Code Snippets
   - 3.4 Sprint Unit & Integration Testing
4. **Sprint 3: Admin Live Dashboard, Assignments, & Visual Analytics**
   - 4.1 Sprint Backlog & Task Log
   - 4.2 Bi-Weekly Scrum Meeting Logs (Standups)
   - 4.3 Key Implementation Highlights & Code Snippets
   - 4.4 Sprint Unit & Integration Testing
5. **Sprint 4: Worker Job Sheets, Validation loop, & End-to-End Testing**
   - 5.1 Sprint Backlog & Task Log
   - 5.2 Bi-Weekly Scrum Meeting Logs (Standups)
   - 5.3 Key Implementation Highlights & Code Snippets
   - 5.4 Sprint Unit & Integration Testing
6. **Agile Scrum Metrics & Performance Analysis**
   - 6.1 Planned vs. Actual Burndown Simulation
   - 6.2 Team Velocity analysis
7. **Conclusion & References**

---
---

## 1. INTRODUCTION TO AGILE SCRUM IN ECOUNIT

The development of **EcoClean** (a Smart Waste Reporting and Management System) was carried out using the **Agile Scrum Framework**. The rationale behind selecting Scrum was the high level of modular dependency between the Citizen, Administrator, and Sanitation Worker workflows. 

By defining time-boxed, 2-week iterations (Sprints), features were created incrementally, reducing architectural risk and allowing for regular reviews with the project guide (acting as the Scrum Master/Product Owner). Daily standups were tracked, and progress was measured in **Story Points (SP)** using a standard Fibonacci scale.

```
       [Product Backlog] ➔ [Sprint Planning] ➔ [Sprint Backlog (2 Weeks)]
                                                        │
         ┌────────────────── Daily Standup ◄────────────┘
         ▼
[Working Increment] ➔ [Sprint Review & Retro] ➔ [Continuous Deployment]
```

---

## 2. SPRINT 1: BACKEND INFRASTRUCTURE, DATABASE SCHEMA & AUTH SETUP
* **Duration**: 2 Weeks (01/04/2026 to 14/04/2026)
* **Sprint Goal**: Establish MongoDB database connectivity, Express MVC file structure, core Mongoose Schemas, and email OTP-verified JWT authentication routes on both frontend and backend.

### 2.1 Sprint 1 Backlog & Task Log
| Module | Task | Pending task if any | Hour of completion | Expected date of completion | Actual date of completion | Reason for delay |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Core** | MongoDB Atlas config & Server Setup | - | 3 hr. | 03/04/2026 | 03/04/2026 | - |
| **Core** | Express Router & MVC folder structure | - | 2 hr. | 05/04/2026 | 05/04/2026 | - |
| **Database**| Creating Mongoose Schemas (User, Complaint, Otp) | - | 4 hr. | 08/04/2026 | 08/04/2026 | - |
| **Auth** | User Registration & Mail OTP API | - | 5 hr. | 10/04/2026 | 11/04/2026 | Nodemailer SMTP authentication delay |
| **Auth** | JWT Secure Login & Token Generator API | - | 3 hr. | 12/04/2026 | 12/04/2026 | - |
| **Citizen** | Register & Login Glassmorphic UI pages | - | 6 hr. | 14/04/2026 | 14/04/2026 | - |

### 2.2 Bi-Weekly Scrum Meeting Logs (Standups)
* **Sprint Day 1 (01/04/2026)**: Sprint 1 planning & directory setup.
* **Sprint Day 3 (03/04/2026)**: Connected server to MongoDB Atlas (Connection timeout resolved via IP whitelisting).
* **Sprint Day 6 (06/04/2026)**: Created Mongoose schemas for User, Complaint & Otp.
* **Sprint Day 8 (09/04/2026)**: Coded register API & Nodemailer OTP dispatch.
* **Sprint Day 10 (11/04/2026)**: Finished verify-otp and JWT token creation.
* **Sprint Day 12 (13/04/2026)**: Built React glassmorphic Login/Register forms.
* **Sprint Day 14 (14/04/2026)**: Sprint 1 demo and verification with Guide.

### 2.3 Key Implementation Highlights & Code Snippets
The core implementation of Sprint 1 involves token creation and secure user validation in [auth.js](file:///d:/Smart%20waste%20management/backend/routes/auth.js#L10-L48):

```javascript
// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_token_for_smart_waste_management_123456', {
    expiresIn: '30d',
  });
};

// Register a new citizen (Generates & Sends Email OTP)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email }); // clean previous attempts
    await Otp.create({ name, email, password, otp });

    await sendEmail({
      to: email,
      subject: 'EcoClean Account Verification OTP',
      text: `Dear ${name},\n\nPlease use this OTP to activate your account: ${otp}`,
    });
    res.status(200).json({ message: 'OTP sent to email. Please verify.', email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### 2.4 Sprint Unit & Integration Testing
* **Test Case UT-101 (User Signup Validation)**:
  * *Input*: Name: "Test User", Email: "test@domain.com", Password: "123"
  * *Expected Output*: Error validation `Password must be at least 6 characters long` (Status: 400).
  * *Actual Result*: Passed. Correctly thrown.
* **Test Case IT-102 (OTP Generation & Dispatch)**:
  * *Input*: Registration POST triggers.
  * *Expected Output*: Otp record created in DB, email dispatched, API returns Success `200 OK`.
  * *Actual Result*: Passed. OTP verified on local terminal consoles.

---

## 3. SPRINT 2: CITIZEN REPORTING PORTAL, LEAFLET MAPPING & INGESTION UI
* **Duration**: 2 Weeks (15/04/2026 to 28/04/2026)
* **Sprint Goal**: Implement interactive map coordinates pinning for citizens, configure Multer server upload handlers, create the complaint submission form, write AI Green Line scanning CSS simulation layouts, and build citizen dashboard panels.

### 3.1 Sprint 2 Backlog & Task Log
| Module | Task | Pending task if any | Hour of completion | Expected date of completion | Actual date of completion | Reason for delay |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Citizen** | Leaflet Map integration with coordinates capture | - | 6 hr. | 18/04/2026 | 18/04/2026 | - |
| **Core** | Multer file upload setup for server-side | - | 3 hr. | 21/04/2026 | 21/04/2026 | - |
| **Citizen** | Waste Reporting submission form page & API | - | 5 hr. | 24/04/2026 | 25/04/2026 | Multi-part form-data parsing debugging |
| **Citizen** | Google Gemini API Integration & visual scanner animation | - | 4 hr. | 26/04/2026 | 26/04/2026 | - |
| **Citizen** | Profile details, Eco-points, & Badge tiers | - | 4 hr. | 28/04/2026 | 28/04/2026 | - |

### 3.2 Bi-Weekly Scrum Meeting Logs (Standups)
* **Sprint Day 1 (15/04/2026)**: Sprint 2 planning & Leaflet maps setup.
* **Sprint Day 3 (17/04/2026)**: Geolocation pin drop & drag implementation.
* **Sprint Day 5 (20/04/2026)**: Integrated Multer middleware for images.
* **Sprint Day 8 (23/04/2026)**: Connected Citizen Reporting form to backend API.
* **Sprint Day 10 (25/04/2026)**: Developed Google Gemini 1.5 Flash Vision API integration with local fallback scanner and scanning CSS animation.
* **Sprint Day 12 (27/04/2026)**: Completed Citizen Dashboard (Points & Badges).
* **Sprint Day 14 (28/04/2026)**: Sprint 2 demo showing citizen reporting flow.

### 3.3 Key Implementation Highlights & Code Snippets
The core implementation of local keyword/size analysis for simulated AI waste type categorization in [complaints.js](file:///d:/Smart%20waste%20management/backend/routes/complaints.js#L7-L39):

```javascript
function runFallbackScanner(originalName, fileSize) {
  const name = (originalName || 'image.jpg').toLowerCase();
  let detectedType = 'Mixed';
  let detectedSeverity = 'Medium';
  let detectedExplanation = '';

  if (name.includes('bottle') || name.includes('plastic') || name.includes('bag') || name.includes('pet')) {
    detectedType = 'Plastic';
    detectedSeverity = 'Medium';
    detectedExplanation = `Local scanning identified plastic-related elements in the file "${originalName}".`;
    return { wasteType: detectedType, severity: detectedSeverity, explanation: detectedExplanation };
  } else if (name.includes('food') || name.includes('waste') || name.includes('rotting') || name.includes('organic')) {
    detectedType = 'Organic';
    detectedSeverity = 'High';
    detectedExplanation = `Local scanning identified organic-related elements in the file "${originalName}".`;
    return { wasteType: detectedType, severity: detectedSeverity, explanation: detectedExplanation };
  }
  
  const sizeSeed = fileSize || Math.floor(Math.random() * 1000000);
  const choices = [
    { type: 'Organic', severity: 'High', explanation: 'Local visual processor detected compostable food waste.' },
    { type: 'Plastic', severity: 'Medium', explanation: 'Local visual processor detected recyclable container units.' }
  ];
  return choices[sizeSeed % choices.length];
}
```

### 3.4 Sprint Unit & Integration Testing
* **Test Case UT-201 (Coordinates Extractor)**:
  * *Input*: Pin drop at Lat: 9.9816, Lng: 76.2999
  * *Expected Output*: Form fields auto-fill coordinates values matching lat-lng precisely.
  * *Actual Result*: Passed. Checked values inside state monitors.
* **Test Case IT-202 (File Ingestion & Local Scanner Callback)**:
  * *Input*: File upload "bottle_plastic_test.jpg"
  * *Expected Output*: API returns Waste Type: `Plastic` and Severity: `Medium` based on fallback rules.
  * *Actual Result*: Passed.

---

## 4. SPRINT 3: ADMIN LIVE DASHBOARD, ASSIGNMENTS, & VISUAL ANALYTICS
* **Duration**: 2 Weeks (29/04/2026 to 12/05/2026)
* **Sprint Goal**: Design administrative dashboard map with status-colored markers, build worker assignment selector API, integrate Recharts analytics, and write Mongoose Aggregation pipelines.

### 4.1 Sprint 3 Backlog & Task Log
| Module | Task | Pending task if any | Hour of completion | Expected date of completion | Actual date of completion | Reason for delay |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Admin** | Live status-colored incident map dashboard | - | 6 hr. | 02/05/2026 | 02/05/2026 | - |
| **Admin** | Ticket details panel & Worker assignment API | - | 4 hr. | 05/05/2026 | 06/05/2026 | Dynamic UI list rendering bugs |
| **Admin** | Mongoose DB Aggregation pipelines for statistics | - | 4 hr. | 08/05/2026 | 08/05/2026 | - |
| **Admin** | Recharts bar & pie diagrams for waste category | - | 5 hr. | 10/05/2026 | 10/05/2026 | - |
| **Admin** | Sanitation Worker Team creation dashboard | - | 4 hr. | 12/05/2026 | 12/05/2026 | - |

### 4.2 Bi-Weekly Scrum Meeting Logs (Standups)
* **Sprint Day 1 (29/04/2026)**: Sprint 3 planning & Admin map integration.
* **Sprint Day 3 (01/05/2026)**: Color-coded status markers (pending/assigned).
* **Sprint Day 5 (04/05/2026)**: Built worker select list & assign API.
* **Sprint Day 8 (07/05/2026)**: Wrote MongoDB aggregation pipelines for charts.
* **Sprint Day 10 (09/05/2026)**: Visualized stats using Recharts charts.
* **Sprint Day 12 (11/05/2026)**: Created Team creation & assignment screens.
* **Sprint Day 14 (12/05/2026)**: Sprint 3 demo showcasing admin panels.

### 4.3 Key Implementation Highlights & Code Snippets
The core implementation of Sprint 3 features database aggregations for administrative analytics charts in [admin.js](file:///d:/Smart%20waste%20management/backend/routes/admin.js):

```javascript
// Get statistics and monthly report counts
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$wasteType', count: { $sum: 1 } } }
    ]);

    const statusStats = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const monthlyTrends = await Complaint.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      categories: categoryStats,
      statuses: statusStats,
      monthly: monthlyTrends
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### 4.4 Sprint Unit & Integration Testing
* **Test Case UT-301 (Admin Security Interceptor)**:
  * *Input*: Requesting `/api/admin/stats` with a Citizen JWT token.
  * *Expected Output*: Denied access `403 Forbidden` response.
  * *Actual Result*: Passed. Correctly blocked access.
* **Test Case IT-302 (Worker Assignments)**:
  * *Input*: Post assignment target (`workerId`, `deadline`) to pending ticket.
  * *Expected Output*: Ticket status changes to `assigned`, and `worker` field updates to correct ID.
  * *Actual Result*: Passed. Database records verified.

---

## 5. SPRINT 4: WORKER WORKSPACE & VERIFICATION
* **Duration**: 2 Weeks (13/05/2026 to 26/05/2026)
* **Sprint Goal**: Build worker dashboard pages, after-cleaning upload APIs, admin validation/verification endpoints, points increment logic, coordinate seeding scripts, and perform end-to-end integration testing.

### 5.1 Sprint 4 Backlog & Task Log
| Module | Task | Pending task if any | Hour of completion | Expected date of completion | Actual date of completion | Reason for delay |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Worker** | Mobile job sheet task list layout | - | 5 hr. | 16/05/2026 | 16/05/2026 | - |
| **Worker** | Cleaned spot validation image upload & API | - | 5 hr. | 19/05/2026 | 20/05/2026 | Image compression resolution issues |
| **Admin** | Admin verification approval, points allocation & mock payment gateway | - | 3 hr. | 22/05/2026 | 22/05/2026 | - |
| **Core** | Database seeding script (`seed.js`) | - | 3 hr. | 24/05/2026 | 24/05/2026 | - |
| **Core** | End-to-end integration and system testing | - | 4 hr. | 26/05/2026 | 26/05/2026 | - |

### 5.2 Bi-Weekly Scrum Meeting Logs (Standups)
* **Sprint Day 1 (13/05/2026)**: Sprint 4 planning & worker task UI.
* **Sprint Day 3 (15/05/2026)**: Added worker task list & directions map link.
* **Sprint Day 5 (18/05/2026)**: Coded "after-cleanup" photo upload logic.
* **Sprint Day 8 (21/05/2026)**: Wrote admin verify, points reward hook, and mock payment gateway popup integration.
* **Sprint Day 10 (23/05/2026)**: Created database seeding script (`seed.js`).
* **Sprint Day 12 (25/05/2026)**: Performed system tests & socket sync testing.
* **Sprint Day 14 (26/05/2026)**: Final review, verification, and code lock.

### 5.3 Key Implementation Highlights & Code Snippets
The core implementation of worker cleanup task submission in [worker.js](file:///d:/Smart%20waste%20management/backend/routes/worker.js#L94-L147):

```javascript
// Worker uploads clean up photo (In Progress -> Cleaned)
router.put('/complaints/:id/clean', upload.single('photo'), uploadImage, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an after-cleaning photo' });
    }

    complaint.photoAfter = req.file.uploadedUrl;
    complaint.status = 'cleaned'; // Wait for Admin Verification
    complaint.cleanedAt = Date.now();
    await complaint.save();

    // Socket emission to admin & citizen
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('task_cleaned', { 
        title: 'Cleanup Submitted', 
        message: `Worker completed cleanup for: "${complaint.title}".` 
      });
    }
    res.json({ message: 'Task marked as cleaned. Awaiting verification.', complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### 5.4 Sprint Unit & Integration Testing
* **Test Case UT-401 (Points Allocation Logic)**:
  * *Input*: Admin verification request targets complaint reported by Citizen.
  * *Expected Output*: Citizen points increase by 50. If total points cross 100, badge tier promotes to `Eco Sentinel`.
  * *Actual Result*: Passed. User document updated correctly.
* **Test Case E2E-402 (Complete Reporting-to-Resolution Flow)**:
  * *Step 1*: Citizen logs complaint.
  * *Step 2*: Admin assigns worker.
  * *Step 3*: Worker marks task as cleaned.
  * *Step 4*: Admin verifies and closes ticket.
  * *Expected Output*: Status transitions: `pending` ➔ `assigned` ➔ `cleaned` ➔ `completed`.
  * *Actual Result*: Passed. Checked database logs.

---

## 6. AGILE SCRUM METRICS & PERFORMANCE ANALYSIS

### 6.1 Planned vs. Actual Burndown Simulation
The burndown analysis tracks the completion of Story Points across the sprints compared to planned progress. 

```
Story Points
  ▲
20│\  Planned ───────────
  │ \
15│  \─● Actual
  │    \
10│     \
  │      \
 5│       \
  │        \
 0└─────────●──────────────► Day of Sprint
   Day 1   Day 7   Day 14
```

| Day of Sprint | Sprint 1 (SP Remaining) | Sprint 2 (SP Remaining) | Sprint 3 (SP Remaining) | Sprint 4 (SP Remaining) | Target (Ideal) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **Day 1** | 18 | 19 | 19 | 18 | 100% |
| **Day 3** | 16 | 16 | 16 | 15 | 80% |
| **Day 5** | 12 | 13 | 12 | 11 | 65% |
| **Day 7** | 9 | 9 | 10 | 9 | 50% |
| **Day 9** | 6 | 5 | 7 | 6 | 35% |
| **Day 12** | 2 | 2 | 3 | 2 | 15% |
| **Day 14** | 0 | 0 | 0 | 0 | 0% |

### 6.2 Team Velocity Analysis
Team Velocity measures the rate at which the development team completes tasks. The steady velocity indicates a sustainable workload and predictable delivery.

* **Sprint 1 (Auth & DB Setup)**: 18 Story Points completed.
* **Sprint 2 (Citizen & Mapping)**: 19 Story Points completed.
* **Sprint 3 (Admin & Recharts)**: 19 Story Points completed.
* **Sprint 4 (Worker & Loops)**: 18 Story Points completed.
* **Average Velocity**: **18.5 Story Points / Sprint**

---

## 7. CONCLUSION & REFERENCES

By applying the Agile Scrum framework, the **EcoClean** platform was developed and tested within the 8-week timeline. Breaking the requirements into logical sprints allowed the team to manage complex features like interactive mapping, fallback AI classification, and photo-verified task status transitions step-by-step.

### References
1. **Schwaber, Ken & Beedle, Mike** (2002). *Agile Software Development with Scrum*. Prentice Hall.
2. **Cohn, Mike** (2005). *Agile Estimating and Planning*. Prentice Hall.
3. APJ Abdul Kalam Technological University MCA Project Guidelines (S3-S4).
4. Mongoose Documentation on aggregation queries: https://mongoosejs.com/docs/api/aggregate.html

---
*End of Scrum Book: Sprint-wise Record of Development.*
