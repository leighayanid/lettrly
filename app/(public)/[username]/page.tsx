import { LetterForm } from '@/components/letter/letter-form'
import { OWNER_USERNAME, APP_NAME } from '@/lib/constants'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params
  return {
    title: `Write a Letter to ${username} | ${APP_NAME}`,
    description: `Send a personal letter to ${username}. Choose to remain anonymous or sign your name.`,
  }
}

export default async function WritePage({ params }: PageProps) {
  const { username } = await params

  // Only allow the owner's username for now
  if (username !== OWNER_USERNAME) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-serif text-[var(--ink-primary)] mb-4">
            Write a Letter to {username}
          </h1>
          <p className="text-[var(--ink-secondary)] text-lg">
            Take your time. Your words matter.
          </p>
        </header>

        <LetterForm recipientName={username} />

        <footer className="text-center mt-12 text-[var(--ink-faded)] text-sm">
          <p>Your letter will be delivered privately and securely.</p>
        </footer>
      </div>
    </main>
  )
}
