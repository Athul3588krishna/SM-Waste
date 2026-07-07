const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || 'EcoClean <noreply@ecoclean.com>';

  const isSmtpConfigured = smtpHost && smtpPort && smtpUser && smtpPass;

  if (isSmtpConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const message = {
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await transporter.sendMail(message);
      console.log(`Email sent successfully: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('Nodemailer failed to send email. Falling back to log:', error.message);
      logEmailFallback(options);
    }
  } else {
    logEmailFallback(options);
  }
};

// Console logger fallback if email credentials are not set up
const logEmailFallback = (options) => {
  console.log('\n==================================================');
  console.log('📬 [EMAIL NOTIFICATION SIMULATOR]');
  console.log(`To:      ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log('--------------------------------------------------');
  console.log(options.text);
  console.log('==================================================\n');
};

module.exports = sendEmail;
