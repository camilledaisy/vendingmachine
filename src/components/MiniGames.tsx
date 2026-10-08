import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw } from 'lucide-react'
import { ObjectArt } from './ObjectArt'
import { Modal } from './Modal'

// Tiny, timer-free, can't-lose games for the Distraction (E05) objects.
// To add one: write a component here and register it in GAMES under the item id.

const rnd = (n: number) => Math.floor(Math.random() * n)
const shuffle = <T,>(xs: T[]) => xs.map((x) => [Math.random(), x] as const).sort((a, b) => a[0] - b[0]).map((p) => p[1])
const Done = ({ children }: { children: ReactNode }) => (
  <p role="status" className="mt-3 rounded-lg bg-butter/70 p-2 text-center font-serif text-[15px] font-medium text-charcoal">{children}</p>
)
const Again = ({ onClick, label = 'Again' }: { onClick: () => void; label?: string }) => (
  <button className="btn mx-auto mt-3 !flex w-fit" onClick={onClick}>
    <RotateCcw size={16} aria-hidden /> {label}
  </button>
)

// ---- Tiny Maze
const N = 8
const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]] // N E S W
function genMaze() {
  const walls = Array.from({ length: N * N }, () => [true, true, true, true])
  const seen = new Set([0])
  const st = [0]
  while (st.length) {
    const c = st[st.length - 1]
    const x = c % N, y = (c / N) | 0
    const nb = DIRS.map(([dx, dy], d) => ({ i: (y + dy) * N + x + dx, x: x + dx, y: y + dy, d })).filter((o) => o.x >= 0 && o.y >= 0 && o.x < N && o.y < N && !seen.has(o.i))
    if (!nb.length) { st.pop(); continue }
    const o = nb[rnd(nb.length)]
    walls[c][o.d] = false
    walls[o.i][(o.d + 2) % 4] = false
    seen.add(o.i)
    st.push(o.i)
  }
  return walls
}
function Maze() {
  const [walls, setWalls] = useState(genMaze)
  const [pos, setPos] = useState(0)
  const won = pos === N * N - 1
  const go = (d: number) => setPos((p) => {
    if (p === N * N - 1 || walls[p][d]) return p
    return p + DIRS[d][1] * N + DIRS[d][0]
  })
  useEffect(() => {
    const keys: Record<string, number> = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3, w: 0, d: 1, s: 2, a: 3 }
    const on = (e: KeyboardEvent) => { if (e.key in keys) { e.preventDefault(); go(keys[e.key]) } }
    document.addEventListener('keydown', on)
    return () => document.removeEventListener('keydown', on)
  })
  const S = 30
  const lines: string[] = []
  walls.forEach((w, i) => {
    const x = (i % N) * S, y = ((i / N) | 0) * S
    if (w[0]) lines.push(`M${x} ${y}h${S}`)
    if (w[1]) lines.push(`M${x + S} ${y}v${S}`)
    if (w[2]) lines.push(`M${x} ${y + S}h${S}`)
    if (w[3]) lines.push(`M${x} ${y}v${S}`)
  })
  return (
    <div>
      <svg viewBox={`-4 -4 ${N * S + 8} ${N * S + 8}`} className="mx-auto w-full max-w-[300px] rounded-lg bg-cream" role="img" aria-label={`Maze. You are at column ${(pos % N) + 1}, row ${((pos / N) | 0) + 1} of ${N}. The flag is at the bottom right.`}>
        <path d={lines.join('')} stroke="#403B36" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d={`M${(N - 1) * S + 9} ${(N - 1) * S + 22}v-14l12 5-12 5`} fill="#914F4F" stroke="#914F4F" strokeWidth="2" />
        <circle cx={(pos % N) * S + S / 2} cy={((pos / N) | 0) * S + S / 2} r="8" fill="#A3B18A" stroke="#403B36" strokeWidth="2" style={{ transition: 'cx .12s, cy .12s' }} />
      </svg>
      <div className="mx-auto mt-3 grid w-[150px] grid-cols-3 gap-1.5">
        {[null, 0, null, 3, 2, 1].map((d, i) => d === null ? <span key={i} /> : (
          <button key={i} className="btn !min-h-[44px] !px-0" onClick={() => go(d)} aria-label={['Up', 'Right', 'Down', 'Left'][d]}>
            {[ArrowUp, ArrowRight, ArrowDown, ArrowLeft].map((I, k) => k === d && <I key={k} size={18} aria-hidden />)}
          </button>
        ))}
      </div>
      <p className="mt-2 text-center font-serif text-[13px] text-charcoal/75">Arrow keys or WASD also work.</p>
      {won && <Done>Out. The exit was not a rumour after all.</Done>}
      <Again onClick={() => (setWalls(genMaze()), setPos(0))} label="New maze" />
    </div>
  )
}

