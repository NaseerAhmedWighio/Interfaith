/**
 * Run database migration for authentication system
 * Usage: node scripts/run-auth-migration.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function runMigration() {
  console.log('\n🔄 Running authentication system migration...\n');

  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../data/migrations/20260502000001_create_auth_system.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Split by semicolon and filter out empty statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip comments
      if (statement.startsWith('/*') || statement.startsWith('--')) {
        continue;
      }

      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        await prisma.$executeRawUnsafe(statement + ';');
        console.log(`✅ Statement ${i + 1} completed`);
      } catch (error) {
        // Some statements might fail if already exists, that's okay
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Statement ${i + 1} skipped (already exists)`);
        } else {
          console.error(`❌ Error in statement ${i + 1}:`, error.message);
          throw error;
        }
      }
    }

    console.log('\n✅ Migration completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Run: node scripts/create-admin.js');
    console.log('2. Execute the generated SQL to create your admin user');
    console.log('3. Start the dev server: npm run dev');
    console.log('4. Visit: http://localhost:3000/login\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nYou can also run the SQL file manually in your database.');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
