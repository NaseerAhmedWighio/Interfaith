import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, subscriptionTopics } = body

    // Generate unsubscribe token
    const unsubscribeToken = randomBytes(32).toString('hex')

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        name,
        subscriptionTopics: subscriptionTopics || [],
        unsubscribeToken,
        isActive: true
      }
    })

    return NextResponse.json({ success: true, subscriber })
  } catch (error) {
    console.error('Error creating newsletter subscriber:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}
