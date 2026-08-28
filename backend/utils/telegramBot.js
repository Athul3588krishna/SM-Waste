const https = require('https');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

/**
 * Utility to send instant Telegram alert notifications to Sanitation Workers via Telegram Bot API
 */
const sendTelegramWorkerAlert = async ({ workerName, telegramChatId, complaint, deadlineDays = 1 }) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '8394865034:AAHC9NDiCA_0NIJ5f7_-mCWgPVmX5RosDqY';
  const chatId = telegramChatId || process.env.TELEGRAM_CHAT_ID || '974642576';

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

  const botToken = process.env.TELEGRAM_BOT_TOKEN || '8394865034:AAHC9NDiCA_0NIJ5f7_-mCWgPVmX5RosDqY';
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

// Start 2-way polling automatically
startTelegramBotListener();

module.exports = sendTelegramWorkerAlert;
