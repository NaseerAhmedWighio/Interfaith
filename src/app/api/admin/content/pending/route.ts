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
  core_pillars: prisma.corePillar,
  mission_content: prisma.missionContent,
  wisdom_to_action: prisma.wisdomToAction,
  impact_goals: prisma.impactGoal,
  featured_programs: prisma.featuredProgram,
  regional_initiatives: prisma.regionalInitiative,
  get_involved: prisma.getInvolved,
  current_initiatives: prisma.currentInitiative,
  about_content: prisma.aboutContent,
  about_values: prisma.aboutValue,
  about_leaders: prisma.aboutLeader,
  teaching_sections: prisma.teachingSection,
  truth_sections: prisma.truthSection,
  tradition_sections: prisma.traditionSection,
  sufi_content: prisma.sufiContent,
  approach_content: prisma.approachContent,
  sufi_cards: prisma.sufiCard,
  approach_cards: prisma.approachCard,
} as const

const CONTENT_MODEL_LOOKUP: Record<string, any> = {
  traditions: prisma.tradition,
  teachings: prisma.teaching,
  misconceptions: prisma.misconception,
  sacred_texts: prisma.sacredText,
  peace_initiatives: prisma.peaceInitiative,
  similarity_themes: prisma.similarityTheme,
  shareable_quotes: prisma.shareableQuote,
  core_pillars: prisma.corePillar,
  mission_content: prisma.missionContent,
  wisdom_to_action: prisma.wisdomToAction,
  impact_goals: prisma.impactGoal,
  featured_programs: prisma.featuredProgram,
  regional_initiatives: prisma.regionalInitiative,
  get_involved: prisma.getInvolved,
  current_initiatives: prisma.currentInitiative,
  about_content: prisma.aboutContent,
  about_values: prisma.aboutValue,
  about_leaders: prisma.aboutLeader,
  teaching_sections: prisma.teachingSection,
  truth_sections: prisma.truthSection,
  tradition_sections: prisma.traditionSection,
  sufi_content: prisma.sufiContent,
  approach_content: prisma.approachContent,
  sufi_cards: prisma.sufiCard,
  approach_cards: prisma.approachCard,
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

    const [traditions, teachings, misconceptions, sacredTexts, peaceInitiatives, similarityThemes, shareableQuotes, corePillars, missionContent, wisdomToAction, impactGoals, featuredPrograms, regionalInitiatives, getInvolved, currentInitiatives, aboutContent, aboutValues, aboutLeaders, teachingSections, truthSections, traditionSections, sufiContent, approachContent, sufiCards, approachCards, pendingEdits] = await Promise.all([
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
      prisma.corePillar.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.missionContent.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.wisdomToAction.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.impactGoal.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.featuredProgram.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.regionalInitiative.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.getInvolved.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.currentInitiative.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.aboutContent.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.aboutValue.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.aboutLeader.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.teachingSection.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.truthSection.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.traditionSection.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sufiContent.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.approachContent.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sufiCard.findMany({
        where: { status: { in: statusFilter } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.approachCard.findMany({
        where: { status: { in: statusFilter } },
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
      corePillars: corePillars.map(item => ({ ...item, type: 'core_pillars' })),
      missionContent: missionContent.map(item => ({ ...item, type: 'mission_content' })),
      wisdomToAction: wisdomToAction.map(item => ({ ...item, type: 'wisdom_to_action' })),
      impactGoals: impactGoals.map(item => ({ ...item, type: 'impact_goals' })),
      featuredPrograms: featuredPrograms.map(item => ({ ...item, type: 'featured_programs' })),
      regionalInitiatives: regionalInitiatives.map(item => ({ ...item, type: 'regional_initiatives' })),
      getInvolved: getInvolved.map(item => ({ ...item, type: 'get_involved' })),
      currentInitiatives: currentInitiatives.map(item => ({ ...item, type: 'current_initiatives' })),
      aboutContent: aboutContent.map(item => ({ ...item, type: 'about_content' })),
      aboutValues: aboutValues.map(item => ({ ...item, type: 'about_values' })),
      aboutLeaders: aboutLeaders.map(item => ({ ...item, type: 'about_leaders' })),
      teachingSections: teachingSections.map(item => ({ ...item, type: 'teaching_sections' })),
      truthSections: truthSections.map(item => ({ ...item, type: 'truth_sections' })),
      traditionSections: traditionSections.map(item => ({ ...item, type: 'tradition_sections' })),
      sufiContent: sufiContent.map(item => ({ ...item, type: 'sufi_content' })),
      approachContent: approachContent.map(item => ({ ...item, type: 'approach_content' })),
      sufiCards: sufiCards.map(item => ({ ...item, type: 'sufi_cards' })),
      approachCards: approachCards.map(item => ({ ...item, type: 'approach_cards' })),
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
