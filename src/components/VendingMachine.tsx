import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Wrench } from 'lucide-react'
import { CATEGORIES, ITEMS, catOf, type CatId, type Item } from '../data/items'
import { DELIVERED_LINES, PLAYFUL_LINES, SELECT_HINTS } from '../data/text'
import { sfx } from '../lib/sound'
import { MachineDisplay } from './MachineDisplay'
import { CategorySelector } from './CategorySelector'
import { DispensingAnimation, type Pt } from './DispensingAnimation'
import { CollectibleCard } from './CollectibleCard'
import { ParcelUnwrap } from './ParcelUnwrap'
import { ObjectArt } from './ObjectArt'
import { Cat, PartyHat } from './Scenery'

type Phase = 'boot' | 'idle' | 'choosing' | 'dispensing' | 'delivered' | 'revealed'
type Msg = readonly [string, string?]

interface Props {
  owned: Record<string, number>
  favs: string[]
  reduced: boolean
  birthday: boolean
  onCollect: (item: Item) => boolean // returns true if it's a new object
  onToggleFav: (id: string) => void
  onOpenLog: () => void
  onOpenHatch: () => void
}

const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]

export function VendingMachine({ owned, favs, reduced, birthday, onCollect, onToggleFav, onOpenLog, onOpenHatch }: Props) {
  const [phase, setPhase] = useState<Phase>('boot')
  const [sel, setSel] = useState<CatId | null>(null)
  const [msg, setMsg] = useState<Msg>(['WARMING UP...', 'Please hold.'])
  const [err, setErr] = useState(false)
  const [item, setItem] = useState<Item | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [fall, setFall] = useState<{ from: Pt; to: Pt } | null>(null)
  const [taken, setTaken] = useState<CatId | null>(null)
  const [trayOpen, setTrayOpen] = useState(false)
  const [announce, setAnnounce] = useState('')
  const [parcel, setParcel] = useState(false) // F06 hands over a wrapped parcel
  const [opened, setOpened] = useState(false)
  const [purr, setPurr] = useState(false)
  const parcelRef = useRef(false)
  const root = useRef<HTMLDivElement>(null)
  const tray = useRef<HTMLDivElement>(null)
  const cells = useRef<Partial<Record<CatId, HTMLButtonElement | null>>>({})
  const trayBtn = useRef<HTMLButtonElement>(null)
  const timers = useRef<number[]>([])
  const last = useRef('')
  const later = (fn: () => void, ms: number) => void timers.current.push(window.setTimeout(fn, ms))
  const say = (a: string, b = '') => setMsg([a, b])
  const ownedCount = Object.keys(owned).length

  useEffect(() => {
    later(() => {
      setPhase('idle')
      say(ownedCount ? 'Welcome back.' : 'Good evening. Or morning.', ownedCount ? 'I haven’t moved.' : 'I wouldn’t know.')
    }, reduced ? 200 : 1300)
    return () => timers.current.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (phase === 'delivered') trayBtn.current?.focus()
  }, [phase])

  const wake = () => {
    if (phase !== 'idle') return
    setPhase('choosing')
    sfx.click()
    say('What do you need today?', 'Choose a compartment.')
    setAnnounce('The machine is awake. What do you need today? Six compartments are available.')
  }

  const select = (id: CatId) => {
    if (phase === 'boot' || phase === 'dispensing' || phase === 'revealed') return
    if (phase === 'delivered') return say('Please collect your item first.', 'It is in the tray. I am not a storage facility.')
    if (phase === 'idle') setPhase('choosing')
    const c = catOf(id)
    setSel(id)
    sfx.click()
    say(`${c.code} — ${c.label}`, c.quip)
    setAnnounce(`${c.code}, ${c.label}, selected. Press Dispense when ready.`)
  }

  const choose = (cat: CatId | null): Item => {
    const all = cat ? ITEMS.filter((i) => i.cat === cat) : ITEMS
    const fresh = all.filter((i) => !owned[i.id])
    let pool = fresh.length && Math.random() < 0.7 ? fresh : all
    if (pool.length > 1) pool = pool.filter((i) => i.id !== last.current)
    return pick(pool)
  }

  const dispense = () => {
    if (phase === 'boot' || phase === 'dispensing' || phase === 'revealed') return
    if (phase === 'delivered') return say('Please collect your item first.', 'It is in the tray.')
    if (!sel) {
      if (phase === 'idle') setPhase('choosing')
      const [a, b] = pick(SELECT_HINTS)
      return say(a, b)
    }
    const isParcel = sel === 'F'
    parcelRef.current = isParcel
    setParcel(isParcel)
    setOpened(false)
    const it = choose(isParcel ? null : sel)
    last.current = it.id
    setItem(it)
    setPhase('dispensing')
    setErr(false)
    sfx.whirr()
    setAnnounce('Dispensing. Please hold.')

    const glitch = Math.random() < 0.1 || /glitch/.test(location.search)
    let t = 0
    if (glitch) {
      say('ERROR: TOO MANY FEELINGS.', 'Please stand by.')
      setErr(true)
      later(() => {
        setErr(false)
        say("Just kidding. We're fine.", 'Resuming.')
      }, reduced ? 1200 : 1700)
      t = reduced ? 2300 : 3100
    }
    const a: readonly string[] = isParcel ? ['Neither do I.', "Let's find out."] : pick(PLAYFUL_LINES)
    const b: readonly string[] = isParcel ? ['Wrapping something up.', 'Please do not look.'] : pick(PLAYFUL_LINES.filter((l) => l !== a))
    const step = reduced ? 0.5 : 1
    later(() => say(a[0], a[1]), t)
    later(() => {
      say(b[0], b[1])
      const cell = cells.current[sel]
      const trayEl = tray.current
      if (!reduced && cell && trayEl && root.current) {
        const r = root.current.getBoundingClientRect()
        const c = cell.getBoundingClientRect()
        const tr = trayEl.getBoundingClientRect()
        setFall({ from: { x: c.left - r.left + c.width / 2, y: c.top - r.top + c.height / 2 - 6 }, to: { x: tr.left - r.left + tr.width / 2, y: tr.top - r.top + 14 } })
      }
      setTaken(sel)
      if (reduced) later(land, 400)
    }, t + 1000 * step)
  }

  function land() {
    setFall(null)
    sfx.clunk()
    setTrayOpen(true)
    const d: readonly string[] = parcelRef.current ? ['One parcel, contents unknown.', 'Even to me. Mostly.'] : pick(DELIVERED_LINES)
    say(d[0], d[1])
    later(() => {
      setPhase('delivered')
      setAnnounce(`Your item is in the tray. Activate "Collect item" to take it.`)
    }, reduced ? 100 : 500)
  }

  const collect = () => {
    if (!item) return
    setPhase('revealed')
    if (parcel) return setAnnounce('You pick up the parcel. Activate "Pull the string" to open it.')
    reveal(item)
  }

  const reveal = (it: Item) => {
    setIsNew(onCollect(it))
    setOpened(true)
    sfx.chime()
    setAnnounce(`You received ${it.name}. ${it.message}`)
  }

  const closeCard = () => {
    setPhase('choosing')
    setSel(null)
    setItem(null)
    setTaken(null)
    setParcel(false)
    setOpened(false)
    setTrayOpen(false)
    say('Thank you for visiting.', 'I hope the rest of your day is at least moderately pleasant.')
    later(() => cells.current.A?.focus(), 60)
  }

  const busy = phase === 'dispensing' || phase === 'delivered' || phase === 'revealed' || phase === 'boot'
  const awake = phase !== 'boot' && phase !== 'idle'

  return (
    <div
      ref={root}
      className="relative mx-auto w-full max-w-[580px]"
      onClick={(e) => !(e.target as HTMLElement).closest('button,a') && wake()}
    >
      <button
        className="absolute -top-[50px] left-6 z-10 cursor-pointer md:left-10"
        aria-label="A sleeping cat"
        onClick={() => {
          say('The cat is not part of the inventory.', 'Please do not ask. It has been tried.')
          setPurr(true)
          later(() => setPurr(false), 1800)
        }}
      >
        <span className={`block ${purr ? 'purr' : ''}`}>
          <Cat />
        </span>
        {purr && [0, 0.35, 0.7].map((d, i) => (
          <i key={i} aria-hidden className="heart-float not-italic" style={{ left: 62 + i * 12, ['--d' as string]: `${d}s` }}>♥</i>
        ))}
      </button>
      {birthday && <PartyHat className="absolute -top-[34px] right-[18%] z-10 rotate-6" />}

      <div className="flex">
        <div className="machine-body paper-overlay relative min-w-0 flex-1 rounded-tl-[26px] border-[4px] border-r-0 border-charcoal bg-sage p-3 md:p-4">
          {/* sign strip */}
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="rounded-md border-2 border-charcoal bg-burgundy px-2.5 py-1 font-display text-[13px] font-bold tracking-wider text-cream md:text-sm">FEELINGS &amp; CO.</span>
            <span role="img" aria-label="Open sign" className="open-sign flex items-center gap-1.5 rounded-full border-2 border-charcoal bg-cream px-3 py-0.5 font-display text-[13px] font-bold tracking-widest text-burgundy">
              <i className="open-dot h-2 w-2 rounded-full bg-burgundy" /> OPEN
            </span>
          </div>

          <div className={err ? 'shake' : ''}>
            <MachineDisplay lines={msg} error={err} asleep={phase === 'idle'} onWake={wake} instant={reduced} />
          </div>

          <div className="mt-2.5 flex flex-col items-stretch gap-2.5 md:mt-3 md:flex-row md:gap-3">
            <CategorySelector
              selected={sel}
              taken={taken}
              vending={phase === 'dispensing' && !taken}
              awake={awake || phase === 'idle'}
              locked={busy}
              onSelect={select}
              setRef={(id, el) => (cells.current[id] = el)}
            />
            {/* control panel */}
            <div className="panel flex shrink-0 items-center gap-3 rounded-lg border-[3px] border-charcoal bg-cream p-2 md:w-[132px] md:flex-col md:gap-2.5">
              <span className="hidden font-display text-[11px] font-bold tracking-widest text-charcoal md:block">SELECT</span>
              <div className="hidden grid-cols-2 gap-1.5 md:grid" aria-hidden>
                {CATEGORIES.map((c) => (
                  <button key={c.id} tabIndex={-1} onClick={() => select(c.id)} className={`key ${sel === c.id ? 'key-on' : ''}`}>
                    {c.code}
                  </button>
                ))}
              </div>
              <div className="hidden w-full text-center md:block">
                <div className="mx-auto h-[7px] w-10 rounded-full border-2 border-charcoal bg-charcoal shadow-[inset_0_2px_0_rgba(0,0,0,.6)]" aria-hidden />
                <span className="mt-1 block font-display text-[10px] leading-tight text-charcoal/80">COINS: NOT REQUIRED</span>
              </div>
              <button className="dispense w-full md:mt-auto" onClick={dispense} aria-disabled={!sel || busy} aria-describedby="dispense-help">
                DISPENSE
              </button>
              <span id="dispense-help" className="sr-only">
                Choose a compartment first.
              </span>
              <button onClick={onOpenHatch} aria-label="A small hatch" className="hatch hidden md:block" />
            </div>
          </div>

          {/* tray */}
          <div ref={tray} className="tray relative mt-2.5 h-[68px] overflow-hidden md:mt-3 md:h-[70px] rounded-lg border-[3px] border-charcoal bg-charcoal">
            {trayOpen && phase !== 'revealed' && [0, 1, 2, 3, 4].map((i) => (
              <i key={i} aria-hidden className="puff" style={{ left: `${18 + i * 16}%`, ['--d' as string]: `${i * 0.08}s`, ['--x' as string]: `${(i - 2) * 8}px` }} />
            ))}
            <AnimatePresence>
              {phase === 'delivered' && item && (
                <motion.button
                  ref={trayBtn}
                  key="tray-item"
                  onClick={collect}
                  initial={{ y: -30, opacity: 0, scale: 0.7 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-0.5 rounded-md"
                  aria-label={`Collect item: ${parcel ? 'mystery parcel' : item.name}`}
                >
                  <span className={reduced ? '' : 'bob'}>
                    <ObjectArt id={parcel ? 'parcel' : item.id} size={56} />
                  </span>
                  <span className="rounded bg-butter px-2 font-display text-[11px] font-bold text-charcoal">CLICK TO COLLECT</span>
                </motion.button>
              )}
            </AnimatePresence>
            <motion.div
              aria-hidden
              className="tray-flap absolute inset-0 z-20 flex items-center justify-center font-display text-xs tracking-[.3em] text-cream/70"
              style={{ transformOrigin: 'top', transformPerspective: 500, pointerEvents: 'none' }}
              animate={reduced ? { opacity: trayOpen ? 0 : 1 } : { rotateX: trayOpen ? -88 : 0, opacity: trayOpen ? [1, 1, 0] : 1 }}
              transition={{ duration: reduced ? 0.15 : 0.6, ease: 'easeOut' }}
            >
              PUSH
            </motion.div>
          </div>

          {/* kick plate with the note */}
          <div className="kick mt-2.5 flex items-center justify-center rounded-md border-[3px] border-charcoal px-2 pb-2 pt-3.5 md:px-3 md:pb-2.5 md:pt-4">
            <p className="note relative rotate-[-2deg] px-6 pb-3 pt-4 text-center font-note text-[21px] leading-[1.1] text-charcoal md:text-[22px]">
              <span className="pin" aria-hidden />
              Please be gentle with the machine.
              <br />
              It is doing <span className="squiggle">its best.</span>
            </p>
          </div>
        </div>

        {/* side of the machine */}
        <div className="machine-side relative w-[26px] shrink-0 rounded-tr-[10px] border-[4px] border-charcoal md:w-[34px]">
          <button onClick={onOpenLog} aria-label="Maintenance button: open the maintenance log" className="maint absolute left-1/2 top-[38%] flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-charcoal bg-butter md:h-7 md:w-7">
            <Wrench size={12} aria-hidden className="text-charcoal" />
          </button>
        </div>
      </div>
      <div className="flex justify-between px-5" aria-hidden>
        <i className="h-3 w-12 rounded-b bg-charcoal" />
        <i className="h-3 w-12 rounded-b bg-charcoal" />
      </div>

      {fall && sel && <DispensingAnimation art={parcel ? 'parcel' : catItemArt(item)} from={fall.from} to={fall.to} onLand={land} />}
      <AnimatePresence>
        {phase === 'revealed' && item && parcel && !opened && <ParcelUnwrap key="parcel" reduced={reduced} onOpen={() => reveal(item)} />}
        {phase === 'revealed' && item && (!parcel || opened) && (
          <CollectibleCard item={item} isNew={isNew} fav={favs.includes(item.id)} onFav={() => onToggleFav(item.id)} onClose={closeCard} />
        )}
      </AnimatePresence>
      <div role="status" aria-live="polite" className="sr-only">
        {announce}
      </div>
    </div>
  )
}

const catItemArt = (it: Item | null) => it?.id ?? 'star'
