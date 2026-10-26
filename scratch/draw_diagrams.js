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

  // System Box
  drawRoundedRect(ctx, 220, 30, 360, 580, 8, '#f8fafc', '#0f172a');
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('ECOCLEAN WASTE MANAGEMENT SYSTEM', 400, 55);

  // Actors
  drawActor(ctx, 100, 200, 'Citizen / User');
  drawActor(ctx, 700, 180, 'Sanitation Worker');
  drawActor(ctx, 700, 450, 'Municipal Admin');

  // Use Cases
  const useCases = [
    { title: 'Register / Login', y: 90 },
    { title: 'View Profile & Eco Credit Card', y: 135 },
    { title: 'Report Waste & Pick Map GPS', y: 180 },
    { title: 'AI Waste Vision Scanning', y: 225 },
    { title: 'Track Report & Status Timeline', y: 270 },
    { title: 'Redeem Eco-Points Vouchers', y: 315 },
    { title: 'View Mobile Duty List & Navigation', y: 360 },
    { title: 'Upload After-Cleaning Proof Photo', y: 405 },
    { title: 'Verify Reports & Dispatch Workforce', y: 450 },
    { title: 'View Ward Analytics & Heatmaps', y: 495 },
    { title: 'Issue Resolution PDF Receipt', y: 540 },
    { title: 'Logout', y: 585 }
  ];

  useCases.forEach(uc => {
    ctx.beginPath();
    ctx.ellipse(400, uc.y, 140, 18, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(uc.title, 400, uc.y + 4);
  });

  // Citizen Lines
  [90, 135, 180, 225, 270, 315, 585].forEach(y => {
    ctx.beginPath();
    ctx.moveTo(130, 200);
    ctx.lineTo(260, y);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Worker Lines
  [90, 360, 405, 585].forEach(y => {
    ctx.beginPath();
    ctx.moveTo(670, 180);
    ctx.lineTo(540, y);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Admin Lines
  [90, 450, 495, 540, 585].forEach(y => {
    ctx.beginPath();
    ctx.moveTo(670, 450);
    ctx.lineTo(540, y);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'use_case_diagram.png'), buffer);
  console.log('Saved use_case_diagram.png');
}

// ---------------------------------------------------------
// 2. LEVEL 0 DFD
// ---------------------------------------------------------
function createLevel0DFD() {
  const canvas = createCanvas(750, 400);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 750, 400);

  // Center Process
  ctx.beginPath();
  ctx.arc(375, 200, 70, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('EcoClean System', 375, 195);
  ctx.font = '11px Arial';
  ctx.fillText('(Level 0 DFD)', 375, 215);

  // External Entities
  drawRoundedRect(ctx, 50, 160, 130, 80, 6, '#f1f5f9', '#0284c7');
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px Arial';
  ctx.fillText('Citizen', 115, 205);

  drawRoundedRect(ctx, 570, 70, 140, 80, 6, '#f1f5f9', '#16a34a');
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px Arial';
  ctx.fillText('Sanitation Worker', 640, 115);

  drawRoundedRect(ctx, 570, 250, 140, 80, 6, '#f1f5f9', '#dc2626');
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px Arial';
  ctx.fillText('Municipal Admin', 640, 295);

  // Arrows
  drawArrow(ctx, 180, 180, 305, 180, 'Report & GPS');
  drawArrow(ctx, 305, 220, 180, 220, 'Receipt & Points');

  drawArrow(ctx, 440, 170, 570, 110, 'Task Alert');
  drawArrow(ctx, 570, 130, 440, 190, 'Proof Photo');

  drawArrow(ctx, 440, 210, 570, 270, 'Verification');
  drawArrow(ctx, 570, 290, 440, 230, 'Dispatch Order');

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'dfd_level_0.png'), buffer);
  console.log('Saved dfd_level_0.png');
}

// ---------------------------------------------------------
// 3. LEVEL 1 DFD
// ---------------------------------------------------------
function createLevel1DFD() {
  const canvas = createCanvas(800, 550);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 800, 550);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('LEVEL 1 DATA FLOW DIAGRAM (SYSTEM SUBSYSTEMS)', 400, 35);

  const processes = [
    { num: '1.0', title: 'User Auth &\nProfile Engine', y: 100 },
    { num: '2.0', title: 'GPS Reporting &\nAI Vision Scanner', y: 190 },
    { num: '3.0', title: 'Dispatch & Worker\nWorkspace', y: 280 },
    { num: '4.0', title: 'Verification &\nProof Upload', y: 370 },
    { num: '5.0', title: 'Eco Rewards &\nPDF Receipts', y: 460 }
  ];

  processes.forEach(p => {
    ctx.beginPath();
    ctx.arc(400, p.y, 35, 0, Math.PI * 2);
    ctx.fillStyle = '#e0f2fe';
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(p.num, 400, p.y - 8);

    const lines = p.title.split('\n');
    ctx.font = '10px Arial';
    ctx.fillText(lines[0], 400, p.y + 7);
    if (lines[1]) ctx.fillText(lines[1], 400, p.y + 18);
  });

  // Stores
  drawRoundedRect(ctx, 600, 160, 150, 45, 4, '#f8fafc', '#475569');
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 11px Arial';
  ctx.fillText('D1: Complaints DB', 675, 187);

  drawRoundedRect(ctx, 600, 340, 150, 45, 4, '#f8fafc', '#475569');
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 11px Arial';
  ctx.fillText('D2: Users & Points DB', 675, 367);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'dfd_level_1.png'), buffer);
  console.log('Saved dfd_level_1.png');
}

