import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting content migration...')

  try {
    // Get the first admin user to use as default creator
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' },
      select: { id: true, fullName: true },
    })

    if (!adminUser) {
      console.log('No admin user found. Creating a default system user...')
      throw new Error('Please ensure at least one admin user exists before running this migration')
    }

    console.log(`Using admin user: ${adminUser.fullName} (${adminUser.id}) as default creator`)

    // Update Teachings
    const teachingsResult = await prisma.teaching.updateMany({
      where: {
        OR: [
          { status: null },
          { createdBy: null },
        ],
      },
      data: {
        status: 'published',
        createdBy: adminUser.id,
        lastModifiedBy: adminUser.id,
      },
    })
    console.log(`Updated ${teachingsResult.count} teachings`)

    // Update Misconceptions
    const misconceptionsResult = await prisma.misconception.updateMany({
      where: {
        OR: [
          { status: null },
          { createdBy: null },
        ],
      },
      data: {
        status: 'published',
        createdBy: adminUser.id,
        lastModifiedBy: adminUser.id,
      },
    })
    console.log(`Updated ${misconceptionsResult.count} misconceptions`)

    // Update Sacred Texts
    const sacredTextsResult = await prisma.sacredText.updateMany({
      where: {
        OR: [
          { status: null },
          { createdBy: null },
        ],
      },
      data: {
        status: 'published',
        createdBy: adminUser.id,
        lastModifiedBy: adminUser.id,
      },
    })
    console.log(`Updated ${sacredTextsResult.count} sacred texts`)

    // Update Peace Initiatives
    const peaceInitiativesResult = await prisma.peaceInitiative.updateMany({
      where: {
        OR: [
          { status: { not: 'published' } },
          { createdBy: null },
        ],
      },
      data: {
        status: 'published',
        createdBy: adminUser.id,
        lastModifiedBy: adminUser.id,
      },
    })
    console.log(`Updated ${peaceInitiativesResult.count} peace initiatives`)

    // Update Similarity Themes
    const similarityThemesResult = await prisma.similarityTheme.updateMany({
      where: {
        OR: [
          { status: null },
          { createdBy: null },
        ],
      },
      data: {
        status: 'published',
        createdBy: adminUser.id,
        lastModifiedBy: adminUser.id,
      },
    })
    console.log(`Updated ${similarityThemesResult.count} similarity themes`)

    // Update Shareable Quotes
    const shareableQuotesResult = await prisma.shareableQuote.updateMany({
      where: {
        OR: [
          { status: null },
          { createdBy: null },
        ],
      },
      data: {
        status: 'published',
        createdBy: adminUser.id,
        lastModifiedBy: adminUser.id,
      },
    })
    console.log(`Updated ${shareableQuotesResult.count} shareable quotes`)

    console.log('\nContent migration completed successfully!')
  } catch (error) {
    console.error('Error during migration:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
