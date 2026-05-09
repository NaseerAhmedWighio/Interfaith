import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        emailVerified: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        profileImage: true,
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Get profile error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth()
    const formData = await request.formData()
    const fullName = formData.get('fullName') as string
    const imageFile = formData.get('image') as File | null

    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Full name must be at least 2 characters' },
        { status: 400 }
      )
    }

    let profileImagePath: string | undefined

    if (imageFile && imageFile.size > 0) {
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Invalid file type. Only images are allowed.' },
          { status: 400 }
        )
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image size must be less than 5MB' },
          { status: 400 }
        )
      }

      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'profiles')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      const timestamp = Date.now()
      const fileExtension = imageFile.name.split('.').pop()
      const fileName = `${user.id}-${timestamp}.${fileExtension}`
      const filePath = join(uploadsDir, fileName)

      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      profileImagePath = `/uploads/profiles/${fileName}`
    }

    const updateData: any = {
      fullName: fullName.trim(),
    }

    if (profileImagePath) {
      updateData.profileImage = profileImagePath
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        emailVerified: true,
        profileImage: true,
      },
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Update profile error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred while updating profile' },
      { status: 500 }
    )
  }
}
