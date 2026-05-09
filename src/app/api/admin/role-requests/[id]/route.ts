import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { hasRole, getDefaultPermissions, assignPermission } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    // Check if user is admin
    const isAdmin = await hasRole(user.id, ['admin'])
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, adminNotes } = body

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be approve or reject.' },
        { status: 400 }
      )
    }

    // Get role request
    const roleRequest = await prisma.roleRequest.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!roleRequest) {
      return NextResponse.json(
        { error: 'Role request not found' },
        { status: 404 }
      )
    }

    if (roleRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'This role request has already been reviewed' },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      // Update user role
      await prisma.user.update({
        where: { id: roleRequest.userId },
        data: { role: roleRequest.requestedRole },
      })

      // Assign default permissions for the role
      const defaultPermissions = getDefaultPermissions(roleRequest.requestedRole as any)
      for (const perm of defaultPermissions) {
        await assignPermission(roleRequest.userId, perm.resource, perm.actions)
      }

      // Update role request
      await prisma.roleRequest.update({
        where: { id },
        data: {
          status: 'approved',
          reviewedBy: user.id,
          reviewedAt: new Date(),
          adminNotes,
        },
      })

      // Send approval notification email
      try {
        const { sendRoleApprovedEmail } = await import('@/lib/email')
        await sendRoleApprovedEmail(
          roleRequest.user.email,
          roleRequest.user.fullName,
          roleRequest.requestedRole
        )
      } catch (emailError) {
        console.error('Failed to send role approval email:', emailError)
        // Don't fail the approval if email fails
      }

      return NextResponse.json({
        message: 'Role request approved successfully',
      })
    } else {
      // Reject role request
      await prisma.roleRequest.update({
        where: { id },
        data: {
          status: 'rejected',
          reviewedBy: user.id,
          reviewedAt: new Date(),
          adminNotes,
        },
      })

      return NextResponse.json({
        message: 'Role request rejected',
      })
    }
  } catch (error) {
    console.error('Review role request error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred while reviewing role request' },
      { status: 500 }
    )
  }
}
