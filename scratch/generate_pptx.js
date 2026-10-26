const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pptx = new pptxgen();

pptx.layout = 'LAYOUT_16x9';
pptx.title = 'EcoClean - Smart Waste Management System Presentation';
pptx.author = 'Athul Krishna R';

// Theme Palette: Emerald Sanitation Theme
const C_BG_DARK = '0B132B';
const C_CARD_BG = '1C2541';
const C_PRIMARY_GREEN = '10B981';
const C_ACCENT_CYAN = '06B6D4';
const C_TEXT_WHITE = 'FFFFFF';
const C_TEXT_MUTED = '94A3B8';
const C_ALERT_AMBER = 'F59E0B';

// Helper to set solid background on slide
function createBaseSlide(titleText, slideNumStr) {
  const slide = pptx.addSlide();
  slide.background = { color: C_BG_DARK };

  // Header Banner
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: '100%', h: 0.9,
    fill: { color: C_CARD_BG },
    line: { color: C_PRIMARY_GREEN, width: 1 }
  });

  // Top Accent Line
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0.88, w: '100%', h: 0.04,
    fill: { color: C_PRIMARY_GREEN }
  });

  // Header Title
  slide.addText(titleText, {
    x: 0.5, y: 0.15, w: 9.0, h: 0.6,
    fontSize: 22, bold: true, color: C_TEXT_WHITE, fontFace: 'Calibri'
  });

  // Slide Number / Footer
  slide.addText(`EcoClean | Perinthalmanna Sanitation Governance | Evaluation 1`, {
    x: 0.5, y: 7.1, w: 7.5, h: 0.3,
    fontSize: 10, color: C_TEXT_MUTED, fontFace: 'Calibri'
  });

  slide.addText(`Slide ${slideNumStr} of 10`, {
    x: 11.5, y: 7.1, w: 1.5, h: 0.3,
    fontSize: 10, align: 'right', color: C_PRIMARY_GREEN, bold: true, fontFace: 'Calibri'
  });

  return slide;
}

// -------------------------------------------------------------
// SLIDE 1: Title Slide
// -------------------------------------------------------------
const slide1 = pptx.addSlide();
slide1.background = { color: C_BG_DARK };

slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8, y: 0.8, w: 11.7, h: 5.8,
  fill: { color: C_CARD_BG },
  line: { color: C_PRIMARY_GREEN, width: 2 }
});

slide1.addText("ECOCLEAN: SMART WASTE MANAGEMENT SYSTEM", {
  x: 1.2, y: 1.3, w: 10.9, h: 0.8,
  fontSize: 28, bold: true, color: C_PRIMARY_GREEN, fontFace: 'Calibri', align: 'center'
});

slide1.addText("AI-Powered Sanitation Governance & Citizen Gamification Platform", {
  x: 1.2, y: 2.1, w: 10.9, h: 0.5,
  fontSize: 16, color: C_ACCENT_CYAN, fontFace: 'Calibri', align: 'center'
});

slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 3.5, y: 2.7, w: 6.3, h: 0.04,
  fill: { color: C_PRIMARY_GREEN }
});

slide1.addText("PROJECT EVALUATION 1 PRESENTATION", {
  x: 1.2, y: 3.0, w: 10.9, h: 0.5,
  fontSize: 18, bold: true, color: C_TEXT_WHITE, fontFace: 'Calibri', align: 'center'
});

slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 2.5, y: 3.8, w: 8.3, h: 2.2,
  fill: { color: C_BG_DARK },
  line: { color: C_TEXT_MUTED, width: 1 }
});

