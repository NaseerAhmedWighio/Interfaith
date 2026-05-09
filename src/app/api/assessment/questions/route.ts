import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const questions = await prisma.assessmentQuestion.findMany({
      orderBy: {
        orderIndex: 'asc'
      }
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error fetching assessment questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessment questions' },
      { status: 500 }
    )
  }
}
