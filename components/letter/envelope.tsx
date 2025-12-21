'use client'

import { motion } from 'framer-motion'

interface EnvelopeProps {
  isSealing?: boolean
}

export function Envelope({ isSealing = false }: EnvelopeProps) {
  return (
    <div className="w-full max-w-md mx-auto flex items-center justify-center min-h-[400px]">
      <motion.div
        className="relative w-80 h-48"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Envelope body */}
        <div className="absolute inset-0 bg-[var(--envelope-tan)] rounded-sm shadow-lg">
          {/* Envelope flap */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-24 origin-top"
            style={{
              background: 'linear-gradient(135deg, #c49a6c 0%, #d4a574 50%, #e4b584 100%)',
              clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
            }}
            initial={{ rotateX: 0 }}
            animate={isSealing ? { rotateX: 180 } : { rotateX: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />

          {/* Wax seal */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[var(--wax-seal)] shadow-md flex items-center justify-center z-10"
            initial={{ scale: 0, rotate: -30 }}
            animate={isSealing ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -30 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 15,
              delay: 0.8
            }}
          >
            <span className="text-white text-2xl font-serif">L</span>
          </motion.div>

          {/* Envelope inner shadow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}
