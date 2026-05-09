/**
 * Email Template System
 *
 * This file contains reusable email template functions that generate
 * HTML emails with consistent styling and branding.
 */

// Brand colors and styling constants
const BRAND_COLORS = {
  primary: '#c8a75e',
  primaryLight: '#d4b56d',
  background: '#f5f3ee',
  text: '#333',
  textLight: '#666',
  success: '#27ae60',
  successLight: '#2ecc71',
  danger: '#e74c3c',
  white: '#ffffff',
}

/**
 * Base email template wrapper
 * Provides consistent structure for all emails
 */
export function baseEmailTemplate(params: {
  headerTitle: string
  headerColor?: string
  content: string
  preheader?: string
}): string {
  const { headerTitle, headerColor = BRAND_COLORS.primary, content, preheader = '' } = params

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${headerTitle}</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
      </style>
      <![endif]-->
      <style>
        /* Reset styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

        /* Base styles */
        body {
          margin: 0;
          padding: 0;
          width: 100% !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: ${BRAND_COLORS.text};
          background-color: #f4f4f4;
        }

        /* Container */
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: ${BRAND_COLORS.white};
        }

        /* Header */
        .header {
          background: linear-gradient(135deg, ${headerColor} 0%, ${BRAND_COLORS.primaryLight} 100%);
          color: ${BRAND_COLORS.white};
          padding: 40px 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }

        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
        }

        /* Content */
        .content {
          background: ${BRAND_COLORS.background};
          padding: 40px 30px;
          border-radius: 0 0 10px 10px;
        }

        .content p {
          margin: 0 0 16px 0;
          font-size: 16px;
          line-height: 1.6;
        }

        /* Button */
        .button {
          display: inline-block;
          background: ${BRAND_COLORS.primary};
          color: ${BRAND_COLORS.white} !important;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          margin: 24px 0;
          transition: background 0.3s ease;
        }

        .button:hover {
          background: ${BRAND_COLORS.primaryLight};
        }

        /* Button container */
        .button-container {
          text-align: center;
          margin: 30px 0;
        }

        /* Link */
        .link {
          color: ${BRAND_COLORS.primary};
          text-decoration: none;
          word-break: break-all;
        }

        /* Warning box */
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 12px 16px;
          margin: 20px 0;
          font-size: 14px;
          color: #856404;
        }

        /* Info box */
        .info {
          background: #d1ecf1;
          border-left: 4px solid #17a2b8;
          padding: 12px 16px;
          margin: 20px 0;
          font-size: 14px;
          color: #0c5460;
        }

        /* Footer */
        .footer {
          text-align: center;
          padding: 30px 20px;
          color: ${BRAND_COLORS.textLight};
          font-size: 14px;
        }

        .footer p {
          margin: 8px 0;
        }

        /* Small text */
        .small-text {
          font-size: 14px;
          color: ${BRAND_COLORS.textLight};
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
          .email-container {
            width: 100% !important;
          }

          .header, .content {
            padding: 30px 20px !important;
          }

          .header h1 {
            font-size: 24px !important;
          }

          .button {
            display: block !important;
            width: 100% !important;
            box-sizing: border-box;
          }
        }
      </style>
    </head>
    <body>
      <!-- Preheader text -->
      <div style="display: none; max-height: 0; overflow: hidden;">
        ${preheader}
      </div>

      <!-- Email wrapper -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
          <td align="center">
            <div class="email-container">
              <div class="header">
                <h1>${headerTitle}</h1>
              </div>
              <div class="content">
                ${content}
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Interfaith Peace Bridge. All rights reserved.</p>
                <p class="small-text">Building bridges of understanding and peace across faiths.</p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

/**
 * Email verification template with OTP
 */
export function verificationEmailTemplate(params: {
  fullName: string
  otp: string
}): string {
  const { fullName, otp } = params

  const content = `
    <p>Dear ${fullName},</p>
    <p>Thank you for joining our interfaith community. We're excited to have you on this journey of understanding, compassion, and peace.</p>
    <p>Please use the following One-Time Password (OTP) to verify your email address:</p>

    <div style="text-align: center; margin: 30px 0;">
      <div style="display: inline-block; background: linear-gradient(135deg, #c8a75e 0%, #d4b56d 100%); padding: 20px 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(200, 167, 94, 0.3);">
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0b0f2a; font-family: 'Courier New', monospace;">
          ${otp}
        </div>
      </div>
    </div>

    <p style="text-align: center; font-size: 14px; color: #666; margin-top: 20px;">
      Enter this code on the verification page to complete your registration.
    </p>

    <div class="warning">
      ⚠️ <strong>Important:</strong> This OTP will expire in 15 minutes.
    </div>

    <div class="info">
      🔒 <strong>Security Tip:</strong> Never share this OTP with anyone. Our team will never ask for your OTP.
    </div>

    <p class="small-text">If you didn't create this account, please ignore this email.</p>

    <p>Peace and blessings,<br><strong>The Interfaith Peace Bridge Team</strong></p>
  `

  return baseEmailTemplate({
    headerTitle: 'Verify Your Email',
    content,
    preheader: `Your verification code is ${otp}`,
  })
}

