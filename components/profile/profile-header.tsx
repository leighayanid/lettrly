import { Avatar } from '@/components/ui/avatar'

interface ProfileHeaderProps {
  username: string
  displayName?: string | null
  avatarUrl?: string | null
}

export function ProfileHeader({ username, displayName, avatarUrl }: ProfileHeaderProps) {
  const name = displayName || username
  const initial = name[0].toUpperCase()

  return (
    <div className="flex flex-col items-center mb-8">
      <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-lg">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[var(--envelope-tan)] flex items-center justify-center text-3xl font-bold text-white">
            {initial}
          </div>
        )}
      </Avatar>
      <h1 className="text-4xl font-serif text-[var(--ink-primary)] mb-2">
        Write a Letter to {name}
      </h1>
      <p className="text-[var(--ink-secondary)] text-lg">
        Take your time. Your words matter.
      </p>
    </div>
  )
}
