import type { Weather } from '../lib/sky'

const drops = Array.from({ length: 46 }, (_, i) => ({ left: (i * 23 + 7) % 100, delay: -((i * 0.37) % 1.4), dur: 0.7 + (i % 5) * 0.12, h: 26 + (i % 4) * 10 }))
const flakes = Array.from({ length: 36 }, (_, i) => ({ left: (i * 29 + 5) % 100, delay: -((i * 0.9) % 9), dur: 7 + (i % 6), s: 3 + (i % 4) }))

// Weather that falls in front of the wall, behind the machine. Hidden by Calm motion (see index.css).
export function WeatherFx({ weather }: { weather: Weather }) {
  if (weather === 'rain' || weather === 'storm')
    return (
      <div className="fx pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden>
        {drops.map((d, i) => (
          <i key={i} className="fx-rain" style={{ left: `${d.left}%`, height: d.h, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }} />
        ))}
      </div>
    )
  if (weather === 'snow')
    return (
      <div className="fx pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden>
        {flakes.map((f, i) => (
          <i key={i} className="fx-snow" style={{ left: `${f.left}%`, width: f.s, height: f.s, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} />
        ))}
      </div>
    )
  if (weather === 'fog') return <div className="fx fx-fog pointer-events-none absolute inset-x-0 bottom-0 top-1/3 z-[3]" aria-hidden />
  return null
}
