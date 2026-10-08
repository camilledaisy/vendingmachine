import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw } from 'lucide-react'
import { ObjectArt } from './ObjectArt'
import { Modal } from './Modal'
import { sfx } from '../lib/sound'

// Tiny, timer-free, can't-lose games for the Distraction (E05) objects.
// To add one: write a component here and register it in GAMES under the item id.

const rnd = (n: number) => Math.floor(Math.random() * n)
const pick = <T,>(xs: T[]) => xs[rnd(xs.length)]
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


// ---- Alphabet Soup: unscramble a cosy word
const WORDS = ['BLANKET', 'LANTERN', 'PORCH', 'COCOA', 'WINDOW', 'PILLOW', 'KETTLE', 'SUNDAY', 'MEADOW', 'BISCUIT', 'CANDLE', 'HAMMOCK', 'PUDDLE', 'LIBRARY', 'TEACUP', 'SLIPPER', 'RIVER', 'GARDEN', 'QUILT', 'MARMALADE']
function Scramble() {
  const make = (prev = '') => {
    let w = prev
    while (w === prev) w = WORDS[rnd(WORDS.length)]
    let order = shuffle(Array.from(w, (_, i) => i))
    while (order.length > 1 && order.map((i) => w[i]).join('') === w) order = shuffle(order)
    return { w, order }
  }
  const [{ w, order }, setRound] = useState(() => make())
  const [picked, setPicked] = useState<number[]>([])
  const [order2, setOrder2] = useState<number[] | null>(null)
  const pool = (order2 ?? order).filter((i) => !picked.includes(i))
  const answer = picked.map((i) => w[i]).join('')
  const won = answer === w
  const full = picked.length === w.length
  return (
    <div className="text-center">
      <div className="flex min-h-[52px] flex-wrap justify-center gap-1.5" aria-label="Your answer">
        {w.split('').map((_, k) => {
          const i = picked[k]
          return i === undefined ? (
            <span key={k} className="flex h-11 w-9 items-center justify-center rounded-md border-2 border-dashed border-charcoal/30" aria-hidden />
          ) : (
            <button key={k} onClick={() => !won && (sfx.tile(), setPicked((p) => p.filter((x) => x !== i)))} className={`tile ${won ? 'bg-sage' : 'bg-butter'}`} aria-label={`${w[i]}, in position ${k + 1}. Tap to take it back.`}>
              {w[i]}
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex min-h-[52px] flex-wrap justify-center gap-1.5 rounded-lg bg-charcoal/10 p-2" aria-label="Spilled letters">
        {pool.map((i) => (
          <button key={i} onClick={() => (sfx.tile(), setPicked((p) => [...p, i]))} className="tile bg-cream" aria-label={`Letter ${w[i]}`}>
            {w[i]}
          </button>
        ))}
      </div>
      <p role="status" className="mt-3 font-serif text-[15px]">{won ? 'Spelled. The soup approves.' : full ? 'Not quite. Tap a letter to take it back.' : `A ${w.length}-letter word, found in a cosy house.`}</p>
      <div className="mt-2 flex justify-center gap-2">
        <button className="btn" onClick={() => setOrder2(shuffle(order))} disabled={won}>Stir</button>
        <button className="btn" onClick={() => (setRound(make(w)), setPicked([]), setOrder2(null))}>New word</button>
      </div>
    </div>
  )
}

// ---- Five-Letter Word (gentle Wordle)
const FIVE = ['BREAD', 'CLOUD', 'PORCH', 'SMILE', 'BLINK', 'QUILT', 'MAPLE', 'HONEY', 'LEMON', 'RIVER', 'FLUTE', 'BERRY', 'DAISY', 'GLOBE', 'NIGHT', 'OCEAN', 'PEARL', 'SPOON', 'TOAST', 'MOSSY', 'SLEEP', 'CANDY', 'PLANT', 'SHEEP', 'STORM', 'BLOOM', 'FROST', 'HEART', 'LIGHT', 'WATER', 'SUGAR', 'PAPER', 'BRICK', 'TULIP', 'CHAIR']
const score = (g: string, t: string) => {
  const res: ('hit' | 'near' | 'miss')[] = Array(5).fill('miss')
  const left = [...t]
  g.split('').forEach((c, i) => c === t[i] && ((res[i] = 'hit'), (left[i] = '_')))
  g.split('').forEach((c, i) => {
    if (res[i] === 'hit') return
    const j = left.indexOf(c)
    if (j >= 0) ((res[i] = 'near'), (left[j] = '_'))
  })
  return res
}
function FiveLetter() {
  const [target, setTarget] = useState(() => pick(FIVE))
  const [guesses, setGuesses] = useState<string[]>([])
  const [cur, setCur] = useState('')
  const done = guesses.includes(target) || guesses.length >= 6
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (cur.length !== 5 || done) return
    setGuesses((g) => [...g, cur])
    setCur('')
  }
  const cls = { hit: 'bg-sage', near: 'bg-butter', miss: 'bg-cream' }
  const word = { hit: 'right place', near: 'wrong place', miss: 'not in the word' }
  return (
    <div className="text-center">
      <div className="mx-auto grid max-w-[260px] gap-1.5">
        {Array.from({ length: 6 }, (_, r) => {
          const g = guesses[r]
          const sc = g ? score(g, target) : null
          const letters = g ?? (r === guesses.length ? cur.padEnd(5) : '     ')
          return (
            <div key={r} className="grid grid-cols-5 gap-1.5" role="group" aria-label={g ? `Guess ${r + 1}: ${g}` : `Guess ${r + 1}`}>
              {letters.split('').map((c, i) => (
                <span key={i} className={`tile-static ${sc ? cls[sc[i]] : 'bg-cream/60'} ${sc ? 'flip' : ''}`} style={{ animationDelay: `${i * 90}ms` }} aria-label={sc ? `${c}, ${word[sc[i]]}` : undefined}>
                  {c.trim()}
                </span>
              ))}
            </div>
          )
        })}
      </div>
      {!done && (
        <form onSubmit={submit} className="mx-auto mt-3 flex max-w-[260px] gap-2">
          <input value={cur} onChange={(e) => setCur(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5))} maxLength={5} aria-label="Your five-letter guess" autoComplete="off" autoCapitalize="characters" spellCheck={false}
            className="min-w-0 flex-1 rounded-lg border-[3px] border-charcoal bg-cream px-3 py-2 text-center font-display text-lg tracking-[.3em]" />
          <button className="btn btn-primary !px-3" disabled={cur.length !== 5}>Guess</button>
        </form>
      )}
      <p role="status" className="mt-3 font-serif text-[14px]">
        {guesses.includes(target) ? 'Got it. Quietly impressive.' : guesses.length >= 6 ? `It was ${target}. Close enough.` : 'Green: right place. Yellow: wrong place. Any five letters are allowed.'}
      </p>
      {done && <Again onClick={() => (setTarget(pick(FIVE)), setGuesses([]), setCur(''))} label="New word" />}
    </div>
  )
}

// ---- Sliding Tile Puzzle
function Sliding() {
  const solved = [1, 2, 3, 4, 5, 6, 7, 8, 0]
  const scramble = () => {
    let t = [...solved]
    let prev = -1
    for (let k = 0; k < 90; k++) {
      const b = t.indexOf(0)
      const opts = [b - 3, b + 3, b % 3 ? b - 1 : -1, b % 3 < 2 ? b + 1 : -1].filter((i) => i >= 0 && i < 9 && i !== prev)
      const m = opts[rnd(opts.length)]
      ;[t[b], t[m]] = [t[m], t[b]]
      prev = b
    }
    return t
  }
  const [t, setT] = useState(scramble)
  const [moves, setMoves] = useState(0)
  const won = moves > 0 && t.every((v, i) => v === solved[i])
  const move = (i: number) => {
    const b = t.indexOf(0)
    const ok = (Math.abs(i - b) === 3) || (Math.abs(i - b) === 1 && (i / 3 | 0) === (b / 3 | 0))
    if (!ok || won) return
    sfx.tile()
    const n = [...t]
    ;[n[i], n[b]] = [n[b], n[i]]
    setT(n)
    setMoves((m) => m + 1)
  }
  const COL = ['#F5EEDF', '#A3B18A', '#F2D98D', '#D4A5A5']
  return (
    <div className="text-center">
      <div className="relative mx-auto aspect-square w-full max-w-[270px] rounded-lg border-[3px] border-charcoal bg-burgundy p-1.5">
        <div className="relative h-full w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => {
            const i = t.indexOf(v)
            return (
              <button key={v} onClick={() => move(i)} aria-label={`Tile ${v}, row ${(i / 3 | 0) + 1} column ${(i % 3) + 1}`}
                className="absolute flex items-center justify-center rounded-md border-2 border-charcoal font-display text-2xl font-bold text-charcoal transition-[left,top] duration-150"
                style={{ width: '31.5%', height: '31.5%', left: `${(i % 3) * 34.25}%`, top: `${(i / 3 | 0) * 34.25}%`, background: COL[(v + (v > 4 ? 1 : 0)) % 4] }}>
                {v}
              </button>
            )
          })}
        </div>
      </div>
      <p role="status" className="mt-3 font-serif text-[15px]">{won ? `In order. ${moves} moves. The gap is pleased.` : `Slide the tiles into order. Moves: ${moves}`}</p>
      <Again onClick={() => (setT(scramble()), setMoves(0))} label="New shuffle" />
    </div>
  )
}

