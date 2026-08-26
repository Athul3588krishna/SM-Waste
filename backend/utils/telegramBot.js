const https = require('https');

/**
 * Utility to send instant Telegram alert notifications to Sanitation Workers via Telegram Bot API
 * @param {Object} params 
 * @param {string} params.workerName - Name of the assigned worker
 * @param {string} params.telegramChatId - Worker's Telegram Chat ID (or fallback to global env chat ID)
 * @param {Object} params.complaint - Complaint details object
 * @param {number} params.deadlineDays - Assignment deadline in days
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

  const data = JSON.stringify({
    chat_id: chatId,
    text: messageText,
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
              console.log(`✅ Telegram Mobile Alert sent to ${workerName} (ChatID: ${chatId}) successfully!`);
              resolve({ success: true, data: parsed.result });
            } else {
              console.error('❌ Telegram API error:', parsed);
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

  // Try hostname first, fallback to Telegram official IP if DNS is unresponsive
  let result = await sendWithHost('api.telegram.org');
  if (!result.success) {
    result = await sendWithHost('149.154.167.220');
  }
  return result;
};

module.exports = sendTelegramWorkerAlert;
