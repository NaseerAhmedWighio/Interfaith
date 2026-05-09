/**
 * Run authentication system migration
 * Executes SQL statements one by one
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function parseSQLStatements(sql) {
  // Remove comments
  let cleaned = sql.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove /* */ comments
  cleaned = cleaned.replace(/--[^\n]*/g, ''); // Remove -- comments

  // Split by semicolon and clean up
  const statements = cleaned
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  return statements;
}

async function runMigration() {
  console.log('\n🔄 Running Authentication System Migration...\n');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../data/migrations/20260502000001_create_auth_system.sql');
    const sqlContent = fs.readFileSync(migrationPath, 'utf8');

    // Parse SQL statements
    const statements = parseSQLStatements(sqlContent);
    console.log(`📝 Found ${statements.length} SQL statements\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip empty statements
      if (!statement || statement.length < 5) continue;

      try {
        await prisma.$executeRawUnsafe(statement);
        successCount++;

        // Show progress for important statements
        if (statement.includes('CREATE TABLE')) {
          const tableName = statement.match(/CREATE TABLE.*?(\w+)\s*\(/)?.[1];
          console.log(`✅ Created table: ${tableName}`);
        } else if (statement.includes('ALTER TABLE') && statement.includes('ADD COLUMN')) {
          console.log(`✅ Added column to existing table`);
        }
      } catch (error) {
        if (error.message.includes('already exists')) {
          skipCount++;
        } else {
          console.error(`⚠️  Error in statement ${i + 1}:`, error.message.split('\n')[0]);
          errorCount++;
        }
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ⏭️  Skipped: ${skipCount} (already exists)`);
    console.log(`   ❌ Errors: ${errorCount}\n`);

    if (errorCount === 0) {
      console.log('✅ Migration completed successfully!\n');
      console.log('📋 Authentication system tables:');
      console.log('   - users (authentication & profiles)');
      console.log('   - sessions (session management)');
      console.log('   - role_requests (role upgrade workflow)');
      console.log('   - user_permissions (granular permissions)\n');

      console.log('🎯 Next steps:');
      console.log('   1. Create admin user: node scripts/create-admin.js');
      console.log('   2. Install email service: npm install resend');
      console.log('   3. Add RESEND_API_KEY to .env file');
      console.log('   4. Start dev server: npm run dev');
      console.log('   5. Visit: http://localhost:3000/login\n');
    } else {
      console.log('⚠️  Migration completed with some errors.');
      console.log('   Check the errors above and fix if needed.\n');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check DATABASE_URL in .env');
    console.error('2. Ensure PostgreSQL is running');
    console.error('3. Verify database "interfaith_db" exists');
    console.error('4. Check user has CREATE permissions\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
