import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.currentInitiative.findMany({ orderBy: { orderIndex: 'asc' } })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch current initiatives' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const item = await prisma.currentInitiative.create({ data: body })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Failed to create current initiative' }, { status: 500 })
  }
}
