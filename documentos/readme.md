# IdeaHub: Collaborative Idea Validation Platform

## One-Line Summary

A web platform where users create accounts, publish app or website ideas, and get validation and collaboration from others (upvotes, comments, feedback).

## Problem & Solution

- **Problem:** Creators often lack a place to test ideas before building, and validators lack a simple way to discover and signal which ideas are worth pursuing.
- **Solution:** IdeaHub bridges the gap—creators publish ideas; the community validates them through upvotes, comments, and feedback; collaboration can follow.

## Core Features

- **User authentication** — Login/signup (e.g. email/password).
- **Profiles** — Avatars, bios, and profile management.
- **Idea management** — Submit and edit ideas (title, description, tags); ideas appear in a feed.
- **Validation** — Upvote/downvote, comments, and optional “validated” marking.
- **Discovery** — Idea listing, search, and filtering.

## User Flows

1. **Creator:** Sign up → create profile → publish idea → receive feedback and validation.
2. **Validator:** Discover ideas → upvote/comment/feedback → optionally collaborate.
3. **Collaborator:** Find validated ideas → contribute or refine with others.

## Technical Stack (Next.js app in `onboarding/`)

| Layer        | Choice                |
|-------------|------------------------|
| Frontend    | Next.js                |
| Backend     | Next.js API routes or Node/Express |
| Database    | PostgreSQL or Firebase |
| Auth        | Firebase Auth or JWT  |
| Hosting     | Vercel or Netlify     |

## Data Model Overview

- **User** — Auth identity; links to Profile.
- **Profile** — Display name, avatar, bio; belongs to User.
- **Idea** — Title, description, tags, author (User); has many Validations and Comments.
- **Validation/Feedback** — Upvotes, “validated” flag, optional notes; links User + Idea.
- **Comment** — Text, author (User), Idea; optional threading.

## MVP Scope

- **Essential:** Auth, profiles, idea CRUD, idea feed, upvotes, comments, basic search/filter.
- **Nice-to-have:** Real-time collaboration, AI suggestions, mobile app, advanced filters.

## Getting Started (once the app exists)

1. Clone the repo and go to the frontend onboarding app:
   ```bash
   cd project/frontend/onboarding
   ```
2. Install dependencies: `npm install`
3. Set environment variables (e.g. `.env.local` for API URL, auth keys).
4. Run dev server: `npm run dev`

## Project Structure (suggested for `onboarding/`)

```
onboarding/
├── app/                 # Next.js App Router (routes, layouts)
├── components/          # UI components (shared + feature-specific)
├── lib/                 # API client, auth, db helpers
├── public/
├── documentos/          # This documentation
└── README.md            # Link to documentos/readme.md
```

Development is guided by `planning.md` (phases) and `tasks.md` (concrete tasks).
