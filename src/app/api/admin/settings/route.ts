import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const SORT_KEYS = [
  'sort_traditions',
  'sort_teachings',
  'sort_misconceptions',
  'sort_sacred_texts',
  'sort_peace_initiatives',
  'sort_similarity_themes',
  'sort_shareable_quotes',
]

const DEFAULTS: Record<string, { field: string; order: string }> = {
  sort_traditions: { field: 'name', order: 'asc' },
  sort_teachings: { field: 'date', order: 'desc' },
  sort_misconceptions: { field: 'date', order: 'desc' },
  sort_sacred_texts: { field: 'date', order: 'desc' },
  sort_peace_initiatives: { field: 'date', order: 'desc' },
  sort_similarity_themes: { field: 'date', order: 'desc' },
  sort_shareable_quotes: { field: 'date', order: 'desc' },
}

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: SORT_KEYS } },
    })
    const settings: Record<string, any> = {}
    for (const key of SORT_KEYS) {
      const row = rows.find(r => r.key === key)
      settings[key] = row ? row.value : DEFAULTS[key]
    }
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    const fallback: Record<string, any> = {}
    for (const key of SORT_KEYS) {
      fallback[key] = DEFAULTS[key]
    }
    return NextResponse.json({ settings: fallback })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || !SORT_KEYS.includes(key)) {
      return NextResponse.json({ error: 'Invalid setting key' }, { status: 400 })
    }

    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving setting:', error)
    return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 })
  }
}
