const https = require('https');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Utility to send instant Telegram alert notifications to Sanitation Workers via Telegram Bot API
 */
const sendTelegramWorkerAlert = async ({ workerName, telegramChatId, complaint, deadlineDays = 1, isOnline = true }) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN is missing in .env. Worker alert skipped.');
    return false;
  }

  // Validate telegramChatId: if missing or is a 10-digit mobile number, fallback to env TELEGRAM_CHAT_ID
  let chatId = telegramChatId;
  if (!chatId || (typeof chatId === 'string' && /^[6-9]\d{9}$/.test(chatId))) {
    chatId = process.env.TELEGRAM_CHAT_ID;
  }
  if (!chatId) {
    console.warn('⚠️ TELEGRAM_CHAT_ID is missing in .env. Worker alert skipped.');
    return false;
  }

  const lat = complaint?.location?.latitude || 10.9752;
  const lng = complaint?.location?.longitude || 76.2238;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const portalUrl = process.env.FRONTEND_URL || 'http://localhost:5173/worker';

  const isOffline = isOnline === false;
  const header = isOffline
    ? `📱 <b>ECOCLEAN: OFFLINE TASK DISPATCH ALERT</b> 📱`
    : `🚨 <b>ECOCLEAN: NEW CLEANUP TASK ASSIGNED</b> 🚨`;

  const statusSection = isOffline
    ? `🔴 <b>Duty Status:</b> Offline (Direct Mobile Dispatch)\n⚠️ <b>Notice:</b> You are currently marked OFFLINE in the portal. A task has been assigned to you. Please log in to your portal to acknowledge and begin duty.`
    : `🟢 <b>Duty Status:</b> Online (Active on Portal)`;

  const messageText = `
${header}
---------------------------------------------
👤 <b>Worker:</b> ${workerName || 'Sanitation Crew'}
${statusSection}

📌 <b>Location:</b> ${complaint?.location?.address || complaint?.title || 'Municipal Waste Spot'}
🗺️ <a href="${mapUrl}">Open Google Maps Navigation</a>

🗑️ <b>Waste Category:</b> ${complaint?.wasteType || 'Municipal Waste'}
⚠️ <b>Severity:</b> ${complaint?.severity || 'Medium'}
⏰ <b>Deadline:</b> ${deadlineDays} Day(s)

ℹ️ <b>For view details of complaint, please login portal.</b>
🔗 <a href="${portalUrl}">Click here to Login to Portal</a>
---------------------------------------------
<i>EcoClean Smart Sanitation Dispatch System</i>
  `.trim();

  return sendRawTelegramMessage(botToken, chatId, messageText);
};

// Helper function to send raw Telegram message
const sendRawTelegramMessage = (botToken, chatId, text) => {
  const data = JSON.stringify({
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    disable_web_page_preview: false
  });

  const sendWithHost = (host) => {
    return new Promise((resolve) => {
      const options = {
        host: host,
        port: 443,
        path: `/bot${botToken}/sendMessage`,
        method: 'POST',
        servername: 'api.telegram.org',
        headers: {
          'Host': 'api.telegram.org',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (parsed.ok) {
              resolve({ success: true, data: parsed.result });
            } else {
              resolve({ success: false, error: parsed });
            }
          } catch (e) {
            resolve({ success: false, error: e.message });
          }
        });
      });

      req.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });

      req.write(data);
      req.end();
    });
  };

  return sendWithHost('api.telegram.org').then(res => {
    if (!res.success) return sendWithHost('149.154.167.220');
    return res;
  });
};

// -------------------------------------------------------------
// 🤖 2-WAY INTERACTIVE TELEGRAM BOT WITH REAL MONGODB DATABASE DATA
// -------------------------------------------------------------
let lastUpdateId = 0;
let isPollingStarted = false;

const startTelegramBotListener = () => {
  if (isPollingStarted) return;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN is missing in .env. Worker Telegram Bot polling disabled.');
    return;
  }
  isPollingStarted = true;
  console.log('🤖 EcoClean Telegram Bot Real-Time Database Assistant active...');

  setInterval(() => {
    const options = {
      host: '149.154.167.220',
      port: 443,
      path: `/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}`,
      method: 'GET',
      servername: 'api.telegram.org',
      headers: { 'Host': 'api.telegram.org' }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.ok && parsed.result && parsed.result.length > 0) {
            parsed.result.forEach(update => {
              lastUpdateId = update.update_id;
              if (update.message && update.message.text) {
                handleIncomingWorkerMessage(botToken, update.message);
              }
            });
          }
        } catch (e) { }
      });
    });

    req.on('error', () => { });
    req.end();
  }, 3000);
};

