import { Resend } from 'resend'
import { verificationEmailTemplate, passwordResetEmailTemplate, roleApprovedEmailTemplate } from './email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)
const fromEmail = process.env.FROM_EMAIL || 'noreply@interfaithpeacebridge.org'
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3060'

/**
 * Send email verification OTP
 */
export async function sendVerificationEmail(email: string, otp: string, fullName: string) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Verify Your Email - Interfaith Peace Bridge',
      html: verificationEmailTemplate({ fullName, otp }),
    })
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

/**
 * Send password reset link
 */
export async function sendPasswordResetEmail(email: string, token: string, fullName: string) {
  const resetUrl = `${appUrl}/reset-password?token=${token}`

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Reset Your Password - Interfaith Peace Bridge',
      html: passwordResetEmailTemplate({ fullName, resetUrl }),
    })
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
}

/**
 * Send role request approval notification
 */
export async function sendRoleApprovedEmail(
  email: string,
  fullName: string,
  role: string
) {
  const dashboardUrl = `${appUrl}/admin`

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Role Request Approved - Interfaith Peace Bridge',
      html: roleApprovedEmailTemplate({ fullName, role, dashboardUrl }),
    })
  } catch (error) {
    console.error('Error sending role approved email:', error)
    // Don't throw - this is a notification, not critical
  }
}
