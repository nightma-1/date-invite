import { supabase, isSupabaseConfigured } from './supabaseClient'

const LOCAL_RESPONSES_KEY = 'date_invite_responses'
export const storageMode = isSupabaseConfigured ? 'supabase' : 'local'

// --- localStorage helpers -------------------------------------------------

function readLocalResponses() {
  try {
    const raw = localStorage.getItem(LOCAL_RESPONSES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Не удалось прочитать ответы из localStorage', err)
    return []
  }
}

function writeLocalResponses(list) {
  try {
    localStorage.setItem(LOCAL_RESPONSES_KEY, JSON.stringify(list))
  } catch (err) {
    console.error('Не удалось сохранить ответы в localStorage', err)
  }
}

// --- Public API -------------------------------------------------------

/**
 * Сохраняет финальный ответ (дата, время, место, еда и т.д.)
 * data: { agreed, date, time, place, place_custom, food, food_custom, submitted_at }
 */
export async function saveResponse(data) {
  const payload = {
    ...data,
    submitted_at: data.submitted_at || new Date().toISOString(),
  }

  if (isSupabaseConfigured) {
    const { data: inserted, error } = await supabase
      .from('responses')
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error('Ошибка сохранения в Supabase', error)
      throw new Error('Не удалось сохранить ответ. Попробуй ещё раз.')
    }
    return inserted
  }

  // fallback: localStorage
  const list = readLocalResponses()
  const newItem = { id: `local-${Date.now()}`, ...payload }
  list.push(newItem)
  writeLocalResponses(list)
  return newItem
}

export async function getResponses() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Ошибка получения ответов из Supabase', error)
      throw new Error('Не удалось загрузить ответы.')
    }
    return data || []
  }

  return readLocalResponses().sort(
    (a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)
  )
}

export async function deleteResponse(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('responses').delete().eq('id', id)
    if (error) {
      console.error('Ошибка удаления ответа из Supabase', error)
      throw new Error('Не удалось удалить ответ.')
    }
    return true
  }

  const list = readLocalResponses().filter((item) => item.id !== id)
  writeLocalResponses(list)
  return true
}
