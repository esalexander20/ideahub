// User and Profile types
export interface User {
  id: string
  email: string
  createdAt: string
}

export interface Profile {
  id: string
  userId: string
  displayName: string
  avatar?: string
  bio?: string
  createdAt: string
  updatedAt: string
}

// Idea types
export interface Idea {
  id: string
  title: string
  description: string
  tags: string[]
  authorId: string
  author?: Profile
  upvotes: number
  downvotes: number
  commentsCount: number
  isValidated: boolean
  createdAt: string
  updatedAt: string
}

// Validation and Comment types
export interface Vote {
  id: string
  ideaId: string
  userId: string
  type: 'upvote' | 'downvote'
  createdAt: string
}

export interface Comment {
  id: string
  ideaId: string
  authorId: string
  author?: Profile
  content: string
  parentId?: string // for threaded comments
  createdAt: string
  updatedAt: string
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
  displayName: string
}

export interface ProfileFormData {
  displayName: string
  bio: string
  avatar?: string
}

export interface IdeaFormData {
  title: string
  description: string
  tags: string[]
}