// ---- Mystery Buttons: memory match
const BTNS = [
  { name: 'rose, two holes', c: '#D4A5A5', h: 2 }, { name: 'sage, four holes', c: '#A3B18A', h: 4 },
  { name: 'butter, two holes', c: '#F2D98D', h: 2 }, { name: 'burgundy, four holes', c: '#914F4F', h: 4 },
  { name: 'sky, two holes', c: '#9DB8C4', h: 2 }, { name: 'cream, four holes', c: '#FFFAF0', h: 4 },
]
function Buttons() {
  const [deck, setDeck] = useState(() => shuffle([...BTNS.keys(), ...BTNS.keys()]))
  const [up, setUp] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const flip = (i: number) => {
    if (up.length === 2 || up.includes(i) || matched.includes(i)) return
    const n = [...up, i]
    setUp(n)
    if (n.length === 2) setTimeout(() => {
      if (deck[n[0]] === deck[n[1]]) setMatched((m) => [...m, ...n])
      setUp([])
    }, 750)
  }
  return (
    <div>
      <div className="mx-auto grid max-w-[320px] grid-cols-4 gap-2">
        {deck.map((b, i) => {
          const shown = up.includes(i) || matched.includes(i)
          const { c, h, name } = BTNS[b]
          return (
            <button key={i} onClick={() => flip(i)} aria-label={shown ? `Card ${i + 1}: ${name}` : `Card ${i + 1}: face down`} className={`flex aspect-square items-center justify-center rounded-lg border-[3px] border-charcoal ${shown ? 'bg-cream' : 'bg-sage'} ${matched.includes(i) ? 'opacity-60' : ''}`}>
              {shown && (
                <svg viewBox="0 0 40 40" width="70%" aria-hidden>
                  <circle cx="20" cy="20" r="17" fill={c} stroke="#403B36" strokeWidth="2.5" />
                  <circle cx="20" cy="20" r="11" fill="none" stroke="#403B36" strokeWidth="1.2" opacity=".4" />
                  {(h === 2 ? [[16, 20], [24, 20]] : [[16, 16], [24, 16], [16, 24], [24, 24]]).map(([x, y]) => <circle key={x + '' + y} cx={x} cy={y} r="1.8" fill="#403B36" />)}
                </svg>
              )}
            </button>
          )
        })}
      </div>
      {matched.length === deck.length && <Done>All matched. None of them were supposed to.</Done>}
      <Again onClick={() => (setDeck(shuffle([...BTNS.keys(), ...BTNS.keys()])), setUp([]), setMatched([]))} label="Shuffle" />
    </div>
  )
}

// ---- Paper Fortune Teller
const FLAPS = [['Rose', '#D4A5A5'], ['Sage', '#A3B18A'], ['Butter', '#F2D98D'], ['Burgundy', '#914F4F']]
const FORTUNES = [
  'Probably fine.', 'Eat something warm.', 'Someone is thinking of you, briefly and fondly.', 'A small good thing is closer than it looks.',
  'You will find a pen that works.', 'Not today, but soon. Possibly Thursday.', 'Drink some water. The oracle insists.', 'The answer is "probably fine." The oracle is limited.',
]
function Fortune() {
  const [colour, setColour] = useState<number | null>(null)
  const [num, setNum] = useState<number | null>(null)
  const f = colour !== null && num !== null ? FORTUNES[(colour * 3 + num * 5 + rnd(2)) % FORTUNES.length] : ''
  const fortune = useMemo(() => f, [colour, num]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="text-center">
      <p className="font-serif text-[15px]">{colour === null ? 'Pick a colour.' : num === null ? 'Now pick a number.' : 'The oracle has spoken:'}</p>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {colour === null && FLAPS.map(([n, c], i) => (
          <button key={n} onClick={() => setColour(i)} className="btn !justify-center" style={{ background: c, color: i === 3 ? '#F5EEDF' : undefined }}>{n}</button>
        ))}
        {colour !== null && num === null && [1, 2, 3, 4].map((n) => (
          <button key={n} onClick={() => setNum(n)} className="btn !justify-center !text-xl">{n}</button>
        ))}
      </div>
      {fortune && <Done>{fortune}</Done>}
      {colour !== null && <Again onClick={() => (setColour(null), setNum(null))} label="Ask again" />}
    </div>
  )
}

