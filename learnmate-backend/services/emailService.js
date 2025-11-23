const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Test connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email service configuration error:', error.message);
    console.log('📧 Email features will not work. Please configure SMTP settings in .env');
  } else {
    console.log('✅ Email service is ready');
  }
});

const buildVerifyUrl = (verificationToken) =>
  `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

const buildResetUrl = (resetToken) =>
  `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

exports.sendVerificationEmail = async (email, verificationToken, userName) => {
  const verifyUrl = buildVerifyUrl(verificationToken);

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"LearnMate" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '✉ Verify Your Email - LearnMate',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Welcome to LearnMate!</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName}! 👋</h2>
              <p>Thanks for joining LearnMate. We're excited to help you achieve your learning goals!</p>
              <p>Please verify your email address by clicking the button below:</p>
              <div style="text-align: center;">
                <a href="${verifyUrl}" class="button">Verify Email Address</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="background: #fff; padding: 10px; border-radius: 5px; word-break: break-all;">
                ${verifyUrl}
              </p>
              <p><strong>⏰ This link expires in 24 hours.</strong></p>
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2025 LearnMate. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send verification email:', error.message);
    throw error;
  }
};

exports.sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetUrl = buildResetUrl(resetToken);

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"LearnMate" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🔐 Password Reset Request - LearnMate',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Hi ${userName},</h2>
            <p>You requested a password reset for your LearnMate account.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">Reset Password</a>
            <p>Or copy this link: ${resetUrl}</p>
            <p><strong>This link expires in 1 hour.</strong></p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </body>
        </html>
      `
    });
    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error.message);
    throw error;
  }
};


