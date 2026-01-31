import { Profile, Idea, Comment } from './types'

// Mock profiles for frontend development
export const mockProfiles: Profile[] = [
  {
    id: '1',
    userId: 'user-1',
    displayName: 'Alex Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    bio: 'Full-stack developer passionate about building products that matter.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    userId: 'user-2',
    displayName: 'Sarah Miller',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    bio: 'UX designer and entrepreneur. Love turning ideas into reality.',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    userId: 'user-3',
    displayName: 'James Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    bio: 'Product manager at a tech startup. Always hunting for the next big thing.',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
]

// Mock ideas for frontend development
export const mockIdeas: Idea[] = [
  {
    id: '1',
    title: 'AI-Powered Recipe Generator',
    description:
      'An app that generates personalized recipes based on ingredients you have at home, dietary restrictions, and cuisine preferences. Uses AI to suggest creative combinations and provides step-by-step cooking instructions with video tutorials.',
    tags: ['AI', 'Food', 'Mobile App'],
    authorId: 'user-1',
    author: mockProfiles[0],
    upvotes: 42,
    downvotes: 3,
    commentsCount: 12,
    isValidated: true,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    title: 'Local Event Discovery Platform',
    description:
      'A platform that aggregates local events from various sources and uses machine learning to recommend events based on user interests, past attendance, and social connections. Includes features for group planning and ticket purchasing.',
    tags: ['Social', 'Events', 'Machine Learning'],
    authorId: 'user-2',
    author: mockProfiles[1],
    upvotes: 38,
    downvotes: 5,
    commentsCount: 8,
    isValidated: false,
    createdAt: '2024-01-21T09:15:00Z',
    updatedAt: '2024-01-21T09:15:00Z',
  },
  {
    id: '3',
    title: 'Sustainable Shopping Assistant',
    description:
      'A browser extension and mobile app that helps users make environmentally conscious purchasing decisions. Shows carbon footprint, ethical ratings, and sustainable alternatives for products while shopping online.',
    tags: ['Sustainability', 'E-commerce', 'Browser Extension'],
    authorId: 'user-3',
    author: mockProfiles[2],
    upvotes: 56,
    downvotes: 2,
    commentsCount: 15,
    isValidated: true,
    createdAt: '2024-01-22T16:45:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
  },
  {
    id: '4',
    title: 'Remote Team Building Games',
    description:
      'A platform with multiplayer games specifically designed for remote teams. Includes icebreakers, trivia, escape rooms, and collaborative challenges. Integrates with Slack and Microsoft Teams for easy scheduling.',
    tags: ['Remote Work', 'Gaming', 'Team Building'],
    authorId: 'user-1',
    author: mockProfiles[0],
    upvotes: 29,
    downvotes: 4,
    commentsCount: 6,
    isValidated: false,
    createdAt: '2024-01-23T11:00:00Z',
    updatedAt: '2024-01-23T11:00:00Z',
  },
  {
    id: '5',
    title: 'Personal Finance Tracker for Gen Z',
    description:
      'A finance app designed specifically for younger users with gamification elements, social savings challenges, and educational content about investing. Features include budget tracking, subscription management, and peer comparison (optional).',
    tags: ['FinTech', 'Mobile App', 'Gamification'],
    authorId: 'user-2',
    author: mockProfiles[1],
    upvotes: 67,
    downvotes: 8,
    commentsCount: 23,
    isValidated: true,
    createdAt: '2024-01-24T13:20:00Z',
    updatedAt: '2024-01-24T13:20:00Z',
  },
]

// Mock comments for frontend development
export const mockComments: Comment[] = [
  {
    id: '1',
    ideaId: '1',
    authorId: 'user-2',
    author: mockProfiles[1],
    content: 'Love this idea! I would definitely use this app. Have you considered adding a meal planning feature?',
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
  },
  {
    id: '2',
    ideaId: '1',
    authorId: 'user-3',
    author: mockProfiles[2],
    content: 'Great concept! The AI recipe generation market is growing fast. You might want to look at partnerships with grocery delivery services.',
    createdAt: '2024-01-20T16:30:00Z',
    updatedAt: '2024-01-20T16:30:00Z',
  },
  {
    id: '3',
    ideaId: '5',
    authorId: 'user-1',
    author: mockProfiles[0],
    content: 'This addresses a real pain point for young adults. The gamification aspect could really drive engagement.',
    createdAt: '2024-01-24T14:00:00Z',
    updatedAt: '2024-01-24T14:00:00Z',
  },
]

// Helper function to get idea by ID
export function getIdeaById(id: string): Idea | undefined {
  return mockIdeas.find((idea) => idea.id === id)
}

// Helper function to get comments for an idea
export function getCommentsForIdea(ideaId: string): Comment[] {
  return mockComments.filter((comment) => comment.ideaId === ideaId)
}

// Helper function to get profile by user ID
export function getProfileByUserId(userId: string): Profile | undefined {
  return mockProfiles.find((profile) => profile.userId === userId)
}