// ---- A Snail, Briefly
function Snail() {
  const [p, setP] = useState(0)
  const say = p === 0 ? 'The snail is at the start. It is not worried.' : p < 35 ? 'Progress. Technically.' : p < 70 ? 'Roughly halfway. No one is counting.' : p < 100 ? 'Nearly there. It has noticed.' : 'Arrived. It says it was always going to be fine.'
  return (
    <div>
      <div className="relative mt-2 h-[84px] rounded-lg border-[3px] border-charcoal bg-[#B9C6A0]">
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#8A9A6F]" aria-hidden />
        <div className="absolute bottom-2" style={{ left: `calc(${p * 0.78}% + 4px)`, transition: 'left .25s' }}><ObjectArt id="snail" size={56} /></div>
        <span className="absolute bottom-3 right-2 font-display text-sm text-burgundy" aria-hidden>FINISH</span>
      </div>
      <div role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100} aria-label="Snail progress" className="sr-only" />
      <p role="status" className="mt-3 text-center font-serif text-[15px]">{say}</p>
      <button className="btn btn-primary !flex mx-auto mt-3 w-fit" disabled={p >= 100} onClick={() => setP((v) => Math.min(100, v + 3))}>Nudge, gently</button>
      {p >= 100 && <Again onClick={() => setP(0)} label="Go again" />}
    </div>
  )
}

// ---- Pocket Moon: find the faint stars
function Stars() {
  const [stars] = useState(() => Array.from({ length: 7 }, () => ({ x: 6 + rnd(88), y: 6 + rnd(84) })))
  const [found, setFound] = useState<number[]>([])
  return (
    <div>
      <div className="relative mx-auto h-[220px] w-full max-w-[340px] overflow-hidden rounded-lg border-[3px] border-charcoal bg-charcoal">
        <div className="absolute right-4 top-3" aria-hidden><ObjectArt id="moon" size={44} /></div>
        {stars.map((s, i) => (
          <button key={i} aria-label={found.includes(i) ? 'A star you found' : 'A faint star'} onClick={() => setFound((f) => (f.includes(i) ? f : [...f, i]))}
            className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
            <i className={`block rotate-45 rounded-[1px] ${found.includes(i) ? 'h-3 w-3 bg-butter shadow-[0_0_10px_#F2D98D]' : 'h-1.5 w-1.5 bg-cream/40'}`} />
          </button>
        ))}
      </div>
      <p role="status" className="mt-3 text-center font-serif text-[15px]">{found.length === 7 ? 'All seven. They were there the whole time.' : `${found.length} of 7 stars found. They are shy.`}</p>
    </div>
  )
}

