import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const results = await prisma.assessmentResult.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching assessment results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessment results' },
      { status: 500 }
    )
  }
}
