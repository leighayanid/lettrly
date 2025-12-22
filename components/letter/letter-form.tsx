'use client'

import { useState, useTransition } from 'react'
import { Paper } from './paper'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Envelope } from './envelope'
import { SendAnimation } from './send-animation'
import { sendLetter } from '@/app/actions/letters'
import { MAX_LETTER_LENGTH } from '@/lib/constants'
import { toast } from 'sonner'

interface LetterFormProps {
  recipientName: string
  recipientUsername: string
}

export function LetterForm({ recipientName, recipientUsername }: LetterFormProps) {
  const [content, setContent] = useState('')
  const [senderName, setSenderName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [showEnvelope, setShowEnvelope] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('Please write something in your letter')
      return
    }

    if (content.length > MAX_LETTER_LENGTH) {
      toast.error(`Letter is too long (max ${MAX_LETTER_LENGTH} characters)`)
      return
    }

    setShowEnvelope(true)

    // Wait for envelope animation
    setTimeout(() => {
      startTransition(async () => {
        const formData = new FormData()
        formData.append('content', content)
        formData.append('senderName', senderName)
        formData.append('isAnonymous', isAnonymous.toString())
        formData.append('recipientUsername', recipientUsername)

        const result = await sendLetter(formData)

        if (result.error) {
          setShowEnvelope(false)
          toast.error(result.error)
          return
        }

        setShowSuccess(true)
        toast.success('Your letter has been sent!')
      })
    }, 1500)
  }

  if (showSuccess) {
    return <SendAnimation onComplete={() => {
      setShowSuccess(false)
      setShowEnvelope(false)
      setContent('')
      setSenderName('')
    }} />
  }

  if (showEnvelope) {
    return <Envelope isSealing={true} />
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <Paper className="min-h-[500px] p-8">
        <div className="mb-6">
          <p className="text-[var(--ink-secondary)] text-sm mb-2">
            Dear {recipientName},
          </p>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your letter here..."
          className="min-h-[300px] border-none outline-none resize-none font-serif text-[var(--ink-primary)] p-0 text-lg placeholder:text-[var(--ink-faded)]/60 focus-visible:ring-0 focus-visible:ring-offset-0"
          maxLength={MAX_LETTER_LENGTH}
          style={{
            lineHeight: '32px',
            paddingTop: '6px',
            background: 'linear-gradient(to bottom, transparent 31px, var(--paper-lines) 31px, var(--paper-lines) 32px, transparent 32px)',
            backgroundSize: '100% 32px',
            backgroundAttachment: 'local',
            backgroundPositionY: '0px',
          }}
        />

        <div className="flex justify-between items-center text-sm text-[var(--ink-faded)] mt-4">
          <span>{content.length} / {MAX_LETTER_LENGTH}</span>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--paper-lines)]">
          <div className="flex items-center gap-4 mb-4">
            <Label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--ink-faded)]"
              />
              <span className="text-[var(--ink-secondary)]">Send anonymously</span>
            </Label>
          </div>

          {!isAnonymous && (
            <div className="mb-4">
              <Label htmlFor="senderName" className="text-[var(--ink-secondary)] mb-2 block">
                Your name (optional)
              </Label>
              <Input
                id="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="How would you like to sign your letter?"
                className="bg-transparent border-[var(--paper-lines)] text-[var(--ink-primary)] font-handwriting text-xl focus-visible:ring-[var(--ink-faded)]"
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending || !content.trim()}
              className="bg-[var(--wax-seal)] hover:bg-[var(--wax-seal)]/90 text-white px-8 py-2 rounded-full shadow-md transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isPending ? 'Sending...' : 'Seal & Send'}
            </Button>
          </div>
        </div>
      </Paper>
    </form>
  )
}
