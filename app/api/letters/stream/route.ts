import { auth } from '@/lib/auth'
import { query } from '@/lib/db'
import type { Letter } from '@/lib/db/types'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = session.user.id
  const encoder = new TextEncoder()
  let lastLetterIds: Set<string> = new Set()

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial data
      const initialLetters = await query<Letter>(
        `SELECT * FROM letters
         WHERE recipient_id = $1
         ORDER BY created_at DESC`,
        [userId]
      )

      lastLetterIds = new Set(initialLetters.map(l => l.id))

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'init', letters: initialLetters })}\n\n`)
      )

      // Poll for changes every 2 seconds
      const interval = setInterval(async () => {
        try {
          const letters = await query<Letter>(
            `SELECT * FROM letters
             WHERE recipient_id = $1
             ORDER BY created_at DESC`,
            [userId]
          )

          const currentIds = new Set(letters.map(l => l.id))

          // Find new letters
          const newLetters = letters.filter(l => !lastLetterIds.has(l.id))

          // Find deleted letters
          const deletedIds = Array.from(lastLetterIds).filter(id => !currentIds.has(id))

          // Find updated letters (read status, favorited, etc.)
          const existingLetters = letters.filter(l => lastLetterIds.has(l.id))

          if (newLetters.length > 0 || deletedIds.length > 0) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({
                type: 'update',
                letters,
                newLetters,
                deletedIds
              })}\n\n`)
            )
            lastLetterIds = currentIds
          }
        } catch (error) {
          console.error('SSE polling error:', error)
        }
      }, 2000)

      // Handle client disconnect
      req.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
