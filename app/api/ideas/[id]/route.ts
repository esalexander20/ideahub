import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'

// GET /api/ideas/[id] - Get a specific idea
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const idea = await prisma.idea.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
            bio: true,
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                displayName: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
    })

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...idea,
      commentsCount: idea._count.comments,
    })
  } catch (error) {
    console.error('Error fetching idea:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/ideas/[id] - Update an idea
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, tags } = body

    // Check ownership
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    const existingIdea = await prisma.idea.findUnique({
      where: { id },
    })

    if (!existingIdea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    if (existingIdea.authorId !== profile?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const idea = await prisma.idea.update({
      where: { id },
      data: {
        title,
        description,
        tags,
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

    return NextResponse.json(idea)
  } catch (error) {
    console.error('Error updating idea:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/ideas/[id] - Delete an idea
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check ownership
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    const existingIdea = await prisma.idea.findUnique({
      where: { id },
    })

    if (!existingIdea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    if (existingIdea.authorId !== profile?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.idea.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting idea:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