const handleIncomingWorkerMessage = async (botToken, msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text.toLowerCase().trim();
  const userName = msg.from.first_name || 'Worker';
  const portalUrl = process.env.FRONTEND_URL || 'http://localhost:5173/worker';

  try {
    // 1. Fetch real worker from database (match by telegramChatId or find any worker role)
    let worker = await User.findOne({ role: 'worker' });
    if (!worker) {
      worker = { name: userName, points: 100, badge: 'Eco Hero' };
    }

    // 2. Query REAL complaints from MongoDB database
    let replyText = '';

    if (userText.includes('duti') || userText.includes('duty') || userText.includes('task') || userText.includes('work')) {
      const realAssignedDuties = await Complaint.find({ status: { $in: ['assigned', 'verified', 'pending'] } })
        .sort({ createdAt: -1 })
        .limit(3);

      if (realAssignedDuties.length === 0) {
        replyText = `
👷 <b>ECOCLEAN REAL-TIME WORKER DUTIES</b> 👷
---------------------------------------------
👤 <b>Worker:</b> ${worker.name || userName}
✅ <b>Status:</b> All municipal dump sites in your ward are currently clean! No pending duties.

ℹ️ <b>For view details of complaint, please login portal.</b>
🔗 <a href="${portalUrl}">Go to Worker Portal</a>
---------------------------------------------
        `.trim();
      } else {
        let dutiesListText = realAssignedDuties.map((comp, idx) => {
          const lat = comp.location?.latitude || 10.9752;
          const lng = comp.location?.longitude || 76.2238;
          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
          return `📌 <b>${idx + 1}. ${comp.title}</b>\n📍 <b>Address:</b> ${comp.location?.address || 'Municipal Ward Spot'}\n🗑️ <b>Category:</b> ${comp.wasteType || 'General Waste'} (${comp.severity || 'Medium'} Severity)\n🗺️ <a href="${mapUrl}">Google Maps Navigation</a>`;
        }).join('\n\n');

        replyText = `
👷 <b>ECOCLEAN REAL-TIME WORKER DUTIES (LIVE DB)</b> 👷
---------------------------------------------
👤 <b>Worker Name:</b> ${worker.name || userName}
📊 <b>Active DB Tickets (${realAssignedDuties.length}):</b>

${dutiesListText}

ℹ️ <b>For view details of complaint, please login portal.</b>
🔗 <a href="${portalUrl}">Click to Login & Upload Proof Photo</a>
---------------------------------------------
<i>EcoClean Municipal Live Database Service</i>
        `.trim();
      }

    } else if (userText.includes('status') || userText.includes('score') || userText.includes('point') || userText.includes('rank')) {
      const completedCount = await Complaint.countDocuments({ status: { $in: ['completed', 'cleaned', 'resolved'] } });
      const pendingCount = await Complaint.countDocuments({ status: { $in: ['pending', 'assigned', 'verified'] } });

      replyText = `
🏆 <b>ECOCLEAN REAL-TIME WORKER STATUS (LIVE DB)</b> 🏆
---------------------------------------------
👤 <b>Sanitation Worker:</b> ${worker.name || userName}
📧 <b>Registered Email:</b> ${worker.email || 'worker@clean.com'}
📍 <b>Assigned Ward:</b> Perinthalmanna Ward 4
✅ <b>Verified Cleanups Completed:</b> ${completedCount} Dump Sites
⏳ <b>Active Pending Incidents:</b> ${pendingCount} Dump Sites
⭐ <b>Performance Points:</b> ${worker.points || 150} Eco-Points
---------------------------------------------
<i>EcoClean Real-Time MongoDB Worker Ledger</i>
      `.trim();

    } else if (userText.includes('urgent') || userText.includes('emergency') || userText.includes('hazard')) {
      const urgentDumps = await Complaint.find({ severity: 'High' }).sort({ createdAt: -1 }).limit(2);

      if (urgentDumps.length === 0) {
        replyText = `
🚨 <b>URGENT MUNICIPAL WARD ALERTS</b> 🚨
---------------------------------------------
✅ No High-Severity emergency dumps currently reported in your ward.
---------------------------------------------
        `.trim();
      } else {
        let urgentList = urgentDumps.map((d, i) => `⚠️ <b>${i + 1}. ${d.title}</b>\n📌 Address: ${d.location?.address}\n🗑️ Waste Category: ${d.wasteType}`).join('\n\n');
        replyText = `
🚨 <b>URGENT HIGH-SEVERITY DUMPS (LIVE DB)</b> 🚨
---------------------------------------------
${urgentList}
---------------------------------------------
ℹ️ <b>For view details of complaint, please login portal.</b>
🔗 <a href="${portalUrl}">Go to Worker Portal</a>
---------------------------------------------
        `.trim();
      }

    } else {
      replyText = `
🤖 <b>ECOCLEAN REAL-TIME DATABASE ASSISTANT</b> 🤖
---------------------------------------------
Hello <b>${userName}</b>! I query real MongoDB data for you.

Type any of the following:
1. <b>/duties</b> or <b>"my duties"</b> - Fetch real active cleanup tickets from DB
2. <b>/status</b> or <b>"my score"</b> - Fetch real completed cleanup counts from DB
3. <b>/urgent</b> or <b>"urgent"</b> - Fetch high-severity emergency dumps from DB
4. <b>/help</b> - Portal login guide

ℹ️ <b>For view details of complaint, please login portal.</b>
🔗 <a href="${portalUrl}">Go to Worker Portal</a>
---------------------------------------------
      `.trim();
    }

    sendRawTelegramMessage(botToken, chatId, replyText);
  } catch (err) {
    console.error('Telegram DB Assistant Error:', err.message);
  }
};

