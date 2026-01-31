'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Button, Card, CardContent, Avatar, Badge, Textarea } from '@/components/ui'

interface Author {
  id: string
  displayName: string
  avatar?: string
  bio?: string
}

interface Comment {
  id: string
  content: string
  author: Author
  createdAt: string
  replies?: Comment[]
}

interface Idea {
  id: string
  title: string
  description: string
  tags: string[]
  author: Author
  upvotes: number
  downvotes: number
  isValidated: boolean
  commentsCount: number
  comments: Comment[]
  createdAt: string
}

export default function IdeaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const ideaId = params.id as string

  const [idea, setIdea] = useState<Idea | null>(null)
  const [loading, setLoading] = useState(true)
  const [userVote, setUserVote] = useState<'UPVOTE' | 'DOWNVOTE' | null>(null)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  useEffect(() => {
    fetchIdea()
    if (user) fetchUserVote()
  }, [ideaId, user])

  const fetchIdea = async () => {
    try {
      const res = await fetch(`/api/ideas/${ideaId}`)
      if (!res.ok) {
        if (res.status === 404) {
          setIdea(null)
        }
        return
      }
      const data = await res.json()
      setIdea(data)
    } catch (error) {
      console.error('Error fetching idea:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserVote = async () => {
    try {
      const res = await fetch(`/api/ideas/${ideaId}/vote`)
      const data = await res.json()
      setUserVote(data.voteType)
    } catch (error) {
      console.error('Error fetching vote:', error)
    }
  }

  const handleVote = async (voteType: 'UPVOTE' | 'DOWNVOTE') => {
    if (!user || isVoting) return
    
    setIsVoting(true)
    try {
      const res = await fetch(`/api/ideas/${ideaId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType }),
      })
      
      const data = await res.json()
      setUserVote(data.voteType)
      
      // Refresh idea to get updated counts
      await fetchIdea()
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setIsSubmittingComment(true)
    try {
      const res = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      })

      if (res.ok) {
        setNewComment('')
        await fetchIdea() // Refresh to get new comment
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-24" />
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!idea) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Idea not found
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">
          The idea you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={() => router.push('/ideas')}>
          Back to Ideas
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href="/ideas"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Ideas
      </Link>

      {/* Idea Content */}
      <Card className="mb-8" variant="elevated">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Avatar
                src={idea.author?.avatar}
                fallback={idea.author?.displayName || 'A'}
                size="lg"
              />
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                  {idea.author?.displayName || 'Anonymous'}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {new Date(idea.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            {idea.isValidated && (
              <Badge variant="success" className="text-base px-4 py-1">
                Validated
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            {idea.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap mb-6">
            {idea.description}
          </p>

          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {idea.tags.map((tag) => (
                <Badge key={tag} variant="default" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              variant={userVote === 'UPVOTE' ? 'primary' : 'outline'}
              onClick={() => handleVote('UPVOTE')}
              disabled={!user || isVoting}
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Upvote ({idea.upvotes})
            </Button>

            <Button
              variant={userVote === 'DOWNVOTE' ? 'danger' : 'outline'}
              onClick={() => handleVote('DOWNVOTE')}
              disabled={!user || isVoting}
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              ({idea.downvotes})
            </Button>

            {!user && (
              <span className="text-sm text-zinc-500">
                <Link href="/auth/login" className="text-indigo-600 hover:underline">Log in</Link> to vote
              </span>
            )}
          </div>

          {/* Validation Progress */}
          {!idea.isValidated && (
            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Progress to Validation
                </span>
                <span className="text-sm text-zinc-500">
                  {Math.min(idea.upvotes - idea.downvotes, 50)} / 50 net upvotes
                </span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(Math.max((idea.upvotes - idea.downvotes) / 50 * 100, 0), 100)}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Ideas with 50+ net upvotes become validated, showing community approval.
              </p>
            </div>
          )}

          {idea.isValidated && (
            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">Community Validated</h4>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    This idea has received strong community support with {idea.upvotes - idea.downvotes}+ net upvotes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
            Comments ({idea.comments?.length || 0})
          </h2>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <Textarea
                placeholder="Share your thoughts or feedback on this idea..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="mb-3"
              />
              <Button type="submit" isLoading={isSubmittingComment} disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-center">
              <p className="text-zinc-600 dark:text-zinc-400">
                <Link href="/auth/login" className="text-indigo-600 hover:underline">Log in</Link> to leave a comment
              </p>
            </div>
          )}

          {/* Comments List */}
          {!idea.comments || idea.comments.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-6">
              {idea.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar
                    src={comment.author?.avatar}
                    fallback={comment.author?.displayName || 'A'}
                    size="sm"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {comment.author?.displayName || 'Anonymous'}
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
