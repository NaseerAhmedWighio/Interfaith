import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.aboutValue.findMany({
      orderBy: { orderIndex: 'asc' },
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching about values:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about values' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, icon, color, orderIndex } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'title and description are required' },
        { status: 400 }
      )
    }

    const item = await prisma.aboutValue.create({
      data: {
        title,
        description,
        icon,
        color,
        orderIndex: orderIndex ?? 0,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating about value:', error)
    return NextResponse.json(
      { error: 'Failed to create about value' },
      { status: 500 }
    )
  }
}
