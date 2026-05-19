import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json()
    const {
      sessionId,
      answers,
      peaceScore,
      toleranceScore,
      compassionScore,
      understandingScore,
      overallScore,
      resultCategory,
      country
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
        resultCategory,
        country: country || null,
        userId: currentUser?.id || null
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
