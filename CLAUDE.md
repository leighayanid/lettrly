# Lettrly - Claude Project Guide

## Project Overview

A personal letter-writing web app where visitors can write and send letters through a beautiful paper-like interface. Letters are private and only readable by the owner (Leigh). Senders can choose to remain anonymous or create an account.

**Live URL structure:** `lettrly.com/leigh` or custom domain

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui | latest |
| Animations | Framer Motion | 11.x |
| Database & Auth | Supabase | latest |
| Local Dev | Supabase CLI | latest |
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
│   │   │   └── page.tsx          # Owner login
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts      # Supabase auth callback
│   ├── dashboard/
│   │   ├── page.tsx              # Letter inbox
│   │   └── [id]/
│   │       └── page.tsx          # Single letter view
│   ├── layout.tsx
│   ├── page.tsx                  # Landing/redirect
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui components
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
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   ├── middleware.ts         # Auth middleware helper
│   │   └── types.ts              # Generated DB types
│   ├── utils.ts                  # General utilities (cn, etc.)
│   └── constants.ts              # App constants
├── hooks/
│   ├── use-letters.ts            # Letter data hooks
│   └── use-auth.ts               # Auth state hooks
├── supabase/
│   ├── config.toml               # Supabase local config
│   ├── migrations/
│   │   └── 00001_initial_schema.sql
│   └── seed.sql                  # Optional seed data
├── public/
│   ├── textures/
│   │   └── paper.png             # Paper texture
│   └── fonts/                    # Custom handwriting fonts
├── .env.local                    # Local environment variables
├── .env.example
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
# Create Next.js 15 project
pnpx create-next-app@latest lettrly --typescript --tailwind --eslint --app --src=false --import-alias "@/*"

cd lettrly

# Install dependencies
pnpm add @supabase/supabase-js @supabase/ssr framer-motion

# Install shadcn/ui
pnpx shadcn@latest init

# Add shadcn components (add more as needed)
pnpx shadcn@latest add button card input textarea label toast avatar dropdown-menu dialog scroll-area badge separator
```

### Supabase CLI Setup

```bash
# Install Supabase CLI (if not installed globally)
pnpm add -D supabase

# Initialize Supabase in project
pnpx supabase init

# Start local Supabase (requires Docker)
pnpx supabase start

# After start, CLI outputs local credentials - add to .env.local:
# NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-from-cli>
# SUPABASE_SERVICE_ROLE_KEY=<service-role-key-from-cli>

# Generate TypeScript types from schema
pnpx supabase gen types typescript --local > lib/supabase/types.ts

# Apply migrations
pnpx supabase db push

# Stop local Supabase
pnpx supabase stop
```

---

## Database Schema

### Migration: `supabase/migrations/00001_initial_schema.sql`

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  is_owner boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Letters table
create table public.letters (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  sender_id uuid references public.profiles(id) on delete set null,
  sender_display_name text, -- For anonymous users who want to leave a name
  is_anonymous boolean default true,
  is_read boolean default false,
  is_favorited boolean default false,
  created_at timestamptz default now(),
  read_at timestamptz
);

-- Indexes
create index letters_created_at_idx on public.letters(created_at desc);
create index letters_is_read_idx on public.letters(is_read);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.letters enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Letters policies
-- Anyone can insert a letter (public submission)
create policy "Anyone can send a letter"
  on public.letters for insert
  with check (true);

-- Only owner can read letters
create policy "Only owner can read letters"
  on public.letters for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_owner = true
    )
  );

-- Only owner can update letters (mark read, favorite, etc.)
create policy "Only owner can update letters"
  on public.letters for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_owner = true
    )
  );

-- Only owner can delete letters
create policy "Only owner can delete letters"
  on public.letters for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_owner = true
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();
```

### Seed: `supabase/seed.sql`

```sql
-- Seed owner account after auth user is created manually
-- Run this after creating your owner account via Supabase dashboard or auth signup

-- UPDATE public.profiles
-- SET is_owner = true
-- WHERE email = 'your-email@example.com';
```

---

## Environment Variables

### `.env.example`

```env
# Supabase - Local Development (from `supabase start` output)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key

# Supabase - Production (from Supabase dashboard)
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_OWNER_USERNAME=leigh
```

---

## Key Implementation Files

### `lib/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### `lib/supabase/server.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle server component context
          }
        },
      },
    }
  )
}
```

### `middleware.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

---

## UI Component Guidelines

### Paper Component Styling

The paper writing surface should feel tactile and realistic:

