import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

const CONTENT_MODELS = {
  traditions: prisma.tradition,
  teachings: prisma.teaching,
  misconceptions: prisma.misconception,
  sacred_texts: prisma.sacredText,
  peace_initiatives: prisma.peaceInitiative,
  similarity_themes: prisma.similarityTheme,
  shareable_quotes: prisma.shareableQuote,
} as const

const CONTENT_MODEL_LOOKUP: Record<string, any> = {
  traditions: prisma.tradition,
  teachings: prisma.teaching,
  misconceptions: prisma.misconception,
  sacred_texts: prisma.sacredText,
  peace_initiatives: prisma.peaceInitiative,
  similarity_themes: prisma.similarityTheme,
  shareable_quotes: prisma.shareableQuote,
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

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

    if (userWithRole.role !== 'admin' && userWithRole.role !== 'moderator') {
      return NextResponse.json(
        { error: 'You do not have permission to view pending content' },
        { status: 403 }
      )
    }

    let statusFilter: string[] = []
    if (userWithRole.role === 'moderator') {
      statusFilter = ['pending_moderator']
    } else if (userWithRole.role === 'admin') {
      statusFilter = ['pending_moderator', 'pending_admin']
    }

    const [traditions, teachings, misconceptions, sacredTexts, peaceInitiatives, similarityThemes, shareableQuotes, pendingEdits] = await Promise.all([
      prisma.tradition.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.teaching.findMany({
        where: { status: { in: statusFilter } },
        include: {
          tradition: true,
          creator: {
            select: { id: true, fullName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.misconception.findMany({
        where: { status: { in: statusFilter } },
        include: {
          tradition: true,
          creator: {
            select: { id: true, fullName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sacredText.findMany({
        where: { status: { in: statusFilter } },
        include: {
          tradition: true,
          creator: {
            select: { id: true, fullName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.peaceInitiative.findMany({
        where: { status: { in: statusFilter } },
        include: {
          creator: {
            select: { id: true, fullName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.similarityTheme.findMany({
        where: { status: { in: statusFilter } },
        include: {
          creator: {
            select: { id: true, fullName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.shareableQuote.findMany({
        where: { status: { in: statusFilter } },
        include: {
          sacredText: {
            include: { tradition: true },
          },
          creator: {
            select: { id: true, fullName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.pendingEdit.findMany({
        where: { status: { in: statusFilter } },
        include: {
          creator: {
            select: { id: true, fullName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    // Fetch original content for each pending edit
    const pendingEditsWithOriginals = await Promise.all(
      pendingEdits.map(async (edit) => {
        const model = CONTENT_MODEL_LOOKUP[edit.contentType]
        let originalContent = null
        if (model) {
          originalContent = await model.findUnique({
            where: { id: edit.contentId },
          })
        }
        return { ...edit, type: 'pending_edit', originalContent }
      })
    )

    const pendingContent = {
      traditions: traditions.map(item => ({ ...item, type: 'traditions' })),
      teachings: teachings.map(item => ({ ...item, type: 'teachings' })),
      misconceptions: misconceptions.map(item => ({ ...item, type: 'misconceptions' })),
      sacredTexts: sacredTexts.map(item => ({ ...item, type: 'sacred_texts' })),
      peaceInitiatives: peaceInitiatives.map(item => ({ ...item, type: 'peace_initiatives' })),
      similarityThemes: similarityThemes.map(item => ({ ...item, type: 'similarity_themes' })),
      shareableQuotes: shareableQuotes.map(item => ({ ...item, type: 'shareable_quotes' })),
      pendingEdits: pendingEditsWithOriginals,
    }

    return NextResponse.json(pendingContent)
  } catch (error) {
    console.error('Error fetching pending content:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch pending content' },
      { status: 500 }
    )
  }
}
