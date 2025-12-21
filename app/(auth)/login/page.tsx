'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { APP_NAME } from '@/lib/constants'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

function LetterIllustration() {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-md"
    >
      {/* Background decorative circles */}
      <circle cx="320" cy="80" r="60" fill="#fef3c7" opacity="0.6" />
      <circle cx="60" cy="320" r="80" fill="#fed7aa" opacity="0.5" />
      <circle cx="350" cy="300" r="40" fill="#fde68a" opacity="0.4" />

      {/* Floating envelope - back */}
      <g transform="translate(80, 100)">
        {/* Envelope body */}
        <rect
          x="0"
          y="40"
          width="240"
          height="160"
          rx="8"
          fill="#f5e6d3"
          stroke="#d4a574"
          strokeWidth="2"
        />

        {/* Envelope flap */}
        <path
          d="M0 48 L120 130 L240 48"
          fill="#ede0d0"
          stroke="#d4a574"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Inner shadow on flap */}
        <path
          d="M8 52 L120 125 L232 52"
          fill="none"
          stroke="#c4956a"
          strokeWidth="1"
          opacity="0.3"
        />
      </g>

      {/* Letter paper sticking out */}
      <g transform="translate(100, 80)">
        <rect
          x="0"
          y="0"
          width="200"
          height="140"
          rx="4"
          fill="#fdfbf7"
          stroke="#e5e5e5"
          strokeWidth="1"
        />

        {/* Paper lines */}
        <line x1="20" y1="30" x2="180" y2="30" stroke="#e5e5e5" strokeWidth="1" />
        <line x1="20" y1="50" x2="180" y2="50" stroke="#e5e5e5" strokeWidth="1" />
        <line x1="20" y1="70" x2="180" y2="70" stroke="#e5e5e5" strokeWidth="1" />
        <line x1="20" y1="90" x2="140" y2="90" stroke="#e5e5e5" strokeWidth="1" />

        {/* Simulated handwriting */}
        <path
          d="M25 28 Q35 25, 50 28 T80 28 T110 26 T140 28"
          stroke="#4a4a5a"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M25 48 Q40 45, 60 48 T100 46 T130 48 T160 47"
          stroke="#4a4a5a"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M25 68 Q45 66, 70 68 T120 67"
          stroke="#4a4a5a"
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
        />
      </g>

      {/* Wax seal */}
      <g transform="translate(200, 210)">
        <circle cx="0" cy="0" r="28" fill="#8b0000" />
        <circle cx="0" cy="0" r="22" fill="#a01010" />
        <circle cx="0" cy="0" r="16" fill="#8b0000" />

        {/* Seal letter */}
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fill="#fdfbf7"
          fontSize="18"
          fontFamily="serif"
          fontWeight="bold"
        >
          L
        </text>

        {/* Seal shine */}
        <ellipse
          cx="-8"
          cy="-8"
          rx="6"
          ry="4"
          fill="#ffffff"
          opacity="0.2"
          transform="rotate(-30, -8, -8)"
        />
      </g>

      {/* Decorative quill */}
      <g transform="translate(280, 180) rotate(35)">
        {/* Quill feather */}
        <path
          d="M0 0 Q-15 30, -10 80 Q-5 100, 0 120 Q5 100, 10 80 Q15 30, 0 0"
          fill="#f5e6d3"
          stroke="#d4a574"
          strokeWidth="1"
        />

        {/* Feather center line */}
        <path
          d="M0 0 L0 120"
          stroke="#c4956a"
          strokeWidth="2"
        />

        {/* Feather details */}
        <path d="M0 20 Q-8 25, -8 35" stroke="#d4a574" strokeWidth="0.5" fill="none" />
        <path d="M0 30 Q-10 38, -9 50" stroke="#d4a574" strokeWidth="0.5" fill="none" />
        <path d="M0 40 Q-12 50, -10 65" stroke="#d4a574" strokeWidth="0.5" fill="none" />
        <path d="M0 20 Q8 25, 8 35" stroke="#d4a574" strokeWidth="0.5" fill="none" />
        <path d="M0 30 Q10 38, 9 50" stroke="#d4a574" strokeWidth="0.5" fill="none" />
        <path d="M0 40 Q12 50, 10 65" stroke="#d4a574" strokeWidth="0.5" fill="none" />

        {/* Quill nib */}
        <path
          d="M-2 120 L0 140 L2 120"
          fill="#4a4a5a"
          stroke="#333"
          strokeWidth="0.5"
        />
      </g>

      {/* Small floating hearts */}
      <g opacity="0.6">
        <path
          d="M60 100 C60 95, 65 90, 70 95 C75 90, 80 95, 80 100 C80 110, 70 118, 70 118 C70 118, 60 110, 60 100"
          fill="#f9a8d4"
        />
        <path
          d="M320 220 C320 216, 324 212, 328 216 C332 212, 336 216, 336 220 C336 228, 328 234, 328 234 C328 234, 320 228, 320 220"
          fill="#fda4af"
        />
      </g>

      {/* Decorative stars */}
      <g fill="#fcd34d" opacity="0.7">
        <polygon points="50,200 52,206 58,206 53,210 55,216 50,212 45,216 47,210 42,206 48,206" />
        <polygon points="340,140 341,144 345,144 342,147 343,151 340,148 337,151 338,147 335,144 339,144" transform="scale(0.8)" />
      </g>
    </svg>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Welcome back!')
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Check your email for a magic link!')
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="min-h-screen flex">
        {/* Left column - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-100/50 via-orange-100/50 to-rose-100/50 items-center justify-center p-12">
          <div className="max-w-lg w-full">
            <LetterIllustration />
            <div className="text-center mt-8 space-y-2">
              <h2 className="text-2xl font-serif text-[var(--ink-primary)]">
                Your Letters Await
              </h2>
              <p className="text-[var(--ink-secondary)] text-sm">
                A private space for heartfelt messages from those who care about you
              </p>
            </div>
          </div>
        </div>

        {/* Right column - Login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile illustration */}
            <div className="lg:hidden flex justify-center">
              <div className="w-48">
                <LetterIllustration />
              </div>
            </div>

            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-serif text-[var(--ink-primary)]">
                {APP_NAME}
              </h1>
              <p className="text-[var(--ink-secondary)]">
                Welcome back, sign in to read your letters
              </p>
            </div>

            {/* Form card */}
            <div className="bg-[var(--paper-bg)] border border-[var(--paper-lines)] rounded-xl p-8 shadow-lg shadow-amber-900/5">
              <form onSubmit={handleLogin} className="space-y-5">
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
                    placeholder="Enter your password"
                    className="bg-white/50 border-[var(--paper-lines)] focus:border-[var(--envelope-tan)] focus:ring-[var(--envelope-tan)]/20"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[var(--wax-seal)] hover:bg-[var(--wax-seal)]/90 text-white font-medium py-5"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[var(--paper-lines)]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[var(--paper-bg)] px-3 text-[var(--ink-faded)]">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleMagicLink}
                disabled={isLoading}
                className="w-full border-[var(--paper-lines)] text-[var(--ink-secondary)] hover:bg-amber-50/50 py-5"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Send Magic Link
              </Button>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-[var(--ink-faded)]">
              This is a private inbox. Only the owner can sign in.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
