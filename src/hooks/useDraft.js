import { useEffect, useState } from 'react'

const DRAFT_KEY = 'date_invite_draft'

const defaultDraft = {
  step: 'invite', // invite | yes | datetime | place | final
  agreed: false,
  date: '',
  time: '',
  place: '',
  placeCustom: '',
  food: [],
  foodCustom: '',
  submitted: false,
}

function readDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return defaultDraft
    return { ...defaultDraft, ...JSON.parse(raw) }
  } catch (err) {
    console.error('Не удалось прочитать черновик из localStorage', err)
    return defaultDraft
  }
}

export function useDraft() {
  const [draft, setDraft] = useState(readDraft)

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    } catch (err) {
      console.error('Не удалось сохранить черновик в localStorage', err)
    }
  }, [draft])

  const updateDraft = (patch) => setDraft((prev) => ({ ...prev, ...patch }))

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    setDraft(defaultDraft)
  }

  return { draft, updateDraft, clearDraft }
}