// ---- Bubble Wrap
function Bubbles() {
  const N = 40
  const [popped, setPopped] = useState<Set<number>>(new Set())
  const done = popped.size === N
  return (
    <div className="text-center">
      <div className="mx-auto grid max-w-[300px] grid-cols-5 gap-2 rounded-xl border-[3px] border-charcoal bg-[#DCE8E8] p-3">
        {Array.from({ length: N }, (_, i) => (
          <button key={i} aria-label={popped.has(i) ? 'Popped bubble' : 'Bubble'} aria-pressed={popped.has(i)} onClick={() => !popped.has(i) && (sfx.pop(), setPopped((p) => new Set(p).add(i)))}
            className={`aspect-square rounded-full border-2 border-charcoal/70 transition-all duration-150 ${popped.has(i) ? 'scale-[.82] bg-[#C3D2D2] shadow-inner' : 'bg-[radial-gradient(circle_at_32%_28%,#fff,#E9F3F3_55%,#C9DADA)] shadow-[0_2px_0_rgba(64,59,54,.35)] hover:scale-105'}`} />
        ))}
      </div>
      <p role="status" className="mt-3 font-serif text-[15px]">{done ? 'All of them. Immensely satisfying. Unnecessary. Fine.' : `${popped.size} of ${N} popped.`}</p>
      <Again onClick={() => setPopped(new Set())} label="Fresh sheet" />
    </div>
  )
}

