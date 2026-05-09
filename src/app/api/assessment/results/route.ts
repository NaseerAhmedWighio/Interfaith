import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sessionId,
      answers,
      peaceScore,
      toleranceScore,
      compassionScore,
      understandingScore,
      overallScore,
      resultCategory
    } = body

    const result = await prisma.assessmentResult.create({
      data: {
        sessionId,
        answers,
        peaceScore,
        toleranceScore,
        compassionScore,
        understandingScore,
        overallScore,
        resultCategory
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error saving assessment result:', error)
    return NextResponse.json(
      { error: 'Failed to save assessment result' },
      { status: 500 }
    )
  }
}
