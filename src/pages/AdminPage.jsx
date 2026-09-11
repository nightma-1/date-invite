import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '../config/siteConfig'
import { CUSTOM_ID } from './PlacePage'
import { getResponses, deleteResponse, storageMode } from '../lib/storage'

const SESSION_KEY = 'date_invite_admin_authed'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'change-me'

function placeLabel(row) {
  if (row.place === CUSTOM_ID) return row.place_custom || '—'
  const found = siteConfig.places.find((p) => p.id === row.place)
  return found ? `${found.emoji} ${found.label}` : row.place || '—'
}

function foodLabel(row) {
  const ids = Array.isArray(row.food) ? row.food : []
  const labels = ids
    .map((id) => {
      const found = siteConfig.foods.find((f) => f.id === id)
      return found ? `${found.emoji} ${found.label}` : null
    })
    .filter(Boolean)
  if (row.food_custom) labels.push(row.food_custom)
  return labels.length ? labels.join(', ') : '—'
}

function formatDateTime(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('ru-RU')
  } catch {
    return iso
  }
}

function LoginGate({ onSuccess }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      onSuccess()
    } else {
      setError('Неверный пароль')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs glass-card rounded-3xl p-6 space-y-4 text-center"
      >
        <div className="text-4xl">🔒</div>
        <h1 className="font-display text-xl font-bold text-gray-800">Админ-панель</h1>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Пароль"
          className="w-full px-4 py-2.5 rounded-xl border border-white/70 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blush-400 text-center"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full px-5 py-2.5 rounded-full bg-gradient-to-r from-blush-500 to-lilac-400 text-white font-bold shadow"
        >
          Войти
        </button>
      </form>
    </div>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true')
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getResponses()
      setResponses(data)
    } catch (err) {
      setError(err.message || 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authed) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этот ответ?')) return
    try {
      await deleteResponse(id)
      setResponses((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      alert(err.message || 'Не удалось удалить')
    }
  }

  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-2xl font-extrabold text-gray-800">
          Ответы {siteConfig.girlName} 💌
        </h1>
        <button
          onClick={load}
          className="px-4 py-2 rounded-full bg-white/70 border border-white/60 text-sm font-semibold text-gray-600"
        >
          Обновить
        </button>
      </div>

      <p className="text-xs text-gray-400 mb-6">
        Источник данных:{' '}
        <span className="font-semibold">
          {storageMode === 'supabase' ? 'Supabase (облако)' : 'localStorage (только этот браузер)'}
        </span>
        {storageMode === 'local' && (
          <>
            {' '}
            — чтобы видеть ответы с другого устройства, подключи Supabase (см. README).
          </>
        )}
      </p>

      {loading && <p className="text-gray-500">Загрузка…</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!loading && responses.length === 0 && (
        <p className="text-gray-400 italic">Пока никто не ответил.</p>
      )}

      <div className="space-y-4">
        {responses.map((row) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 text-sm">
                <p>
                  <span className="font-semibold text-gray-500">Согласилась:</span>{' '}
                  {row.agreed ? 'Да ✅' : 'Нет'}
                </p>
                <p>
                  <span className="font-semibold text-gray-500">Дата:</span> {row.date || '—'}
                </p>
                <p>
                  <span className="font-semibold text-gray-500">Время:</span> {row.time || '—'}
                </p>
                <p>
                  <span className="font-semibold text-gray-500">Место:</span> {placeLabel(row)}
                </p>
                <p>
                  <span className="font-semibold text-gray-500">Еда:</span> {foodLabel(row)}
                </p>
                <p className="text-xs text-gray-400">
                  Заполнено: {formatDateTime(row.submitted_at)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(row.id)}
                className="shrink-0 px-3 py-1.5 rounded-full bg-red-50 text-red-500 text-xs font-semibold border border-red-100"
              >
                Удалить
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-xs text-gray-400 leading-relaxed">
        Чтобы изменить имя, тексты, варианты мест/еды и цвета — отредактируй файл{' '}
        <code className="bg-white/60 px-1.5 py-0.5 rounded">src/config/siteConfig.js</code> и задеплой
        проект заново.
      </div>
    </div>
  )
}
