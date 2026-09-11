import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { siteConfig } from '../config/siteConfig'

function CelebrationVisual() {
  if (siteConfig.celebrationGifUrl) {
    return (
      <img
        src={siteConfig.celebrationGifUrl}
        alt="Celebration"
        className="w-40 h-40 object-contain mx-auto"
      />
    )
  }

  // Встроенная CSS/Framer Motion анимация — не зависит от внешних ссылок.
  return (
    <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
      {['🎉', '💃', '✨', '🎊'].map((emoji, i) => (
        <motion.span
          key={emoji}
          className="absolute text-4xl"
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: 1,
            scale: [0, 1.2, 1],
            x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 10)],
            y: [0, -20 - i * 8, 0],
            rotate: [0, i % 2 === 0 ? 15 : -15, 0],
          }}
          transition={{
            duration: 1.6,
            delay: i * 0.15,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          {emoji}
        </motion.span>
      ))}
      <motion.span
        className="text-6xl"
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        🥳
      </motion.span>
    </div>
  )
}

export default function YesPage({ onNext, playSuccess }) {
  useEffect(() => {
    playSuccess?.()
    const duration = 1400
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff5c8a', '#ffb3cd', '#c9a3f5', '#ffd700'],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: ['#ff5c8a', '#ffb3cd', '#c9a3f5', '#ffd700'],
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-10 text-center"
    >
      <CelebrationVisual />

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-display text-3xl sm:text-4xl font-extrabold text-gray-800 mt-6 mb-4"
      >
        {siteConfig.texts.yesPageTitle}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-lg text-gray-600 max-w-sm mb-10"
      >
        {siteConfig.texts.yesPageBody}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.03 }}
        onClick={onNext}
        className="px-7 py-3.5 rounded-full bg-gradient-to-r from-blush-500 to-lilac-400 text-white font-bold shadow-lg shadow-blush-300/50"
      >
        {siteConfig.texts.yesPageButton}
      </motion.button>
    </motion.div>
  )
}