slide1.addText([
  { text: "Presented by: ", options: { bold: true, color: C_TEXT_MUTED } },
  { text: "Athul Krishna R\n", options: { bold: true, color: C_PRIMARY_GREEN } },
  { text: "Degree & Course: ", options: { bold: true, color: C_TEXT_MUTED } },
  { text: "Master of Computer Applications (MCA S3)\n", options: { color: C_TEXT_WHITE } },
  { text: "Institution: ", options: { bold: true, color: C_TEXT_MUTED } },
  { text: "MEA Engineering College, Perinthalmanna\n", options: { color: C_TEXT_WHITE } },
  { text: "Evaluation Date: ", options: { bold: true, color: C_TEXT_MUTED } },
  { text: "03 / 09 / 2026", options: { color: C_ACCENT_CYAN, bold: true } }
], { x: 2.7, y: 3.9, w: 7.9, h: 2.0, fontSize: 13, fontFace: 'Calibri', align: 'center' });


// -------------------------------------------------------------
// SLIDE 2: Project Overview & Objectives
// -------------------------------------------------------------
const slide2 = createBaseSlide("1. PROJECT OVERVIEW & OBJECTIVES", "2");

slide2.addShape(pptx.shapes.RECTANGLE, {
  x: 0.6, y: 1.2, w: 5.8, h: 5.5,
  fill: { color: C_CARD_BG }, line: { color: C_PRIMARY_GREEN, width: 1 }
});

slide2.addText("📌 Project Overview", {
  x: 0.8, y: 1.4, w: 5.4, h: 0.4,
  fontSize: 18, bold: true, color: C_PRIMARY_GREEN
});

slide2.addText(
  "EcoClean is a comprehensive smart sanitation and municipal waste management portal specifically designed for Perinthalmanna Municipality.\n\n" +
  "It bridges the gap between citizens, municipal sanitation workers, and city administrators by providing dual reporting channels (Web & Telegram), automated AI image verification, real-time worker dispatching, and citizen rewards.",
  { x: 0.8, y: 2.0, w: 5.4, h: 4.4, fontSize: 13, color: C_TEXT_WHITE, lineSpacing: 22 }
);

slide2.addShape(pptx.shapes.RECTANGLE, {
  x: 6.8, y: 1.2, w: 5.8, h: 5.5,
  fill: { color: C_CARD_BG }, line: { color: C_ACCENT_CYAN, width: 1 }
});

slide2.addText("🎯 Core Objectives", {
  x: 7.0, y: 1.4, w: 5.4, h: 0.4,
  fontSize: 18, bold: true, color: C_ACCENT_CYAN
});

slide2.addText([
  { text: "1. Eliminate Open Dumps: ", options: { bold: true, color: C_PRIMARY_GREEN } },
  { text: "Identify & resolve illegal waste spots in Perinthalmanna wards.\n\n", options: { color: C_TEXT_WHITE } },
  { text: "2. AI Waste Classification: ", options: { bold: true, color: C_PRIMARY_GREEN } },
  { text: "Use Google Gemini AI to auto-classify waste types and filter fake images.\n\n", options: { color: C_TEXT_WHITE } },
  { text: "3. Direct GPS Dispatch: ", options: { bold: true, color: C_PRIMARY_GREEN } },
  { text: "Send instant Telegram alerts to workers with live Google Maps links.\n\n", options: { color: C_TEXT_WHITE } },
  { text: "4. Citizen Gamification: ", options: { bold: true, color: C_PRIMARY_GREEN } },
  { text: "Reward citizens 50 Eco-Points per verified report for municipal vouchers.", options: { color: C_TEXT_WHITE } }
], { x: 7.0, y: 2.0, w: 5.4, h: 4.4, fontSize: 12, lineSpacing: 18 });


// -------------------------------------------------------------
// SLIDE 3: Existing vs Proposed System
// -------------------------------------------------------------
const slide3 = createBaseSlide("2. EXISTING SYSTEM VS PROPOSED ECOCLEAN SYSTEM", "3");