// ---- Four Small Bells: repeat the tune
const BELLS = [
  { n: 'Rose', c: '#D4A5A5', f: 523 },
  { n: 'Sage', c: '#A3B18A', f: 587 },
  { n: 'Butter', c: '#F2D98D', f: 659 },
  { n: 'Burgundy', c: '#914F4F', f: 784 },
]
function Bells() {
  const [seq, setSeq] = useState<number[]>([])
  const [pos, setPos] = useState(0)
  const [lit, setLit] = useState<number | null>(null)
  const [mode, setMode] = useState<'idle' | 'show' | 'play'>('idle')
  const [note, setNote] = useState('Press start. Listen, then say it back.')
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const at = (fn: () => void, ms: number) => void timers.current.push(window.setTimeout(fn, ms))
  const ring = (b: number) => (setLit(b), sfx.note(BELLS[b].f), at(() => setLit(null), 380))
  const show = (s: number[]) => {
    setMode('show'); setPos(0)
    s.forEach((b, i) => at(() => ring(b), 700 + i * 650))
    at(() => (setMode('play'), setNote('Your turn.')), 700 + s.length * 650)
  }
  const start = () => { const s = [rnd(4)]; setSeq(s); setNote('Listen…'); show(s) }
  const press = (b: number) => {
    if (mode !== 'play') return
    ring(b)
    if (b !== seq[pos]) { setNote('Close. Listen again.'); return show(seq) }
    if (pos + 1 < seq.length) return setPos(pos + 1)
    const next = [...seq, rnd(4)]
    setSeq(next); setMode('show'); setNote(`${seq.length} remembered. Listen…`)
    at(() => show(next), 800)
  }
  return (
    <div className="text-center">
      <div className="mx-auto grid max-w-[260px] grid-cols-2 gap-3">
        {BELLS.map((b, i) => (
          <button key={b.n} onClick={() => press(i)} disabled={mode !== 'play'} aria-label={`${b.n} bell`}
            className="aspect-square rounded-2xl border-[3px] border-charcoal transition-all duration-150 disabled:cursor-default"
            style={{ background: b.c, transform: lit === i ? 'scale(1.08)' : 'none', filter: lit === i ? 'brightness(1.25)' : 'brightness(.9)', boxShadow: lit === i ? `0 0 22px ${b.c}` : '0 4px 0 #403B36' }} />
        ))}
      </div>
      <p role="status" className="mt-3 font-serif text-[15px]">{note}</p>
      <button className="btn btn-primary !flex mx-auto mt-3 w-fit" onClick={start} disabled={mode === 'show'}>{seq.length ? 'Start over' : 'Start'}</button>
      <p className="mt-2 font-serif text-[12px] text-charcoal/70">Sound is optional: the bells light up too.</p>
    </div>
  )
}

