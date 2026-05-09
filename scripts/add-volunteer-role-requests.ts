import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Updating role_requests constraint to include volunteer...')

  await prisma.$executeRaw`
    ALTER TABLE role_requests DROP CONSTRAINT IF EXISTS role_requests_requested_role_check;
  `
  console.log('✅ Dropped old constraint')

  await prisma.$executeRaw`
    ALTER TABLE role_requests ADD CONSTRAINT role_requests_requested_role_check
    CHECK (requested_role IN ('volunteer', 'editor', 'moderator', 'admin'));
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
