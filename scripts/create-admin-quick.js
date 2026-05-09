const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  console.log('\n🔐 Creating Admin User...\n');

  // Default admin credentials (CHANGE THESE!)
  const email = 'admin@interfaithpeacebridge.org';
  const password = 'Admin123!';
  const fullName = 'Admin User';

  try {
    // Check if admin already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log('⚠️  Admin user already exists with email:', email);
      console.log('   Use the login page to access the admin dashboard.\n');
      return;
    }

    // Hash password
    console.log('⏳ Hashing password...');
    const passwordHash = await bcrypt.hash(password, 12);

    // Create admin user
    console.log('⏳ Creating admin user...');
    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: 'admin',
        emailVerified: true,
        isActive: true,
      },
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('📋 Login Credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');
    console.log('🎯 Next steps:');
    console.log('   1. Install email service: npm install resend');
    console.log('   2. Add RESEND_API_KEY to .env (sign up at https://resend.com)');
    console.log('   3. Start dev server: npm run dev');
    console.log('   4. Visit: http://localhost:3000/login');
    console.log('   5. Login with the credentials above\n');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
