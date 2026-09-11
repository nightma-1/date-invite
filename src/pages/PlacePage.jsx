import { motion } from 'framer-motion'
import { siteConfig } from '../config/siteConfig'
import ProgressBar from '../components/ProgressBar'

const CUSTOM_ID = '__custom__'

function OptionCard({ emoji, label, selected, onClick }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-4 border transition-colors ${
        selected
          ? 'bg-gradient-to-br from-blush-400 to-lilac-400 text-white border-transparent shadow-md'
          : 'bg-white/70 border-white/70 text-gray-600'
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-xs font-semibold text-center leading-tight">{label}</span>
    </motion.button>
  )
}

export default function PlacePage({ draft, updateDraft, onNext, onBack, playClick }) {
  const placeIsCustom = draft.place === CUSTOM_ID
  const foodHasCustom = draft.food.includes(CUSTOM_ID)

  const toggleFood = (id) => {
    const has = draft.food.includes(id)
    updateDraft({
      food: has ? draft.food.filter((f) => f !== id) : [...draft.food, id],
    })
  }

  const canContinue =
    (draft.place && (!placeIsCustom || draft.placeCustom.trim())) &&
    draft.food.length > 0 &&
    (!foodHasCustom || draft.foodCustom.trim())

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-10"
    >
      <ProgressBar step={4} total={5} />

      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-2">
        {siteConfig.texts.placeTitle}
      </h2>
      <p className="text-gray-500 text-center mb-8 max-w-xs">{siteConfig.texts.placeSubtitle}</p>

      <div className="w-full max-w-md space-y-6">
        <div className="glass-card rounded-3xl p-5">
          <h3 className="text-sm font-bold text-gray-600 mb-3">{siteConfig.texts.placeSectionTitle}</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {siteConfig.places.map((p) => (
              <OptionCard
                key={p.id}
                emoji={p.emoji}
                label={p.label}
                selected={draft.place === p.id}
                onClick={() => updateDraft({ place: p.id })}
              />
            ))}
            <OptionCard
              emoji="✍️"
              label={siteConfig.texts.customOptionLabel}
              selected={placeIsCustom}
              onClick={() => updateDraft({ place: CUSTOM_ID })}
            />
          </div>
          {placeIsCustom && (
            <motion.input
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              value={draft.placeCustom}
              onChange={(e) => updateDraft({ placeCustom: e.target.value })}
              placeholder={siteConfig.texts.customPlacePlaceholder}
              className="mt-3 w-full px-4 py-2.5 rounded-xl border border-white/70 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blush-400 text-sm"
            />
          )}
        </div>

        <div className="glass-card rounded-3xl p-5">
          <h3 className="text-sm font-bold text-gray-600 mb-3">{siteConfig.texts.foodSectionTitle}</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {siteConfig.foods.map((f) => (
              <OptionCard
                key={f.id}
                emoji={f.emoji}
                label={f.label}
                selected={draft.food.includes(f.id)}
                onClick={() => toggleFood(f.id)}
              />
            ))}
            <OptionCard
              emoji="✍️"
              label={siteConfig.texts.customOptionLabel}
              selected={foodHasCustom}
              onClick={() => toggleFood(CUSTOM_ID)}
            />
          </div>
          {foodHasCustom && (
            <motion.input
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              value={draft.foodCustom}
              onChange={(e) => updateDraft({ foodCustom: e.target.value })}
              placeholder={siteConfig.texts.customFoodPlaceholder}
              className="mt-3 w-full px-4 py-2.5 rounded-xl border border-white/70 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blush-400 text-sm"
            />
          )}
        </div>
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
          {siteConfig.texts.placeButton}
        </motion.button>
      </div>
    </motion.div>
  )
}

export { CUSTOM_ID }
