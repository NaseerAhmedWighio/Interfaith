const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTables() {
  console.log('\n🔍 Checking authentication tables...\n');
  
  try {
    // Check users table
    const userCount = await prisma.user.count();
    console.log('✅ users table exists (', userCount, 'users)');
    
    // Check sessions table
    const sessionCount = await prisma.session.count();
    console.log('✅ sessions table exists (', sessionCount, 'sessions)');
    
    // Check role_requests table
    const roleRequestCount = await prisma.roleRequest.count();
    console.log('✅ role_requests table exists (', roleRequestCount, 'requests)');
    
    // Check user_permissions table
    const permissionCount = await prisma.userPermission.count();
    console.log('✅ user_permissions table exists (', permissionCount, 'permissions)');
    
    console.log('\n✅ All authentication tables are ready!\n');
    console.log('🎯 Next step: Create your first admin user');
    console.log('   Run: node scripts/create-admin.js\n');
    
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
