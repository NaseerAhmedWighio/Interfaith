import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const [
      traditions,
      teachings,
      misconceptions,
      sacredTexts,
      peaceInitiatives,
      movementMembers,
      newsletterSubscribers,
      assessmentResults,
      shareableQuotes,
      similarityThemes,
      users,
      roleRequests
    ] = await Promise.all([
      prisma.tradition.count(),
      prisma.teaching.count(),
      prisma.misconception.count(),
      prisma.sacredText.count(),
      prisma.peaceInitiative.count(),
      prisma.movementMember.count(),
      prisma.newsletterSubscriber.count(),
      prisma.assessmentResult.count(),
      prisma.shareableQuote.count(),
      prisma.similarityTheme.count(),
      prisma.user.count(),
      prisma.roleRequest.count({ where: { status: 'pending' } })
    ])

    return NextResponse.json({
      traditions,
      teachings,
      misconceptions,
      sacredTexts,
      peaceInitiatives,
      movementMembers,
      newsletterSubscribers,
      assessmentResults,
      shareableQuotes,
      similarityThemes,
      users,
      roleRequests
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
