<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Database-3fcf8e?style=for-the-badge&logo=supabase" alt="Supabase" />
</p>

<h1 align="center">
  <br>
  <sub>&#9993;</sub> Lettrly
  <br>
</h1>

<h3 align="center">
  <em>Words that matter, delivered with care.</em>
</h3>

<p align="center">
  A personal letter-writing web app where visitors can write and send letters through a beautiful paper-like interface. Letters are private and only readable by the owner.
</p>

---

## The Story

In a world of instant messages and fleeting notifications, Lettrly brings back the art of thoughtful correspondence. Create your personal letter page, share your unique link, and receive heartfelt messages from friends, family, and admirers.

Whether it's words of gratitude, secret confessions, or simply a thoughtful note — every letter arrives sealed and waiting just for you.

---

## Features

**For Recipients**
- **Personal Letter Page** — Your own `lettrly.com/username` link to share
- **Private Inbox** — Only you can read your letters
- **Favorites & Organization** — Mark special letters and keep them close

**For Writers**
- **Beautiful Paper Interface** — Write on a realistic, tactile paper surface
- **Stay Anonymous** — Choose whether to sign your name or remain mysterious
- **No Rush** — Take your time crafting the perfect message

**The Experience**
- **Envelope Animations** — Watch your letter fold and seal
- **Elegant Design** — Warm, paper-like aesthetics throughout
- **Fully Responsive** — Write from anywhere, on any device

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | [TypeScript](https://typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) |
| Animations | [Framer Motion](https://framer.com/motion) |
| Database & Auth | [Supabase](https://supabase.com) |
| Package Manager | [pnpm](https://pnpm.io) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/installation)
- [Docker](https://docker.com) (for local Supabase)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lettrly.git
cd lettrly

# Install dependencies
pnpm install
```

### Environment Setup

Copy the environment example and configure:

```bash
cp .env.example .env.local
```

### Start Local Supabase

```bash
# Start Supabase (requires Docker)
pnpx supabase start

# Apply database migrations
pnpx supabase db push
```

After running `supabase start`, copy the output credentials to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_OWNER_USERNAME=leigh
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Project Structure

```
lettrly/
├── app/
│   ├── (auth)/           # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (public)/
│   │   └── [username]/   # Public letter-writing page
│   ├── dashboard/        # Private letter inbox
│   └── actions/          # Server actions
├── components/
│   ├── letter/           # Paper, envelope, animations
│   ├── dashboard/        # Inbox & letter views
│   ├── landing/          # Homepage components
│   ├── shared/           # Common components
│   └── ui/               # shadcn/ui primitives
├── lib/
│   ├── supabase/         # Database clients & types
│   ├── constants.ts      # App configuration
│   └── utils.ts          # Utilities
├── hooks/                # React hooks
├── supabase/
│   └── migrations/       # Database schema
└── public/               # Static assets
```

---

## Development

```bash
# Start development server
pnpm dev

# Type checking
pnpm build

# Linting
pnpm lint

# Generate Supabase types after schema changes
pnpx supabase gen types typescript --local > lib/supabase/types.ts
```

**Local Services:**
- App: http://localhost:3000
- Supabase Studio: http://127.0.0.1:54323
- Supabase API: http://127.0.0.1:54321

---

## Design Philosophy

Lettrly embraces the warmth and intimacy of handwritten letters:

- **Paper Textures** — Subtle backgrounds that feel tactile and real
- **Ink Colors** — Deep, thoughtful tones inspired by fountain pens
- **Wax Seal Accents** — Rich burgundy touches that evoke tradition
- **Gentle Animations** — Envelope folds and seal stamps that delight

```css
--paper-bg: #fdfbf7;      /* Warm cream paper */
--ink-primary: #1a1a2e;   /* Deep midnight ink */
--envelope-tan: #d4a574;  /* Aged envelope */
--wax-seal: #8b0000;      /* Dark burgundy seal */
```

---

## Deployment

### Supabase (Production)

1. Create a new project at [supabase.com](https://supabase.com)
2. Link your local project:
   ```bash
   pnpx supabase link --project-ref your-project-ref
   ```
3. Push migrations:
   ```bash
   pnpx supabase db push
   ```

### Vercel

Deploy with one click or connect your repository:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Add your production environment variables in the Vercel dashboard.

---

## License

MIT

---

<p align="center">
  <em>Made with care for meaningful connections.</em>
</p>
