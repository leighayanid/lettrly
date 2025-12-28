'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { Letter } from '@/lib/db/types'

interface NotificationState {
  unreadCount: number
  newLetters: Letter[]
  showBatchNotification: boolean
}

interface NotificationContextValue extends NotificationState {
  setUnreadCount: (count: number) => void
  addNewLetters: (letters: Letter[]) => void
  clearNewLetters: () => void
  dismissBatchNotification: () => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NotificationState>({
    unreadCount: 0,
    newLetters: [],
    showBatchNotification: false,
  })

  const setUnreadCount = useCallback((count: number) => {
    setState(prev => ({ ...prev, unreadCount: count }))
  }, [])

  const addNewLetters = useCallback((letters: Letter[]) => {
    setState(prev => ({
      ...prev,
      newLetters: [...letters, ...prev.newLetters],
      showBatchNotification: letters.length > 0,
    }))
  }, [])

  const clearNewLetters = useCallback(() => {
    setState(prev => ({
      ...prev,
      newLetters: [],
      showBatchNotification: false,
    }))
  }, [])

  const dismissBatchNotification = useCallback(() => {
    setState(prev => ({
      ...prev,
      showBatchNotification: false,
    }))
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        setUnreadCount,
        addNewLetters,
        clearNewLetters,
        dismissBatchNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
