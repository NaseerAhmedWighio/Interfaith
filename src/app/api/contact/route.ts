import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { baseEmailTemplate } from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      console.error('ADMIN_EMAIL not configured')
      return NextResponse.json({ error: 'Contact form not available' }, { status: 500 })
    }

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json({ error: 'Email service not available' }, { status: 500 })
    }

    const resend = new Resend(resendApiKey)
    const fromEmail = process.env.FROM_EMAIL || 'noreply@interfaithpeacebridge.org'

    const content = `
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="white-space: pre-wrap;">${message}</p>
    `

    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: baseEmailTemplate({
        headerTitle: 'New Contact Form Submission',
        content,
        preheader: `Message from ${name} - ${subject}`,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
