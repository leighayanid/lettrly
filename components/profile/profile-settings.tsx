'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { updateProfile, checkUsernameAvailability, deleteAccount, changePassword } from '@/app/actions/profile'
import { toast } from 'sonner'
import { APP_URL } from '@/lib/constants'
import type { ProfileWithEmail } from '@/lib/db/types'

interface ProfileSettingsProps {
  profile: ProfileWithEmail
  stats: {
    total_letters: number
    unread_letters: number
    favorited_letters: number
    member_since: Date
  } | null
}

export function ProfileSettings({ profile, stats }: ProfileSettingsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Form state
  const [username, setUsername] = useState(profile.username || '')
  const [displayName, setDisplayName] = useState(profile.display_name || '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Track if form has changes
  const hasChanges =
    username !== (profile.username || '') ||
    displayName !== (profile.display_name || '') ||
    avatarUrl !== (profile.avatar_url || '')

  const handleUsernameChange = async (value: string) => {
    setUsername(value)
    setUsernameAvailable(null)

    // Only check if username is different from current
    if (value && value !== profile.username) {
      setIsCheckingUsername(true)
      try {
        const result = await checkUsernameAvailability(value)
        if (!result.error) {
          setUsernameAvailable(result.available)
        }
      } catch (error) {
        console.error('Error checking username:', error)
      } finally {
        setIsCheckingUsername(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!hasChanges) {
      toast.info('No changes to save')
      return
    }

    startTransition(async () => {
      try {
        const result = await updateProfile({
          username: username || undefined,
          displayName: displayName || undefined,
          avatarUrl: avatarUrl || undefined,
        })

        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success('Profile updated successfully!')
          router.refresh()
        }
      } catch (error) {
        console.error('Update error:', error)
        toast.error('Failed to update profile')
      }
    })
  }

  const handleDeleteAccount = async () => {
    startTransition(async () => {
      try {
        const result = await deleteAccount()

        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success('Account deleted successfully')
          await signOut({ redirect: false })
          router.push('/')
          router.refresh()
        }
      } catch (error) {
        console.error('Delete error:', error)
        toast.error('Failed to delete account')
      }
    })
  }

  const handleCopyLink = () => {
    if (profile.username) {
      const link = `${APP_URL}/${profile.username}`
      navigator.clipboard.writeText(link)
      toast.success('Link copied to clipboard!')
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        const result = await changePassword({
          currentPassword,
          newPassword,
          confirmPassword,
        })

        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success('Password changed successfully!')
          // Clear password fields
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        }
      } catch (error) {
        console.error('Password change error:', error)
        toast.error('Failed to change password')
      }
    })
  }

  const memberSince = stats?.member_since
    ? new Date(stats.member_since).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown'

  return (
    <div className="space-y-6">
      {/* Profile Stats */}
      {stats && (
        <Card className="bg-[var(--paper-bg)] border-[var(--paper-lines)]">
          <CardHeader>
            <CardTitle className="text-[var(--ink-primary)]">Account Overview</CardTitle>
            <CardDescription className="text-[var(--ink-secondary)]">
              Your letter statistics and account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-amber-50/50 rounded-lg">
                <div className="text-2xl font-bold text-[var(--ink-primary)]">
                  {stats.total_letters}
                </div>
                <div className="text-sm text-[var(--ink-secondary)]">Total Letters</div>
              </div>
              <div className="text-center p-4 bg-amber-50/50 rounded-lg">
                <div className="text-2xl font-bold text-[var(--wax-seal)]">
                  {stats.unread_letters}
                </div>
                <div className="text-sm text-[var(--ink-secondary)]">Unread</div>
              </div>
              <div className="text-center p-4 bg-amber-50/50 rounded-lg">
                <div className="text-2xl font-bold text-[var(--stamp-red)]">
                  {stats.favorited_letters}
                </div>
                <div className="text-sm text-[var(--ink-secondary)]">Favorited</div>
              </div>
              <div className="text-center p-4 bg-amber-50/50 rounded-lg">
                <div className="text-xs font-medium text-[var(--ink-primary)]">
                  {memberSince}
                </div>
                <div className="text-sm text-[var(--ink-secondary)]">Member Since</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Information */}
      <Card className="bg-[var(--paper-bg)] border-[var(--paper-lines)]">
        <CardHeader>
          <CardTitle className="text-[var(--ink-primary)]">Profile Information</CardTitle>
          <CardDescription className="text-[var(--ink-secondary)]">
            Update your public profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName || username || 'Avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--envelope-tan)] flex items-center justify-center text-2xl font-bold text-white">
                    {(displayName || username || 'U')[0].toUpperCase()}
                  </div>
                )}
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="avatarUrl" className="text-[var(--ink-primary)]">
                  Avatar URL
                </Label>
                <Input
                  id="avatarUrl"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="bg-white border-[var(--paper-lines)]"
                />
                <p className="text-xs text-[var(--ink-secondary)] mt-1">
                  Enter a URL to an image for your profile picture
                </p>
              </div>
            </div>

            <Separator className="bg-[var(--paper-lines)]" />

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[var(--ink-primary)]">
                Username *
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="your-username"
                className="bg-white border-[var(--paper-lines)]"
                required
                pattern="[a-z0-9_-]+"
                minLength={3}
                maxLength={30}
              />
              {isCheckingUsername && (
                <p className="text-xs text-[var(--ink-secondary)]">Checking availability...</p>
              )}
              {usernameAvailable === true && (
                <p className="text-xs text-green-600">✓ Username is available</p>
              )}
              {usernameAvailable === false && (
                <p className="text-xs text-red-600">✗ Username is already taken</p>
              )}
              <p className="text-xs text-[var(--ink-secondary)]">
                Lowercase letters, numbers, hyphens, and underscores only (3-30 characters)
              </p>
              {profile.username && (
                <div className="mt-2 p-3 bg-amber-50/50 rounded-lg border border-[var(--paper-lines)]">
                  <p className="text-xs text-[var(--ink-secondary)] mb-1">Your letter link:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-[var(--ink-primary)] font-mono flex-1">
                      {APP_URL}/{username || profile.username}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="shrink-0"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-[var(--ink-primary)]">
                Display Name
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name"
                className="bg-white border-[var(--paper-lines)]"
                maxLength={50}
              />
              <p className="text-xs text-[var(--ink-secondary)]">
                This is how your name will appear on your profile (optional, max 50 characters)
              </p>
            </div>

            <Separator className="bg-[var(--paper-lines)]" />

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--ink-secondary)]">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-gray-50 border-[var(--paper-lines)] text-[var(--ink-secondary)]"
              />
              <p className="text-xs text-[var(--ink-secondary)]">
                Email address cannot be changed
              </p>
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={!hasChanges || isPending || (usernameAvailable === false)}
                className="bg-[var(--wax-seal)] hover:bg-[var(--wax-seal)]/90 text-white"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              {hasChanges && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setUsername(profile.username || '')
                    setDisplayName(profile.display_name || '')
                    setAvatarUrl(profile.avatar_url || '')
                    setUsernameAvailable(null)
                  }}
                  className="border-[var(--paper-lines)]"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="bg-[var(--paper-bg)] border-[var(--paper-lines)]">
        <CardHeader>
          <CardTitle className="text-[var(--ink-primary)]">Change Password</CardTitle>
          <CardDescription className="text-[var(--ink-secondary)]">
            Update your account password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-[var(--ink-primary)]">
                Current Password *
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="bg-white border-[var(--paper-lines)]"
                required
                minLength={6}
              />
            </div>

            <Separator className="bg-[var(--paper-lines)]" />

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-[var(--ink-primary)]">
                New Password *
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="bg-white border-[var(--paper-lines)]"
                required
                minLength={6}
              />
              <p className="text-xs text-[var(--ink-secondary)]">
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[var(--ink-primary)]">
                Confirm New Password *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="bg-white border-[var(--paper-lines)]"
                required
                minLength={6}
              />
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-600">Passwords do not match</p>
              )}
              {newPassword && confirmPassword && newPassword === confirmPassword && (
                <p className="text-xs text-green-600">✓ Passwords match</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword ||
                  isPending
                }
                className="bg-[var(--wax-seal)] hover:bg-[var(--wax-seal)]/90 text-white"
              >
                {isPending ? 'Changing Password...' : 'Change Password'}
              </Button>
              {(currentPassword || newPassword || confirmPassword) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                  }}
                  className="border-[var(--paper-lines)]"
                >
                  Clear
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-[var(--paper-bg)] border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription className="text-[var(--ink-secondary)]">
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full md:w-auto">
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[var(--paper-bg)]">
              <DialogHeader>
                <DialogTitle className="text-red-600">Delete Account?</DialogTitle>
                <DialogDescription className="text-[var(--ink-secondary)]">
                  This action cannot be undone. This will permanently delete your account and
                  remove all your data, including:
                </DialogDescription>
              </DialogHeader>
              <ul className="list-disc list-inside space-y-1 text-sm text-[var(--ink-secondary)]">
                <li>Your profile and username</li>
                <li>All letters you&apos;ve received ({stats?.total_letters || 0} letters)</li>
                <li>Your account settings and preferences</li>
              </ul>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isPending}
                >
                  {isPending ? 'Deleting...' : 'Yes, Delete My Account'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <p className="text-xs text-[var(--ink-secondary)] mt-2">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
