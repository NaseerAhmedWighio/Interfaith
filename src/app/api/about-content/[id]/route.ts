import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = await getCurrentUser()

    const content = await prisma.aboutContent.findUnique({
      where: { id }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'About content not found' },
        { status: 404 }
      )
    }

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (content.status !== 'published') {
        return NextResponse.json(
          { error: 'About content not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching about content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You do not have permission to update about content' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { sectionKey, title, content } = body

    const aboutContent = await prisma.aboutContent.update({
      where: { id },
      data: { sectionKey, title, content, status: 'published' }
    })

    return NextResponse.json(aboutContent)
  } catch (error) {
    console.error('Error updating about content:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You do not have permission to delete about content' },
        { status: 403 }
      )
    }

    await prisma.aboutContent.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting about content:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete about content' },
      { status: 500 }
    )
  }
}