import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const comparisons = await prisma.textComparison.findMany({
      include: {
        comparisonTexts: {
          include: {
            sacredText: {
              include: {
                tradition: true
              }
            }
          },
          orderBy: {
            displayOrder: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(comparisons)
  } catch (error) {
    console.error('Error fetching text comparisons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch text comparisons' },
      { status: 500 }
    )
  }
}
