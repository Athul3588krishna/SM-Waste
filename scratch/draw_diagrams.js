const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const outputDir = path.join(__dirname, 'diagrams');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper: Draw rounded rectangle
function drawRoundedRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Helper: Draw Arrow
function drawArrow(ctx, fromX, fromY, toX, toY, label = '') {
  const headlen = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
  ctx.fillStyle = '#334155';
  ctx.fill();

  if (label) {
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2 - 6;
    ctx.fillStyle = '#0f172a';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, midX, midY);
  }
}

// Helper: Draw Stick Figure (Actor)
function drawActor(ctx, x, y, label) {
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  // Head
  ctx.beginPath();
  ctx.arc(x, y - 25, 12, 0, Math.PI * 2);
  ctx.stroke();
  // Body
  ctx.beginPath();
  ctx.moveTo(x, y - 13);
  ctx.lineTo(x, y + 15);
  ctx.stroke();
  // Arms
  ctx.beginPath();
  ctx.moveTo(x - 18, y - 5);
  ctx.lineTo(x + 18, y - 5);
  ctx.stroke();
  // Legs
  ctx.beginPath();
  ctx.moveTo(x, y + 15);
  ctx.lineTo(x - 12, y + 38);
  ctx.moveTo(x, y + 15);
  ctx.lineTo(x + 12, y + 38);
  ctx.stroke();

  // Label
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y + 55);
}

// ---------------------------------------------------------
// 1. USE CASE DIAGRAM
// ---------------------------------------------------------
function createUseCaseDiagram() {
  const canvas = createCanvas(800, 650);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 800, 650);

  // System Boundary
  drawRoundedRect(ctx, 220, 40, 360, 570, 10, '#f8fafc', '#94a3b8');
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('EcoClean Smart Waste Management System', 400, 68);

  // Actors
  drawActor(ctx, 100, 180, 'Citizen');
  drawActor(ctx, 100, 440, 'Sanitation Worker');
  drawActor(ctx, 700, 300, 'Municipal Admin');

  // Use cases (Ovals)
  const useCases = [
    { title: 'Register / Login', y: 110, citizen: true, worker: true, admin: true },
    { title: 'Report Waste Dump & Geotag', y: 165, citizen: true },
    { title: 'AI Waste Scanning & Severity', y: 220, citizen: true },
    { title: 'View Eco Credit Card & Points', y: 275, citizen: true },
    { title: 'Redeem Municipal Vouchers', y: 330, citizen: true },
    { title: 'Track Complaint Timeline & Status', y: 385, citizen: true },
    { title: 'Download Official Receipt', y: 440, citizen: true },
    { title: 'View Assigned Job Sheet & Map', y: 495, worker: true },
    { title: 'Upload Cleanup Proof Photo', y: 550, worker: true, admin: true },
    { title: 'Verify Incidents & Dispatch Crew', y: 200, admin: true },
    { title: 'View Analytics & Hotspots', y: 350, admin: true }
  ];

  useCases.forEach(uc => {
    // Draw Oval
    ctx.beginPath();
    ctx.ellipse(400, uc.y, 140, 22, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(uc.title, 400, uc.y + 4);

    // Connectors
    if (uc.citizen) drawArrow(ctx, 140, 180, 260, uc.y);
    if (uc.worker) drawArrow(ctx, 140, 440, 260, uc.y);
    if (uc.admin) drawArrow(ctx, 660, 300, 540, uc.y);
  });

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'use_case_diagram.png'), buffer);
  console.log('Saved use_case_diagram.png');
}

// ---------------------------------------------------------
// 2. LEVEL 0 DFD (CONTEXT DIAGRAM)
// ---------------------------------------------------------
function createLevel0DFD() {
  const canvas = createCanvas(800, 500);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 800, 500);

  // Title
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('LEVEL 0 DATA FLOW DIAGRAM (CONTEXT DIAGRAM)', 400, 35);

  // Central Process Circle
  ctx.beginPath();
  ctx.arc(400, 250, 90, 0, Math.PI * 2);
  ctx.fillStyle = '#e0f2fe';
  ctx.fill();
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#0369a1';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('0.0', 400, 220);
  ctx.fillText('EcoClean Smart', 400, 245);
  ctx.fillText('Waste Management', 400, 265);
  ctx.fillText('System', 400, 285);

  // Entities (Rectangles)
  // 1. Citizen (Left)
  drawRoundedRect(ctx, 50, 210, 130, 80, 6, '#f1f5f9', '#475569');
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('CITIZEN', 115, 255);

  // 2. Sanitation Worker (Bottom)
  drawRoundedRect(ctx, 335, 400, 130, 70, 6, '#f1f5f9', '#475569');
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('SANITATION', 400, 435);
  ctx.fillText('WORKER', 400, 452);

  // 3. Municipal Admin (Right)
  drawRoundedRect(ctx, 620, 210, 130, 80, 6, '#f1f5f9', '#475569');
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('MUNICIPAL', 685, 247);
  ctx.fillText('ADMIN', 685, 265);

  // Data flow arrows
  // Citizen <-> System
  drawArrow(ctx, 180, 230, 310, 230, 'Waste Report, Photo, GPS');
  drawArrow(ctx, 310, 270, 180, 270, 'Status, Points, Receipt');

  // Admin <-> System
  drawArrow(ctx, 620, 230, 490, 230, 'Worker Dispatch, Verify');
  drawArrow(ctx, 490, 270, 620, 270, 'Analytics, Incident Ledger');

  // Worker <-> System
  drawArrow(ctx, 380, 330, 380, 400, 'Assigned Targets');
  drawArrow(ctx, 420, 400, 420, 330, 'Proof Photo & Status');

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'dfd_level_0.png'), buffer);
  console.log('Saved dfd_level_0.png');
}

