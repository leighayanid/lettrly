import { LetterForm } from '@/components/letter/letter-form'
import { APP_NAME } from '@/lib/constants'
import { getProfileByUsername } from '@/app/actions/letters'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params
  const { profile } = await getProfileByUsername(username)

  if (!profile) {
    return {
      title: `User Not Found | ${APP_NAME}`,
    }
  }

  const displayName = profile.display_name || profile.username
  return {
    title: `Write a Letter to ${displayName} | ${APP_NAME}`,
    description: `Send a personal letter to ${displayName}. Choose to remain anonymous or sign your name.`,
  }
}

export default async function WritePage({ params }: PageProps) {
  const { username } = await params
  const { profile } = await getProfileByUsername(username)

  if (!profile || !profile.username) {
    notFound()
  }

  const displayName = profile.display_name || profile.username

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-serif text-[var(--ink-primary)] mb-4">
            Write a Letter to {displayName}
          </h1>
          <p className="text-[var(--ink-secondary)] text-lg">
            Take your time. Your words matter.
          </p>
        </header>

        <LetterForm recipientName={displayName} recipientUsername={profile.username} />

        <footer className="text-center mt-12 text-[var(--ink-faded)] text-sm">
          <p>Your letter will be delivered privately and securely.</p>
        </footer>
      </div>
    </main>
  )
}
