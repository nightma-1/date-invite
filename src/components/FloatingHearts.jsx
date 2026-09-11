const DEFAULT_ITEMS = [
  { emoji: '❤️', top: '8%', left: '10%', size: '1.6rem', delay: '0s', duration: '7s' },
  { emoji: '✨', top: '18%', left: '82%', size: '1.3rem', delay: '1.2s', duration: '6s' },
  { emoji: '💫', top: '70%', left: '85%', size: '1.5rem', delay: '0.5s', duration: '8s' },
  { emoji: '🩷', top: '78%', left: '12%', size: '1.4rem', delay: '2s', duration: '7.5s' },
  { emoji: '⭐', top: '40%', left: '5%', size: '1.1rem', delay: '1.5s', duration: '9s' },
  { emoji: '✨', top: '35%', left: '92%', size: '1.2rem', delay: '0.8s', duration: '6.5s' },
]

// Purely decorative, non-interactive floating elements for the background.
export default function FloatingHearts({ items = DEFAULT_ITEMS }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((item, i) => (
        <span
          key={i}
          className="absolute opacity-60 animate-float select-none"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  )
}