slide3.addTable([
  [
    { text: "Feature / Parameter", options: { bold: true, fill: C_CARD_BG, color: C_PRIMARY_GREEN, fontSize: 13 } },
    { text: "Existing Traditional System", options: { bold: true, fill: C_CARD_BG, color: C_ALERT_AMBER, fontSize: 13 } },
    { text: "Proposed EcoClean System", options: { bold: true, fill: C_CARD_BG, color: C_ACCENT_CYAN, fontSize: 13 } }
  ],
  [
    { text: "Reporting Channel", options: { bold: true, color: C_TEXT_WHITE } },
    { text: "Manual phone calls or visiting municipal office physically.", options: { color: C_TEXT_MUTED } },
    { text: "Dual reporting via React Web App & Leaflet Geo-Picker.", options: { color: C_TEXT_WHITE, bold: true } }
  ],
  [
    { text: "Waste Verification", options: { bold: true, color: C_TEXT_WHITE } },
    { text: "Manual inspection by municipal officer (slow & expensive).", options: { color: C_TEXT_MUTED } },
    { text: "Instant Google Gemini AI Vision classification & paper safeguards.", options: { color: C_TEXT_WHITE, bold: true } }
  ],
  [
    { text: "Worker Dispatch", options: { bold: true, color: C_TEXT_WHITE } },
    { text: "Paper work orders without precise location guidance.", options: { color: C_TEXT_MUTED } },
    { text: "Real-time Telegram alerts with live Google Maps GPS route button.", options: { color: C_TEXT_WHITE, bold: true } }
  ],
  [
    { text: "Proof of Cleanup", options: { bold: true, color: C_TEXT_WHITE } },
    { text: "No photo verification mechanism available.", options: { color: C_TEXT_MUTED } },
    { text: "Worker uploads compressed 'After Cleanup' proof photo before closing ticket.", options: { color: C_TEXT_WHITE, bold: true } }
  ],
  [
    { text: "Citizen Motivation", options: { bold: true, color: C_TEXT_WHITE } },
    { text: "Zero incentives; citizens feel ignored.", options: { color: C_TEXT_MUTED } },
    { text: "50 Eco-Points reward per verified cleanup, redeemable for vouchers.", options: { color: C_TEXT_WHITE, bold: true } }
  ]
], {
  x: 0.6, y: 1.3, w: 12.0, h: 5.3,
  colW: [2.5, 4.75, 4.75],
  border: { pt: 1, color: C_PRIMARY_GREEN },
  fontSize: 11,
  valign: 'middle'
});


// -------------------------------------------------------------
// SLIDE 4: System Architecture & Workflow
// -------------------------------------------------------------
const slide4 = createBaseSlide("3. SYSTEM ARCHITECTURE & COMPLAINT LIFECYCLE", "4");

const steps = [
  { num: "01", title: "Reporting", desc: "Citizen files report via Web UI with photo & GPS pin.", color: C_PRIMARY_GREEN },
  { num: "02", title: "AI Vision Scan", desc: "Gemini AI scans photo, classifies waste type, severity, and filters non-waste.", color: C_ACCENT_CYAN },
  { num: "03", title: "Admin Dispatch", desc: "Admin verifies ticket and assigns Sanitation Worker or Team.", color: C_PRIMARY_GREEN },
  { num: "04", title: "Worker Action", desc: "Worker receives alert notification with Maps link, cleans spot, uploads proof photo.", color: C_ACCENT_CYAN },
  { num: "05", title: "Verification & Reward", desc: "Admin approves cleanup proof -> Status: Resolved -> +50 Eco-Points credited.", color: C_PRIMARY_GREEN }
];

steps.forEach((st, idx) => {
  const xPos = 0.6 + (idx * 2.45);
  slide4.addShape(pptx.shapes.RECTANGLE, {
    x: xPos, y: 1.5, w: 2.3, h: 5.0,
    fill: { color: C_CARD_BG }, line: { color: st.color, width: 2 }
  });

  slide4.addText(st.num, {
    x: xPos, y: 1.7, w: 2.3, h: 0.6,
    fontSize: 24, bold: true, color: st.color, align: 'center'
  });

  slide4.addText(st.title, {
    x: xPos + 0.1, y: 2.4, w: 2.1, h: 0.6,
    fontSize: 13, bold: true, color: C_TEXT_WHITE, align: 'center'
  });

  slide4.addText(st.desc, {
    x: xPos + 0.1, y: 3.1, w: 2.1, h: 3.1,
    fontSize: 10, color: C_TEXT_MUTED, align: 'center', lineSpacing: 14
  });
});


