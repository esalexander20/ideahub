'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Card, Avatar, Badge, Button } from '@/components/ui'
import { Idea } from '@/lib/types'

interface IdeaCardProps {
  idea: Idea
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const [upvotes, setUpvotes] = useState(idea.upvotes)
  const [hasUpvoted, setHasUpvoted] = useState(false)

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (hasUpvoted) {
      setUpvotes(upvotes - 1)
      setHasUpvoted(false)
    } else {
      setUpvotes(upvotes + 1)
      setHasUpvoted(true)
    }
  }

  return (
    <Link href={`/ideas/${idea.id}`}>
      <Card
        className="hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-md cursor-pointer"
        padding="none"
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <Avatar
                src={idea.author?.avatar}
                fallback={idea.author?.displayName || 'Anonymous'}
                size="sm"
              />
              <div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {idea.author?.displayName || 'Anonymous'}
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">
                  · {new Date(idea.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {idea.isValidated && (
              <Badge variant="success">Validated</Badge>
            )}
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            {idea.title}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4">
            {idea.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              {/* Upvote button */}
              <Button
                variant={hasUpvoted ? 'primary' : 'outline'}
                size="sm"
                onClick={handleUpvote}
                className="flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                {upvotes}
              </Button>

              {/* Comments */}
              <span className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {idea.commentsCount}
              </span>
            </div>

            <Button variant="ghost" size="sm">
              View Details →
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}
