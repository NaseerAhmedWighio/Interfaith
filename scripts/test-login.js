const { PrismaClient } = require('@prisma/client');
const { compare } = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin() {
  console.log('\n🔐 Testing Login Flow...\n');

  const email = 'admin@interfaithpeacebridge.org';
  const password = 'Admin123!';

  try {
    // Step 1: Find user (exactly like API does)
    console.log('Step 1: Finding user with email:', email);
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }
    console.log('✅ User found:', user.email);

    // Step 2: Check if active
    console.log('\nStep 2: Checking if user is active');
    console.log('   isActive:', user.isActive);
    if (!user.isActive) {
      console.log('❌ User is not active');
      return;
    }
    console.log('✅ User is active');

    // Step 3: Check if email verified
    console.log('\nStep 3: Checking if email is verified');
    console.log('   emailVerified:', user.emailVerified);
    if (!user.emailVerified) {
      console.log('❌ Email not verified');
      return;
    }
    console.log('✅ Email is verified');

    // Step 4: Verify password (exactly like API does)
    console.log('\nStep 4: Verifying password');
    console.log('   Password:', password);
    console.log('   Hash:', user.passwordHash);
    console.log('   Hash prefix:', user.passwordHash.substring(0, 7));

    const isValidPassword = await compare(password, user.passwordHash);
    console.log('   Result:', isValidPassword ? '✅ VALID' : '❌ INVALID');

    if (!isValidPassword) {
      console.log('\n❌ LOGIN FAILED: Invalid password');
      return;
    }

    console.log('\n✅ LOGIN SUCCESSFUL - All checks passed!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
