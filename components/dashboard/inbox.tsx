'use client'

import { Tables } from '@/lib/supabase/types'
import { LetterCard } from './letter-card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface InboxProps {
  letters: Tables<'letters'>[]
}

export function Inbox({ letters }: InboxProps) {
  if (letters.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📮</div>
        <h2 className="text-xl font-serif text-[var(--ink-primary)] mb-2">
          Your inbox is empty
        </h2>
        <p className="text-[var(--ink-secondary)]">
          Share your letter link to start receiving letters
        </p>
      </div>
    )
  }

  const unreadLetters = letters.filter((l) => !l.is_read)
  const readLetters = letters.filter((l) => l.is_read)

  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <div className="space-y-6">
        {unreadLetters.length > 0 && (
          <div>
            <h2 className="text-lg font-serif text-[var(--ink-primary)] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--wax-seal)] rounded-full" />
              Unread ({unreadLetters.length})
            </h2>
            <div className="space-y-4">
              {unreadLetters.map((letter) => (
                <LetterCard key={letter.id} letter={letter} />
              ))}
            </div>
          </div>
        )}

        {readLetters.length > 0 && (
          <div>
            <h2 className="text-lg font-serif text-[var(--ink-secondary)] mb-4">
              Read ({readLetters.length})
            </h2>
            <div className="space-y-4">
              {readLetters.map((letter) => (
                <LetterCard key={letter.id} letter={letter} />
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
