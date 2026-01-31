import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'
import { VoteType } from '@prisma/client'

// Validation threshold - ideas with this many net upvotes become validated
const VALIDATION_THRESHOLD = 50

// Check and update validation status based on votes
async function checkAndUpdateValidation(ideaId: string) {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    select: { upvotes: true, downvotes: true, isValidated: true },
  })
  
  if (!idea) return
  
  const netUpvotes = idea.upvotes - idea.downvotes
  const shouldBeValidated = netUpvotes >= VALIDATION_THRESHOLD
  
  // Only update if validation status needs to change
  if (shouldBeValidated !== idea.isValidated) {
    await prisma.idea.update({
      where: { id: ideaId },
      data: { isValidated: shouldBeValidated },
    })
  }
}

// POST /api/ideas/[id]/vote - Vote on an idea
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: ideaId } = await params
    const body = await request.json()
    const { voteType } = body as { voteType: 'UPVOTE' | 'DOWNVOTE' }

    if (!voteType || !['UPVOTE', 'DOWNVOTE'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      )
    }

    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check if idea exists
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    })

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    // Check for existing vote
    const existingVote = await prisma.vote.findUnique({
      where: {
        ideaId_userId: {
          ideaId,
          userId: profile.id,
        },
      },
    })

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Same vote type - remove the vote (toggle off)
        await prisma.$transaction([
          prisma.vote.delete({
            where: { id: existingVote.id },
          }),
          prisma.idea.update({
            where: { id: ideaId },
            data: {
              [voteType === 'UPVOTE' ? 'upvotes' : 'downvotes']: {
                decrement: 1,
              },
            },
          }),
        ])

        // Check if validation status should change
        await checkAndUpdateValidation(ideaId)

        return NextResponse.json({ 
          message: 'Vote removed',
          voteType: null,
        })
      } else {
        // Different vote type - change the vote
        await prisma.$transaction([
          prisma.vote.update({
            where: { id: existingVote.id },
            data: { voteType: voteType as VoteType },
          }),
          prisma.idea.update({
            where: { id: ideaId },
            data: {
              [voteType === 'UPVOTE' ? 'upvotes' : 'downvotes']: {
                increment: 1,
              },
              [voteType === 'UPVOTE' ? 'downvotes' : 'upvotes']: {
                decrement: 1,
              },
            },
          }),
        ])

        // Check if validation status should change
        await checkAndUpdateValidation(ideaId)

        return NextResponse.json({ 
          message: 'Vote changed',
          voteType,
        })
      }
    }

    // Create new vote
    await prisma.$transaction([
      prisma.vote.create({
        data: {
          ideaId,
          userId: profile.id,
          voteType: voteType as VoteType,
        },
      }),
      prisma.idea.update({
        where: { id: ideaId },
        data: {
          [voteType === 'UPVOTE' ? 'upvotes' : 'downvotes']: {
            increment: 1,
          },
        },
      }),
    ])

    // Check if validation status should change
    await checkAndUpdateValidation(ideaId)

    return NextResponse.json({ 
      message: 'Vote added',
      voteType,
    }, { status: 201 })
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/ideas/[id]/vote - Get user's vote for an idea
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ voteType: null })
    }

    const { id: ideaId } = await params

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    if (!profile) {
      return NextResponse.json({ voteType: null })
    }

    const vote = await prisma.vote.findUnique({
      where: {
        ideaId_userId: {
          ideaId,
          userId: profile.id,
        },
      },
    })

    return NextResponse.json({ voteType: vote?.voteType || null })
  } catch (error) {
    console.error('Error getting vote:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
