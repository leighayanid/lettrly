'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'

interface SendAnimationProps {
  onComplete: () => void
}

export function SendAnimation({ onComplete }: SendAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[400px]">
      {/* Flying envelope */}
      <motion.div
        className="relative"
        initial={{ y: 0, x: 0, scale: 1 }}
        animate={{
          y: -200,
          x: 100,
          scale: 0.5,
          opacity: 0
        }}
        transition={{
          duration: 1.5,
          ease: 'easeOut',
        }}
      >
        <div className="w-24 h-16 bg-[var(--envelope-tan)] rounded-sm shadow-lg relative">
          <div
            className="absolute top-0 left-0 right-0 h-8"
            style={{
              background: 'linear-gradient(135deg, #c49a6c 0%, #d4a574 50%, #e4b584 100%)',
              clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
              transform: 'rotateX(180deg)',
              transformOrigin: 'top',
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--wax-seal)] shadow-md flex items-center justify-center">
            <span className="text-white text-sm font-serif">L</span>
          </div>
        </div>
      </motion.div>

      {/* Success message */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          className="text-6xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 1.2,
            type: 'spring',
            stiffness: 200,
            damping: 10
          }}
        >
          ✨
        </motion.div>
        <h2 className="text-2xl font-serif text-[var(--ink-primary)] mb-2">
          Letter Sent!
        </h2>
        <p className="text-[var(--ink-secondary)]">
          Your letter is on its way
        </p>
      </motion.div>
    </div>
  )
}
