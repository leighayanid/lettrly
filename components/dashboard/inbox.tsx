'use client'

import { Letter } from '@/lib/db/types'
import { LetterCard } from './letter-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRealtimeLetters } from '@/hooks/use-realtime-letters'
import { useNotifications } from '@/lib/contexts/notification-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface InboxProps {
  letters: Letter[]
}

export function Inbox({ letters: initialLetters }: InboxProps) {
  const { letters, isConnected, error } = useRealtimeLetters({
    initialLetters,
  })
  const { newLetters, showBatchNotification, dismissBatchNotification, clearNewLetters } = useNotifications()

  const handleViewNewLetters = () => {
    clearNewLetters()
    // Scroll to top to see new letters
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
        {error && (
          <p className="text-sm text-amber-600 mt-4">{error}</p>
        )}
      </div>
    )
  }

  const unreadLetters = letters.filter((l) => !l.is_read)
  const readLetters = letters.filter((l) => l.is_read)

  return (
    <div className="relative">
      {/* Batch notification banner */}
      <AnimatePresence>
        {showBatchNotification && newLetters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 bg-[var(--wax-seal)] text-white rounded-lg shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">✉️</span>
              <div>
                <p className="font-medium">
                  {newLetters.length === 1
                    ? 'You have a new letter!'
                    : `You have ${newLetters.length} new letters!`}
                </p>
                <p className="text-sm text-white/80">
                  {newLetters.length === 1
                    ? `From ${newLetters[0].sender_display_name || 'Anonymous'}`
                    : `${newLetters.length} new messages just arrived`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewNewLetters}
                className="text-white hover:bg-white/20"
              >
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissBatchNotification}
                className="text-white/60 hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection status indicator */}
      <div className="flex items-center gap-2 mb-4 text-sm text-[var(--ink-secondary)]">
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-amber-500 animate-pulse'
          }`}
        />
        {isConnected ? 'Live updates enabled' : 'Reconnecting...'}
        {error && <span className="text-amber-600 ml-2">{error}</span>}
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-6">
          {unreadLetters.length > 0 && (
            <div>
              <h2 className="text-lg font-serif text-[var(--ink-primary)] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--wax-seal)] rounded-full animate-pulse" />
                Unread ({unreadLetters.length})
              </h2>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {unreadLetters.map((letter, index) => (
                    <motion.div
                      key={letter.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <LetterCard letter={letter} isNew={newLetters.some(nl => nl.id === letter.id)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {readLetters.length > 0 && (
            <div>
              <h2 className="text-lg font-serif text-[var(--ink-secondary)] mb-4">
                Read ({readLetters.length})
              </h2>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {readLetters.map((letter) => (
                    <motion.div
                      key={letter.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                    >
                      <LetterCard letter={letter} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
