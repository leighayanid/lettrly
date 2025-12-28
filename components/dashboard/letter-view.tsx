'use client'

import { useState, useTransition } from 'react'
import { Letter } from '@/lib/db/types'
import { Paper } from '@/components/letter/paper'
import { Button } from '@/components/ui/button'
import { toggleFavorite, deleteLetter } from '@/app/actions/letters'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface LetterViewProps {
  letter: Letter
}

export function LetterView({ letter }: LetterViewProps) {
  const [isFavorited, setIsFavorited] = useState(letter.is_favorited)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const senderName = letter.is_anonymous
    ? 'Anonymous'
    : letter.sender_display_name || 'Someone'

  const handleToggleFavorite = () => {
    startTransition(async () => {
      const result = await toggleFavorite(letter.id, isFavorited)
      if (result.error) {
        toast.error(result.error)
        return
      }
      setIsFavorited(!isFavorited)
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites')
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteLetter(letter.id)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success('Letter deleted')
      router.push('/dashboard')
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-[var(--ink-faded)]">
            Received {format(new Date(letter.created_at), 'MMMM d, yyyy')} at{' '}
            {format(new Date(letter.created_at), 'h:mm a')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            disabled={isPending}
            className="text-[var(--ink-secondary)]"
          >
            {isFavorited ? '❤️' : '🤍'} {isFavorited ? 'Favorited' : 'Favorite'}
          </Button>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600"
              >
                🗑️ Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[var(--paper-bg)]">
              <DialogHeader>
                <DialogTitle>Delete this letter?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  letter.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Paper className="min-h-[400px] p-8">
        <div className="mb-6 pb-4 border-b border-[var(--paper-lines)]">
          <p className="text-sm text-[var(--ink-faded)] mb-1">From:</p>
          <p
            className={`font-handwriting text-xl ${
              letter.is_anonymous
                ? 'text-[var(--ink-faded)] italic'
                : 'text-[var(--ink-primary)]'
            }`}
          >
            {senderName}
          </p>
        </div>

        <div
          className="font-serif text-[var(--ink-primary)] text-lg whitespace-pre-wrap"
          style={{
            lineHeight: '32px',
            paddingTop: '6px',
            background: 'linear-gradient(to bottom, transparent 31px, var(--paper-lines) 31px, var(--paper-lines) 32px, transparent 32px)',
            backgroundSize: '100% 32px',
          }}
        >
          {letter.content}
        </div>

        {letter.read_at && (
          <div className="mt-8 pt-4 border-t border-[var(--paper-lines)]">
            <p className="text-xs text-[var(--ink-faded)]">
              First read on{' '}
              {format(new Date(letter.read_at), 'MMMM d, yyyy')} at{' '}
              {format(new Date(letter.read_at), 'h:mm a')}
            </p>
          </div>
        )}
      </Paper>
    </div>
  )
}
