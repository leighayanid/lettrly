import { getLetters, getCurrentUserProfile } from '@/app/actions/letters'
import { Inbox } from '@/components/dashboard/inbox'
import { Header } from '@/components/shared/header'
import { APP_NAME, APP_URL } from '@/lib/constants'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: `Inbox | ${APP_NAME}`,
  description: 'View and manage your letters',
}

export default async function DashboardPage() {
  const { profile } = await getCurrentUserProfile()

  if (!profile) {
    redirect('/login')
  }

  const { letters, error } = await getLetters()

  const needsUsername = !profile.username

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header username={profile.username || undefined} />

      <main className="max-w-4xl mx-auto py-8 px-4">
        {needsUsername && (
          <div className="mb-8 p-4 bg-amber-100/50 border border-amber-200 rounded-lg">
            <p className="text-[var(--ink-primary)] font-medium mb-2">
              Set up your personal letter link
            </p>
            <p className="text-sm text-[var(--ink-secondary)] mb-3">
              Choose a username to get your personal letter link that you can share with others.
            </p>
            <a
              href="/settings"
              className="text-[var(--wax-seal)] text-sm font-medium hover:underline"
            >
              Set username →
            </a>
          </div>
        )}

        {profile.username && (
          <div className="mb-8 p-4 bg-[var(--paper-bg)] border border-[var(--paper-lines)] rounded-lg">
            <p className="text-sm text-[var(--ink-secondary)] mb-1">Your letter link</p>
            <p className="text-[var(--ink-primary)] font-medium font-mono">
              {APP_URL}/{profile.username}
            </p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-serif text-[var(--ink-primary)] mb-2">
            Your Letters
          </h1>
          <p className="text-[var(--ink-secondary)]">
            {letters.length === 0
              ? 'No letters yet. Share your link to start receiving letters.'
              : `You have ${letters.length} letter${letters.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {error && (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
          </div>
        )}

        <Inbox letters={letters} />
      </main>
    </div>
  )
}
