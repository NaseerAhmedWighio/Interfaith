/**
 * Script to create an admin user
 * Usage: node scripts/create-admin.js
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  console.log('\n=== Create Admin User ===\n');

  const email = await question('Admin email: ');
  const fullName = await question('Full name: ');
  const password = await question('Password (min 8 chars): ');

  // Validate password
  if (password.length < 8) {
    console.error('\n❌ Password must be at least 8 characters');
    rl.close();
    return;
  }

  console.log('\n⏳ Generating password hash...');
  const passwordHash = await bcrypt.hash(password, 12);

  console.log('\n✅ Admin user SQL generated!\n');
  console.log('Copy and run this SQL in your database:\n');
  console.log('---START SQL---');
  console.log(`INSERT INTO users (
  email,
  password_hash,
  full_name,
  role,
  email_verified,
  is_active
) VALUES (
  '${email}',
  '${passwordHash}',
  '${fullName}',
  'admin',
  true,
  true
);`);
  console.log('---END SQL---\n');

  console.log('📝 Save these credentials:\n');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('\n⚠️  Change the password after first login!\n');

  rl.close();
}

createAdmin().catch(error => {
  console.error('Error:', error);
  rl.close();
});
