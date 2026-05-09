import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkRoleRequests() {
  try {
    console.log('Checking role requests...\n')

    const allRequests = await prisma.roleRequest.findMany({
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
            role: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Total role requests: ${allRequests.length}\n`)

    if (allRequests.length === 0) {
      console.log('No role requests found in database.')
    } else {
      allRequests.forEach((req, index) => {
        console.log(`${index + 1}. Role Request`)
        console.log(`   ID: ${req.id}`)
        console.log(`   User: ${req.user.fullName} (${req.user.email})`)
        console.log(`   Current Role: ${req.user.role}`)
        console.log(`   Requested Role: ${req.requestedRole}`)
        console.log(`   Status: ${req.status}`)
        console.log(`   Reason: ${req.reason || 'N/A'}`)
        console.log(`   Created: ${req.createdAt}`)
        console.log('')
      })
    }

    // Check pending specifically
    const pendingRequests = await prisma.roleRequest.findMany({
      where: { status: 'pending' },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
            role: true,
          }
        }
      }
    })

    console.log(`\nPending requests: ${pendingRequests.length}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkRoleRequests()
