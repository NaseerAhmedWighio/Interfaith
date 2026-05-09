const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createVerifiedAdmin() {
  console.log('\n🔐 Create Verified Admin Account\n');
  console.log('This script creates an admin account with verified email.\n');

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
      const update = await question('Update to admin with verified email? (yes/no): ');

      if (update.toLowerCase() === 'yes' || update.toLowerCase() === 'y') {
        const passwordHash = await bcrypt.hash(password, 12);

        await prisma.user.update({
          where: { id: existing.id },
          data: {
            passwordHash,
            fullName,
            role: 'admin',
            emailVerified: true,
            isActive: true,
            emailVerificationToken: null,
            emailVerificationExpires: null,
          },
        });

        console.log('\n✅ User updated to admin successfully!\n');
      } else {
        console.log('\n❌ Operation cancelled\n');
        process.exit(0);
      }
    } else {
      // Hash password
      console.log('\n⏳ Creating admin account...');
      const passwordHash = await bcrypt.hash(password, 12);

      // Create admin user with verified email
      const admin = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          fullName,
          role: 'admin',
          emailVerified: true,
          isActive: true,
        },
      });

      console.log('\n✅ Admin account created successfully!\n');
    }

    console.log('📋 Login Credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('   Role: admin');
    console.log('   Email Verified: ✓\n');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3060'
    console.log('🎯 Next steps:');
    console.log(`   1. Visit: ${appUrl}/login`);
    console.log('   2. Login with the credentials above');
    console.log(`   3. Access admin dashboard at: ${appUrl}/admin\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

createVerifiedAdmin();
