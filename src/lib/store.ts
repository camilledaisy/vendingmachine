import { useCallback, useEffect, useState } from 'react'
import { ITEMS } from '../data/items'

export interface Saved {
  owned: Record<string, number> // item id -> times received
  order: string[] // shelf order
  favs: string[]
  sound: boolean
  calm: boolean | null // null = follow the system setting
  place: { lat: number; lon: number } | null // rounded; set only if the visitor asks for live weather
}

const KEY = 'evm:v1'
const empty: Saved = { owned: {}, order: [], favs: [], sound: false, calm: null, place: null }
const known = new Set(ITEMS.map((i) => i.id))

function load(): Saved {
  try {
    const r = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (!r || typeof r !== 'object') return empty
    const owned: Record<string, number> = {}
    for (const id of Object.keys(r.owned ?? {})) if (known.has(id)) owned[id] = Math.max(1, Number(r.owned[id]) || 1)
    const order = (Array.isArray(r.order) ? r.order : []).filter((id: string) => owned[id])
    for (const id of Object.keys(owned)) if (!order.includes(id)) order.push(id)
    return {
      owned,
      order,
      favs: (Array.isArray(r.favs) ? r.favs : []).filter((id: string) => owned[id]),
      sound: r.sound === true,
      calm: typeof r.calm === 'boolean' ? r.calm : null,
      place: r.place && typeof r.place.lat === 'number' && typeof r.place.lon === 'number' ? { lat: r.place.lat, lon: r.place.lon } : null,
    }
  } catch {
    return empty
  }
}

export function useSaved() {
  const [saved, setSaved] = useState<Saved>(load)
  const [storageOk, setStorageOk] = useState(true)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(saved))
    } catch {
      setStorageOk(false)
    }
  }, [saved])

  const update = useCallback((fn: (s: Saved) => Saved) => setSaved(fn), [])

  const collect = (id: string) =>
    update((s) => ({
      ...s,
      owned: { ...s.owned, [id]: (s.owned[id] ?? 0) + 1 },
      order: s.order.includes(id) ? s.order : [...s.order, id],
    }))
  const toggleFav = (id: string) =>
    update((s) => ({ ...s, favs: s.favs.includes(id) ? s.favs.filter((f) => f !== id) : [...s.favs, id] }))
  const move = (from: number, to: number) =>
    update((s) => {
      if (to < 0 || to >= s.order.length || from === to) return s
      const order = [...s.order]
      order.splice(to, 0, order.splice(from, 1)[0])
      return { ...s, order }
    })

  return { saved, update, storageOk, collect, toggleFav, move }
}
