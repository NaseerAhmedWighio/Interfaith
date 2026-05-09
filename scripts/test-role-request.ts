import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testRoleRequest() {
  try {
    console.log('Testing role request creation...\n')

    // Get first admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' },
      select: { id: true, email: true, fullName: true }
    })

    if (!adminUser) {
      console.log('No admin user found')
      return
    }

    console.log(`Using user: ${adminUser.fullName} (${adminUser.email})`)

    // Try to create a test role request
    try {
      const roleRequest = await prisma.roleRequest.create({
        data: {
          userId: adminUser.id,
          requestedRole: 'editor',
          reason: 'Test role request',
          status: 'pending',
        }
      })

      console.log('\n✓ Role request created successfully!')
      console.log('ID:', roleRequest.id)
      console.log('Requested Role:', roleRequest.requestedRole)
      console.log('Status:', roleRequest.status)

      // Clean up - delete the test request
      await prisma.roleRequest.delete({
        where: { id: roleRequest.id }
      })
      console.log('\n✓ Test request cleaned up')

    } catch (error: any) {
      console.log('\n✗ Failed to create role request')
      console.log('Error:', error.message)
      if (error.code) {
        console.log('Error code:', error.code)
      }
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRoleRequest()
