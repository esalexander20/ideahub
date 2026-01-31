import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'

// GET /api/profile/ideas - Get current user's ideas
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get user's ideas with comment counts
    const ideas = await prisma.idea.findMany({
      where: { authorId: profile.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { comments: true },
        },
      },
    })

    // Transform to include commentsCount
    const transformedIdeas = ideas.map((idea) => ({
      ...idea,
      commentsCount: idea._count.comments,
      _count: undefined,
    }))

    return NextResponse.json({ ideas: transformedIdeas })
  } catch (error) {
    console.error('Error fetching user ideas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
