import { motion } from 'framer-motion'
import { siteConfig } from '../config/siteConfig'
import ProgressBar from '../components/ProgressBar'

export default function DateTimePage({ draft, updateDraft, onNext, onBack, playClick }) {
  const today = new Date().toISOString().split('T')[0]
  const canContinue = Boolean(draft.date && draft.time)

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-10"
    >
      <ProgressBar step={3} total={5} />

      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-2">
        {siteConfig.texts.dateTimeTitle}
      </h2>
      <p className="text-gray-500 text-center mb-8 max-w-xs">{siteConfig.texts.dateTimeSubtitle}</p>

      <div className="w-full max-w-sm glass-card rounded-3xl p-6 space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-gray-600 mb-1.5 block">
            {siteConfig.texts.dateLabel}
          </span>
          <input
            type="date"
            min={today}
            value={draft.date}
            onChange={(e) => updateDraft({ date: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border border-white/70 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blush-400 text-gray-700 font-medium"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-600 mb-1.5 block">
            {siteConfig.texts.timeLabel}
          </span>
          <input
            type="time"
            value={draft.time}
            onChange={(e) => updateDraft({ time: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border border-white/70 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blush-400 text-gray-700 font-medium"
          />
        </label>
      </div>

      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-full bg-white/60 text-gray-600 font-semibold border border-white/60"
        >
          {siteConfig.texts.backButton}
        </button>
        <motion.button
          whileTap={{ scale: canContinue ? 0.96 : 1 }}
          whileHover={{ scale: canContinue ? 1.03 : 1 }}
          disabled={!canContinue}
          onClick={() => {
            playClick?.()
            onNext()
          }}
          className={`px-7 py-3 rounded-full font-bold shadow-lg transition-opacity ${
            canContinue
              ? 'bg-gradient-to-r from-blush-500 to-lilac-400 text-white shadow-blush-300/50'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          {siteConfig.texts.dateTimeButton}
        </motion.button>
      </div>
    </motion.div>
  )
}