// -------------------------------------------------------------
// SLIDE 5: Module Description
// -------------------------------------------------------------
const slide5 = createBaseSlide("4. MODULE DESCRIPTION (ALL 5 MODULES)", "5");

const modules = [
  { name: "1. Citizen Module", desc: "Report waste with map picker, track ticket timeline, view leaderboard, redeem Eco-Points vouchers in store.", col: C_PRIMARY_GREEN },
  { name: "2. Sanitation Worker Module", desc: "View assigned duties, click Google Maps navigation, upload compressed proof photo ('imageCompressor.js'), track performance score.", col: C_ACCENT_CYAN },
  { name: "3. Admin Module", desc: "Verify reports, assign workers/teams, monitor ward heatmaps, broadcast municipal announcements, export CSV analytics.", col: C_PRIMARY_GREEN },
  { name: "4. EcoBot AI Assistant", desc: "Embedded chatbot widget ('EcoBotWidget.jsx') providing segregation rules, collection schedules, and portal help.", col: C_ACCENT_CYAN },
  { name: "5. Mobile Dispatch Alert Engine", desc: "Interactive alerts for citizen reporting (Photo + GPS) and instant worker duty notifications.", col: C_PRIMARY_GREEN }
];

modules.forEach((mod, idx) => {
  const yPos = 1.2 + (idx * 1.1);
  slide5.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: yPos, w: 12.0, h: 0.95,
    fill: { color: C_CARD_BG }, line: { color: mod.col, width: 1 }
  });

  slide5.addText(mod.name, {
    x: 0.8, y: yPos + 0.2, w: 3.2, h: 0.5,
    fontSize: 14, bold: true, color: mod.col
  });

  slide5.addText(mod.desc, {
    x: 4.1, y: yPos + 0.15, w: 8.3, h: 0.65,
    fontSize: 11, color: C_TEXT_WHITE, lineSpacing: 14
  });
});


// -------------------------------------------------------------
// SLIDE 6: Technology Stack Used
// -------------------------------------------------------------
const slide6 = createBaseSlide("5. TECHNOLOGY STACK USED", "6");

const techStack = [
  { category: "Frontend Stack", items: "React.js (Vite), TailwindCSS, Glassmorphism UI, Recharts, Lucide Icons, Leaflet GIS Maps", color: C_PRIMARY_GREEN },
  { category: "Backend Stack", items: "Node.js, Express.js REST APIs, JWT (JSON Web Tokens), bcryptjs, Multer", color: C_ACCENT_CYAN },
  { category: "Database & ODM", items: "MongoDB (Cloud Atlas / Local) with Mongoose ODM (Geospatial Lat/Lng indexes)", color: C_PRIMARY_GREEN },
  { category: "AI & External APIs", items: "Google Gemini Vision API (gemini-2.5-flash / gemini-1.5-flash), Telegram Bot API", color: C_ACCENT_CYAN },
  { category: "Tools & Libraries", items: "Git, GitHub, VS Code, Postman, npm, imageCompressor.js, HTTPS Polling Engine", color: C_PRIMARY_GREEN }
];

techStack.forEach((t, i) => {
  const yPos = 1.3 + (i * 1.1);
  slide6.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: yPos, w: 3.5, h: 0.9,
    fill: { color: C_CARD_BG }, line: { color: t.color, width: 2 }
  });
  slide6.addText(t.category, {
    x: 0.8, y: yPos + 0.25, w: 3.1, h: 0.4,
    fontSize: 14, bold: true, color: t.color
  });

  slide6.addShape(pptx.shapes.RECTANGLE, {
    x: 4.3, y: yPos, w: 8.3, h: 0.9,
    fill: { color: C_CARD_BG }, line: { color: C_TEXT_MUTED, width: 1 }
  });
  slide6.addText(t.items, {
    x: 4.5, y: yPos + 0.2, w: 7.9, h: 0.5,
    fontSize: 12, color: C_TEXT_WHITE
  });
});


