import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    const searchParams = request.nextUrl.searchParams
    const sortBy = searchParams.get('sortBy') || 'popular'

    let whereClause = {}

    // If not authenticated or not admin/moderator, only show published content
    if (!currentUser || currentUser.role === 'user') {
      whereClause = { status: 'published' }
    }

    const quotes = await prisma.shareableQuote.findMany({
      where: whereClause,
      include: {
        sacredText: {
          include: {
            tradition: true
          }
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: sortBy === 'popular'
        ? { shareCount: 'desc' }
        : { createdAt: 'desc' }
    })

    const formattedQuotes = quotes
      .filter(quote => quote.sacredText)
      .map(quote => ({
        id: quote.id,
        quoteText: quote.quoteText,
        backgroundStyle: quote.backgroundStyle,
        shareCount: quote.shareCount,
        status: quote.status,
        creator: quote.creator,
        sacredText: {
          title: quote.sacredText!.title,
          source: quote.sacredText!.source,
          tradition: quote.sacredText!.tradition ? {
            name: quote.sacredText!.tradition.name,
          } : null
        }
      }))

    return NextResponse.json(formattedQuotes)
  } catch (error) {
    console.error('Error fetching shareable quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    // Check create permission
    const hasPermission = await checkPermission(user.id, 'shareable_quotes', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create shareable quotes' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { quoteText, backgroundStyle, sacredTextId } = body

    if (!quoteText || !sacredTextId) {
      return NextResponse.json(
        { error: 'Quote text and sacred text are required' },
        { status: 400 }
      )
    }

    // Get user's role to determine status
    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    let status = 'published'
    if (userWithRole?.role === 'editor') {
      status = 'pending_moderator'
    } else if (userWithRole?.role === 'moderator') {
      status = 'pending_admin'
    }

    const shareableQuote = await prisma.shareableQuote.create({
      data: {
        quoteText,
        backgroundStyle: backgroundStyle || 'gradient-1',
        sacredTextId,
        shareCount: 0,
        status,
        createdBy: user.id,
        lastModifiedBy: user.id,
      },
      include: {
        sacredText: {
          include: {
            tradition: true
          }
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      }
    })

    return NextResponse.json(shareableQuote, { status: 201 })
  } catch (error) {
    console.error('Error creating shareable quote:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create shareable quote' },
      { status: 500 }
    )
  }
}
