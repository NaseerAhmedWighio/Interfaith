import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { quoteId } = await request.json()

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      )
    }

    const quote = await prisma.shareableQuote.update({
      where: { id: quoteId },
      data: {
        shareCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      shareCount: quote.shareCount
    })
  } catch (error) {
    console.error('Error incrementing share count:', error)
    return NextResponse.json(
      { error: 'Failed to update share count' },
      { status: 500 }
    )
  }
}
