'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/lib/supabase/types'

export function useLetters() {
  const [letters, setLetters] = useState<Tables<'letters'>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchLetters = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        return
      }

      setLetters(data || [])
    } catch {
      setError('Failed to fetch letters')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchLetters()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('letters-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'letters' },
        () => {
          fetchLetters()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchLetters, supabase])

  const unreadCount = letters.filter((l) => !l.is_read).length
  const favoritedLetters = letters.filter((l) => l.is_favorited)

  return {
    letters,
    isLoading,
    error,
    refetch: fetchLetters,
    unreadCount,
    favoritedLetters,
  }
}

export function useLetter(id: string) {
  const [letter, setLetter] = useState<Tables<'letters'> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchLetter = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError(error.message)
        return
      }

      setLetter(data)
    } catch {
      setError('Failed to fetch letter')
    } finally {
      setIsLoading(false)
    }
  }, [id, supabase])

  useEffect(() => {
    fetchLetter()
  }, [fetchLetter])

  return {
    letter,
    isLoading,
    error,
    refetch: fetchLetter,
  }
}
