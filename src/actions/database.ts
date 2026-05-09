'use server'

import { prisma } from '@/lib/prisma'

// Traditions
export async function getTraditions() {
  try {
    const traditions = await prisma.tradition.findMany({
      where: { status: 'published' },
      orderBy: { name: 'asc' },
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
    const teachings = await prisma.teaching.findMany({
      take: limit,
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
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
      orderBy: { createdAt: 'desc' }
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
      orderBy: { createdAt: 'desc' }
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
    const initiatives = await prisma.peaceInitiative.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' }
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
    const themes = await prisma.similarityTheme.findMany({
      where: { status: 'published' },
      orderBy: { orderIndex: 'asc' },
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
      orderBy: { createdAt: 'desc' }
    })
    return { data: texts, error: null }
  } catch (error) {
    console.error('Error fetching sacred texts:', error)
    return { data: null, error: 'Failed to fetch sacred texts' }
  }
}

export async function getTextComparisons() {
  try {
    const comparisons = await prisma.textComparison.findMany({
      include: {
        comparisonTexts: {
          include: {
            sacredText: {
              include: {
                tradition: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          },
          orderBy: { displayOrder: 'asc' }
        }
      }
    })
    return { data: comparisons, error: null }
  } catch (error) {
    console.error('Error fetching text comparisons:', error)
    return { data: null, error: 'Failed to fetch text comparisons' }
  }
}
