import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

const FIND_MODEL = {
  traditions: (id: string) => prisma.tradition.findUnique({ where: { id } }),
  teachings: (id: string) => prisma.teaching.findUnique({ where: { id } }),
  misconceptions: (id: string) => prisma.misconception.findUnique({ where: { id } }),
  sacred_texts: (id: string) => prisma.sacredText.findUnique({ where: { id } }),
  peace_initiatives: (id: string) => prisma.peaceInitiative.findUnique({ where: { id } }),
  similarity_themes: (id: string) => prisma.similarityTheme.findUnique({ where: { id } }),
  shareable_quotes: (id: string) => prisma.shareableQuote.findUnique({ where: { id } }),
  core_pillars: (id: string) => prisma.corePillar.findUnique({ where: { id } }),
  mission_content: (id: string) => prisma.missionContent.findUnique({ where: { id } }),
  wisdom_to_action: (id: string) => prisma.wisdomToAction.findUnique({ where: { id } }),
  impact_goals: (id: string) => prisma.impactGoal.findUnique({ where: { id } }),
  featured_programs: (id: string) => prisma.featuredProgram.findUnique({ where: { id } }),
  regional_initiatives: (id: string) => prisma.regionalInitiative.findUnique({ where: { id } }),
  get_involved: (id: string) => prisma.getInvolved.findUnique({ where: { id } }),
  current_initiatives: (id: string) => prisma.currentInitiative.findUnique({ where: { id } }),
  about_content: (id: string) => prisma.aboutContent.findUnique({ where: { id } }),
  about_values: (id: string) => prisma.aboutValue.findUnique({ where: { id } }),
  about_leaders: (id: string) => prisma.aboutLeader.findUnique({ where: { id } }),
  teaching_sections: (id: string) => prisma.teachingSection.findUnique({ where: { id } }),
  truth_sections: (id: string) => prisma.truthSection.findUnique({ where: { id } }),
  tradition_sections: (id: string) => prisma.traditionSection.findUnique({ where: { id } }),
  sufi_content: (id: string) => prisma.sufiContent.findUnique({ where: { id } }),
  approach_content: (id: string) => prisma.approachContent.findUnique({ where: { id } }),
  sufi_cards: (id: string) => prisma.sufiCard.findUnique({ where: { id } }),
  approach_cards: (id: string) => prisma.approachCard.findUnique({ where: { id } }),
}

const UPDATE_MODEL = {
  traditions: (id: string, data: any) => prisma.tradition.update({ where: { id }, data }),
  teachings: (id: string, data: any) => prisma.teaching.update({ where: { id }, data }),
  misconceptions: (id: string, data: any) => prisma.misconception.update({ where: { id }, data }),
  sacred_texts: (id: string, data: any) => prisma.sacredText.update({ where: { id }, data }),
  peace_initiatives: (id: string, data: any) => prisma.peaceInitiative.update({ where: { id }, data }),
  similarity_themes: (id: string, data: any) => prisma.similarityTheme.update({ where: { id }, data }),
  shareable_quotes: (id: string, data: any) => prisma.shareableQuote.update({ where: { id }, data }),
  core_pillars: (id: string, data: any) => prisma.corePillar.update({ where: { id }, data }),
  mission_content: (id: string, data: any) => prisma.missionContent.update({ where: { id }, data }),
  wisdom_to_action: (id: string, data: any) => prisma.wisdomToAction.update({ where: { id }, data }),
  impact_goals: (id: string, data: any) => prisma.impactGoal.update({ where: { id }, data }),
  featured_programs: (id: string, data: any) => prisma.featuredProgram.update({ where: { id }, data }),
  regional_initiatives: (id: string, data: any) => prisma.regionalInitiative.update({ where: { id }, data }),
  get_involved: (id: string, data: any) => prisma.getInvolved.update({ where: { id }, data }),
  current_initiatives: (id: string, data: any) => prisma.currentInitiative.update({ where: { id }, data }),
  about_content: (id: string, data: any) => prisma.aboutContent.update({ where: { id }, data }),
  about_values: (id: string, data: any) => prisma.aboutValue.update({ where: { id }, data }),
  about_leaders: (id: string, data: any) => prisma.aboutLeader.update({ where: { id }, data }),
  teaching_sections: (id: string, data: any) => prisma.teachingSection.update({ where: { id }, data }),
  truth_sections: (id: string, data: any) => prisma.truthSection.update({ where: { id }, data }),
  tradition_sections: (id: string, data: any) => prisma.traditionSection.update({ where: { id }, data }),
  sufi_content: (id: string, data: any) => prisma.sufiContent.update({ where: { id }, data }),
  approach_content: (id: string, data: any) => prisma.approachContent.update({ where: { id }, data }),
  sufi_cards: (id: string, data: any) => prisma.sufiCard.update({ where: { id }, data }),
  approach_cards: (id: string, data: any) => prisma.approachCard.update({ where: { id }, data }),
}

type ContentType = keyof typeof FIND_MODEL

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const user = await requireAuth()
    const { type, id } = await params
    const body = await request.json()
    const { reason } = body

    if (!reason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      )
    }

    // Get user role
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

    // Check permissions
    if (userWithRole.role !== 'admin' && userWithRole.role !== 'moderator') {
      return NextResponse.json(
        { error: 'You do not have permission to reject content' },
        { status: 403 }
      )
    }

    // Handle pending edit rejection
    if (type === 'pending_edit') {
      const pendingEdit = await prisma.pendingEdit.findUnique({
        where: { id },
      })

      if (!pendingEdit) {
        return NextResponse.json(
          { error: 'Pending edit not found' },
          { status: 404 }
        )
      }

      await prisma.pendingEdit.update({
        where: { id },
        data: { status: 'rejected', rejectionReason: reason, adminApprovedBy: user.id, appliedAt: new Date() },
      })

      return NextResponse.json({ message: 'Edit rejected successfully' })
    }

    // Validate content type for regular content
    const findContent = FIND_MODEL[type as ContentType]
    if (!findContent) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }

    // Get current content
    const content = await findContent(id)

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Update content
    const updateContent = UPDATE_MODEL[type as ContentType]
    const updatedContent = await updateContent(id, {
      status: 'rejected',
      rejectionReason: reason,
      approvedBy: user.id,
      approvedAt: new Date(),
    })

    return NextResponse.json({
      message: 'Content rejected successfully',
      content: updatedContent,
    })
  } catch (error) {
    console.error('Error rejecting content:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to reject content' },
      { status: 500 }
    )
  }
}
