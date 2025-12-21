'use client'

import { Tables } from '@/lib/supabase/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LetterCardProps {
  letter: Tables<'letters'>
}

export function LetterCard({ letter }: LetterCardProps) {
  const preview = letter.content.slice(0, 150) + (letter.content.length > 150 ? '...' : '')
  const senderName = letter.is_anonymous
    ? 'Anonymous'
    : letter.sender_display_name || 'Someone'

  return (
    <Link href={`/dashboard/${letter.id}`}>
      <Card
        className={cn(
          'bg-[var(--paper-bg)] border-[var(--paper-lines)] hover:shadow-md transition-all cursor-pointer',
          !letter.is_read && 'border-l-4 border-l-[var(--wax-seal)]'
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'font-handwriting text-lg',
                  letter.is_anonymous
                    ? 'text-[var(--ink-faded)] italic'
                    : 'text-[var(--ink-primary)]'
                )}
              >
                {senderName}
              </span>
              {letter.is_favorited && (
                <span className="text-[var(--wax-seal)]">❤️</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!letter.is_read && (
                <Badge
                  variant="secondary"
                  className="bg-[var(--wax-seal)] text-white text-xs"
                >
                  New
                </Badge>
              )}
              <span className="text-xs text-[var(--ink-faded)]">
                {formatDistanceToNow(new Date(letter.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
          <p className="text-[var(--ink-secondary)] text-sm leading-relaxed font-serif">
            {preview}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
