'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useNotifications } from '@/lib/contexts/notification-context'
import type { Letter } from '@/lib/db/types'

interface UseRealtimeLettersOptions {
  initialLetters?: Letter[]
  enabled?: boolean
}

interface SSEMessage {
  type: 'init' | 'update'
  letters: Letter[]
  newLetters?: Letter[]
  deletedIds?: string[]
}

export function useRealtimeLetters({
  initialLetters = [],
  enabled = true
}: UseRealtimeLettersOptions = {}) {
  const [letters, setLetters] = useState<Letter[]>(initialLetters)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { setUnreadCount, addNewLetters } = useNotifications()

  const connect = useCallback(() => {
    if (!enabled) return

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const eventSource = new EventSource('/api/letters/stream')
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setIsConnected(true)
      setError(null)
    }

    eventSource.onmessage = (event) => {
      try {
        const data: SSEMessage = JSON.parse(event.data)

        if (data.type === 'init') {
          // Parse dates from JSON
          const parsedLetters = data.letters.map(parseLetterDates)
          setLetters(parsedLetters)
          setUnreadCount(parsedLetters.filter(l => !l.is_read).length)
        } else if (data.type === 'update') {
          const parsedLetters = data.letters.map(parseLetterDates)
          setLetters(parsedLetters)
          setUnreadCount(parsedLetters.filter(l => !l.is_read).length)

          // Handle new letters notification
          if (data.newLetters && data.newLetters.length > 0) {
            const parsedNewLetters = data.newLetters.map(parseLetterDates)
            addNewLetters(parsedNewLetters)
          }
        }
      } catch (err) {
        console.error('Error parsing SSE message:', err)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      setError('Connection lost. Reconnecting...')
      eventSource.close()

      // Reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect()
      }, 5000)
    }
  }, [enabled, setUnreadCount, addNewLetters])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    setIsConnected(false)
  }, [])

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  // Update letters from props when they change
  useEffect(() => {
    if (initialLetters.length > 0 && letters.length === 0) {
      setLetters(initialLetters)
      setUnreadCount(initialLetters.filter(l => !l.is_read).length)
    }
  }, [initialLetters, letters.length, setUnreadCount])

  return {
    letters,
    isConnected,
    error,
    reconnect: connect,
    disconnect,
  }
}

// Helper to parse date strings from JSON
function parseLetterDates(letter: Letter): Letter {
  return {
    ...letter,
    created_at: new Date(letter.created_at),
    read_at: letter.read_at ? new Date(letter.read_at) : null,
  }
}
