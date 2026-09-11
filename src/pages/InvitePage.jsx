import { useRef } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '../config/siteConfig'
import FloatingHearts from '../components/FloatingHearts'
import RunawayButton from '../components/RunawayButton'

export default function InvitePage({ onAgree, playClick, playWhoosh }) {
  const playZoneRef = useRef(null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-10 overflow-hidden"
    >
      <FloatingHearts />

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="font-display text-4xl sm:text-5xl font-extrabold text-center text-gray-800 mb-4"
      >
        {siteConfig.texts.inviteTitle}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className="text-lg sm:text-xl text-center text-gray-600 max-w-sm mb-10 font-medium"
      >
        {siteConfig.texts.inviteQuestion}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-6xl mb-10"
      >
        🌸
      </motion.div>

      <div
        ref={playZoneRef}
        className="relative w-full max-w-sm h-56 sm:h-48 glass-card rounded-3xl flex items-center justify-center gap-5 px-6"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.04 }}
          onClick={() => {
            playClick?.()
            onAgree()
          }}
          className="relative z-10 px-7 py-3.5 rounded-full bg-gradient-to-r from-blush-500 to-blush-400 text-white font-bold shadow-lg shadow-blush-300/50"
        >
          {siteConfig.texts.yesButton}
        </motion.button>

        <RunawayButton containerRef={playZoneRef} onAttempt={playWhoosh} />
      </div>
    </motion.div>
  )
}
