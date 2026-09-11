export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={enabled ? 'Выключить звук' : 'Включить звук'}
      className="fixed top-4 right-4 z-30 h-10 w-10 rounded-full bg-white/60 backdrop-blur border border-white/60 shadow-sm flex items-center justify-center text-lg hover:scale-105 active:scale-95 transition-transform"
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  )
}
