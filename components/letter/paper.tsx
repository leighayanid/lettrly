'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface PaperProps {
  children: ReactNode
  className?: string
  showLines?: boolean
}

export function Paper({ children, className, showLines = false }: PaperProps) {
  return (
    <div
      className={cn(
        'relative',
        'bg-[var(--paper-bg)]',
        'rounded-sm',
        'shadow-[0_1px_3px_var(--paper-shadow),_0_1px_2px_var(--paper-shadow)]',
        showLines && [
          'before:absolute',
          'before:inset-0',
          'before:bg-[linear-gradient(transparent_31px,_var(--paper-lines)_31px)]',
          'before:bg-[size:100%_32px]',
          'before:pointer-events-none',
          'before:rounded-sm',
        ],
        className
      )}
    >
      {children}
    </div>
  )
}
