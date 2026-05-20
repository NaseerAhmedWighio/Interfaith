import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/session'

const VALID_TYPES = ['teachings', 'sacred-texts', 'traditions', 'truth-sections', 'similarity-themes'] as const
type BulkType = typeof VALID_TYPES[number]

const REQUIRED_FIELDS: Record<BulkType, string[]> = {
  'teachings': ['title', 'content', 'source'],
  'sacred-texts': ['title', 'source', 'textContent'],
  'traditions': ['name', 'description'],
  'truth-sections': ['sectionKey', 'title', 'content'],
  'similarity-themes': ['title', 'description', 'icon', 'slug'],
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const user = await requireAuth()
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can perform bulk uploads' },
        { status: 403 }
      )
    }

    const { type } = await params
    if (!VALID_TYPES.includes(type as BulkType)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    const body = await request.json()
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: 'Request body must be a non-empty array' },
        { status: 400 }
      )
    }

    const required = REQUIRED_FIELDS[type as BulkType]
    const results = { total: body.length, created: 0, errors: [] as { index: number; message: string }[] }

    for (let i = 0; i < body.length; i++) {
      const item = body[i]
      const missing = required.filter(f => !item[f])
      if (missing.length > 0) {
        results.errors.push({ index: i, message: `Missing required fields: ${missing.join(', ')}` })
        continue
      }
    }

    if (results.errors.length > 0) {
      return NextResponse.json(results, { status: 400 })
    }

    const now = new Date()

    switch (type) {
      case 'teachings': {
        const data = body.map((item: any) => ({
          title: item.title,
          content: item.content,
          source: item.source,
          traditionId: item.traditionId || null,
          category: item.category || 'peace',
          status: 'published',
          createdBy: user.id,
          lastModifiedBy: user.id,
          createdAt: now,
          updatedAt: now,
        }))
        await prisma.teaching.createMany({ data })
        results.created = data.length
        break
      }
      case 'sacred-texts': {
        const data = body.map((item: any) => ({
          title: item.title,
          source: item.source,
          textContent: item.textContent,
          traditionId: item.traditionId || null,
          theme: item.theme || '',
          context: item.context || '',
          translation: item.translation || '',
          status: 'published',
          createdBy: user.id,
          lastModifiedBy: user.id,
          createdAt: now,
          updatedAt: now,
        }))
        await prisma.sacredText.createMany({ data })
        results.created = data.length
        break
      }
      case 'traditions': {
        const data = body.map((item: any) => ({
          name: item.name,
          description: item.description,
          coreValues: item.coreValues || [],
          status: 'published',
          createdBy: user.id,
          lastModifiedBy: user.id,
          createdAt: now,
          updatedAt: now,
        }))
        await prisma.tradition.createMany({ data })
        results.created = data.length
        break
      }
      case 'truth-sections': {
        const data = body.map((item: any) => ({
          sectionKey: item.sectionKey,
          title: item.title,
          content: item.content,
          status: 'published',
          createdAt: now,
          updatedAt: now,
        }))
        await prisma.truthSection.createMany({ data })
        results.created = data.length
        break
      }
      case 'similarity-themes': {
        const data = body.map((item: any) => ({
          title: item.title,
          description: item.description,
          icon: item.icon,
          slug: item.slug,
          color: item.color || null,
          orderIndex: item.orderIndex ?? 0,
          status: 'published',
          createdBy: user.id,
          lastModifiedBy: user.id,
          createdAt: now,
          updatedAt: now,
        }))
        await prisma.similarityTheme.createMany({ data })
        results.created = data.length
        break
      }
    }

    return NextResponse.json(results, { status: 201 })
  } catch (error) {
    console.error('Bulk upload error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to process bulk upload' }, { status: 500 })
  }
}
