import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

const FIND_MODEL = {
  traditions: (id: string) => prisma.tradition.findUnique({ where: { id } }),
  teachings: (id: string) => prisma.teaching.findUnique({ where: { id } }),
  misconceptions: (id: string) => prisma.misconception.findUnique({ where: { id } }),
  sacred_texts: (id: string) => prisma.sacredText.findUnique({ where: { id } }),
  peace_initiatives: (id: string) => prisma.peaceInitiative.findUnique({ where: { id } }),
  similarity_themes: (id: string) => prisma.similarityTheme.findUnique({ where: { id } }),
  shareable_quotes: (id: string) => prisma.shareableQuote.findUnique({ where: { id } }),
}

const UPDATE_MODEL = {
  traditions: (id: string, data: any) => prisma.tradition.update({ where: { id }, data }),
  teachings: (id: string, data: any) => prisma.teaching.update({ where: { id }, data }),
  misconceptions: (id: string, data: any) => prisma.misconception.update({ where: { id }, data }),
  sacred_texts: (id: string, data: any) => prisma.sacredText.update({ where: { id }, data }),
  peace_initiatives: (id: string, data: any) => prisma.peaceInitiative.update({ where: { id }, data }),
  similarity_themes: (id: string, data: any) => prisma.similarityTheme.update({ where: { id }, data }),
  shareable_quotes: (id: string, data: any) => prisma.shareableQuote.update({ where: { id }, data }),
}

type ContentType = keyof typeof FIND_MODEL

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const user = await requireAuth()
    const { type, id } = await params

    // Get user role
    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (!userWithRole) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check permissions
    if (userWithRole.role !== 'admin' && userWithRole.role !== 'moderator') {
      return NextResponse.json(
        { error: 'You do not have permission to approve content' },
        { status: 403 }
      )
    }

    // Handle pending edit approval
    if (type === 'pending_edit') {
      const pendingEdit = await prisma.pendingEdit.findUnique({
        where: { id },
      })

      if (!pendingEdit) {
        return NextResponse.json(
          { error: 'Pending edit not found' },
          { status: 404 }
        )
      }

      if (pendingEdit.status === 'applied') {
        return NextResponse.json(
          { error: 'This edit has already been applied' },
          { status: 400 }
        )
      }

      if (userWithRole.role === 'moderator') {
        if (pendingEdit.status !== 'pending_moderator') {
          return NextResponse.json(
            { error: 'This edit is not pending moderator review' },
            { status: 400 }
          )
        }
        // Moderator approves -> pending_admin
        await prisma.pendingEdit.update({
          where: { id },
          data: { status: 'pending_admin', moderatorApprovedBy: user.id },
        })
        return NextResponse.json({ message: 'Edit approved, pending admin review' })
      }

      // Admin approves -> apply changes to original content
      const applyUpdate = UPDATE_MODEL[pendingEdit.contentType as keyof typeof UPDATE_MODEL]
      if (!applyUpdate) {
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
      }

      const changes = pendingEdit.changes as Record<string, any>
      await applyUpdate(pendingEdit.contentId, { ...changes, status: 'published', lastModifiedBy: user.id, approvedBy: user.id, approvedAt: new Date() })

      await prisma.pendingEdit.update({
        where: { id },
        data: { status: 'applied', adminApprovedBy: user.id, appliedAt: new Date() },
      })

      return NextResponse.json({ message: 'Edit approved and applied successfully' })
    }

    // Validate content type for regular content
    const findContent = FIND_MODEL[type as ContentType]
    if (!findContent) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }

    // Get current content
    const content = await findContent(id)

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Determine new status based on role
    let newStatus = 'published'
    if (userWithRole.role === 'moderator') {
      // Moderators can only approve to pending_admin
      if (content.status === 'pending_moderator') {
        newStatus = 'pending_admin'
      } else {
        return NextResponse.json(
          { error: 'This content is not pending moderator review' },
          { status: 400 }
        )
      }
    } else if (userWithRole.role === 'admin') {
      // Admins can approve to published
      newStatus = 'published'
    }

    // Update content
    const updateContent = UPDATE_MODEL[type as ContentType]
    const updatedContent = await updateContent(id, {
      status: newStatus,
      approvedBy: user.id,
      approvedAt: new Date(),
    })

    return NextResponse.json({
      message: 'Content approved successfully',
      content: updatedContent,
    })
  } catch (error) {
    console.error('Error approving content:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to approve content' },
      { status: 500 }
    )
  }
}
