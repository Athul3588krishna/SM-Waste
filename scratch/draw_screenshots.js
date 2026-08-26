const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const outputDir = path.join(__dirname, 'diagrams');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

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
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

// 1. Citizen Dashboard Mockup
function drawCitizenMockup() {
  const canvas = createCanvas(750, 480);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0b0f19';
  ctx.fillRect(0, 0, 750, 480);

  // Navbar
  drawRoundedRect(ctx, 15, 15, 720, 50, 8, 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)');
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('EcoClean', 35, 45);

  // EN|ML Toggle
  drawRoundedRect(ctx, 580, 27, 70, 26, 13, 'rgba(16,185,129,0.2)', '#10b981');
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px Arial';
  ctx.fillText('🌐 ML', 596, 44);

  // Eco Credit Card
  drawRoundedRect(ctx, 35, 90, 320, 190, 14, 'linear-gradient(135deg, #064e3b, #022c22)', '#10b981');
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px Arial';
  ctx.fillText('CITIZEN ECO-CARD', 55, 120);
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 10px Arial';
  ctx.fillText('ECO WARRIOR', 260, 120);
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 16px Courier New';
  ctx.fillText('4582  8910  3412  9018', 55, 180);
  ctx.font = '11px Arial';
  ctx.fillText('ATHUL KRISHNA R', 55, 235);
  ctx.fillText('500 PTS', 270, 235);

  // Reports List
  drawRoundedRect(ctx, 380, 90, 335, 360, 12, 'rgba(255,255,255,0.02)', 'rgba(255,255,255,0.08)');
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('My Reported Dumps (3)', 400, 120);

  // Card 1
  drawRoundedRect(ctx, 395, 140, 305, 60, 8, 'rgba(255,255,255,0.03)', 'rgba(16,185,129,0.3)');
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px Arial';
  ctx.fillText('Market Road Garbage Spot', 410, 165);
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 10px Arial';
  ctx.fillText('📄 Receipt', 635, 165);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Arial';
  ctx.fillText('Status: Cleaned & Verified', 410, 185);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'app_citizen_dashboard.png'), buffer);
  console.log('Saved app_citizen_dashboard.png');
}

// 2. AI Scanner Mockup
function drawAIScannerMockup() {
  const canvas = createCanvas(750, 480);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0b0f19';
  ctx.fillRect(0, 0, 750, 480);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('AI Predictive Waste Scan & Geotag', 30, 40);

  // Upload Area
  drawRoundedRect(ctx, 30, 70, 400, 370, 12, 'rgba(255,255,255,0.02)', '#10b981');
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 110, 340, 240);

  // AI Bounding Box
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.strokeRect(120, 150, 220, 150);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(120, 125, 150, 25);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px Arial';
  ctx.fillText('PLASTIC WASTE (94%)', 130, 142);

  // Side Details Panel
  drawRoundedRect(ctx, 450, 70, 270, 370, 12, 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0.1)');
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('AI Analysis Result', 470, 110);
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px Arial';
  ctx.fillText('Predicted Category: Plastic', 470, 150);
  ctx.fillText('Severity Level: HIGH', 470, 180);
  ctx.fillText('GPS Latitude: 10.9752 N', 470, 210);
  ctx.fillText('GPS Longitude: 76.2238 E', 470, 240);

  drawRoundedRect(ctx, 470, 360, 230, 45, 8, '#10b981', null);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Submit Dump Report', 510, 388);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'app_ai_scanner.png'), buffer);
  console.log('Saved app_ai_scanner.png');
}

// 3. Admin Console & Receipt Mockup
function drawAdminReceiptMockup() {
  const canvas = createCanvas(750, 480);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 750, 480);

  // Receipt Card Border
  drawRoundedRect(ctx, 40, 20, 670, 440, 10, '#f8fafc', '#10b981');

  // Title
  ctx.fillStyle = '#064e3b';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('ECOCLEAN MUNICIPAL SANITATION PORTAL', 375, 60);
  ctx.fillStyle = '#047857';
  ctx.font = 'bold 13px Arial';
  ctx.fillText('OFFICIAL CIVIC INCIDENT RESOLUTION RECEIPT', 375, 85);

  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 100);
  ctx.lineTo(670, 100);
  ctx.stroke();

  // Grid Info
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#334155';
  ctx.fillText('Ticket Reference: #EC-9018F4A', 80, 135);
  ctx.fillText('Issued Date: 23/10/2026', 420, 135);
  ctx.fillText('Reporter Name: ATHUL KRISHNA R', 80, 165);
  ctx.fillText('Rank: ECO WARRIOR', 420, 165);
  ctx.fillText('Reward Points Awarded: +50 Eco-Points', 80, 195);
  ctx.fillText('Assigned Unit: Ward 4 Sanitation Crew', 420, 195);

  // Photos Box
  drawRoundedRect(ctx, 80, 220, 270, 140, 6, '#fee2e2', '#ef4444');
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 11px Arial';
  ctx.fillText('BEFORE: REPORTED DUMP', 100, 245);

  drawRoundedRect(ctx, 380, 220, 270, 140, 6, '#dcfce7', '#16a34a');
  ctx.fillStyle = '#16a34a';
  ctx.font = 'bold 11px Arial';
  ctx.fillText('AFTER: CLEANED & VERIFIED SITE', 400, 245);

  // Official Stamp Seal
  ctx.strokeStyle = '#047857';
  ctx.lineWidth = 3;
  ctx.strokeRect(500, 385, 170, 45);
  ctx.fillStyle = '#047857';
  ctx.font = 'bold 13px Arial';
  ctx.fillText('✓ VERIFIED & RESOLVED', 510, 412);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, 'app_resolution_receipt.png'), buffer);
  console.log('Saved app_resolution_receipt.png');
}

drawCitizenMockup();
drawAIScannerMockup();
drawAdminReceiptMockup();
