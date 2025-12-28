'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { APP_NAME, APP_URL } from '@/lib/constants'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerUser, checkUsernameAvailable } from '@/app/actions/auth'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const router = useRouter()

  const checkUsername = useCallback(async (value: string) => {
    if (!value || value.length < 3) {
      setUsernameAvailable(null)
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameAvailable(false)
      return
    }

    setIsCheckingUsername(true)
    try {
      const { available } = await checkUsernameAvailable(value)
      setUsernameAvailable(available)
    } catch {
      setUsernameAvailable(null)
    } finally {
      setIsCheckingUsername(false)
    }
  }, [])

  const handleUsernameChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsername(sanitized)
    checkUsername(sanitized)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || username.length < 3) {
      toast.error('Username must be at least 3 characters')
      return
    }

    if (!usernameAvailable) {
      toast.error('Please choose an available username')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      formData.append('username', username)
      if (displayName) {
        formData.append('displayName', displayName)
      }

      const result = await registerUser(formData)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('Account created! Please sign in.')
      router.push('/login')
    } catch {
      toast.error('An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif text-[var(--ink-primary)]">
              Join {APP_NAME}
            </h1>
            <p className="text-[var(--ink-secondary)]">
              Create your personal letter page
            </p>
          </div>

          {/* Form card */}
          <div className="bg-[var(--paper-bg)] border border-[var(--paper-lines)] rounded-xl p-8 shadow-lg shadow-amber-900/5">
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[var(--ink-secondary)] text-sm">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="yourname"
                    required
                    minLength={3}
                    maxLength={20}
                    className="bg-white/50 border-[var(--paper-lines)] focus:border-[var(--envelope-tan)] focus:ring-[var(--envelope-tan)]/20 pr-10"
                  />
                  {isCheckingUsername && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-[var(--ink-faded)] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {!isCheckingUsername && usernameAvailable === true && username.length >= 3 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                      ✓
                    </div>
                  )}
                  {!isCheckingUsername && usernameAvailable === false && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      ✗
                    </div>
                  )}
                </div>
                {username && (
                  <p className="text-xs text-[var(--ink-faded)]">
                    Your letter link: {APP_URL}/{username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-[var(--ink-secondary)] text-sm">
                  Display Name <span className="text-[var(--ink-faded)]">(optional)</span>
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  maxLength={50}
                  className="bg-white/50 border-[var(--paper-lines)] focus:border-[var(--envelope-tan)] focus:ring-[var(--envelope-tan)]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[var(--ink-secondary)] text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="bg-white/50 border-[var(--paper-lines)] focus:border-[var(--envelope-tan)] focus:ring-[var(--envelope-tan)]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[var(--ink-secondary)] text-sm">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="bg-white/50 border-[var(--paper-lines)] focus:border-[var(--envelope-tan)] focus:ring-[var(--envelope-tan)]/20"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !usernameAvailable}
                className="w-full bg-[var(--wax-seal)] hover:bg-[var(--wax-seal)]/90 text-white font-medium py-5"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-[var(--ink-secondary)]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[var(--wax-seal)] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
