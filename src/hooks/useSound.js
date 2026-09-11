import { useCallback, useEffect, useState } from 'react'

const SOUND_KEY = 'date_invite_sound_enabled'

let audioCtx = null
function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null
    audioCtx = new AudioContextClass()
  }
  return audioCtx
}

function playTone({ frequency = 440, duration = 0.12, type = 'sine', volume = 0.08 }) {
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    if (ctx.state === 'suspended') ctx.resume()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = frequency
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch (err) {
    console.error('Ошибка воспроизведения звука', err)
  }
}

export function useSound() {
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem(SOUND_KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_KEY, String(enabled))
    } catch {}
  }, [enabled])

  const toggle = useCallback(() => setEnabled((v) => !v), [])

  const playClick = useCallback(() => {
    if (enabled) playTone({ frequency: 320, duration: 0.08, type: 'sine', volume: 0.06 })
  }, [enabled])

  const playSuccess = useCallback(() => {
    if (!enabled) return
    playTone({ frequency: 523, duration: 0.12, type: 'sine', volume: 0.07 })
    setTimeout(() => playTone({ frequency: 659, duration: 0.12, type: 'sine', volume: 0.07 }), 110)
    setTimeout(() => playTone({ frequency: 784, duration: 0.18, type: 'sine', volume: 0.07 }), 220)
  }, [enabled])

  const playWhoosh = useCallback(() => {
    if (enabled) playTone({ frequency: 220, duration: 0.1, type: 'triangle', volume: 0.05 })
  }, [enabled])

  return { enabled, toggle, playClick, playSuccess, playWhoosh }
}
