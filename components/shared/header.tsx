'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { APP_NAME, OWNER_USERNAME, APP_URL } from '@/lib/constants'
import { toast } from 'sonner'
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
}

export function Header({ showBack = false }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const letterLink = `${APP_URL}/${OWNER_USERNAME}`

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(letterLink)
    toast.success('Link copied to clipboard!')
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
            className="font-serif text-xl text-[var(--ink-primary)] hover:text-[var(--wax-seal)] transition-colors"
          >
            {APP_NAME}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="border-[var(--paper-lines)] text-[var(--ink-secondary)]"
          >
            📋 Copy Letter Link
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--ink-secondary)]"
              >
                ⚙️
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[var(--paper-bg)] border-[var(--paper-lines)]"
            >
              <DropdownMenuItem
                onClick={handleCopyLink}
                className="cursor-pointer"
              >
                📋 Copy Letter Link
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/${OWNER_USERNAME}`} target="_blank">
                  ✉️ View Letter Page
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[var(--paper-lines)]" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-red-500"
              >
                🚪 Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