// -------------------------------------------------------------
// SLIDE 7: Database Schemas / Collections
// -------------------------------------------------------------
const slide7 = createBaseSlide("6. DATABASE COLLECTIONS (MONGODB SCHEMAS)", "7");

const collections = [
  { name: "User Collection", fields: "name, email, password (bcrypt), role (citizen/worker/admin), points, badge, avatar, ward, status, phone, telegramChatId." },
  { name: "Complaint Collection", fields: "title, description, wasteType, severity, status (pending/assigned/cleaned/resolved), location (address, lat, lng, ward), photoBefore, photoAfter, citizen ID, assignedWorker ID, assignedTeam ID, rating." },
  { name: "Announcement Collection", fields: "title, content, targetRole, ward, author (Admin ID), createdAt." },
  { name: "Team Collection", fields: "name, leader (Worker ID), members [Worker IDs], ward, activeTasksCount." },
  { name: "Notification & OTP", fields: "email, otp, expiresAt / user ID, type, title, message, read, complaintId." }
];

collections.forEach((c, idx) => {
  const yPos = 1.2 + (idx * 1.1);
  slide7.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: yPos, w: 12.0, h: 0.95,
    fill: { color: C_CARD_BG }, line: { color: C_PRIMARY_GREEN, width: 1 }
  });

  slide7.addText(c.name, {
    x: 0.8, y: yPos + 0.2, w: 3.2, h: 0.5,
    fontSize: 13, bold: true, color: C_ACCENT_CYAN
  });

  slide7.addText(c.fields, {
    x: 4.1, y: yPos + 0.15, w: 8.3, h: 0.65,
    fontSize: 10, color: C_TEXT_WHITE, lineSpacing: 14
  });
});


// -------------------------------------------------------------
// SLIDE 8: Implementation Status & Progress
// -------------------------------------------------------------
const slide8 = createBaseSlide("7. IMPLEMENTATION STATUS (> 85% COMPLETED)", "8");

slide8.addShape(pptx.shapes.RECTANGLE, {
  x: 0.6, y: 1.2, w: 12.0, h: 0.7,
  fill: { color: C_PRIMARY_GREEN }
});
slide8.addText("🎉 PROJECT PROGRESS: OVER 85% COMPLETED (Exceeds 50% Evaluation Milestone)", {
  x: 0.8, y: 1.35, w: 11.6, h: 0.4,
  fontSize: 14, bold: true, color: C_BG_DARK, align: 'center'
});

const progressItems = [
  { item: "Role-Based Authentication (JWT, bcrypt, OTP)", status: "100% DONE" },
  { item: "Google Gemini AI Photo Vision & Paper Safeguard", status: "100% DONE" },
  { item: "Interactive Mobile Dispatch Alert System", status: "100% DONE" },
  { item: "Citizen Dashboard, Leaflet Map Pin & Eco-Rewards", status: "100% DONE" },
  { item: "Worker Portal, Google Maps Route & Photo Compression", status: "100% DONE" },
  { item: "Admin Ward Heatmaps, Worker Dispatch & CSV Export", status: "100% DONE" }
];

progressItems.forEach((p, idx) => {
  const yPos = 2.1 + (idx * 0.75);
  slide8.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: yPos, w: 9.2, h: 0.6,
    fill: { color: C_CARD_BG }, line: { color: C_TEXT_MUTED, width: 1 }
  });
  slide8.addText(`✅  ${p.item}`, {
    x: 0.8, y: yPos + 0.1, w: 8.8, h: 0.4,
    fontSize: 12, color: C_TEXT_WHITE
  });

  slide8.addShape(pptx.shapes.RECTANGLE, {
    x: 10.0, y: yPos, w: 2.6, h: 0.6,
    fill: { color: C_CARD_BG }, line: { color: C_PRIMARY_GREEN, width: 2 }
  });
  slide8.addText(p.status, {
    x: 10.0, y: yPos + 0.1, w: 2.6, h: 0.4,
    fontSize: 12, bold: true, color: C_PRIMARY_GREEN, align: 'center'
  });
});