```typescript
// Tailwind classes for paper effect
const paperClasses = `
  relative
  bg-[#fdfbf7]
  bg-[url('/textures/paper.png')]
  rounded-sm
  shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]
  before:absolute
  before:inset-0
  before:bg-[linear-gradient(transparent_31px,_#e5e5e5_31px)]
  before:bg-[size:100%_32px]
  before:pointer-events-none
`

// Textarea should be invisible, blending with paper
const textareaClasses = `
  bg-transparent
  border-none
  outline-none
  resize-none
  font-serif
  text-[#333]
  leading-8
  p-8
  pt-10
  w-full
  h-full
  placeholder:text-gray-400/60
`
```

### Framer Motion Animation Patterns

```typescript
// Envelope seal animation
const envelopeVariants = {
  open: { rotateX: 0 },
  closed: { rotateX: 180 },
}

// Paper fold animation
const paperVariants = {
  flat: { scaleY: 1 },
  folded: { scaleY: 0.5, y: 50 },
}

// Success stamp animation
const stampVariants = {
  hidden: { scale: 0, rotate: -30 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 300, damping: 15 }
  },
}
```

---

## API Routes / Server Actions

Prefer Server Actions for mutations:

```typescript
// app/actions/letters.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendLetter(formData: FormData) {
  const supabase = await createClient()
  
  const content = formData.get('content') as string
  const senderName = formData.get('senderName') as string | null
  const isAnonymous = formData.get('isAnonymous') === 'true'

  if (!content || content.trim().length === 0) {
    return { error: 'Letter content is required' }
  }

  if (content.length > 5000) {
    return { error: 'Letter is too long (max 5000 characters)' }
  }

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('letters').insert({
    content: content.trim(),
    sender_id: isAnonymous ? null : user?.id,
    sender_display_name: senderName || null,
    is_anonymous: isAnonymous || !user,
  })

  if (error) {
    return { error: 'Failed to send letter' }
  }

  return { success: true }
}

export async function markLetterAsRead(id: string) {
  const supabase = await createClient()
  
  await supabase
    .from('letters')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', id)

  revalidatePath('/dashboard')
}

export async function toggleFavorite(id: string, isFavorited: boolean) {
  const supabase = await createClient()
  
  await supabase
    .from('letters')
    .update({ is_favorited: !isFavorited })
    .eq('id', id)

  revalidatePath('/dashboard')
}

export async function deleteLetter(id: string) {
  const supabase = await createClient()
  
  await supabase.from('letters').delete().eq('id', id)

  revalidatePath('/dashboard')
}
```

---

## Development Workflow

### Daily Development

```bash
# Start Supabase local
pnpx supabase start

# Start Next.js dev server
pnpm dev

# Access:
# - App: http://localhost:3000
# - Supabase Studio: http://127.0.0.1:54323
# - Supabase API: http://127.0.0.1:54321
```

### Database Changes

```bash
# Create new migration
pnpx supabase migration new migration_name

# Apply migrations locally
pnpx supabase db push

# Reset database (careful!)
pnpx supabase db reset

# Regenerate types after schema changes
pnpx supabase gen types typescript --local > lib/supabase/types.ts
```

### Deployment

```bash
# Link to Supabase project
pnpx supabase link --project-ref your-project-ref

# Push migrations to production
pnpx supabase db push

# Deploy to Vercel
vercel deploy --prod
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

Recommended handwriting/serif fonts for letter feel:

```typescript
// next.config.ts or layout.tsx
import { Crimson_Text, Caveat } from 'next/font/google'

// Elegant serif for body text
const crimson = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-serif',
})

// Handwriting style for signatures/names
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-handwriting',
})
```

---

## Rate Limiting (Optional Enhancement)

Use Supabase Edge Functions or Next.js middleware:

```typescript
// Simple in-memory rate limit for MVP
const rateLimitMap = new Map<string, number[]>()

export function checkRateLimit(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now()
  const windowStart = now - windowMs
  
  const requests = rateLimitMap.get(ip) || []
  const recentRequests = requests.filter(time => time > windowStart)
  
  if (recentRequests.length >= limit) {
    return false
  }
  
  recentRequests.push(now)
  rateLimitMap.set(ip, recentRequests)
  return true
}
```

---

## Testing Checklist

- [ ] Anonymous letter submission works
- [ ] Authenticated letter submission works
- [ ] Owner can view all letters
- [ ] Non-owner cannot access dashboard
- [ ] Letters marked as read correctly
- [ ] Favorite toggle works
- [ ] Delete removes letter
- [ ] Paper UI renders correctly on mobile
- [ ] Animations perform smoothly
- [ ] Rate limiting prevents spam

---

## Future Enhancements

1. **Email notifications** - Send email when new letter arrives
2. **Multiple recipients** - Platform mode for multiple users
3. **Letter templates** - Pre-designed paper styles
4. **Attachments** - Small image uploads
5. **Handwriting mode** - Canvas-based actual drawing
6. **Export** - Download letters as PDF
7. **Analytics** - Letter count, read rate, etc.
