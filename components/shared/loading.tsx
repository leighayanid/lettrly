'use client'

import { motion } from 'framer-motion'

interface LoadingProps {
  message?: string
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="text-4xl mb-4"
          animate={{
            rotate: [0, 10, -10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ✉️
        </motion.div>
        <p className="text-[var(--ink-secondary)] font-serif">{message}</p>
      </div>
    </div>
  )
}

export function LoadingSpinner() {
  return (
    <motion.div
      className="w-8 h-8 border-4 border-[var(--paper-lines)] border-t-[var(--wax-seal)] rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}
