'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Button, Input, Badge, Card, CardContent, Avatar } from '@/components/ui'

interface Author {
  id: string
  displayName: string
  avatar?: string
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
  createdAt: string
}

type SortOption = 'newest' | 'popular' | 'validated'

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('popular')

  useEffect(() => {
    fetchIdeas()
  }, [sortBy])

  const fetchIdeas = async () => {
    try {
      const params = new URLSearchParams({
        sortBy,
        limit: '50',
      })
      
      const res = await fetch(`/api/ideas?${params}`)
      const data = await res.json()
      setIdeas(data.ideas || [])
    } catch (error) {
      console.error('Error fetching ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get all unique tags from ideas
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    ideas.forEach((idea) => idea.tags?.forEach((tag) => tags.add(tag)))
    return Array.from(tags)
  }, [ideas])

  // Filter ideas client-side for instant feedback
  const filteredIdeas = useMemo(() => {
    let filtered = [...ideas]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (idea) =>
          idea.title.toLowerCase().includes(query) ||
          idea.description.toLowerCase().includes(query) ||
          idea.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((idea) =>
        selectedTags.some((tag) => idea.tags?.includes(tag))
      )
    }

    return filtered
  }, [ideas, searchQuery, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
          <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Explore Ideas
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Discover and validate innovative ideas from the community
          </p>
        </div>
        <Link href="/ideas/new">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Submit Idea
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-zinc-900"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'popular' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('popular')}
            >
              Popular
            </Button>
            <Button
              variant={sortBy === 'newest' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('newest')}
            >
              Newest
            </Button>
            <Button
              variant={sortBy === 'validated' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSortBy('validated')}
            >
              Validated
            </Button>
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-zinc-500 dark:text-zinc-400 mr-2">Filter by tags:</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`
                  px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  }
                `}
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-sm text-indigo-600 hover:text-indigo-700 ml-2"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        Showing {filteredIdeas.length} {filteredIdeas.length === 1 ? 'idea' : 'ideas'}
      </p>

      {/* Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            {ideas.length === 0 ? 'No ideas yet' : 'No ideas found'}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">
            {ideas.length === 0 
              ? 'Be the first to share an idea!'
              : 'Try adjusting your search or filters'
            }
          </p>
          {ideas.length === 0 ? (
            <Link href="/ideas/new">
              <Button>Submit Your Idea</Button>
            </Link>
          ) : (
            <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedTags([]) }}>
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredIdeas.map((idea) => (
            <Link key={idea.id} href={`/ideas/${idea.id}`}>
              <Card
                className="h-full hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-md cursor-pointer"
                padding="none"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={idea.author?.avatar}
                        fallback={idea.author?.displayName || 'A'}
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
                    {idea.isValidated && <Badge variant="success">Validated</Badge>}
                  </div>

                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    {idea.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4">
                    {idea.description}
                  </p>

                  {idea.tags && idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {idea.tags.map((tag) => (
                        <Badge key={tag} variant="default">{tag}</Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      {idea.upvotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {idea.commentsCount || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
