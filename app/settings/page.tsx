import { getCurrentUserProfile } from '@/app/actions/letters'
import { getProfileStats } from '@/app/actions/profile'
import { Header } from '@/components/shared/header'
import { ProfileSettings } from '@/components/profile/profile-settings'
import { APP_NAME } from '@/lib/constants'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: `Settings | ${APP_NAME}`,
  description: 'Manage your profile and account settings',
}

export default async function SettingsPage() {
  const { profile } = await getCurrentUserProfile()

  if (!profile) {
    redirect('/login')
  }

  const { stats } = await getProfileStats()

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header username={profile.username || undefined} />

      <main className="max-w-3xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-[var(--ink-primary)] mb-2">
            Profile Settings
          </h1>
          <p className="text-[var(--ink-secondary)]">
            Manage your account information and preferences
          </p>
        </div>

        <ProfileSettings profile={profile} stats={stats} />
      </main>
    </div>
  )
}