// ---- Noughts and Crosses
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
const winner = (b: (string | null)[]) => {
  const l = LINES.find(([a, c, d]) => b[a] && b[a] === b[c] && b[a] === b[d])
  return l ? b[l[0]] : null
}
function Noughts() {
  const [b, setB] = useState<(string | null)[]>(Array(9).fill(null))
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('Your move. You are crosses.')
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  const w = winner(b)
  const over = !!w || b.every(Boolean)
  const machine = (cur: (string | null)[]) => {
    const free = cur.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0)
    const find = (who: string) => {
      for (const l of LINES) {
        const empty = l.find((i) => cur[i] === null)
        if (l.filter((i) => cur[i] === who).length === 2 && empty !== undefined) return empty
      }
    }
    let m = Math.random() < 0.2 ? undefined : find('O') ?? find('X')
    if (m === undefined) m = cur[4] === null && Math.random() < 0.7 ? 4 : free[rnd(free.length)]
    return m
  }
  const play = (i: number) => {
    if (b[i] || busy || over) return
    sfx.tile()
    const n = [...b]; n[i] = 'X'
    setB(n)
    if (winner(n)) return setMsg('You win. I let you. (I did not.)')
    if (n.every(Boolean)) return setMsg('A draw. Dignified for everyone.')
    setBusy(true); setMsg('Thinking. Politely.')
    timer.current = window.setTimeout(() => {
      const m = machine(n); const n2 = [...n]; n2[m] = 'O'
      setB(n2); setBusy(false); sfx.tile()
      setMsg(winner(n2) ? 'I win. This is awkward for both of us.' : n2.every(Boolean) ? 'A draw. Dignified for everyone.' : 'Your move.')
    }, 650)
  }
  return (
    <div className="text-center">
      <div className="mx-auto grid max-w-[240px] grid-cols-3 gap-1.5 rounded-lg bg-charcoal p-1.5">
        {b.map((v, i) => (
          <button key={i} onClick={() => play(i)} aria-label={`Row ${(i / 3 | 0) + 1}, column ${(i % 3) + 1}: ${v === 'X' ? 'cross' : v === 'O' ? 'nought' : 'empty'}`}
            className="flex aspect-square items-center justify-center rounded bg-cream font-display text-4xl font-bold hover:bg-butter/60">
            {v && <span className="pop" style={{ color: v === 'X' ? '#914F4F' : '#6F8560' }}>{v === 'X' ? '✕' : '○'}</span>}
          </button>
        ))}
      </div>
      <p role="status" className="mt-3 font-serif text-[15px]">{msg}</p>
      <Again onClick={() => (clearTimeout(timer.current), setB(Array(9).fill(null)), setBusy(false), setMsg('Your move. You are crosses.'))} label="New game" />
    </div>
  )
}

export const GAMES: Record<string, { title: string; blurb: string; Game: () => ReactNode }> = {
  maze: { title: 'Tiny Maze', blurb: 'Reach the flag. There is no timer. There is no rush.', Game: Maze },
  buttons: { title: 'Mystery Buttons', blurb: 'Find the pairs. None of them match, but some of them do.', Game: Buttons },
  fortune: { title: 'Paper Fortune Teller', blurb: 'Ask nothing in particular.', Game: Fortune },
  snail: { title: 'A Snail, Briefly', blurb: 'Help the snail across. Gently. It knows the way.', Game: Snail },
  moon: { title: 'Pocket Moon', blurb: 'Look at the sky for a while. Find the faint ones.', Game: Stars },
  soup: { title: 'Alphabet Soup', blurb: 'Put the spilled letters back in order. A cosy word is hiding.', Game: Scramble },
  wordtiles: { title: 'Five-Letter Word', blurb: 'Guess the word in six tries. There are no wrong guesses, only data.', Game: FiveLetter },
  sliding: { title: 'Sliding Tiles', blurb: 'Slide the tiles into order. There is no timer.', Game: Sliding },
  bubbles: { title: 'Bubble Wrap', blurb: 'Pop them. There is no wrong order.', Game: Bubbles },
  bells: { title: 'Four Small Bells', blurb: 'Listen to the tune, then play it back. It gets one bell longer each time.', Game: Bells },
  noughts: { title: 'Noughts and Crosses', blurb: 'A friendly game against the machine. It is not very good, on purpose.', Game: Noughts },
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
