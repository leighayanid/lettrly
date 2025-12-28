import { getLetter, markLetterAsReadQuiet, getCurrentUserProfile } from '@/app/actions/letters'
import { LetterView } from '@/components/dashboard/letter-view'
import { Header } from '@/components/shared/header'
import { APP_NAME } from '@/lib/constants'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const { letter } = await getLetter(id)

  if (!letter) {
    return {
      title: `Letter Not Found | ${APP_NAME}`,
    }
  }

  return {
    title: `Letter from ${letter.sender_display_name || 'Anonymous'} | ${APP_NAME}`,
  }
}

export default async function LetterPage({ params }: PageProps) {
  const { profile } = await getCurrentUserProfile()

  if (!profile) {
    redirect('/login')
  }

  const { id } = await params
  const { letter, error } = await getLetter(id)

  if (error || !letter) {
    notFound()
  }

  // Mark as read if not already (use quiet version to avoid revalidatePath during render)
  if (!letter.is_read) {
    await markLetterAsReadQuiet(id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header showBack username={profile.username || undefined} />

      <main className="max-w-4xl mx-auto py-8 px-4">
        <LetterView letter={letter} />
      </main>
    </div>
  )
}
