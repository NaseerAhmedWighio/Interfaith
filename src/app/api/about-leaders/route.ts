import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.aboutLeader.findMany({
      orderBy: { orderIndex: 'asc' },
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching about leaders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about leaders' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, role, description, image, orderIndex } = body

    if (!name || !role || !description) {
      return NextResponse.json(
        { error: 'name, role, and description are required' },
        { status: 400 }
      )
    }

    const item = await prisma.aboutLeader.create({
      data: {
        name,
        role,
        description,
        image,
        orderIndex: orderIndex ?? 0,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating about leader:', error)
    return NextResponse.json(
      { error: 'Failed to create about leader' },
      { status: 500 }
    )
  }
}
