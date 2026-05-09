import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Updating role constraint to include volunteer...')

  await prisma.$executeRaw`
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
  `
  console.log('✅ Dropped old constraint')

  await prisma.$executeRaw`
    ALTER TABLE users ADD CONSTRAINT users_role_check
    CHECK (role IN ('user', 'volunteer', 'editor', 'moderator', 'admin'));
  `
  console.log('✅ Added new constraint with volunteer role')

  console.log('🎉 Migration completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error running migration:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
