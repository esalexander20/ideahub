'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Button, Input, Textarea, Card, CardContent, Badge } from '@/components/ui'

const SUGGESTED_TAGS = [
  'AI', 'Mobile App', 'Web App', 'Social', 'E-commerce', 'FinTech',
  'Health', 'Education', 'Gaming', 'Productivity', 'Sustainability', 'B2B'
]

export default function NewIdeaPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
  })
  const [customTag, setCustomTag] = useState('')

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const addCustomTag = () => {
    if (customTag && !formData.tags.includes(customTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, customTag],
      }))
      setCustomTag('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create idea')
      }

      router.push('/ideas')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Sign in to share your idea
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              Join our community of innovators and start getting feedback
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/login">
                <Button size="lg">Log in</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" size="lg">Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/2 relative">
          <Image
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80"
            alt="Share your idea"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/80" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-zinc-50 dark:bg-zinc-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge variant="primary" className="mb-4">Share Your Vision</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Submit Your Idea
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Describe your concept and let our community help you validate and refine it
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <Input
                    label="Title"
                    placeholder="Give your idea a catchy, descriptive title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />

                  <Textarea
                    label="Description"
                    placeholder="Describe your idea in detail:&#10;• What problem does it solve?&#10;• Who is it for?&#10;• What makes it unique?&#10;• How would it work?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={8}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Tags <span className="text-zinc-400 font-normal">(select at least 1)</span>
                    </label>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="primary"
                            className="cursor-pointer hover:bg-indigo-700 pr-2"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                            <svg className="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {SUGGESTED_TAGS.filter((tag) => !formData.tags.includes(tag)).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="px-3 py-1.5 rounded-full text-sm font-medium bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-zinc-200 dark:border-zinc-700"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom tag"
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addCustomTag()
                          }
                        }}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={addCustomTag}>
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      size="lg"
                      isLoading={isSubmitting}
                      disabled={!formData.title || !formData.description || formData.tags.length === 0}
                    >
                      Submit Idea
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Tips Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Tips for Success
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Be specific about the problem you&apos;re solving
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Describe your target audience clearly
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Explain what makes your idea unique
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Include any initial thoughts on implementation
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Choose relevant tags for discoverability
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80"
                      alt="Collaboration"
                      width={400}
                      height={200}
                      className="object-cover w-full h-32"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <p className="text-white text-sm font-medium">
                        Great ideas deserve great feedback
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
