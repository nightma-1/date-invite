import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Если переменные окружения не заданы, supabase будет null,
// и приложение автоматически переключится на localStorage (см. lib/storage.js).
export const supabase = url && anonKey ? createClient(url, anonKey) : null

export const isSupabaseConfigured = Boolean(supabase)
