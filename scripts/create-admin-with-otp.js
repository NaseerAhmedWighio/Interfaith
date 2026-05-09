const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { Resend } = require('resend');
const readline = require('readline');
require('dotenv').config();

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Get OTP expiry (15 minutes from now)
function getOTPExpiry() {
  return new Date(Date.now() + 15 * 60 * 1000);
}

// Send OTP email using Resend
async function sendOTPEmail(email, otp, fullName) {
  const fromEmail = process.env.FROM_EMAIL || 'noreply@interfaithpeacebridge.org';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #c8a75e 0%, #d4b56d 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #f5f3ee; padding: 40px 30px; }
        .otp-box { text-align: center; margin: 30px 0; }
        .otp-code { display: inline-block; background: linear-gradient(135deg, #c8a75e 0%, #d4b56d 100%); padding: 20px 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(200, 167, 94, 0.3); }
        .otp-code span { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0b0f2a; font-family: 'Courier New', monospace; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px 16px; margin: 20px 0; font-size: 14px; color: #856404; }
        .info { background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 12px 16px; margin: 20px 0; font-size: 14px; color: #0c5460; }
        .footer { text-align: center; padding: 30px 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="content">
          <p>Dear ${fullName},</p>
          <p>Thank you for joining our interfaith community. We're excited to have you on this journey of understanding, compassion, and peace.</p>
          <p>Please use the following One-Time Password (OTP) to verify your email address:</p>

          <div class="otp-box">
            <div class="otp-code">
              <span>${otp}</span>
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

          <p style="font-size: 14px; color: #666;">If you didn't create this account, please ignore this email.</p>

          <p>Peace and blessings,<br><strong>The Interfaith Peace Bridge Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Interfaith Peace Bridge. All rights reserved.</p>
          <p style="font-size: 12px; color: #999;">Building bridges of understanding and peace across faiths.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Verify Your Email - Interfaith Peace Bridge',
    html: htmlContent,
  });
}

async function createAdminWithOTP() {
  console.log('\n🔐 Create Admin Account with OTP Verification\n');
  console.log('This script creates an admin account that requires email verification via OTP.\n');

  try {
    // Get user input
    const email = await question('Enter email address: ');
    const fullName = await question('Enter full name: ');
    const password = await question('Enter password (min 8 chars, 1 uppercase, 1 number): ');

    // Validate inputs
    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email address');
      process.exit(1);
    }

    if (!fullName || fullName.length < 2) {
      console.error('❌ Full name must be at least 2 characters');
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('❌ Password must be at least 8 characters');
      process.exit(1);
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existing) {
      console.log('\n⚠️  User already exists with email:', email);
      console.log('   Please use a different email or login with existing account.\n');
      process.exit(0);
    }

    // Hash password
    console.log('\n⏳ Creating admin account...');
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Create admin user with OTP (email not verified yet)
    const admin = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        fullName,
        role: 'admin',
        emailVerified: false, // Not verified yet
        emailVerificationToken: otp,
        emailVerificationExpires: otpExpiry,
        isActive: true,
      },
    });

    console.log('\n✅ Admin account created successfully!\n');
    console.log('📋 Account Details:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('   Role: admin');
    console.log('   Email Verified: ❌ (requires OTP verification)\n');

    console.log('🔑 Verification OTP (valid for 15 minutes):');
    console.log('   ' + otp);
    console.log('\n⚠️  IMPORTANT: This OTP is only shown once!\n');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3060'
    console.log('🎯 Next steps:');
    console.log('   1. An email with the OTP has been sent to:', email);
    console.log(`   2. Visit: ${appUrl}/verify-email`);
    console.log('   3. Enter your email and the OTP code');
    console.log(`   4. After verification, login at: ${appUrl}/login\n`);

    console.log('💡 If you didn\'t receive the email:');
    console.log('   - Check your spam folder');
    console.log('   - Use the "Resend OTP" button on the verification page');
    console.log('   - Or use the OTP shown above (valid for 15 minutes)\n');

    // Try to send email
    try {
      console.log('📧 Sending verification email...');
      await sendOTPEmail(email, otp, fullName);
      console.log('✉️  Verification email sent successfully!\n');
    } catch (emailError) {
      console.log('⚠️  Could not send email automatically.');
      console.log('   Error:', emailError.message);
      console.log('   Please use the OTP shown above or request a new one.\n');
      console.log('💡 Troubleshooting:');
      console.log('   - Check RESEND_API_KEY in .env file');
      console.log('   - Verify FROM_EMAIL is correct');
      console.log('   - Check Resend dashboard for errors\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

createAdminWithOTP();