// -------------------------------------------------------------
// SLIDE 9: Future Enhancements
// -------------------------------------------------------------
const slide9 = createBaseSlide("8. FUTURE ENHANCEMENTS & ROADMAP", "9");

const futures = [
  { title: "1. IoT Smart Waste Bin Integration", desc: "Installing ultrasonic fill-level sensors inside public trash bins to automatically dispatch workers before bins overflow.", col: C_PRIMARY_GREEN },
  { title: "2. AI Garbage Truck Route Optimization", desc: "Implementing Dijkstra & Genetic pathfinding algorithms to compute shortest collection routes for municipal vehicles.", col: C_ACCENT_CYAN },
  { title: "3. Progressive Web App (PWA) / Native App", desc: "Converting portal to a Native Mobile App with offline reporting support for rural ward areas.", col: C_PRIMARY_GREEN }
];

futures.forEach((f, idx) => {
  const yPos = 1.3 + (idx * 1.8);
  slide9.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: yPos, w: 12.0, h: 1.5,
    fill: { color: C_CARD_BG }, line: { color: f.col, width: 2 }
  });

  slide9.addText(f.title, {
    x: 0.9, y: yPos + 0.2, w: 11.4, h: 0.4,
    fontSize: 16, bold: true, color: f.col
  });

  slide9.addText(f.desc, {
    x: 0.9, y: yPos + 0.7, w: 11.4, h: 0.65,
    fontSize: 12, color: C_TEXT_WHITE, lineSpacing: 18
  });
});


// -------------------------------------------------------------
// SLIDE 10: Conclusion & Q&A
// -------------------------------------------------------------
const slide10 = pptx.addSlide();
slide10.background = { color: C_BG_DARK };

slide10.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8, y: 0.8, w: 11.7, h: 5.8,
  fill: { color: C_CARD_BG },
  line: { color: C_PRIMARY_GREEN, width: 2 }
});

slide10.addText("THANK YOU!", {
  x: 1.2, y: 1.5, w: 10.9, h: 0.8,
  fontSize: 36, bold: true, color: C_PRIMARY_GREEN, fontFace: 'Calibri', align: 'center'
});

slide10.addText("EcoClean — Smart Municipal Sanitation Governance System", {
  x: 1.2, y: 2.4, w: 10.9, h: 0.5,
  fontSize: 18, color: C_ACCENT_CYAN, fontFace: 'Calibri', align: 'center'
});

slide10.addShape(pptx.shapes.RECTANGLE, {
  x: 4.0, y: 3.1, w: 5.3, h: 0.04,
  fill: { color: C_PRIMARY_GREEN }
});

slide10.addText("Questions & Evaluation Discussion", {
  x: 1.2, y: 3.5, w: 10.9, h: 0.6,
  fontSize: 22, bold: true, color: C_TEXT_WHITE, fontFace: 'Calibri', align: 'center'
});

slide10.addText("Developer: Athul Krishna R | MEA Engineering College", {
  x: 1.2, y: 5.2, w: 10.9, h: 0.4,
  fontSize: 13, color: C_TEXT_MUTED, fontFace: 'Calibri', align: 'center'
});

// Save Presentation
const outputPath = path.join(__dirname, '../EcoClean_Evaluation1_Presentation_Final.pptx');
const rootCopyPath = path.join(__dirname, '../EcoClean_Evaluation1_Presentation.pptx');

pptx.writeFile({ fileName: outputPath }).then(() => {
  fs.copyFileSync(outputPath, rootCopyPath);
  console.log('Successfully generated PowerPoint file at:', outputPath);
}).catch(err => {
  console.error('Error generating pptx:', err);
});
