'use server'

import { prisma } from '@/lib/prisma'

type SortOrder = 'asc' | 'desc'

async function getSortSetting(key: string): Promise<{ field: string; order: SortOrder } | null> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key } })
    return setting?.value as any ?? null
  } catch {
    return null
  }
}

function buildOrderBy(field: string, order: SortOrder, nameField: string, dateField: string): any {
  if (field === 'name') return { [nameField]: order }
  return { [dateField]: order }
}

// Traditions
export async function getTraditions() {
  try {
    const saved = await getSortSetting('sort_traditions')
    const orderBy = buildOrderBy(saved?.field || 'name', saved?.order || 'asc', 'name', 'createdAt')
    const traditions = await prisma.tradition.findMany({
      where: { status: 'published' },
      orderBy,
      select: {
        id: true,
        name: true,
        description: true,
        coreValues: true
      }
    })
    return { data: traditions, error: null }
  } catch (error) {
    console.error('Error fetching traditions:', error)
    return { data: null, error: 'Failed to fetch traditions' }
  }
}

export async function getTraditionById(id: string) {
  try {
    const tradition = await prisma.tradition.findUnique({
      where: { id },
      include: {
        teachings: true,
        misconceptions: true
      }
    })
    return { data: tradition, error: null }
  } catch (error) {
    console.error('Error fetching tradition:', error)
    return { data: null, error: 'Failed to fetch tradition' }
  }
}

// Teachings
export async function getTeachings(limit?: number) {
  try {
    const saved = await getSortSetting('sort_teachings')
    const orderBy = buildOrderBy(saved?.field || 'date', saved?.order || 'desc', 'title', 'createdAt')
    const teachings = await prisma.teaching.findMany({
      take: limit,
      where: { status: 'published' },
      orderBy,
      select: {
        id: true,
        title: true,
        content: true,
        source: true,
        category: true
      }
    })
    return { data: teachings, error: null }
  } catch (error) {
    console.error('Error fetching teachings:', error)
    return { data: null, error: 'Failed to fetch teachings' }
  }
}

