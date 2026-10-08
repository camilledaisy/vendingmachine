import { useEffect, useState } from 'react'

export type Phase = 'dawn' | 'day' | 'dusk' | 'night'
export type Weather = 'clear' | 'cloudy' | 'rain' | 'snow' | 'fog' | 'storm'
export interface Sun { rise: number; set: number } // minutes since local midnight

// Lighting for each phase. Tints are multiplied over the wall; text colours keep things readable.
export const LOOK: Record<Phase, Record<string, string>> = {
  day: { '--tint': 'rgba(255,255,255,0)', '--spill': '0', '--glow': '.18', '--neon': '.75', '--ground': '#B7AB99', '--ground-text': '#403B36', '--tagline': '#914F4F' },
  dawn: { '--tint': 'rgba(255,176,160,.42)', '--spill': '.2', '--glow': '.35', '--neon': '.85', '--ground': '#BBA79B', '--ground-text': '#403B36', '--tagline': '#914F4F' },
  dusk: { '--tint': 'rgba(255,132,70,.42)', '--spill': '.45', '--glow': '.6', '--neon': '1', '--ground': '#A8978C', '--ground-text': '#2f2b27', '--tagline': '#7d3d3d' },
  night: { '--tint': 'rgba(34,44,110,.66)', '--spill': '1', '--glow': '1', '--neon': '1.15', '--ground': '#4D4A57', '--ground-text': '#F5EEDF', '--tagline': '#F5EEDF' },
}
// Weather lays a flat wash over the wall (normal blend) on top of the phase tint.
export const WASH: Record<Weather, string> = {
  clear: 'rgba(0,0,0,0)',
  cloudy: 'rgba(120,126,138,.28)',
  rain: 'rgba(86,98,120,.38)',
  storm: 'rgba(52,58,82,.5)',
  snow: 'rgba(230,236,246,.34)',
  fog: 'rgba(225,225,228,.5)',
}

export function phaseFor(d: Date, sun?: Sun | null): Phase {
  const m = d.getHours() * 60 + d.getMinutes()
  const rise = sun?.rise ?? 6.5 * 60
  const set = sun?.set ?? 18.5 * 60
  if (m >= rise - 40 && m < rise + 50) return 'dawn'
  if (m >= rise + 50 && m < set - 60) return 'day'
  if (m >= set - 60 && m < set + 40) return 'dusk'
  return 'night'
}

// Open-Meteo: free, no key. WMO weather codes -> our handful of moods.
const codeToWeather = (c: number): Weather =>
  c >= 95 ? 'storm' : c >= 71 && c <= 77 ? 'snow' : c === 85 || c === 86 ? 'snow' : c === 45 || c === 48 ? 'fog' : (c >= 51 && c <= 67) || (c >= 80 && c <= 82) ? 'rain' : c === 2 || c === 3 ? 'cloudy' : 'clear'

const minutes = (iso: string) => {
  const t = iso.split('T')[1]
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export async function fetchWeather(lat: number, lon: number): Promise<{ weather: Weather; sun: Sun }> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code&daily=sunrise,sunset&timezone=auto&forecast_days=1`
  const r = await fetch(url)
  if (!r.ok) throw new Error('weather unavailable')
  const j = await r.json()
  return { weather: codeToWeather(j.current.weather_code), sun: { rise: minutes(j.daily.sunrise[0]), set: minutes(j.daily.sunset[0]) } }
}

export function getPosition(): Promise<{ lat: number; lon: number }> {
  return new Promise((res, rej) => {
    if (!navigator.geolocation) return rej(new Error('no geolocation'))
    // Rounded to ~11 km: plenty for weather, and not precise enough to be a location.
    navigator.geolocation.getCurrentPosition((p) => res({ lat: Math.round(p.coords.latitude * 10) / 10, lon: Math.round(p.coords.longitude * 10) / 10 }), rej, { timeout: 10000, maximumAge: 3600_000 })
  })
}

export function useNow(everyMs = 60_000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), everyMs)
    return () => clearInterval(id)
  }, [everyMs])
  return now
}