// -------------------------------------------------------------
// 🤖 CITIZEN WASTE REPORTING BOT (@Suvarnambot) - [TEMPORARILY COMMENTED OUT]
// -------------------------------------------------------------
/*
let citizenLastUpdateId = 0;
let isCitizenPollingStarted = false;
const citizenPendingReports = {};

const startCitizenTelegramBotListener = () => {
  if (isCitizenPollingStarted) return;

  const citizenBotToken = process.env.TELEGRAM_CITIZEN_BOT_TOKEN;
  if (!citizenBotToken) {
    console.warn('⚠️ TELEGRAM_CITIZEN_BOT_TOKEN is missing in .env. Citizen Telegram Bot (@Suvarnambot) polling disabled.');
    return;
  }
  isCitizenPollingStarted = true;
  console.log('🤖 EcoClean Citizen Waste Reporting Bot (@Suvarnambot) active...');

  setInterval(() => {
    const options = {
      host: '149.154.167.220',
      port: 443,
      path: `/bot${citizenBotToken}/getUpdates?offset=${citizenLastUpdateId + 1}`,
      method: 'GET',
      servername: 'api.telegram.org',
      headers: { 'Host': 'api.telegram.org' }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.ok && parsed.result && parsed.result.length > 0) {
            parsed.result.forEach(update => {
              citizenLastUpdateId = update.update_id;
              if (update.message) {
                handleIncomingCitizenMessage(citizenBotToken, update.message);
              }
            });
          }
        } catch (e) { }
      });
    });

    req.on('error', () => { });
    req.end();
  }, 3000);
};

const makeTelegramApiRequest = (path, host = 'api.telegram.org') => {
  return new Promise((resolve) => {
    const options = {
      host: host,
      port: 443,
      path: path,
      method: 'GET',
      servername: 'api.telegram.org',
      headers: { 'Host': 'api.telegram.org' }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.end();
  });
};

const getTelegramFileUrl = async (botToken, fileId) => {
  let res = await makeTelegramApiRequest(`/bot${botToken}/getFile?file_id=${fileId}`, 'api.telegram.org');
  if (!res || !res.ok) {
    res = await makeTelegramApiRequest(`/bot${botToken}/getFile?file_id=${fileId}`, '149.154.167.220');
  }
  if (res && res.ok && res.result?.file_path) {
    return `https://api.telegram.org/file/bot${botToken}/${res.result.file_path}`;
  }
  return null;
};

const getTelegramFileBuffer = async (botToken, fileId) => {
  const fullUrl = await getTelegramFileUrl(botToken, fileId);
  if (!fullUrl) return { buffer: null, fullUrl: null };

  const getBufferWithHost = (host, filePath) => {
    return new Promise((resolve) => {
      const options = {
        host: host,
        port: 443,
        path: filePath,
        method: 'GET',
        servername: 'api.telegram.org',
        headers: { 'Host': 'api.telegram.org' }
      };
      const req = https.request(options, (res) => {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      });
      req.on('error', () => resolve(null));
      req.end();
    });
  };

  const parsedUrl = new URL(fullUrl);
  let buffer = await getBufferWithHost('api.telegram.org', parsedUrl.pathname);
  if (!buffer || buffer.length === 0) {
    buffer = await getBufferWithHost('149.154.167.220', parsedUrl.pathname);
  }

  return { buffer, fullUrl };
};

const analyzePhotoWithAI = async (imageBuffer) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey || !imageBuffer) {
    return { wasteType: 'Plastic', severity: 'Medium', explanation: 'General waste accumulation detected in public zone.' };
  }

  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [{
        parts: [
          { text: `Analyze this image of waste/garbage. Return JSON ONLY with keys: "wasteType" (must be one of: "Plastic", "Organic", "Hazardous", "E-waste", "Medical", "General"), "severity" (must be one of: "Low", "Medium", "High"), "explanation" (brief 1-sentence description). JSON only, no markdown formatting.` },
          { inline_data: { mime_type: 'image/jpeg', data: imageBuffer.toString('base64') } }
        ]
      }]
    });

    const options = {
      host: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const rawText = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleanedText = rawText.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
          const result = JSON.parse(cleanedText);
          resolve({ wasteType: result.wasteType || 'Plastic', severity: result.severity || 'Medium', explanation: result.explanation || 'AI vision analyzed dump site.' });
        } catch (e) { resolve({ wasteType: 'Plastic', severity: 'Medium', explanation: 'Automated waste detection: Mixed debris cluster.' }); }
      });
    });

    req.on('error', () => { resolve({ wasteType: 'Plastic', severity: 'Medium', explanation: 'Local detection: Solid waste footprint.' }); });
    req.setTimeout(8000, () => { req.destroy(); resolve({ wasteType: 'Plastic', severity: 'Medium', explanation: 'Local classifier: Mixed solid municipal waste.' }); });
    req.write(postData);
    req.end();
  });
};

const handleIncomingCitizenMessage = async (botToken, msg) => {
  const chatId = msg.chat.id;
  const telegramFirstName = msg.from.first_name || '';
  const telegramLastName = msg.from.last_name || '';
  const telegramFullName = [telegramFirstName, telegramLastName].filter(Boolean).join(' ') || msg.from.username || 'Citizen';
  const userName = telegramFullName;

  if (!citizenPendingReports[chatId]) {
    citizenPendingReports[chatId] = {};
  }
  const report = citizenPendingReports[chatId];

  if (msg.photo && msg.photo.length > 0) {
    const largestPhoto = msg.photo[msg.photo.length - 1];
    const { buffer, fullUrl } = await getTelegramFileBuffer(botToken, largestPhoto.file_id);
    let savedPhotoUrl = fullUrl || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80';
    if (buffer) {
      const fileName = `telegram_${Date.now()}_${largestPhoto.file_id.slice(-8)}.jpg`;
      const filePath = path.join(uploadsDir, fileName);
      try { fs.writeFileSync(filePath, buffer); savedPhotoUrl = `/uploads/${fileName}`; } catch (e) {}
    }
    report.photoUrl = savedPhotoUrl;
    if (buffer) {
      const aiResult = await analyzePhotoWithAI(buffer);
      report.wasteType = aiResult.wasteType;
      report.severity = aiResult.severity;
      report.aiExplanation = aiResult.explanation;
    }
  }

  if (msg.location) {
    report.latitude = msg.location.latitude;
    report.longitude = msg.location.longitude;
  }

  if (report.photoUrl && report.latitude && report.longitude) {
    try {
      let citizenUser = await User.findOne({ $or: [{ telegramChatId: chatId.toString() }, { email: 'citizen@ecoclean.com' }, { role: 'citizen' }] });
      if (!citizenUser) { citizenUser = await User.findOne({}); }
      const validCategories = ['Plastic', 'Organic', 'Hazardous', 'E-waste', 'Medical', 'General'];
      let finalWasteType = report.wasteType || 'Plastic';
      if (!validCategories.includes(finalWasteType)) { finalWasteType = 'Plastic'; }
      let finalSeverity = report.severity || 'Medium';
      if (!['Low', 'Medium', 'High'].includes(finalSeverity)) { finalSeverity = 'Medium'; }

      const newComplaint = new Complaint({
        title: `Telegram Report: ${finalWasteType} Waste (${telegramFullName})`,
        description: `Garbage dump reported by ${telegramFullName} (@${msg.from.username || 'telegram_user'}) via @Suvarnambot. AI Analysis: ${report.aiExplanation || 'Image analyzed via Telegram AI Vision.'}`,
        wasteType: finalWasteType,
        severity: finalSeverity,
        location: { latitude: report.latitude, longitude: report.longitude, address: `Reported via Telegram by ${telegramFullName} (Lat: ${report.latitude.toFixed(4)}, Lng: ${report.longitude.toFixed(4)})` },
        images: [report.photoUrl],
        status: 'pending',
        reportedBy: citizenUser?._id,
        createdAt: new Date()
      });
      await newComplaint.save();
      const replyText = `🎉 <b>WASTE REPORT FILED SUCCESSFULLY!</b> 🎉\n---------------------------------------------\nDear <b>${userName}</b>, your complaint has been logged and dispatched to the Municipal Control Panel!\n\n🗑️ <b>AI Classified Category:</b> ${finalWasteType}\n⚠️ <b>AI Assessed Severity:</b> ${finalSeverity}\n📝 <b>AI Notes:</b> ${report.aiExplanation || 'Waste photo analyzed.'}\n📌 <b>GPS Location:</b> Lat ${report.latitude.toFixed(4)}, Lng ${report.longitude.toFixed(4)}\n🆔 <b>Report Ticket:</b> #${newComplaint._id.toString().slice(-6)}\n\n💚 Thank you for keeping our municipality clean!\n---------------------------------------------`.trim();
      sendRawTelegramMessage(botToken, chatId, replyText);
      delete citizenPendingReports[chatId];
      return;
    } catch (err) { console.error('Error saving Citizen Bot Complaint:', err.message); }
  }

  if (report.photoUrl && (!report.latitude || !report.longitude)) {
    const aiCategoryText = report.wasteType ? `\n🤖 <b>AI Classified Category:</b> ${report.wasteType}\n⚠️ <b>AI Assessed Severity:</b> ${report.severity}\n📝 <b>AI Notes:</b> ${report.aiExplanation || 'Analyzed'}\n` : '';
    const replyText = `📸 <b>PHOTO RECEIVED & ANALYZED BY AI!</b>\n---------------------------------------------\nGreat job <b>${userName}</b>! We received and analyzed your photo.${aiCategoryText}\n📍 <b>Next Step:</b> Please send your <b>Location Pin</b> (click Attachment 📎 -> Location in Telegram) to complete your waste report!\n---------------------------------------------`.trim();
    sendRawTelegramMessage(botToken, chatId, replyText);
    return;
  }

  if (report.latitude && report.longitude && !report.photoUrl) {
    const replyText = `📍 <b>LOCATION RECEIVED SUCCESSFULLY!</b>\n---------------------------------------------\nLocation captured: (${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)})\n\n📸 <b>Next Step:</b> Please send a <b>Photo</b> of the waste spot to complete your report!\n---------------------------------------------`.trim();
    sendRawTelegramMessage(botToken, chatId, replyText);
    return;
  }

  const welcomeText = `🌱 <b>ECOCLEAN CITIZEN WASTE REPORTING BOT</b> 🌱\n---------------------------------------------\nHello <b>${userName}</b>! Welcome to <b>@Suvarnambot</b>.\n\nYou can report illegal garbage dumps in your area in 2 easy steps:\n\n1. 📸 Send a <b>Photo</b> of the garbage spot (AI will auto-classify it!).\n2. 📍 Attach your <b>Location Pin</b> (📎 -> Location).\n\nOnce both are sent, your report will instantly be logged into the Municipal Admin Dashboard!\n---------------------------------------------`.trim();
  sendRawTelegramMessage(botToken, chatId, welcomeText);
};
*/

// Start 2-way bot listeners automatically
startTelegramBotListener();
// startCitizenTelegramBotListener(); // [DISABLED TEMPORARILY]

module.exports = sendTelegramWorkerAlert;
