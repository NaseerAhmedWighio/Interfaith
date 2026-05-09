import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting user cleanup...')

  try {
    // First, get count of users to be deleted
    const usersToDelete = await prisma.user.findMany({
      where: {
        role: {
          not: 'admin'
        }
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      }
    })

    console.log(`\nFound ${usersToDelete.length} non-admin users to delete:`)
    usersToDelete.forEach(user => {
      console.log(`  - ${user.fullName} (${user.email}) - Role: ${user.role}`)
    })

    if (usersToDelete.length === 0) {
      console.log('\nNo users to delete.')
      return
    }

    console.log('\nDeleting non-admin users...')

    // Delete all non-admin users
    // Cascade deletes will handle related records (sessions, role requests, etc.)
    const result = await prisma.user.deleteMany({
      where: {
        role: {
          not: 'admin'
        }
      }
    })

    console.log(`\n✓ Successfully deleted ${result.count} non-admin users`)

    // Show remaining users
    const remainingUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      }
    })

    console.log(`\nRemaining users (${remainingUsers.length}):`)
    remainingUsers.forEach(user => {
      console.log(`  - ${user.fullName} (${user.email}) - Role: ${user.role}`)
    })

  } catch (error) {
    console.error('Error during user cleanup:', error)
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
