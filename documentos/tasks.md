# IdeaHub: Tasks

## Phase 1: Core Features

- [x] Set up Next.js app in `onboarding/`
- [x] Create UI components (Button, Input, Card, Avatar, Badge)
- [x] Create layout components (Navbar, Footer)
- [x] User authentication pages (login/signup UI)
- [x] Profile page UI
- [x] Idea submission form UI
- [x] Basic idea listing (feed) UI
- [x] Idea detail page with comments UI

## Phase 1.5: Database Setup (Prisma + Supabase)

- [x] Install Prisma and initialize
- [x] Create Prisma schema (Profile, Idea, Vote, Comment)
- [x] Configure Supabase connection strings
- [x] Run initial migration (`pnpm prisma migrate dev`)
- [x] Generate Prisma client (`pnpm prisma generate`)

## Phase 2: Backend Integration

- [x] Connect auth pages to Supabase Auth
- [x] Create API routes for ideas CRUD
- [x] Create API routes for votes
- [x] Create API routes for comments
- [x] Connect frontend to real data (replace mock data)
- [x] Implement upvote/downvote with database
- [x] Implement commenting with database

## Phase 3: Validation & Collaboration

- [x] Idea search and filtering (server-side)
- [x] Idea validation system (auto-validates at 50+ net upvotes)
- [x] User profile with real data
- [x] Dedicated API for user's ideas

## Phase 4: Polish & Deployment

- [x] UI/UX improvements (validation progress bar, better detail page)
- [ ] Bug fixes
- [ ] Deploy to Vercel

## Stretch Goals

- [ ] Real-time collaboration
- [ ] AI-powered idea suggestions
- [ ] Mobile app version
