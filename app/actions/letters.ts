'use server'

import { query, queryOne } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { MAX_LETTER_LENGTH } from '@/lib/constants'
import type { Profile, Letter } from '@/lib/db/types'

export async function getProfileByUsername(username: string) {
  const profile = await queryOne<Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url'>>(
    'SELECT id, username, display_name, avatar_url FROM profiles WHERE username = $1',
    [username.toLowerCase()]
  )

  return { profile }
}

export async function getCurrentUserProfile() {
  const session = await auth()

  if (!session?.user?.id) {
    return { profile: null }
  }

  const profile = await queryOne<Profile & { email: string }>(
    `SELECT p.*, u.email
     FROM profiles p
     JOIN users u ON u.id = p.id
     WHERE p.id = $1`,
    [session.user.id]
  )

  return { profile }
}

export async function sendLetter(formData: FormData) {
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
  const recipient = await queryOne<{ id: string }>(
    'SELECT id FROM profiles WHERE username = $1',
    [recipientUsername.toLowerCase()]
  )

  if (!recipient) {
    return { error: 'Recipient not found' }
  }

  const session = await auth()
  const senderId = isAnonymous ? null : session?.user?.id

  await queryOne(
    `INSERT INTO letters (content, sender_id, sender_display_name, is_anonymous, recipient_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [content.trim(), senderId, senderName || null, isAnonymous || !session?.user, recipient.id]
  )

  return { success: true }
}

export async function getLetters() {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Unauthorized', letters: [] }
  }

  const letters = await query<Letter>(
    `SELECT * FROM letters
     WHERE recipient_id = $1
     ORDER BY created_at DESC`,
    [session.user.id]
  )

  return { letters }
}

export async function getLetter(id: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Unauthorized', letter: null }
  }

  const letter = await queryOne<Letter>(
    `SELECT * FROM letters
     WHERE id = $1 AND recipient_id = $2`,
    [id, session.user.id]
  )

  if (!letter) {
    return { error: 'Letter not found', letter: null }
  }

  return { letter }
}

export async function markLetterAsRead(id: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Unauthorized' }
  }

  await queryOne(
    `UPDATE letters
     SET is_read = true, read_at = NOW()
     WHERE id = $1 AND recipient_id = $2`,
    [id, session.user.id]
  )

  revalidatePath('/dashboard')
  return { success: true }
}

export async function toggleFavorite(id: string, isFavorited: boolean) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Unauthorized' }
  }

  await queryOne(
    `UPDATE letters
     SET is_favorited = $1
     WHERE id = $2 AND recipient_id = $3`,
    [!isFavorited, id, session.user.id]
  )

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteLetter(id: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Unauthorized' }
  }

  await queryOne(
    `DELETE FROM letters
     WHERE id = $1 AND recipient_id = $2`,
    [id, session.user.id]
  )

  revalidatePath('/dashboard')
  return { success: true }
}
