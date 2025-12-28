'use server'

import { hash } from 'bcryptjs'
import { query, queryOne, pool } from '@/lib/db'
import type { User, Profile } from '@/lib/db/types'
import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const displayName = formData.get('displayName') as string | null

  if (!email || !password || !username) {
    return { error: 'Email, password, and username are required' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  if (username.length < 3) {
    return { error: 'Username must be at least 3 characters' }
  }

  // Check if email exists
  const existingUser = await queryOne<User>(
    'SELECT id FROM users WHERE email = $1',
    [email]
  )

  if (existingUser) {
    return { error: 'An account with this email already exists' }
  }

  // Check if username exists
  const existingUsername = await queryOne<Profile>(
    'SELECT id FROM profiles WHERE username = $1',
    [username.toLowerCase()]
  )

  if (existingUsername) {
    return { error: 'This username is already taken' }
  }

  // Hash password
  const passwordHash = await hash(password, 12)

  // Create user and profile in a transaction
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, name, email_verified)
       VALUES ($1, $2, $3, NOW())
       RETURNING id`,
      [email, passwordHash, displayName || username]
    )

    const userId = userResult.rows[0].id

    // Update the auto-created profile with username
    await client.query(
      `UPDATE profiles SET username = $1, display_name = $2 WHERE id = $3`,
      [username.toLowerCase(), displayName || username, userId]
    )

    await client.query('COMMIT')

    return { success: true }
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Registration error:', error)
    return { error: 'Failed to create account' }
  } finally {
    client.release()
  }
}

export async function loginUser(formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password' }
        default:
          return { error: 'Something went wrong' }
      }
    }
    throw error
  }
}

export async function checkUsernameAvailable(username: string) {
  if (!username || username.length < 3) {
    return { available: false }
  }

  const existing = await queryOne<Profile>(
    'SELECT id FROM profiles WHERE username = $1',
    [username.toLowerCase()]
  )

  return { available: !existing }
}