// ---------------------------------------------------------
// 3. LEVEL 1 DFD (SUBSYSTEMS)
// ---------------------------------------------------------
function createLevel1DFD() {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 800, 600);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('LEVEL 1 DATA FLOW DIAGRAM (SUBSYSTEM DECOMPOSITION)', 400, 35);

  // Processes (Circles)
  const processes = [
    { id: '1.0', title: 'Auth & Profile', x: 200, y: 130 },
    { id: '2.0', title: 'Report & AI Scan', x: 600, y: 130 },
    { id: '3.0', title: 'Admin Dispatch', x: 200, y: 450 },
    { id: '4.0', title: 'Worker Cleanup', x: 600, y: 450 },
    { id: '5.0', title: 'Eco Rewards', x: 400, y: 290 }
  ];

  processes.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#e0f2fe';
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(p.id, p.x, p.y - 10);
    ctx.font = '11px Arial';
    ctx.fillText(p.title, p.x, p.y + 10);
  });

  // Data Stores (Open Rectangles)
  const stores = [
    { title: 'D1: USERS DB', x: 100, y: 290 },
    { title: 'D2: COMPLAINTS DB', x: 670, y: 290 }
  ];

  stores.forEach(s => {
    drawRoundedRect(ctx, s.x - 60, s.y - 20, 120, 40, 4, '#f8fafc', '#64748b');
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(s.title, s.x, s.y + 4);
  });

  // Flow Connections
  drawArrow(ctx, 200, 180, 130, 270, 'User Data');
  drawArrow(ctx, 550, 130, 250, 130, 'Verify User');
  drawArrow(ctx, 600, 180, 670, 270, 'Save Complaint');
  drawArrow(ctx, 670, 310, 600, 400, 'Assigned Jobs');
  drawArrow(ctx, 600, 450, 450, 310, 'Complete Proof');
  drawArrow(ctx, 400, 240, 200, 180, 'Points & Badge');
  drawArrow(ctx, 200, 400, 610, 300, 'Admin Verify');

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'dfd_level_1.png'), buffer);
  console.log('Saved dfd_level_1.png');
}

// ---------------------------------------------------------
// 4. LEVEL 2 DFD (DETAILED REPORTING FLOW)
// ---------------------------------------------------------
function createLevel2DFD() {
  const canvas = createCanvas(800, 500);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 800, 500);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('LEVEL 2 DATA FLOW DIAGRAM (INCIDENT & REWARD LIFECYCLE)', 400, 35);

  const steps = [
    { num: '2.1', title: 'Capture GPS &\nPhoto', x: 120, y: 250 },
    { num: '2.2', title: 'AI Waste &\nSeverity Scan', x: 300, y: 250 },
    { num: '2.3', title: 'Store Complaint\n(Status: Pending)', x: 480, y: 250 },
    { num: '2.4', title: 'Dispatch &\nResolution Receipt', x: 670, y: 250 }
  ];

  steps.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, 45, 0, Math.PI * 2);
    ctx.fillStyle = '#f0fdf4';
    ctx.fill();
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#15803d';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(s.num, s.x, s.y - 12);

    const lines = s.title.split('\n');
    ctx.font = '10px Arial';
    ctx.fillText(lines[0], s.x, s.y + 5);
    if (lines[1]) ctx.fillText(lines[1], s.x, s.y + 18);
  });

  drawArrow(ctx, 165, 250, 255, 250, 'Image & Coords');
  drawArrow(ctx, 345, 250, 435, 250, 'Category %');
  drawArrow(ctx, 525, 250, 625, 250, 'Approved Clean');

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'dfd_level_2.png'), buffer);
  console.log('Saved dfd_level_2.png');
}

// Generate all diagrams
createUseCaseDiagram();
createLevel0DFD();
createLevel1DFD();
createLevel2DFD();

console.log('All DFD diagrams successfully generated!');
