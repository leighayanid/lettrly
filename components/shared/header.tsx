'use client'

import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { APP_NAME, APP_URL } from '@/lib/constants'
import { toast } from 'sonner'
import { useNotifications } from '@/lib/contexts/notification-context'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

interface HeaderProps {
  showBack?: boolean
  username?: string
}

export function Header({ showBack = false, username }: HeaderProps) {
  const router = useRouter()
  const { unreadCount } = useNotifications()

  const letterLink = username ? `${APP_URL}/${username}` : null

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/login')
    router.refresh()
  }

  const handleCopyLink = () => {
    if (letterLink) {
      navigator.clipboard.writeText(letterLink)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <header className="border-b border-[var(--paper-lines)] bg-[var(--paper-bg)]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-[var(--ink-secondary)]"
            >
              ← Back
            </Button>
          )}
          <Link
            href="/dashboard"
            className="font-serif text-xl text-[var(--ink-primary)] hover:text-[var(--wax-seal)] transition-colors relative"
          >
            {APP_NAME}
            {/* Notification badge */}
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-4 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-xs font-bold bg-[var(--wax-seal)] text-white rounded-full"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Inbox button with notification badge */}
          <Link href="/dashboard" className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--ink-secondary)] relative"
            >
              Inbox
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center text-[10px] font-bold bg-[var(--wax-seal)] text-white rounded-full"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </Link>

          {letterLink && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="border-[var(--paper-lines)] text-[var(--ink-secondary)]"
            >
              Copy Letter Link
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--ink-secondary)]"
              >
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[var(--paper-bg)] border-[var(--paper-lines)]"
            >
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/settings">Profile Settings</Link>
              </DropdownMenuItem>
              {username && (
                <>
                  <DropdownMenuSeparator className="bg-[var(--paper-lines)]" />
                  <DropdownMenuItem
                    onClick={handleCopyLink}
                    className="cursor-pointer"
                  >
                    Copy Letter Link
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/${username}`} target="_blank">
                      View Letter Page
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator className="bg-[var(--paper-lines)]" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-red-500"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
