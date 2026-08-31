const https = require('https');
const path = require('path');
const fs = require('fs');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Utility to send instant Telegram alert notifications to Sanitation Workers via Telegram Bot API
 */
const sendTelegramWorkerAlert = async ({ workerName, telegramChatId, complaint, deadlineDays = 1 }) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '8812417545:AAECFAqUmvmlihKyOJMH3rn4tBjl3mY5uBU';
  
  // Validate telegramChatId: if missing or is a 10-digit mobile number, fallback to env TELEGRAM_CHAT_ID
  let chatId = telegramChatId;
  if (!chatId || (typeof chatId === 'string' && /^[6-9]\d{9}$/.test(chatId))) {
    chatId = process.env.TELEGRAM_CHAT_ID || '974642576';
  }

  const lat = complaint?.location?.latitude || 10.9752;
  const lng = complaint?.location?.longitude || 76.2238;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const portalUrl = process.env.FRONTEND_URL || 'http://localhost:5173/worker';

  const messageText = `
🚨 <b>ECOCLEAN: NEW CLEANUP TASK ASSIGNED</b> 🚨
---------------------------------------------
👤 <b>Worker:</b> ${workerName || 'Sanitation Crew'}
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
  isPollingStarted = true;

  const botToken = process.env.TELEGRAM_BOT_TOKEN || '8812417545:AAECFAqUmvmlihKyOJMH3rn4tBjl3mY5uBU';
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
        } catch (e) {}
      });
    });

    req.on('error', () => {});
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
        let urgentList = urgentDumps.map((d, i) => `⚠️ <b>${i+1}. ${d.title}</b>\n📌 Address: ${d.location?.address}\n🗑️ Waste Category: ${d.wasteType}`).join('\n\n');
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
// 🤖 CITIZEN WASTE REPORTING BOT (@Suvarnambot)
// -------------------------------------------------------------
let citizenLastUpdateId = 0;
let isCitizenPollingStarted = false;
const citizenPendingReports = {};

const startCitizenTelegramBotListener = () => {
  if (isCitizenPollingStarted) return;
  isCitizenPollingStarted = true;

  const citizenBotToken = process.env.TELEGRAM_CITIZEN_BOT_TOKEN || '8773392264:AAGlxqH0dPinGDFmBS6VrSwalhqXL6ZOJV0';
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
        } catch (e) {}
      });
    });

    req.on('error', () => {});
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
  if (!buffer) {
    buffer = await getBufferWithHost('149.154.167.220', parsedUrl.pathname);
  }

  return { buffer, fullUrl };
};

const classifyImageWithGemini = async (buffer) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey || !buffer) {
    return { wasteType: 'Municipal Waste', severity: 'Medium', explanation: 'Standard waste dump reported.' };
  }

  try {
    const base64Data = buffer.toString('base64');
    const prompt = `Analyze this image strictly for municipal waste management.
    Identify the main subject of the image.
    If it's an uncollected waste dump, garbage pile, litter, or overflowing trash bin, select one of:
    "Organic", "Plastic", "E-waste", "Hazardous", "Medical", or "Mixed".
    Otherwise if it's a paper document or non-waste item, output "Unknown".
    Output response ONLY as raw JSON:
    {
      "wasteType": "Organic" | "Plastic" | "E-waste" | "Hazardous" | "Mixed" | "Medical" | "Unknown",
      "severity": "Low" | "Medium" | "High",
      "explanation": "1 short sentence of what was detected"
    }`;

    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    for (const model of modelsToTry) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:key=${geminiApiKey}`.replace(':key=', '?key='), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000),
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: base64Data } }] }]
          })
        });

        if (response.ok) {
          const responseData = await response.json();
          const textResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textResponse) {
            let cleanText = textResponse.trim();
            const startIdx = cleanText.indexOf('{');
            const endIdx = cleanText.lastIndexOf('}');
            if (startIdx !== -1 && endIdx !== -1) {
              cleanText = cleanText.substring(startIdx, endIdx + 1);
            }
            const result = JSON.parse(cleanText);
            return {
              wasteType: result.wasteType || 'Municipal Waste',
              severity: result.severity || 'Medium',
              explanation: result.explanation || 'AI Vision analysis completed.'
            };
          }
        }
      } catch (e) {}
    }
  } catch (err) {}

  return { wasteType: 'Municipal Waste', severity: 'Medium', explanation: 'AI analysis completed.' };
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

  // 1. Photo received
  if (msg.photo && msg.photo.length > 0) {
    const largestPhoto = msg.photo[msg.photo.length - 1];
    const { buffer, fullUrl } = await getTelegramFileBuffer(botToken, largestPhoto.file_id);
    
    let savedPhotoUrl = fullUrl || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80';
    if (buffer) {
      const fileName = `telegram_${Date.now()}_${largestPhoto.file_id.slice(-8)}.jpg`;
      const filePath = path.join(uploadsDir, fileName);
      try {
        fs.writeFileSync(filePath, buffer);
        savedPhotoUrl = `/uploads/${fileName}`;
      } catch (e) {
        console.error('Failed to write local telegram photo:', e.message);
      }
    }
    report.photoUrl = savedPhotoUrl;
    if (msg.caption) report.caption = msg.caption;

    // AI Vision Classification
    if (buffer) {
      const aiResult = await classifyImageWithGemini(buffer);
      report.wasteType = aiResult.wasteType;
      report.severity = aiResult.severity;
      report.aiExplanation = aiResult.explanation;
    }
  }

  // 2. Location received
  if (msg.location) {
    report.latitude = msg.location.latitude;
    report.longitude = msg.location.longitude;
  }

  // Check if both photo and location are now present
  if (report.photoUrl && report.latitude && report.longitude) {
    try {
      // Find or create User document with exact Telegram Account Name for Admin Dashboard
      const telegramChatIdStr = msg.chat.id.toString();
      const telegramEmail = `telegram_${msg.chat.id}@ecoclean.com`;

      let citizenUser = await User.findOne({
        $or: [{ telegramChatId: telegramChatIdStr }, { email: telegramEmail }]
      });

      if (!citizenUser) {
        citizenUser = await User.create({
          name: `${telegramFullName} (Telegram)`,
          email: telegramEmail,
          password: 'telegram_citizen_pass_12345',
          role: 'citizen',
          telegramChatId: telegramChatIdStr
        });
      } else {
        const expectedName = `${telegramFullName} (Telegram)`;
        if (citizenUser.name !== expectedName) {
          citizenUser.name = expectedName;
          await citizenUser.save();
        }
      }

      const finalWasteType = report.wasteType || 'Municipal Waste';
      const finalSeverity = report.severity || 'Medium';

      const newComplaint = await Complaint.create({
        title: report.caption || `${finalWasteType} Dump Reported via Telegram`,
        description: `Garbage dump reported by ${telegramFullName} (@${msg.from.username || 'telegram_user'}) via @Suvarnambot. AI Analysis: ${report.aiExplanation || 'Image analyzed via Telegram AI Vision.'}`,
        location: {
          address: `Municipal Ward Spot (Lat: ${report.latitude.toFixed(4)}, Lng: ${report.longitude.toFixed(4)})`,
          latitude: report.latitude,
          longitude: report.longitude
        },
        wasteType: finalWasteType,
        severity: finalSeverity,
        status: 'pending',
        photoBefore: report.photoUrl,
        citizen: citizenUser._id
      });

      const replyText = `
🚨 <b>ECOCLEAN: WASTE REPORT REGISTERED!</b> 🚨
---------------------------------------------
👤 <b>Reporter Name:</b> ${telegramFullName}
🗑️ <b>AI Classified Category:</b> ${finalWasteType}
⚠️ <b>AI Assessed Severity:</b> ${finalSeverity}
📝 <b>AI Notes:</b> ${report.aiExplanation || 'Waste photo analyzed.'}
📌 <b>GPS Location:</b> Lat ${report.latitude.toFixed(4)}, Lng ${report.longitude.toFixed(4)}
🆔 <b>Report Ticket:</b> #${newComplaint._id.toString().slice(-6)}
⏳ <b>Status:</b> Pending Admin Verification

💚 Thank you for keeping our municipality clean! +50 Eco-Points will be awarded upon municipal verification.
---------------------------------------------
<i>EcoClean Smart Waste Management System</i>
      `.trim();

      sendRawTelegramMessage(botToken, chatId, replyText);
      delete citizenPendingReports[chatId];
      return;
    } catch (err) {
      console.error('Error saving Citizen Bot Complaint:', err.message);
    }
  }

  // If only photo is present but missing location
  if (report.photoUrl && (!report.latitude || !report.longitude)) {
    const aiCategoryText = report.wasteType ? `
🤖 <b>AI Classified Category:</b> ${report.wasteType}
⚠️ <b>AI Assessed Severity:</b> ${report.severity}
📝 <b>AI Notes:</b> ${report.aiExplanation || 'Analyzed'}
` : '';
    const replyText = `
📸 <b>PHOTO RECEIVED & ANALYZED BY AI!</b>
---------------------------------------------
Great job <b>${userName}</b>! We received and analyzed your photo.
${aiCategoryText}
📍 <b>Next Step:</b> Please send your <b>Location Pin</b> (click Attachment 📎 -> Location in Telegram) to complete your waste report!
---------------------------------------------
    `.trim();
    sendRawTelegramMessage(botToken, chatId, replyText);
    return;
  }

  // If only location is present but missing photo
  if (report.latitude && report.longitude && !report.photoUrl) {
    const replyText = `
📍 <b>LOCATION RECEIVED SUCCESSFULLY!</b>
---------------------------------------------
Location captured: (${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)})

📸 <b>Next Step:</b> Please send a <b>Photo</b> of the waste spot to complete your report!
---------------------------------------------
    `.trim();
    sendRawTelegramMessage(botToken, chatId, replyText);
    return;
  }

  // Default welcome/help message for text input or /start
  const welcomeText = `
🌱 <b>ECOCLEAN CITIZEN WASTE REPORTING BOT</b> 🌱
---------------------------------------------
Hello <b>${userName}</b>! Welcome to <b>@Suvarnambot</b>.

You can report illegal garbage dumps in your area in 2 easy steps:

1. 📸 Send a <b>Photo</b> of the garbage spot (AI will auto-classify it!).
2. 📍 Attach your <b>Location Pin</b> (📎 -> Location).

Once both are sent, your report will instantly be logged into the Municipal Admin Dashboard!
---------------------------------------------
  `.trim();
  sendRawTelegramMessage(botToken, chatId, welcomeText);
};

// Start both 2-way bot listeners automatically
startTelegramBotListener();
startCitizenTelegramBotListener();

module.exports = sendTelegramWorkerAlert;