// ---- One Good Marble: tilt it into the dip
function Marble() {
  const SZ = 240, R = 11
  const [hole] = useState(() => ({ x: 40 + rnd(SZ - 80), y: 40 + rnd(SZ - 80) }))
  const [pos, setPos] = useState({ x: 24, y: 24 })
  const [done, setDone] = useState(false)
  const tilt = useRef({ x: 0, y: 0 })
  const v = useRef({ x: 0, y: 0 })
  useEffect(() => {
    if (done) return
    let raf = 0
    let p = { ...pos }
    const step = () => {
      v.current.x = (v.current.x + tilt.current.x * 0.22) * 0.975
      v.current.y = (v.current.y + tilt.current.y * 0.22) * 0.975
      p = { x: p.x + v.current.x, y: p.y + v.current.y }
      for (const k of ['x', 'y'] as const) {
        if (p[k] < R) { p[k] = R; v.current[k] *= -0.4 }
        if (p[k] > SZ - R) { p[k] = SZ - R; v.current[k] *= -0.4 }
      }
      setPos(p)
      if (Math.hypot(p.x - hole.x, p.y - hole.y) < 9 && Math.hypot(v.current.x, v.current.y) < 3.2) return setDone(true)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    const key = (down: boolean) => (e: KeyboardEvent) => {
      const m: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }
      if (!m[e.key]) return
      e.preventDefault()
      if (m[e.key][0]) tilt.current.x = down ? m[e.key][0] : 0
      if (m[e.key][1]) tilt.current.y = down ? m[e.key][1] : 0
    }
    const dn = key(true), up = key(false)
    document.addEventListener('keydown', dn)
    document.addEventListener('keyup', up)
    return () => { cancelAnimationFrame(raf); document.removeEventListener('keydown', dn); document.removeEventListener('keyup', up) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])
  const hold = (x: number, y: number) => ({
    onPointerDown: () => (tilt.current = { x, y }),
    onPointerUp: () => (tilt.current = { x: 0, y: 0 }),
    onPointerLeave: () => (tilt.current = { x: 0, y: 0 }),
    onKeyDown: (e: React.KeyboardEvent) => e.key === ' ' && (tilt.current = { x, y }),
    onKeyUp: () => (tilt.current = { x: 0, y: 0 }),
  })
  return (
    <div>
      <svg viewBox={`0 0 ${SZ} ${SZ}`} className="mx-auto w-full max-w-[260px] rounded-lg border-[3px] border-charcoal bg-[#E9DFC8]" role="img" aria-label="A wooden tray with a marble and a small dip. Tilt the tray with the arrow keys or buttons.">
        <circle cx={hole.x} cy={hole.y} r="13" fill="#403B36" opacity=".75" />
        <circle cx={pos.x} cy={pos.y} r={R} fill="#A3B18A" stroke="#403B36" strokeWidth="2" />
        <path d={`M${pos.x - 6} ${pos.y} Q${pos.x} ${pos.y - 6} ${pos.x + 6} ${pos.y - 1}`} stroke="#F5EEDF" strokeWidth="2.5" fill="none" />
      </svg>
      <div className="mx-auto mt-3 grid w-[150px] grid-cols-3 gap-1.5">
        {([[null], [ArrowUp, 0, -1, 'Tilt up'], [null], [ArrowLeft, -1, 0, 'Tilt left'], [ArrowDown, 0, 1, 'Tilt down'], [ArrowRight, 1, 0, 'Tilt right']] as const).map((b, i) => {
          if (b.length === 1) return <span key={i} />
          const [I, x, y, l] = b
          return <button key={i} className="btn !min-h-[44px] !px-0 touch-none" aria-label={l} {...hold(x, y)}><I size={18} aria-hidden /></button>
        })}
      </div>
      <p className="mt-2 text-center font-serif text-[13px] text-charcoal/75">Hold the arrows to tilt. Slow down over the dip.</p>
      {done && <Done>Settled. Nobody asked it to be anywhere else.</Done>}
      {done && <Again onClick={() => (v.current = { x: 0, y: 0 }, setPos({ x: 24, y: 24 }), setDone(false))} label="Roll again" />}
    </div>
  )
}

export const GAMES: Record<string, { title: string; blurb: string; Game: () => ReactNode }> = {
  maze: { title: 'Tiny Maze', blurb: 'Reach the flag. There is no timer. There is no rush.', Game: Maze },
  buttons: { title: 'Mystery Buttons', blurb: 'Find the pairs. None of them match, but some of them do.', Game: Buttons },
  fortune: { title: 'Paper Fortune Teller', blurb: 'Ask nothing in particular.', Game: Fortune },
  snail: { title: 'A Snail, Briefly', blurb: 'Help the snail across. Gently. It knows the way.', Game: Snail },
  moon: { title: 'Pocket Moon', blurb: 'Look at the sky for a while. Find the faint ones.', Game: Stars },
  marble: { title: 'One Good Marble', blurb: 'Tilt it into the dip. Do not make it mean anything.', Game: Marble },
}

export function MiniGame({ id, onClose }: { id: string; onClose: () => void }) {
  const g = GAMES[id]
  return (
    <Modal title={g.title} onClose={onClose} className="max-w-[400px]">
      <h2 className="pr-10 font-display text-2xl font-bold text-burgundy">{g.title}</h2>
      <p className="mb-3 font-serif text-[14px] text-charcoal/85">{g.blurb}</p>
      <g.Game />
      <button className="btn btn-primary !flex mx-auto mt-4 w-fit" onClick={onClose} data-autofocus>Back to the object</button>
    </Modal>
  )
}
