import { getLetters } from '@/app/actions/letters'
import { Inbox } from '@/components/dashboard/inbox'
import { Header } from '@/components/shared/header'
import { APP_NAME } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Inbox | ${APP_NAME}`,
  description: 'View and manage your letters',
}

export default async function DashboardPage() {
  const { letters, error } = await getLetters()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header />

      <main className="max-w-4xl mx-auto py-8 px-4">
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
