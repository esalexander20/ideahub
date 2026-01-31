'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/ideas')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const displayName = formData.get('displayName') as string

  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  // When email confirmation is disabled, user is auto-logged in and session exists
  // When email confirmation is enabled, session will be null until email is confirmed
  if (authData.session && authData.user) {
    // User is logged in immediately (email confirmation disabled)
    // Create profile in our database
    try {
      await prisma.profile.create({
        data: {
          userId: authData.user.id,
          email: email,
          displayName: displayName,
        },
      })
    } catch (dbError) {
      // Profile might already exist - check and update if needed
      console.error('Error creating profile:', dbError)
      
      // Try to find existing profile
      const existingProfile = await prisma.profile.findUnique({
        where: { userId: authData.user.id },
      })
      
      if (!existingProfile) {
        // Try with email as fallback
        const profileByEmail = await prisma.profile.findUnique({
          where: { email: email },
        })
        
        if (!profileByEmail) {
          // Genuinely failed to create profile
          console.error('Failed to create profile for user:', authData.user.id)
        }
      }
    }

    revalidatePath('/', 'layout')
    redirect('/ideas')
  } else if (authData.user && !authData.session) {
    // Email confirmation is required (shouldn't happen if disabled in dashboard)
    // But handle gracefully just in case
    return { 
      error: 'Please check your email to confirm your account.',
      needsConfirmation: true 
    }
  }

  // Fallback - user created successfully
  revalidatePath('/', 'layout')
  redirect('/ideas')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile() {
  const user = await getUser()
  
  if (!user) return null

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  })

  return profile
}
