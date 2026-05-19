import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const item = await prisma.currentInitiative.update({ where: { id }, data: body })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Failed to update current initiative' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.currentInitiative.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete current initiative' }, { status: 500 })
  }
}