export async function getTeachingsByCategory(category: string) {
  try {
    const saved = await getSortSetting('sort_teachings')
    const orderBy = buildOrderBy(saved?.field || 'date', saved?.order || 'desc', 'title', 'createdAt')
    const teachings = await prisma.teaching.findMany({
      where: { category, status: 'published' },
      include: {
        tradition: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy
    })
    return { data: teachings, error: null }
  } catch (error) {
    console.error('Error fetching teachings:', error)
    return { data: null, error: 'Failed to fetch teachings' }
  }
}

// Misconceptions
export async function getMisconceptions() {
  try {
    const saved = await getSortSetting('sort_misconceptions')
    const orderBy = buildOrderBy(saved?.field || 'date', saved?.order || 'desc', 'misconception', 'createdAt')
    const misconceptions = await prisma.misconception.findMany({
      where: { status: 'published' },
      include: {
        tradition: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy
    })
    return { data: misconceptions, error: null }
  } catch (error) {
    console.error('Error fetching misconceptions:', error)
    return { data: null, error: 'Failed to fetch misconceptions' }
  }
}

// Peace Initiatives
export async function getPeaceInitiatives() {
  try {
    const saved = await getSortSetting('sort_peace_initiatives')
    const orderBy = buildOrderBy(saved?.field || 'date', saved?.order || 'desc', 'title', 'createdAt')
    const initiatives = await prisma.peaceInitiative.findMany({
      orderBy,
      select: {
        id: true,
        title: true,
        description: true,
        impact: true,
        status: true,
        createdAt: true,
      }
    })
    return { data: initiatives, error: null }
  } catch (error) {
    console.error('Error fetching peace initiatives:', error)
    return { data: null, error: 'Failed to fetch peace initiatives' }
  }
}

// Similarity Themes
export async function getSimilarityThemes() {
  try {
    const saved = await getSortSetting('sort_similarity_themes')
    const orderBy = saved ? buildOrderBy(saved.field, saved.order, 'title', 'createdAt') : { orderIndex: 'asc' as const }
    const themes = await prisma.similarityTheme.findMany({
      where: { status: 'published' },
      orderBy,
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
        slug: true
      }
    })
    return { data: themes, error: null }
  } catch (error) {
    console.error('Error fetching similarity themes:', error)
    return { data: null, error: 'Failed to fetch similarity themes' }
  }
}

export async function getSimilarityThemeBySlug(slug: string) {
  try {
    const theme = await prisma.similarityTheme.findUnique({
      where: { slug, status: 'published' },
      include: {
        teachings: {
          include: {
            tradition: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })
    return { data: theme, error: null }
  } catch (error) {
    console.error('Error fetching similarity theme:', error)
    return { data: null, error: 'Failed to fetch similarity theme' }
  }
}

// Assessment
export async function getAssessmentQuestions() {
  try {
    const questions = await prisma.assessmentQuestion.findMany({
      orderBy: { orderIndex: 'asc' }
    })
    return { data: questions, error: null }
  } catch (error) {
    console.error('Error fetching assessment questions:', error)
    return { data: null, error: 'Failed to fetch assessment questions' }
  }
}

export async function saveAssessmentResult(data: {
  sessionId: string
  peaceScore: number
  toleranceScore: number
  compassionScore: number
  understandingScore: number
  overallScore: number
  resultCategory: string
  answers: any
  userId?: string
}) {
  try {
    const result = await prisma.assessmentResult.create({
      data
    })
    return { data: result, error: null }
  } catch (error) {
    console.error('Error saving assessment result:', error)
    return { data: null, error: 'Failed to save assessment result' }
  }
}

// Movement Members
export async function createMovementMember(data: {
  email: string
  fullName: string
  country?: string
  interests?: string[]
  traditionAffiliation?: string
  howHeard?: string
  message?: string
  wantsNewsletter?: boolean
  wantsVolunteer?: boolean
  userId?: string
}) {
  try {
    const member = await prisma.movementMember.create({
      data
    })
    return { data: member, error: null }
  } catch (error) {
    console.error('Error creating movement member:', error)
    return { data: null, error: 'Failed to create movement member' }
  }
}

// Newsletter Subscribers
export async function createNewsletterSubscriber(data: {
  email: string
  name?: string
  subscriptionTopics?: string[]
  frequency?: string
  source?: string
  userId?: string
}) {
  try {
    const subscriber = await prisma.newsletterSubscriber.create({
      data
    })
    return { data: subscriber, error: null }
  } catch (error) {
    console.error('Error creating newsletter subscriber:', error)
    return { data: null, error: 'Failed to create newsletter subscriber' }
  }
}

// Sacred Texts
export async function getSacredTexts(theme?: string) {
  try {
    const saved = await getSortSetting('sort_sacred_texts')
    const orderBy = buildOrderBy(saved?.field || 'date', saved?.order || 'desc', 'title', 'createdAt')
    const texts = await prisma.sacredText.findMany({
      where: { status: 'published', ...(theme ? { theme } : {}) },
      include: {
        tradition: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy
    })
    return { data: texts, error: null }
  } catch (error) {
    console.error('Error fetching sacred texts:', error)
    return { data: null, error: 'Failed to fetch sacred texts' }
  }
}

// ── Core Content Models ─────────────────────────────────

export async function getCorePillars() {
  try {
    const data = await prisma.corePillar.findMany({
      where: { status: 'published' },
      orderBy: { orderIndex: 'asc' },
    })
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching core pillars:', error)
    return { data: null, error: 'Failed to fetch core pillars' }
  }
}

export async function getMissionContent(sectionKey?: string) {
  try {
    const where = sectionKey ? { sectionKey } : {}
    const data = await prisma.missionContent.findMany({
      where: sectionKey ? { ...where, status: 'published' } : where,
    })
    return { data: sectionKey ? data[0] || null : data, error: null }
  } catch (error) {
    console.error('Error fetching mission content:', error)
    return { data: null, error: 'Failed to fetch mission content' }
  }
}

export async function getImpactGoals() {
  try {
    const data = await prisma.impactGoal.findMany({
      where: { status: 'published' },
      orderBy: { orderIndex: 'asc' },
    })
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching impact goals:', error)
    return { data: null, error: 'Failed to fetch impact goals' }
  }
}

export async function getFeaturedPrograms() {
  try {
    const data = await prisma.featuredProgram.findMany({
      where: { status: 'published' },
      orderBy: { orderIndex: 'asc' },
    })
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching featured programs:', error)
    return { data: null, error: 'Failed to fetch featured programs' }
  }
}

export async function getRegionalInitiatives() {
  try {
    const data = await prisma.regionalInitiative.findMany({
      where: { status: 'published' },
      orderBy: { orderIndex: 'asc' },
    })
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching regional initiatives:', error)
    return { data: null, error: 'Failed to fetch regional initiatives' }
  }
}

export async function getGetInvolved() {
  try {
    const data = await prisma.getInvolved.findMany({
      where: { status: 'published' },
      orderBy: { orderIndex: 'asc' },
    })
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching get involved:', error)
    return { data: null, error: 'Failed to fetch get involved' }
  }
}

export async function getAboutContent(sectionKey?: string) {
  try {
    const where = sectionKey ? { sectionKey } : {}
    const data = await prisma.aboutContent.findMany({
      where: sectionKey ? { ...where, status: 'published' } : where,
      orderBy: { orderIndex: 'asc' },
    })
    return { data: sectionKey ? data[0] || null : data, error: null }
  } catch (error) {
    console.error('Error fetching about content:', error)
    return { data: null, error: 'Failed to fetch about content' }
  }
}

export async function getTeachingSection(sectionKey?: string) {
  try {
    const where = sectionKey ? { sectionKey } : {}
    const data = await prisma.teachingSection.findMany({
      where: sectionKey ? { ...where, status: 'published' } : where,
    })
    return { data: sectionKey ? data[0] || null : data, error: null }
  } catch (error) {
    console.error('Error fetching teaching sections:', error)
    return { data: null, error: 'Failed to fetch teaching sections' }
  }
}

export async function getTruthSection(sectionKey?: string) {
  try {
    const where = sectionKey ? { sectionKey } : {}
    const data = await prisma.truthSection.findMany({
      where: sectionKey ? { ...where, status: 'published' } : where,
    })
    return { data: sectionKey ? data[0] || null : data, error: null }
  } catch (error) {
    console.error('Error fetching truth sections:', error)
    return { data: null, error: 'Failed to fetch truth sections' }
  }
}

export async function getTraditionSection(sectionKey?: string) {
  try {
    const where = sectionKey ? { sectionKey } : {}
    const data = await prisma.traditionSection.findMany({
      where: sectionKey ? { ...where, status: 'published' } : where,
    })
    return { data: sectionKey ? data[0] || null : data, error: null }
  } catch (error) {
    console.error('Error fetching tradition sections:', error)
    return { data: null, error: 'Failed to fetch tradition sections' }
  }
}
