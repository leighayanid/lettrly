import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import PostgresAdapter from '@auth/pg-adapter'
import { pool, queryOne } from '@/lib/db'
import type { User, Profile } from '@/lib/db/types'
import { authConfig } from './auth.config'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      username?: string | null
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PostgresAdapter(pool),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await queryOne<User>(
          'SELECT * FROM users WHERE email = $1',
          [email]
        )

        if (!user || !user.password_hash) {
          return null
        }

        const isValid = await compare(password, user.password_hash)

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string

        // Fetch username from profile
        const profile = await queryOne<Profile>(
          'SELECT username FROM profiles WHERE id = $1',
          [token.id]
        )
        if (profile) {
          session.user.username = profile.username
        }
      }
      return session
    },
  },
})
