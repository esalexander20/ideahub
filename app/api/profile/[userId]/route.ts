import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/profile/[userId] - Get a specific user's profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            ideas: true,
            comments: true,
          },
        },
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
