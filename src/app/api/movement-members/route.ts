import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fullName,
      email,
      traditionAffiliation,
      message,
      howHeard,
      wantsNewsletter,
      wantsVolunteer
    } = body

    const member = await prisma.movementMember.create({
      data: {
        fullName,
        email,
        traditionAffiliation,
        message,
        howHeard,
        wantsNewsletter: wantsNewsletter || false,
        wantsVolunteer: wantsVolunteer || false
      }
    })

    return NextResponse.json({ success: true, member })
  } catch (error) {
    console.error('Error creating movement member:', error)
    return NextResponse.json(
      { error: 'Failed to join movement' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const members = await prisma.movementMember.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching movement members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}
