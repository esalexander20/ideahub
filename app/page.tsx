import Link from 'next/link'
import Image from 'next/image'
import { Button, Card, CardContent, Badge } from '@/components/ui'
import prisma from '@/lib/db'

// Map tags to relevant Unsplash images
const tagImageMap: Record<string, string> = {
  'AI': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  'Food': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  'Mobile App': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
  'Sustainability': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
  'E-commerce': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
  'Remote Work': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  'Gaming': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
  'FinTech': 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80',
  'Health': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80',
  'Wellness': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  'Education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
  'Freelance': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  'Productivity': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
  'Local': 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
  'Community': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
}

function getImageForTags(tags: string[]): string {
  for (const tag of tags) {
    if (tagImageMap[tag]) {
      return tagImageMap[tag]
    }
  }
  return tagImageMap['default']
}

const testimonials = [
  {
    quote: "IdeaHub helped me validate my startup idea before spending months building it. The feedback was invaluable!",
    author: "Maria Santos",
    role: "Founder, EcoTrack",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
  },
  {
    quote: "I found my co-founder through IdeaHub. We connected over a shared vision and now we're building together.",
    author: "David Kim",
    role: "CTO, CloudSync",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
  },
  {
    quote: "The community feedback helped me pivot my idea in a direction I never would have considered.",
    author: "Emma Thompson",
    role: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
  },
]

// Fallback ideas in case database is empty
const fallbackIdeas = [
  {
    id: 'fallback-1',
    title: 'AI-Powered Recipe Generator',
    description: 'An app that generates personalized recipes based on ingredients you have at home.',
    tags: ['AI', 'Food', 'Mobile App'],
    author: { displayName: 'IdeaHub Team' },
    upvotes: 42,
  },
  {
    id: 'fallback-2',
    title: 'Sustainable Shopping Assistant',
    description: 'A browser extension that helps users make environmentally conscious purchasing decisions.',
    tags: ['Sustainability', 'E-commerce'],
    author: { displayName: 'IdeaHub Team' },
    upvotes: 56,
  },
  {
    id: 'fallback-3',
    title: 'Remote Team Building Games',
    description: 'A platform with multiplayer games specifically designed for remote teams.',
    tags: ['Remote Work', 'Gaming'],
    author: { displayName: 'IdeaHub Team' },
    upvotes: 29,
  },
]

async function getFeaturedIdeas() {
  try {
    const ideas = await prisma.idea.findMany({
      orderBy: { upvotes: 'desc' },
      take: 3,
      include: {
        author: {
          select: {
            displayName: true,
          },
        },
      },
    })
    
    if (ideas.length === 0) {
      return fallbackIdeas
    }
    
    return ideas
  } catch (error) {
    console.error('Error fetching featured ideas:', error)
    return fallbackIdeas
  }
}

export default async function Home() {
  const featuredIdeas = await getFeaturedIdeas()
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80"
            alt="Team collaboration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 via-indigo-900/90 to-purple-900/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-8 border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              Join 10,000+ innovators validating ideas
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-6">
              Turn Your Ideas Into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300"> Reality</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-indigo-100 mb-10">
              Share your app or website ideas with a community of creators and validators. 
              Get honest feedback, upvotes, and find collaborators before you build.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/ideas">
                <Button size="lg" className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-indigo-50">
                  Explore Ideas
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                  Start Sharing Free
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold text-white">2,500+</div>
                <div className="text-indigo-200 text-sm">Ideas Shared</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">15,000+</div>
                <div className="text-indigo-200 text-sm">Validations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-indigo-200 text-sm">Projects Launched</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Validate Your Ideas in Three Steps
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              From concept to validation, our community helps you refine your vision
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80"
                  alt="Share your idea"
                  width={600}
                  height={400}
                  className="object-cover w-full h-48"
                />
                <div className="absolute top-4 left-4 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Share Your Idea
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Describe your concept, the problem it solves, and who it&apos;s for. Add tags to help others discover it.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80"
                  alt="Get feedback"
                  width={600}
                  height={400}
                  className="object-cover w-full h-48"
                />
                <div className="absolute top-4 left-4 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Get Community Feedback
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Receive upvotes, comments, and constructive feedback from fellow creators and potential users.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80"
                  alt="Build with confidence"
                  width={600}
                  height={400}
                  className="object-cover w-full h-48"
                />
                <div className="absolute top-4 left-4 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Build With Confidence
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Use validated feedback to refine your idea and build with the confidence that people want what you&apos;re creating.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ideas */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <Badge variant="primary" className="mb-4">Trending Now</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Featured Ideas
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                See what the community is excited about
              </p>
            </div>
            <Link href="/ideas">
              <Button variant="outline">
                View All Ideas
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredIdeas.map((idea) => (
              <Link key={idea.id} href={`/ideas/${idea.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getImageForTags(idea.tags)}
                      alt={idea.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap gap-2">
                        {idea.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="default" className="bg-white/20 backdrop-blur-sm text-white border-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-indigo-600 transition-colors">
                      {idea.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4">
                      {idea.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-500">by {idea.author.displayName}</span>
                      <span className="flex items-center gap-1 text-sm font-medium text-indigo-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        {idea.upvotes}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Loved by Innovators
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              See what our community members have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <div className="p-6">
                  <svg className="w-10 h-10 text-indigo-200 dark:text-indigo-800 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-zinc-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&q=80"
            alt="Start your journey"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/90" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Validate Your Next Big Idea?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of innovators who are building the future, one validated idea at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-indigo-50">
                Get Started Free
              </Button>
            </Link>
            <Link href="/ideas">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                Browse Ideas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Everything You Need to Validate
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: 'Idea Sharing',
                description: 'Share your concepts with a supportive community',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ),
                title: 'Community Voting',
                description: 'Get real signals on what resonates with people',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                title: 'Feedback & Comments',
                description: 'Receive constructive feedback to improve your idea',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'Find Collaborators',
                description: 'Connect with people who share your vision',
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
