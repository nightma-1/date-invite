import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '../config/siteConfig'

// containerRef: ref to the bounding box the button is allowed to roam within.
// The container must have position: relative and a defined size.
export default function RunawayButton({ containerRef, onAttempt }) {
  const stages = siteConfig.texts.noButtonStages
  const [pos, setPos] = useState(null)
  const [stageIndex, setStageIndex] = useState(0)
  const btnRef = useRef(null)
  const escaping = useRef(false)

  const runAway = () => {
    const container = containerRef.current
    const btn = btnRef.current
    if (!container || !btn || escaping.current) return
    escaping.current = true

    const cRect = container.getBoundingClientRect()
    const bWidth = btn.offsetWidth || 120
    const bHeight = btn.offsetHeight || 48

    const maxX = Math.max(0, cRect.width - bWidth)
    const maxY = Math.max(0, cRect.height - bHeight)

    const x = Math.random() * maxX
    const y = Math.random() * maxY

    setPos({ x, y })
    setStageIndex((prev) => Math.min(prev + 1, stages.length - 1))
    if (onAttempt) onAttempt()

    setTimeout(() => {
      escaping.current = false
    }, 200)
  }

  const style = pos
    ? {
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        transition: 'left 0.28s cubic-bezier(0.34,1.56,0.64,1), top 0.28s cubic-bezier(0.34,1.56,0.64,1)',
      }
    : { position: 'relative' }

  return (
    <motion.button
      ref={btnRef}
      type="button"
      style={style}
      onMouseEnter={runAway}
      onTouchStart={(e) => {
        e.preventDefault()
        runAway()
      }}
      onClick={(e) => {
        e.preventDefault()
        runAway()
      }}
      whileTap={{ scale: 0.96 }}
      className="px-6 py-3 rounded-full bg-white/70 backdrop-blur border border-white/60 text-gray-500 font-semibold shadow-sm select-none whitespace-nowrap"
    >
      {stages[stageIndex]}
    </motion.button>
  )
}
