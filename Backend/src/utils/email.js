import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log("Email transporter error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5500"
    }/reset-password.html?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password - Qure Healthcare",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: 'Plus Jakarta Sans', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8fafc;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #3b82f6;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .content {
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background-color: #3b82f6;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 500;
              margin: 20px 0;
              transition: background-color 0.3s ease;
            }
            .button:hover {
              background-color: #2563eb;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #6b7280;
              text-align: center;
            }
            .warning {
              background-color: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              color: #92400e;
            }
            .token {
              background-color: #f3f4f6;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              padding: 10px;
              font-family: monospace;
              font-size: 12px;
              word-break: break-all;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏥 Qure</div>
              <h1 class="title">Reset Your Password</h1>
            </div>
            
            <div class="content">
              <p>Hello,</p>
              
              <p>We received a request to reset your password for your Qure Healthcare account. If you made this request, click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <div class="token">${resetUrl}</div>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link will expire in 10 minutes</li>
                  <li>If you didn't request this password reset, please ignore this email</li>
                  <li>For security, never share this link with anyone</li>
                </ul>
              </div>
              
              <p>If the button doesn't work, you can also manually navigate to the reset password page and use this token:</p>
              <div class="token">${resetToken}</div>
            </div>
            
            <div class="footer">
              <p>This email was sent from Qure Healthcare Queue Management System.</p>
              <p>If you have any questions, please contact our support team.</p>
              <p><strong>Qure Healthcare</strong> - Making healthcare accessible for everyone</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Reset Your Password - Qure Healthcare
        
        Hello,
        
        We received a request to reset your password for your Qure Healthcare account.
        
        To reset your password, click the link below:
        ${resetUrl}
        
        Or copy and paste this link into your browser:
        ${resetUrl}
        
        Important:
        - This link will expire in 10 minutes
        - If you didn't request this password reset, please ignore this email
        - For security, never share this link with anyone
        
        If the link doesn't work, you can also manually navigate to the reset password page and use this token:
        ${resetToken}
        
        This email was sent from Qure Healthcare Queue Management System.
        If you have any questions, please contact our support team.
        
        Qure Healthcare - Making healthcare accessible for everyone
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

// Send welcome email (for future use)
export const sendWelcomeEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Qure Healthcare!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Qure</title>
          <style>
            body {
              font-family: 'Plus Jakarta Sans', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8fafc;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #3b82f6;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .content {
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background-color: #10b981;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 500;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #6b7280;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏥 Qure</div>
              <h1 class="title">Welcome to Qure Healthcare!</h1>
            </div>
            
            <div class="content">
              <p>Hello ${firstName},</p>
              
              <p>Welcome to Qure Healthcare Queue Management System! We're excited to have you on board.</p>
              
              <p>With Qure, you can:</p>
              <ul>
                <li>📅 Book appointments easily</li>
                <li>⏰ Track your queue status in real-time</li>
                <li>🏥 Access multiple healthcare providers</li>
                <li>📱 Manage everything from your mobile device</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${
                  process.env.FRONTEND_URL || "http://localhost:5500"
                }/login.html" class="button">Get Started</a>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing Qure Healthcare!</p>
              <p><strong>Qure Healthcare</strong> - Making healthcare accessible for everyone</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};
