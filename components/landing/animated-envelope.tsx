"use client";

import { motion } from "framer-motion";

export function AnimatedEnvelope() {
  return (
    <div className="relative w-72 h-48 mx-auto">
      {/* Envelope body */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-br from-[#e8d5b7] via-[#d4a574] to-[#c49a6c] rounded-lg shadow-2xl"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(139, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Envelope texture overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmMGYwZjAiPjwvcmVjdD4KPC9zdmc+')] rounded-lg" />

        {/* Inner shadow for depth */}
        <div className="absolute inset-0 rounded-lg shadow-inner opacity-30" />
      </motion.div>

      {/* Envelope flap */}
      <motion.div
        initial={{ rotateX: 0 }}
        animate={{ rotateX: 180 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
        style={{ transformOrigin: "top center", perspective: 1000 }}
        className="absolute top-0 left-0 right-0 h-24 z-10"
      >
        <div
          className="w-full h-full bg-gradient-to-b from-[#c49a6c] to-[#b8906a]"
          style={{
            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
          }}
        />
      </motion.div>

      {/* Letter peeking out */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: -20, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        className="absolute top-4 left-6 right-6 h-32 bg-[#fdfbf7] rounded-t-sm shadow-lg z-5"
        style={{
          boxShadow: "0 -5px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Paper lines */}
        <div className="absolute inset-4 opacity-30">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
              className="h-0.5 bg-[var(--ink-faded)] mb-3 rounded-full"
              style={{ width: `${85 - i * 15}%` }}
            />
          ))}
        </div>
      </motion.div>

      {/* Wax seal */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
          delay: 0.5,
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="relative w-16 h-16">
          {/* Seal shadow */}
          <div className="absolute inset-0 bg-[#6a0000] rounded-full blur-sm translate-y-1" />

          {/* Main seal */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#a00000] via-[#8b0000] to-[#6a0000] rounded-full shadow-lg">
            {/* Seal texture */}
            <div className="absolute inset-2 rounded-full border-2 border-[#c00000]/30" />
            <div className="absolute inset-4 rounded-full border border-[#c00000]/20" />

            {/* Letter */}
            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-serif font-semibold drop-shadow-sm">
              L
            </span>
          </div>

          {/* Shine effect */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: [0, 0.6, 0], x: 20 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="absolute top-1 left-1 w-4 h-8 bg-white/40 rounded-full blur-sm rotate-45"
          />
        </div>
      </motion.div>

      {/* Floating hearts */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: -60 - i * 20,
            x: (i - 1) * 30,
          }}
          transition={{
            duration: 2,
            delay: 1.5 + i * 0.3,
            repeat: Infinity,
            repeatDelay: 3,
          }}
          className="absolute bottom-1/2 left-1/2 text-[var(--wax-seal)]/60"
          style={{ fontSize: 12 + i * 4 }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}
