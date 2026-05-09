import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding admin and moderator accounts...')

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const adminName = process.env.ADMIN_NAME

  const moderatorEmail = process.env.MODERATOR_EMAIL
  const moderatorPassword = process.env.MODERATOR_PASSWORD
  const moderatorName = process.env.MODERATOR_NAME

  if (!adminEmail || !adminPassword) {
    console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin seed')
  } else {
    const adminHash = await bcrypt.hash(adminPassword, 10)
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        passwordHash: adminHash,
        fullName: adminName || 'Super Admin',
        role: 'admin',
        emailVerified: true,
        isActive: true,
      },
    })
    console.log(`✅ Admin account: ${adminEmail} (role: admin)`)
  }

  if (!moderatorEmail || !moderatorPassword) {
    console.warn('⚠️  MODERATOR_EMAIL or MODERATOR_PASSWORD not set in .env — skipping moderator seed')
  } else {
    const modHash = await bcrypt.hash(moderatorPassword, 10)
    await prisma.user.upsert({
      where: { email: moderatorEmail },
      update: {},
      create: {
        email: moderatorEmail,
        passwordHash: modHash,
        fullName: moderatorName || 'Head Moderator',
        role: 'moderator',
        emailVerified: true,
        isActive: true,
      },
    })
    console.log(`✅ Moderator account: ${moderatorEmail} (role: moderator)`)
  }

  console.log('\n🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