// ---------------------------------------------------------
// 4. LEVEL 2 DFD
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

// ---------------------------------------------------------
// 5. KTU LOGO PNG
// ---------------------------------------------------------
function createKTULogo() {
  const canvas = createCanvas(180, 180);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 180, 180);

  // Outer Shield Path
  ctx.beginPath();
  ctx.moveTo(90, 15);
  ctx.lineTo(155, 45);
  ctx.lineTo(155, 115);
  ctx.quadraticCurveTo(90, 170, 90, 170);
  ctx.quadraticCurveTo(25, 115, 25, 115);
  ctx.lineTo(25, 45);
  ctx.closePath();
  ctx.fillStyle = '#0f4c81';
  ctx.fill();
  ctx.strokeStyle = '#0a2e50';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Inner Banner / Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Times New Roman';
  ctx.textAlign = 'center';
  ctx.fillText('APJ ABDUL KALAM', 90, 50);
  ctx.font = 'bold 12px Times New Roman';
  ctx.fillText('TECHNOLOGICAL', 90, 68);
  ctx.fillText('UNIVERSITY', 90, 84);

  // Red Stripe Box
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(45, 95, 90, 30);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('KTU', 90, 117);

  // Estd Year
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px Arial';
  ctx.fillText('ESTD 2014', 90, 145);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'ktu_logo.png'), buffer);
  console.log('Saved ktu_logo.png');
}

// ---------------------------------------------------------
// 6. MEA LOGO PNG
// ---------------------------------------------------------
function createMEALogo() {
  const canvas = createCanvas(180, 180);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 180, 180);

  // Outer Circle / Gear shape
  ctx.beginPath();
  ctx.arc(90, 90, 75, 0, Math.PI * 2);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Gear teeth
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const x1 = 90 + Math.cos(angle) * 75;
    const y1 = 90 + Math.sin(angle) * 75;
    const x2 = 90 + Math.cos(angle) * 83;
    const y2 = 90 + Math.sin(angle) * 83;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 8;
    ctx.stroke();
  }

  // Inner Emblem "M"
  ctx.beginPath();
  ctx.arc(90, 90, 60, 0, Math.PI * 2);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 50px Times New Roman';
  ctx.textAlign = 'center';
  ctx.fillText('M', 90, 105);

  // Banner
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(25, 125, 130, 22);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px Arial';
  ctx.fillText('MEA ENGINEERING COLLEGE', 90, 139);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 8px Arial';
  ctx.fillText('KNOWLEDGE IS POWER', 90, 160);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'mea_logo.png'), buffer);
  console.log('Saved mea_logo.png');
}

// Generate all diagrams and logos
createUseCaseDiagram();
createLevel0DFD();
createLevel1DFD();
createLevel2DFD();
createKTULogo();
createMEALogo();

console.log('All DFD diagrams and logos successfully generated!');
