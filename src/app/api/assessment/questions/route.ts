import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const questions = await prisma.assessmentQuestion.findMany({
      orderBy: { orderIndex: 'asc' }
    })
    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error fetching assessment questions:', error)
    return NextResponse.json({ error: 'Failed to fetch assessment questions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { questionText, category, orderIndex } = body
    if (!questionText || !category) {
      return NextResponse.json({ error: 'questionText and category are required' }, { status: 400 })
    }
    const question = await prisma.assessmentQuestion.create({
      data: { questionText, category, orderIndex: orderIndex ?? 0 }
    })
    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
  }
}
