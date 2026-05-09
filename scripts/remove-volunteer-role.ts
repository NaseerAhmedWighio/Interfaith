import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting volunteer role removal...')

  try {
    // 1. Check for users with volunteer role
    const volunteerUsers = await prisma.user.findMany({
      where: { role: 'volunteer' },
      select: { id: true, email: true, fullName: true },
    })

    if (volunteerUsers.length > 0) {
      console.log(`Found ${volunteerUsers.length} users with volunteer role:`)
      volunteerUsers.forEach(user => {
        console.log(`  - ${user.fullName} (${user.email})`)
      })

      // Update volunteer users to 'user' role
      const updateResult = await prisma.user.updateMany({
        where: { role: 'volunteer' },
        data: { role: 'user' },
      })
      console.log(`Updated ${updateResult.count} users from volunteer to user role`)
    } else {
      console.log('No users with volunteer role found')
    }

    // 2. Check for pending volunteer role requests
    const volunteerRequests = await prisma.roleRequest.findMany({
      where: {
        requestedRole: 'volunteer',
        status: 'pending',
      },
      select: { id: true, userId: true },
    })

    if (volunteerRequests.length > 0) {
      console.log(`\nFound ${volunteerRequests.length} pending volunteer role requests`)

      // Reject pending volunteer role requests
      const rejectResult = await prisma.roleRequest.updateMany({
        where: {
          requestedRole: 'volunteer',
          status: 'pending',
        },
        data: {
          status: 'rejected',
          adminNotes: 'Volunteer role has been removed from the system. Please request a different role.',
        },
      })
      console.log(`Rejected ${rejectResult.count} pending volunteer role requests`)
    } else {
      console.log('\nNo pending volunteer role requests found')
    }

    // 3. Update database constraints
    console.log('\nUpdating database constraints...')

    // Update users table constraint
    await prisma.$executeRaw`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
    `
    await prisma.$executeRaw`
      ALTER TABLE users ADD CONSTRAINT users_role_check
      CHECK (role IN ('user', 'editor', 'moderator', 'admin'));
    `
    console.log('Updated users table role constraint')

    // Update role_requests table constraint
    await prisma.$executeRaw`
      ALTER TABLE role_requests DROP CONSTRAINT IF EXISTS role_requests_requested_role_check;
    `
    await prisma.$executeRaw`
      ALTER TABLE role_requests ADD CONSTRAINT role_requests_requested_role_check
      CHECK (requested_role IN ('editor', 'moderator', 'admin'));
    `
    console.log('Updated role_requests table constraint')

    console.log('\nVolunteer role removal completed successfully!')
  } catch (error) {
    console.error('Error during volunteer role removal:', error)
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
