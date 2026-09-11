import { motion } from 'framer-motion'

// step: current step number (1-based), total: total number of steps
export default function ProgressBar({ step, total }) {
  const pct = Math.min(100, Math.max(0, (step / total) * 100))

  return (
    <div className="w-full max-w-xs mx-auto mb-6">
      <div className="flex items-center justify-between mb-1.5 text-xs font-medium text-gray-500">
        <span>Шаг {step} из {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/50 overflow-hidden backdrop-blur">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blush-400 to-lilac-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
