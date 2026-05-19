import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { questionText, category, orderIndex } = body
    const updated = await prisma.assessmentQuestion.update({
      where: { id },
      data: { questionText, category, orderIndex: orderIndex !== undefined ? orderIndex : undefined }
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating question:', error)
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.assessmentQuestion.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 })
  }
}
