import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'

// GET /api/ideas - Get all ideas with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    const sortBy = searchParams.get('sortBy') || 'popular'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (tags.length > 0) {
      where.tags = { hasSome: tags }
    }

    // Build orderBy clause
    let orderBy: Record<string, string> = {}
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'popular':
        orderBy = { upvotes: 'desc' }
        break
      case 'validated':
        orderBy = { isValidated: 'desc' }
        break
      default:
        orderBy = { upvotes: 'desc' }
    }

    const [ideas, total] = await Promise.all([
      prisma.idea.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.idea.count({ where }),
    ])

    // Transform to include commentsCount
    const transformedIdeas = ideas.map((idea) => ({
      ...idea,
      commentsCount: idea._count.comments,
      _count: undefined,
    }))

    return NextResponse.json({
      ideas: transformedIdeas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching ideas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/ideas - Create a new idea
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { title, description, tags } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        tags: tags || [],
        authorId: profile.id,
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json(idea, { status: 201 })
  } catch (error) {
    console.error('Error creating idea:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
