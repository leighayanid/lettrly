'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { MAX_LETTER_LENGTH } from '@/lib/constants'

export async function getProfileByUsername(username: string) {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .eq('username', username.toLowerCase())
    .single()

  if (error || !profile) {
    return { profile: null }
  }

  return { profile }
}

export async function getCurrentUserProfile() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { profile: null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { profile }
}

export async function sendLetter(formData: FormData) {
  const supabase = await createClient()

  const content = formData.get('content') as string
  const senderName = formData.get('senderName') as string | null
  const isAnonymous = formData.get('isAnonymous') === 'true'
  const recipientUsername = formData.get('recipientUsername') as string

  if (!content || content.trim().length === 0) {
    return { error: 'Letter content is required' }
  }

  if (content.length > MAX_LETTER_LENGTH) {
    return { error: `Letter is too long (max ${MAX_LETTER_LENGTH} characters)` }
  }

  if (!recipientUsername) {
    return { error: 'Recipient not specified' }
  }

  // Look up the recipient by username
  const { data: recipient } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', recipientUsername.toLowerCase())
    .single()

  if (!recipient) {
    return { error: 'Recipient not found' }
  }

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('letters').insert({
    content: content.trim(),
    sender_id: isAnonymous ? null : user?.id,
    sender_display_name: senderName || null,
    is_anonymous: isAnonymous || !user,
    recipient_id: recipient.id,
  })

  if (error) {
    console.error('Error sending letter:', error)
    return { error: 'Failed to send letter' }
  }

  return { success: true }
}

export async function getLetters() {
  const supabase = await createClient()

  const { data: letters, error } = await supabase
    .from('letters')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching letters:', error)
    return { error: 'Failed to fetch letters', letters: [] }
  }

  return { letters }
}

export async function getLetter(id: string) {
  const supabase = await createClient()

  const { data: letter, error } = await supabase
    .from('letters')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching letter:', error)
    return { error: 'Failed to fetch letter', letter: null }
  }

  return { letter }
}

export async function markLetterAsRead(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('letters')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error marking letter as read:', error)
    return { error: 'Failed to mark letter as read' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function toggleFavorite(id: string, isFavorited: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('letters')
    .update({ is_favorited: !isFavorited })
    .eq('id', id)

  if (error) {
    console.error('Error toggling favorite:', error)
    return { error: 'Failed to toggle favorite' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteLetter(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('letters').delete().eq('id', id)

  if (error) {
    console.error('Error deleting letter:', error)
    return { error: 'Failed to delete letter' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
