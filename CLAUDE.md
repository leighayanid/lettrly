# Lettrly - Claude Project Guide

## Project Overview

A personal letter-writing web app where visitors can write and send letters through a beautiful paper-like interface. Letters are private and only readable by the recipient. Senders can choose to remain anonymous or create an account.

**Live URL structure:** `lettrly.com/leigh` or custom domain

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui | latest |
| Animations | Framer Motion | 12.x |
| Database | PostgreSQL (Docker) | 16.x |
| Auth | Auth.js (NextAuth v5) | beta |
| Package Manager | pnpm | latest |

---

## Project Structure

```
lettrly/
├── app/
│   ├── (public)/
│   │   └── [username]/
│   │       └── page.tsx          # Public letter writing page
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── register/
│   │       └── page.tsx          # Registration page
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts      # Auth.js API route
│   ├── actions/
│   │   ├── auth.ts               # Auth server actions
│   │   └── letters.ts            # Letter server actions
│   ├── dashboard/
│   │   ├── page.tsx              # Letter inbox
│   │   └── [id]/
│   │       └── page.tsx          # Single letter view
│   ├── layout.tsx
│   ├── page.tsx                  # Landing/redirect
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── providers.tsx             # Session provider wrapper
│   ├── letter/
│   │   ├── paper.tsx             # Paper writing surface
│   │   ├── letter-form.tsx       # Letter composition form
│   │   ├── envelope.tsx          # Envelope animation component
│   │   └── send-animation.tsx    # Submit/send animation
│   ├── dashboard/
│   │   ├── inbox.tsx             # Letter list
│   │   ├── letter-card.tsx       # Letter preview card
│   │   └── letter-view.tsx       # Full letter display
│   └── shared/
│       ├── header.tsx
│       └── loading.tsx
├── lib/
│   ├── db/
│   │   ├── index.ts              # PostgreSQL connection pool
│   │   └── types.ts              # Database type definitions
│   ├── auth.ts                   # Auth.js configuration
│   ├── utils.ts                  # General utilities (cn, etc.)
│   └── constants.ts              # App constants
├── db/
│   └── init.sql                  # Database initialization script
├── public/
│   ├── textures/
│   │   └── paper.png             # Paper texture
│   └── fonts/                    # Custom handwriting fonts
├── .env.local                    # Local environment variables
├── .env.example
├── docker-compose.yml            # PostgreSQL container config
├── middleware.ts                 # Next.js middleware for auth
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Setup Commands

### Initial Project Setup

```bash
# Create Next.js project
pnpx create-next-app@latest lettrly --typescript --tailwind --eslint --app --src=false --import-alias "@/*"

cd lettrly

# Install dependencies
pnpm add pg next-auth@beta bcryptjs @auth/pg-adapter framer-motion

# Install type definitions
pnpm add -D @types/pg

# Install shadcn/ui
pnpx shadcn@latest init

# Add shadcn components (add more as needed)
pnpx shadcn@latest add button card input textarea label toast avatar dropdown-menu dialog scroll-area badge separator
```

### Database Setup (Docker)

```bash
# Start PostgreSQL container (requires Docker)
docker compose up -d

# The database will be initialized automatically with db/init.sql

# Stop the database
docker compose down

# Reset database (removes all data)
docker compose down -v && docker compose up -d
```

---

## Database Schema

### `db/init.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auth.js Required Tables
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  image TEXT,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE verification_token (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Application Tables
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  is_owner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE letters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sender_display_name TEXT,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_anonymous BOOLEAN DEFAULT TRUE,
  is_read BOOLEAN DEFAULT FALSE,
  is_favorited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX letters_created_at_idx ON letters(created_at DESC);
CREATE INDEX letters_recipient_id_idx ON letters(recipient_id);
CREATE INDEX profiles_username_idx ON profiles(username);
```

---

## Environment Variables

### `.env.example`

```env
# Database - Docker PostgreSQL
DATABASE_URL=postgresql://lettrly:lettrly_dev_password@localhost:5432/lettrly

# Auth.js
AUTH_SECRET=your-auth-secret-here-generate-with-openssl-rand-base64-32

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_OWNER_USERNAME=leigh
```

---

## Key Implementation Files

### `lib/db/index.ts`

```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export { pool }

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(text, params)
  return result.rows as T[]
}

