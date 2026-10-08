import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig, useReducedMotion } from 'motion/react'
import { Receipt, Library, Volume2, VolumeX, Feather } from 'lucide-react'
import { ITEMS, type Item } from './data/items'
import { useSaved } from './lib/store'
import { setSoundEnabled } from './lib/sound'
import { VendingMachine } from './components/VendingMachine'
import { CollectionShelf } from './components/CollectionShelf'
import { MaintenanceLog } from './components/MaintenanceLog'
import { ReceiptGenerator } from './components/ReceiptGenerator'
import { HatchNote } from './components/HatchNote'
import { Flyer, Topiary } from './components/Scenery'

type Panel = 'shelf' | 'log' | 'hatch' | 'receipt' | null

const dust = Array.from({ length: 14 }, (_, i) => ({ left: (i * 37 + 11) % 100, top: 20 + ((i * 53) % 70), d: 9 + (i % 5) * 3, delay: -(i * 1.7), s: 2 + (i % 3) }))

export default function App() {
  const { saved, update, storageOk, collect, toggleFav, move } = useSaved()
  const systemReduced = useReducedMotion()
  const reduced = saved.calm ?? !!systemReduced
  const [panel, setPanel] = useState<Panel>(null)
  const [visit, setVisit] = useState<string[]>([])
  const birthday = useMemo(() => {
    const d = new Date()
    return (d.getMonth() === 9 && d.getDate() === 12) || /party/.test(location.search)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('calm', reduced)
  }, [reduced])
  useEffect(() => setSoundEnabled(saved.sound), [saved.sound])

  const onCollect = (item: Item) => {
    const isNew = !saved.owned[item.id]
    collect(item.id)
    setVisit((v) => [...v, item.id])
    return isNew
  }
  const close = () => setPanel(null)
  const found = Object.keys(saved.owned).length

  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
      <div className="scene relative min-h-screen overflow-x-hidden pb-24">
        {!reduced && (
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {dust.map((p, i) => (
              <i key={i} className="dust" style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.s, height: p.s, animationDuration: `${p.d}s`, animationDelay: `${p.delay}s` }} />
            ))}
          </div>
        )}

        <header className="relative z-10 px-4 pb-12 pt-5 text-center">
          <h1 className="paper mx-auto inline-block max-w-[92vw] -rotate-[0.6deg] border-[3px] border-burgundy px-5 py-3 font-display text-[22px] font-bold leading-tight tracking-wide text-charcoal shadow-[4px_5px_0_rgba(64,59,54,.3)] sm:text-4xl md:text-[36px]">
            THE EMOTIONAL VENDING MACHINE
          </h1>
          <p className="mt-3 font-hand text-[28px] font-bold leading-none text-charcoal md:text-[32px]">“Some things you need aren’t sold in stores.”</p>
        </header>

        <main className="relative z-10 px-3">
          <div className="relative mx-auto max-w-[580px]">
            <div className="absolute -right-[84px] bottom-0 hidden lg:block" aria-hidden>
              <Topiary />
            </div>
            <div className="absolute -left-[130px] top-[170px] hidden lg:block">
              <Flyer />
            </div>
            <VendingMachine
              owned={saved.owned}
              favs={saved.favs}
              reduced={reduced}
              birthday={birthday}
              onCollect={onCollect}
              onToggleFav={toggleFav}
              onOpenLog={() => setPanel('log')}
              onOpenHatch={() => setPanel('hatch')}
            />
          </div>

          <p className="mx-auto mt-5 max-w-[34rem] text-center font-serif text-[15px] font-medium text-charcoal">
            Open 24 hours. No money required. No refunds on existential realizations.
          </p>

          <nav aria-label="Machine extras" className="mx-auto mt-5 flex max-w-[600px] flex-wrap justify-center gap-2.5">
            <button className="btn btn-primary" onClick={() => setPanel('shelf')}>
              <Library size={17} aria-hidden /> MY LITTLE SHELF
              <span className="rounded-full bg-cream px-2 font-display text-xs text-burgundy" aria-label={`${found} of ${ITEMS.length} discovered`}>
                {found}/{ITEMS.length}
              </span>
            </button>
            <button className="btn" onClick={() => setPanel('receipt')}>
              <Receipt size={17} aria-hidden /> Guest receipt
            </button>
            <button className="btn" aria-pressed={saved.sound} onClick={() => update((s) => ({ ...s, sound: !s.sound }))}>
              {saved.sound ? <Volume2 size={17} aria-hidden /> : <VolumeX size={17} aria-hidden />} Sound: {saved.sound ? 'on' : 'off'}
            </button>
            <button className="btn" aria-pressed={reduced} onClick={() => update((s) => ({ ...s, calm: !reduced }))}>
              <Feather size={17} aria-hidden /> Calm motion: {reduced ? 'on' : 'off'}
            </button>
          </nav>

          {!storageOk && (
            <p role="alert" className="mx-auto mt-4 max-w-md rounded-lg border-2 border-burgundy bg-cream p-2 text-center font-serif text-sm text-burgundy">
              This browser won’t let me keep your shelf between visits. Your objects will vanish when you close the tab. The machine is sorry.
            </p>
          )}

          <footer className="mx-auto mt-8 max-w-md text-center font-serif text-[13px] leading-relaxed text-charcoal/85">
            A small thing made with care. I don’t know what you’re going through. I am a vending machine. If today is heavier than a vending machine can carry, a person can carry it better. Please talk to one.
          </footer>
        </main>

        <AnimatePresence>
          {panel === 'shelf' && <CollectionShelf key="shelf" owned={saved.owned} order={saved.order} favs={saved.favs} onMove={move} onToggleFav={toggleFav} onClose={close} />}
          {panel === 'log' && <MaintenanceLog key="log" onClose={close} />}
          {panel === 'hatch' && <HatchNote key="hatch" onClose={close} />}
          {panel === 'receipt' && <ReceiptGenerator key="receipt" visit={visit} onClose={close} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
