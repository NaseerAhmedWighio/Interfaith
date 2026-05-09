import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

const CONTENT_MODELS: Record<string, any> = {
  traditions: prisma.tradition,
  teachings: prisma.teaching,
  misconceptions: prisma.misconception,
  sacred_texts: prisma.sacredText,
  peace_initiatives: prisma.peaceInitiative,
  similarity_themes: prisma.similarityTheme,
  shareable_quotes: prisma.shareableQuote,
}

const ALLOWED_FIELDS: Record<string, string[]> = {
  traditions: ['name', 'description', 'coreValues'],
  teachings: ['title', 'content', 'source', 'category', 'traditionId'],
  misconceptions: ['misconception', 'truth', 'category', 'traditionId'],
  sacred_texts: ['title', 'source', 'textContent', 'theme', 'context', 'translation', 'traditionId'],
  peace_initiatives: ['title', 'description', 'impact'],
  similarity_themes: ['title', 'description', 'icon', 'slug', 'orderIndex'],
  shareable_quotes: ['quoteText', 'backgroundStyle', 'sacredTextId'],
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const user = await requireAuth()
    const { type, id } = await params

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (!userWithRole || (userWithRole.role !== 'admin' && userWithRole.role !== 'moderator')) {
      return NextResponse.json(
        { error: 'You do not have permission to edit content' },
        { status: 403 }
      )
    }

    const body = await request.json()

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

      const allowedFields = ALLOWED_FIELDS[pendingEdit.contentType] || []
      const currentChanges = pendingEdit.changes as Record<string, any>
      const updatedChanges: Record<string, any> = { ...currentChanges }

      for (const key of Object.keys(body)) {
        if (allowedFields.includes(key)) {
          updatedChanges[key] = body[key]
        }
      }

      await prisma.pendingEdit.update({
        where: { id },
        data: { changes: updatedChanges },
      })

      return NextResponse.json({
        message: 'Edit updated successfully',
        changes: updatedChanges,
      })
    }

    const model = CONTENT_MODELS[type]
    if (!model) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }

    const content = await model.findUnique({ where: { id } })
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    const allowedFields = ALLOWED_FIELDS[type] || []
    const updateData: Record<string, any> = { lastModifiedBy: user.id }

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key]
      }
    }

    await model.update({ where: { id }, data: updateData })

    return NextResponse.json({
      message: 'Content updated successfully',
    })
  } catch (error) {
    console.error('Error editing content:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to edit content' },
      { status: 500 }
    )
  }
}