/**
 * Password reset template
 */
export function passwordResetEmailTemplate(params: {
  fullName: string
  resetUrl: string
}): string {
  const { fullName, resetUrl } = params

  const content = `
    <p>Dear ${fullName},</p>
    <p>We received a request to reset your password for your Interfaith Peace Bridge account.</p>
    <p>Click the button below to create a new password:</p>

    <div class="button-container">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>

    <p class="small-text">Or copy and paste this link into your browser:</p>
    <p class="small-text"><a href="${resetUrl}" class="link">${resetUrl}</a></p>

    <div class="warning">
      ⚠️ <strong>Important:</strong> This password reset link will expire in 1 hour.
    </div>

    <p class="small-text">If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>

    <p>Peace and blessings,<br><strong>The Interfaith Peace Bridge Team</strong></p>
  `

  return baseEmailTemplate({
    headerTitle: 'Password Reset Request',
    content,
    preheader: 'Reset your password',
  })
}

/**
 * Role approved template
 */
export function roleApprovedEmailTemplate(params: {
  fullName: string
  role: string
  dashboardUrl: string
}): string {
  const { fullName, role, dashboardUrl } = params
  const roleCapitalized = role.charAt(0).toUpperCase() + role.slice(1)

  const content = `
    <p>Dear ${fullName},</p>
    <p>🎉 <strong>Great news!</strong> Your role request has been approved.</p>

    <div class="info">
      <strong>Your new role:</strong> ${roleCapitalized}
    </div>

    <p>You now have access to additional features and permissions. Log in to explore your new capabilities:</p>

    <div class="button-container">
      <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
    </div>

    <p>Thank you for your commitment to building bridges of understanding and peace.</p>

    <p>Peace and blessings,<br><strong>The Interfaith Peace Bridge Team</strong></p>
  `

  return baseEmailTemplate({
    headerTitle: '🎉 Role Request Approved!',
    headerColor: BRAND_COLORS.success,
    content,
    preheader: 'Your role request has been approved',
  })
}

/**
 * Welcome email template (optional - for after verification)
 */
export function welcomeEmailTemplate(params: {
  fullName: string
  dashboardUrl: string
}): string {
  const { fullName, dashboardUrl } = params

  const content = `
    <p>Dear ${fullName},</p>
    <p>Welcome to the Interfaith Peace Bridge community! 🌟</p>
    <p>Your email has been verified and your account is now active. We're thrilled to have you join us on this journey of interfaith understanding and dialogue.</p>

    <h2 style="color: ${BRAND_COLORS.primary}; font-size: 20px; margin: 24px 0 16px 0;">What You Can Do:</h2>
    <ul style="margin: 0 0 20px 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Explore sacred texts from different traditions</li>
      <li style="margin-bottom: 8px;">Learn about common values across faiths</li>
      <li style="margin-bottom: 8px;">Discover peace initiatives worldwide</li>
      <li style="margin-bottom: 8px;">Share your insights and perspectives</li>
      <li style="margin-bottom: 8px;">Connect with a diverse community</li>
    </ul>

    <div class="button-container">
      <a href="${dashboardUrl}" class="button">Get Started</a>
    </div>

    <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>

    <p>Peace and blessings,<br><strong>The Interfaith Peace Bridge Team</strong></p>
  `

  return baseEmailTemplate({
    headerTitle: 'Welcome to Our Community!',
    content,
    preheader: 'Your account is now active',
  })
}

/**
 * Generic notification template
 */
export function notificationEmailTemplate(params: {
  fullName: string
  title: string
  message: string
  buttonText?: string
  buttonUrl?: string
}): string {
  const { fullName, title, message, buttonText, buttonUrl } = params

  let content = `
    <p>Dear ${fullName},</p>
    <p>${message}</p>
  `

  if (buttonText && buttonUrl) {
    content += `
      <div class="button-container">
        <a href="${buttonUrl}" class="button">${buttonText}</a>
      </div>
    `
  }

  content += `
    <p>Peace and blessings,<br><strong>The Interfaith Peace Bridge Team</strong></p>
  `

  return baseEmailTemplate({
    headerTitle: title,
    content,
    preheader: message.substring(0, 100),
  })
}
