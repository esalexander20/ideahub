import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

// Create Prisma client with adapter
// Use DIRECT_URL for seeding (more reliable for direct connections)
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
console.log('📡 Connecting to database...')

const pool = new Pool({
  connectionString,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Sample ideas data
const sampleIdeas = [
  {
    title: 'AI-Powered Recipe Generator',
    description: `An intelligent mobile app that generates personalized recipes based on ingredients you have at home. Simply scan your fridge or pantry items, and the AI will suggest delicious meals you can make right now.

Key Features:
- Photo recognition for ingredient scanning
- Dietary preference filters (vegan, keto, gluten-free)
- Nutritional information for each recipe
- Save favorites and create shopping lists
- Share recipes with friends and family`,
    tags: ['AI', 'Food', 'Mobile App', 'Machine Learning'],
    upvotes: 142,
    downvotes: 8,
    isValidated: true,
  },
  {
    title: 'Sustainable Shopping Assistant',
    description: `A browser extension that helps users make environmentally conscious purchasing decisions. When shopping online, it shows the carbon footprint of products, suggests eco-friendly alternatives, and tracks your sustainability score over time.

Features:
- Real-time carbon footprint estimates
- Eco-friendly product alternatives
- Personal sustainability dashboard
- Integration with major e-commerce sites
- Community challenges and achievements`,
    tags: ['Sustainability', 'E-commerce', 'Browser Extension', 'Climate'],
    upvotes: 98,
    downvotes: 5,
    isValidated: true,
  },
  {
    title: 'Remote Team Building Games',
    description: `A platform with multiplayer games specifically designed for remote teams. Unlike generic gaming platforms, these games focus on collaboration, communication, and team bonding without requiring gaming experience.

Game Types:
- Collaborative puzzle solving
- Virtual escape rooms
- Team trivia with company-specific questions
- Creative challenges and whiteboard games
- Icebreaker activities for new team members`,
    tags: ['Remote Work', 'Gaming', 'Team Building', 'SaaS'],
    upvotes: 76,
    downvotes: 3,
    isValidated: false,
  },
  {
    title: 'Personal Finance AI Coach',
    description: `An AI-powered financial advisor that helps people manage their money better. It analyzes spending patterns, suggests budget optimizations, and provides personalized investment advice based on your goals and risk tolerance.

Core Features:
- Bank account integration
- Smart categorization of expenses
- Bill negotiation suggestions
- Investment portfolio recommendations
- Goal tracking (emergency fund, vacation, retirement)`,
    tags: ['FinTech', 'AI', 'Personal Finance', 'Mobile App'],
    upvotes: 234,
    downvotes: 12,
    isValidated: true,
  },
  {
    title: 'Local Events Discovery Platform',
    description: `A hyper-local events platform that surfaces hidden gems in your neighborhood - from pop-up art shows to community sports games. Unlike big event platforms, we focus on small, authentic local experiences.

What makes it different:
- Neighborhood-focused curation
- Support for informal/grassroots events
- Built-in RSVP and attendee matching
- Local business partnerships
- Community ratings and reviews`,
    tags: ['Local', 'Events', 'Community', 'Social'],
    upvotes: 67,
    downvotes: 4,
    isValidated: false,
  },
  {
    title: 'Sleep Optimization Tracker',
    description: `A comprehensive sleep tracking app that goes beyond basic metrics. Uses your phone's sensors and optional wearable integration to analyze sleep quality, identify issues, and provide actionable recommendations.

Features:
- Smart alarm that wakes you at optimal time
- Sleep environment analysis (noise, light, temperature)
- Correlation with daily activities and diet
- Guided sleep meditations and sounds
- Integration with smart home devices`,
    tags: ['Health', 'Wellness', 'Mobile App', 'IoT'],
    upvotes: 89,
    downvotes: 6,
    isValidated: false,
  },
  {
    title: 'Freelancer Invoice & Contract Manager',
    description: `An all-in-one platform for freelancers to manage contracts, invoices, and client relationships. Includes AI-powered contract generation, automatic payment reminders, and tax preparation assistance.

Key Features:
- Template library for common contract types
- Multi-currency invoicing
- Payment tracking and reminders
- Time tracking integration
- Year-end tax summary reports`,
    tags: ['Freelance', 'Productivity', 'FinTech', 'SaaS'],
    upvotes: 156,
    downvotes: 7,
    isValidated: true,
  },
  {
    title: 'Language Learning Through News',
    description: `Learn a new language by reading real news articles at your level. The app adapts content difficulty based on your progress and provides instant translations, pronunciation guides, and vocabulary building exercises.

Learning Features:
- Daily curated news in your target language
- Difficulty levels from beginner to advanced
- Tap-to-translate with context
- Spaced repetition for vocabulary
- Speaking practice with AI feedback`,
    tags: ['Education', 'Language Learning', 'AI', 'News'],
    upvotes: 112,
    downvotes: 9,
    isValidated: false,
  },
]

async function main() {
  console.log('🌱 Starting database seed...')
  
  // Test database connection first
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (connectError) {
    console.error('❌ Failed to connect to database. Please check:')
    console.error('   1. Your Supabase project is active (not paused)')
    console.error('   2. Your DATABASE_URL or DIRECT_URL in .env is correct')
    console.error('   3. Your network allows connections to Supabase')
    throw connectError
  }

  // Check if system profile exists
  let systemProfile = await prisma.profile.findFirst({
    where: { email: 'team@ideahub.com' },
  })

  if (!systemProfile) {
    // Create a system profile for seeded ideas
    systemProfile = await prisma.profile.create({
      data: {
        userId: 'system-seed-user-id',
        email: 'team@ideahub.com',
        displayName: 'IdeaHub Team',
        bio: 'Official IdeaHub team account showcasing featured ideas.',
      },
    })
    console.log('✅ Created system profile:', systemProfile.displayName)
  } else {
    console.log('ℹ️  System profile already exists')
  }

  // Check existing ideas count
  const existingCount = await prisma.idea.count()
  
  if (existingCount > 0) {
    console.log(`ℹ️  Database already has ${existingCount} ideas. Skipping seed.`)
    console.log('💡 To re-seed, delete existing ideas first.')
    return
  }

  // Create sample ideas
  for (const ideaData of sampleIdeas) {
    const idea = await prisma.idea.create({
      data: {
        title: ideaData.title,
        description: ideaData.description,
        tags: ideaData.tags,
        upvotes: ideaData.upvotes,
        downvotes: ideaData.downvotes,
        isValidated: ideaData.isValidated,
        authorId: systemProfile.id,
      },
    })
    console.log(`✅ Created idea: ${idea.title}`)
  }

  console.log(`\n🎉 Seed completed! Created ${sampleIdeas.length} sample ideas.`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