export async function queryOne<T>(text: string, params?: unknown[]): Promise<T | null> {
  const result = await pool.query(text, params)
  return (result.rows[0] as T) || null
}
```

### `lib/auth.ts`

```typescript
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import PostgresAdapter from '@auth/pg-adapter'
import { pool, queryOne } from '@/lib/db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PostgresAdapter(pool),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await queryOne(
          'SELECT * FROM users WHERE email = $1',
          [credentials.email]
        )

        if (!user || !user.password_hash) {
          return null
        }

        const isValid = await compare(credentials.password, user.password_hash)

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string

        const profile = await queryOne(
          'SELECT username FROM profiles WHERE id = $1',
          [token.id]
        )
        if (profile) {
          session.user.username = profile.username
        }
      }
      return session
    },
  },
})
```

### `middleware.ts`

```typescript
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth

  if (req.nextUrl.pathname.startsWith('/dashboard') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

---

## Server Actions

### `app/actions/letters.ts`

```typescript
'use server'

import { query, queryOne } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function sendLetter(formData: FormData) {
  const content = formData.get('content') as string
  const recipientUsername = formData.get('recipientUsername') as string

  const recipient = await queryOne(
    'SELECT id FROM profiles WHERE username = $1',
    [recipientUsername.toLowerCase()]
  )

  if (!recipient) {
    return { error: 'Recipient not found' }
  }

  const session = await auth()

  await queryOne(
    `INSERT INTO letters (content, sender_id, recipient_id)
     VALUES ($1, $2, $3)`,
    [content.trim(), session?.user?.id || null, recipient.id]
  )

  return { success: true }
}

export async function getLetters() {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Unauthorized', letters: [] }
  }

  const letters = await query(
    `SELECT * FROM letters WHERE recipient_id = $1 ORDER BY created_at DESC`,
    [session.user.id]
  )

  return { letters }
}
```

---

## Development Workflow

### Daily Development

```bash
# Start PostgreSQL container
docker compose up -d

# Start Next.js dev server
pnpm dev

# Access:
# - App: http://localhost:3000
# - Database: localhost:5432 (use any PostgreSQL client)
```

### Database Changes

```bash
# Edit db/init.sql with your changes

# Reset database to apply changes
docker compose down -v && docker compose up -d
```

---

## Design Tokens

```css
/* globals.css additions */
:root {
  /* Paper colors */
  --paper-bg: #fdfbf7;
  --paper-lines: #e5e5e5;
  --paper-shadow: rgba(0, 0, 0, 0.12);

  /* Ink colors */
  --ink-primary: #1a1a2e;
  --ink-secondary: #4a4a5a;
  --ink-faded: #8a8a9a;

  /* Accent */
  --envelope-tan: #d4a574;
  --wax-seal: #8b0000;
  --stamp-red: #c41e3a;
}
```

---

## Fonts

```typescript
// layout.tsx
import { Crimson_Text, Caveat } from 'next/font/google'

const crimson = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-serif',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-handwriting',
})
```

---

## Testing Checklist

- [ ] Anonymous letter submission works
- [ ] Authenticated letter submission works
- [ ] User can view their letters
- [ ] Non-authenticated users cannot access dashboard
- [ ] Letters marked as read correctly
- [ ] Favorite toggle works
- [ ] Delete removes letter
- [ ] Paper UI renders correctly on mobile
- [ ] Animations perform smoothly

---

## Future Enhancements

1. **Email notifications** - Send email when new letter arrives
2. **Letter templates** - Pre-designed paper styles
3. **Attachments** - Small image uploads
4. **Handwriting mode** - Canvas-based actual drawing
5. **Export** - Download letters as PDF
6. **Analytics** - Letter count, read rate, etc.
