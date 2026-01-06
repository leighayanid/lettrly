'use server'

import { query, queryOne, pool } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import type { Profile } from '@/lib/db/types'

// Username validation constants
const USERNAME_MIN_LENGTH = 3
const USERNAME_MAX_LENGTH = 30
const USERNAME_REGEX = /^[a-z0-9_-]+$/
const RESERVED_USERNAMES = [
  'admin',
  'api',
  'auth',
  'dashboard',
  'login',
  'register',
  'settings',
  'profile',
  'user',
  'users',
  'help',
  'support',
  'about',
  'contact',
  'terms',
  'privacy',
  'lettrly',
]

// Display name validation
const DISPLAY_NAME_MAX_LENGTH = 50

// Avatar URL validation
const MAX_URL_LENGTH = 500

interface UpdateProfileInput {
  username?: string
  displayName?: string
  avatarUrl?: string
}

function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username) {
    return { valid: false, error: 'Username is required' }
  }

  const trimmed = username.trim().toLowerCase()

  if (trimmed.length < USERNAME_MIN_LENGTH) {
    return {
      valid: false,
      error: `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
    }
  }

  if (trimmed.length > USERNAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `Username must be no more than ${USERNAME_MAX_LENGTH} characters`,
    }
  }

  if (!USERNAME_REGEX.test(trimmed)) {
    return {
      valid: false,
      error: 'Username can only contain lowercase letters, numbers, hyphens, and underscores',
    }
  }

  if (RESERVED_USERNAMES.includes(trimmed)) {
    return {
      valid: false,
      error: 'This username is reserved',
    }
  }

  return { valid: true }
}

function validateDisplayName(displayName: string): { valid: boolean; error?: string } {
  if (!displayName) {
    return { valid: true } // Display name is optional
  }

  const trimmed = displayName.trim()

  if (trimmed.length > DISPLAY_NAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `Display name must be no more than ${DISPLAY_NAME_MAX_LENGTH} characters`,
    }
  }

  return { valid: true }
}

function validateAvatarUrl(url: string): { valid: boolean; error?: string } {
  if (!url) {
    return { valid: true } // Avatar URL is optional
  }

  const trimmed = url.trim()

  if (trimmed.length > MAX_URL_LENGTH) {
    return {
      valid: false,
      error: 'Avatar URL is too long',
    }
  }

  // Basic URL validation
  try {
    const urlObj = new URL(trimmed)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        valid: false,
        error: 'Avatar URL must use HTTP or HTTPS protocol',
      }
    }
  } catch {
    return {
      valid: false,
      error: 'Invalid avatar URL format',
    }
  }

  return { valid: true }
}

export async function updateProfile(data: UpdateProfileInput) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Unauthorized' }
  }

  const updates: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  // Validate and prepare username update
  if (data.username !== undefined) {
    const validation = validateUsername(data.username)
    if (!validation.valid) {
      return { error: validation.error }
    }

    const username = data.username.trim().toLowerCase()

    // Check if username is already taken (excluding current user)
    const existing = await queryOne<{ id: string }>(
      'SELECT id FROM profiles WHERE username = $1 AND id != $2',
      [username, session.user.id]
    )

    if (existing) {
      return { error: 'This username is already taken' }
    }

    updates.push(`username = $${paramIndex}`)
    values.push(username)
    paramIndex++
  }

  // Validate and prepare display name update
  if (data.displayName !== undefined) {
    const validation = validateDisplayName(data.displayName)
    if (!validation.valid) {
      return { error: validation.error }
    }

    const displayName = data.displayName.trim() || null
    updates.push(`display_name = $${paramIndex}`)
    values.push(displayName)
    paramIndex++
  }

  // Validate and prepare avatar URL update
  if (data.avatarUrl !== undefined) {
    const validation = validateAvatarUrl(data.avatarUrl)
    if (!validation.valid) {
      return { error: validation.error }
    }

    const avatarUrl = data.avatarUrl.trim() || null
    updates.push(`avatar_url = $${paramIndex}`)
    values.push(avatarUrl)
    paramIndex++
  }

  if (updates.length === 0) {
    return { error: 'No updates provided' }
  }

  // Add updated_at timestamp
  updates.push(`updated_at = NOW()`)

  // Add user ID for WHERE clause
  values.push(session.user.id)

  try {
    await queryOne(
      `UPDATE profiles SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
    )

    revalidatePath('/dashboard')
    revalidatePath('/settings')

    return { success: true }
  } catch (error) {
    console.error('Profile update error:', error)
    return { error: 'Failed to update profile' }
  }
}

export async function checkUsernameAvailability(username: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { available: false, error: 'Unauthorized' }
  }

  const validation = validateUsername(username)
  if (!validation.valid) {
    return { available: false, error: validation.error }
  }

  const normalized = username.trim().toLowerCase()

  // Check if username exists (excluding current user)
  const existing = await queryOne<{ id: string }>(
    'SELECT id FROM profiles WHERE username = $1 AND id != $2',
    [normalized, session.user.id]
  )

  return { available: !existing }
}

export async function deleteAccount() {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Unauthorized' }
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Delete user (this will cascade to profile, letters, sessions, etc.)
    await client.query('DELETE FROM users WHERE id = $1', [session.user.id])

    await client.query('COMMIT')

    return { success: true }
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Account deletion error:', error)
    return { error: 'Failed to delete account' }
  } finally {
    client.release()
  }
}

export async function getProfileStats() {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Unauthorized', stats: null }
  }

  const stats = await queryOne<{
    total_letters: number
    unread_letters: number
    favorited_letters: number
    member_since: Date
  }>(
    `SELECT
      (SELECT COUNT(*) FROM letters WHERE recipient_id = $1) as total_letters,
      (SELECT COUNT(*) FROM letters WHERE recipient_id = $1 AND is_read = false) as unread_letters,
      (SELECT COUNT(*) FROM letters WHERE recipient_id = $1 AND is_favorited = true) as favorited_letters,
      (SELECT created_at FROM profiles WHERE id = $1) as member_since`,
    [session.user.id]
  )

  return { stats }
}
