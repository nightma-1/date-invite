import { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { siteConfig } from '../config/siteConfig'
import { CUSTOM_ID } from './PlacePage'
import { saveResponse } from '../lib/storage'
import ProgressBar from '../components/ProgressBar'

function formatDate(isoDate) {
  if (!isoDate) return '—'
  const d = new Date(isoDate + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return isoDate
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function resolvePlaceLabel(draft) {
  if (draft.place === CUSTOM_ID) return draft.placeCustom || '—'
  const found = siteConfig.places.find((p) => p.id === draft.place)
  return found ? `${found.emoji} ${found.label}` : '—'
}

function resolveFoodLabel(draft) {
  const labels = draft.food
    .filter((id) => id !== CUSTOM_ID)
    .map((id) => {
      const found = siteConfig.foods.find((f) => f.id === id)
      return found ? `${found.emoji} ${found.label}` : null
    })
    .filter(Boolean)

  if (draft.food.includes(CUSTOM_ID) && draft.foodCustom.trim()) {
    labels.push(draft.foodCustom.trim())
  }

  return labels.length ? labels.join(', ') : '—'
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-white/50 last:border-0">
      <span className="text-sm font-semibold text-gray-500 shrink-0">{label}</span>
      <span className="text-sm text-gray-800 font-medium text-right">{value}</span>
    </div>
  )
}

export default function FinalPage({ draft, onBack, onSubmitted, playSuccess }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(draft.submitted)

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      await saveResponse({
        agreed: true,
        date: draft.date,
        time: draft.time,
        place: draft.place,
        place_custom: draft.place === CUSTOM_ID ? draft.placeCustom : null,
        food: draft.food.filter((f) => f !== CUSTOM_ID),
        food_custom: draft.food.includes(CUSTOM_ID) ? draft.foodCustom : null,
      })
      setSubmitted(true)
      onSubmitted()
      playSuccess?.()
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } })
    } catch (err) {
      setError(err.message || 'Не удалось отправить подтверждение. Попробуй ещё раз.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-10 text-center"
    >
      <ProgressBar step={5} total={5} />

      {!submitted ? (
        <>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
            {siteConfig.texts.finalTitle}
          </h2>
          <p className="text-gray-500 mb-6">{siteConfig.texts.finalSubtitle}</p>

          <div className="w-full max-w-sm glass-card rounded-3xl p-6 text-left mb-6">
            <SummaryRow label={siteConfig.texts.finalDateLabel} value={formatDate(draft.date)} />
            <SummaryRow label={siteConfig.texts.finalTimeLabel} value={draft.time || '—'} />
            <SummaryRow label={siteConfig.texts.finalPlaceLabel} value={resolvePlaceLabel(draft)} />
            <SummaryRow label={siteConfig.texts.finalFoodLabel} value={resolveFoodLabel(draft)} />
          </div>

          <p className="text-gray-600 max-w-sm mb-6">{siteConfig.texts.finalThanks}</p>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              disabled={submitting}
              className="px-5 py-3 rounded-full bg-white/60 text-gray-600 font-semibold border border-white/60 disabled:opacity-50"
            >
              {siteConfig.texts.backButton}
            </button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.03 }}
              disabled={submitting}
              onClick={handleSubmit}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-blush-500 to-lilac-400 text-white font-bold shadow-lg shadow-blush-300/50 disabled:opacity-60"
            >
              {submitting ? 'Отправляю…' : siteConfig.texts.finalSubmitButton}
            </motion.button>
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="text-6xl mb-5">💌</div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3">
            {siteConfig.texts.finalSubmittedTitle}
          </h2>
          <p className="text-gray-600 max-w-sm mx-auto">{siteConfig.texts.finalSubmittedBody}</p>
        </motion.div>
      )}
    </motion.div>
  )
}
