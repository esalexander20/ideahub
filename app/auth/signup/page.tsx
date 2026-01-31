'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signup } from '@/lib/auth'
import { Button, Input } from '@/components/ui'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }

    const result = await signup(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white dark:bg-zinc-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">I</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Join IdeaHub
            </h1>
          </div>

          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Create your account
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Start sharing and validating ideas today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            
            <Input
              label="Display Name"
              name="displayName"
              type="text"
              placeholder="Alex Chen"
              required
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
              helperText="Must be at least 8 characters"
              required
            />
            
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
            />
            
            <div className="flex items-start gap-3 pt-2">
              <input 
                type="checkbox" 
                className="mt-1 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" 
                required 
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                I agree to the{' '}
                <Link href="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Privacy Policy
                </Link>
              </span>
            </div>
            
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Create account
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-zinc-950 text-zinc-500">
                  Already have an account?
                </span>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/auth/login">
                <Button variant="outline" className="w-full" size="lg">
                  Sign in instead
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80"
          alt="Innovation and ideas"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white mb-6">
              Join a Community of Innovators
            </h2>
            <div className="space-y-4">
              {[
                'Share your ideas and get instant feedback',
                'Connect with like-minded creators',
                'Validate before you build',
                'Find collaborators for your projects',
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-indigo-100">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
