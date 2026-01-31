'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent, Avatar, Badge } from '@/components/ui'

interface Profile {
  id: string
  displayName: string
  avatar?: string
  bio?: string
  createdAt: string
}

interface Idea {
  id: string
  title: string
  description: string
  upvotes: number
  commentsCount: number
  isValidated: boolean
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userIdeas, setUserIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }
    if (user) {
      fetchProfile()
    }
  }, [user, authLoading, router])

  const fetchProfile = async () => {
    try {
      const [profileRes, ideasRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/profile/ideas'),
      ])

      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile(profileData)
        setFormData({
          displayName: profileData.displayName || '',
          bio: profileData.bio || '',
        })
      }

      if (ideasRes.ok) {
        const ideasData = await ideasRes.json()
        setUserIdeas(ideasData.ideas || [])
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const updatedProfile = await res.json()
        setProfile(updatedProfile)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          </div>
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Please log in to view your profile
        </h2>
        <Link href="/auth/login">
          <Button>Log in</Button>
        </Link>
      </div>
    )
  }

  const totalUpvotes = userIdeas.reduce((acc, idea) => acc + idea.upvotes, 0)
  const validatedCount = userIdeas.filter((idea) => idea.isValidated).length

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8" variant="elevated">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar
              src={profile.avatar}
              fallback={profile.displayName}
              size="xl"
            />
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Display Name"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  />
                  <Textarea
                    label="Bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} isLoading={isSaving}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {profile.displayName}
                  </h1>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                    {profile.bio || 'No bio yet'}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
                    Joined {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <CardContent className="py-6">
            <div className="text-3xl font-bold text-indigo-600">{userIdeas.length}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Ideas Shared</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="py-6">
            <div className="text-3xl font-bold text-indigo-600">{totalUpvotes}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Total Upvotes</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="py-6">
            <div className="text-3xl font-bold text-indigo-600">{validatedCount}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Validated Ideas</div>
          </CardContent>
        </Card>
      </div>

      {/* User's Ideas */}
      <Card>
        <CardHeader>
          <CardTitle>My Ideas</CardTitle>
          <CardDescription>Ideas you&apos;ve shared with the community</CardDescription>
        </CardHeader>
        <CardContent>
          {userIdeas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                You haven&apos;t shared any ideas yet
              </p>
              <Link href="/ideas/new">
                <Button>Share Your First Idea</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userIdeas.map((idea) => (
                <Link key={idea.id} href={`/ideas/${idea.id}`}>
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {idea.title}
                          </h3>
                          {idea.isValidated && (
                            <Badge variant="success">Validated</Badge>
                          )}
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {idea.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
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
                          <span>
                            {new Date(idea.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
