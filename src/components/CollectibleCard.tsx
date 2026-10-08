import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Download, Gamepad2, Heart, Sparkles } from 'lucide-react'
import { catOf, type Item } from '../data/items'
import { cardSvg, saveImage } from '../lib/image'
import { ObjectArt } from './ObjectArt'
import { Modal } from './Modal'
import { GAMES, MiniGame } from './MiniGames'

interface Props {
  item: Item
  isNew?: boolean
  fav: boolean
  onFav: () => void
  onClose: () => void
  closeLabel?: string
  extra?: ReactNode
}

export function CollectibleCard({ item, isNew, fav, onFav, onClose, closeLabel = 'Back to the machine', extra }: Props) {
  const cat = catOf(item.cat)
  const [status, setStatus] = useState('')
  const [playing, setPlaying] = useState(false)

  const save = async () => {
    setStatus('Developing the picture…')
    try {
      await saveImage(await cardSvg(item), `${item.id}-emotional-vending-machine.png`)
      setStatus('Saved. It looks lovely.')
    } catch {
      setStatus('The machine could not make the image. It apologises.')
    }
  }

  return (
    <>
    <Modal title={`${item.name}. ${item.message}`} onClose={onClose} bare className="max-w-[390px]">
      <motion.article
        initial={{ scale: 0.3, y: 240, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 170, damping: 17 }}
        className="paper relative rounded-2xl border-[3px] border-charcoal p-4 shadow-[0_12px_0_rgba(64,59,54,.35)]"
      >
        <div className="rounded-xl border-2 border-dashed border-burgundy/60 p-3">
          <div className="flex items-center justify-between font-display text-[13px] text-burgundy">
            <span>
              {cat.code} · {cat.label.length > 22 ? cat.id + ' collection' : cat.label}
            </span>
            <span>No. {item.inv}</span>
          </div>
          <div className="card-art relative mt-3 flex overflow-visible items-center justify-center rounded-lg border-2 border-charcoal bg-sage py-5">
            {item.image ? (
              <img src={item.image} alt={item.name} className="max-h-[360px] w-auto max-w-[92%] -rotate-1 rounded border-[6px] border-cream bg-cream object-contain shadow-md" />
            ) : (
              <ObjectArt id={item.id} name={item.name} size={168} className="float" />
            )}
            <span className="sheen" aria-hidden />
            {isNew &&
              ['✦', '✧', '✦', '✧', '✦', '✧', '✦', '✧', '✦', '✧'].map((c, i) => (
                <i key={i} aria-hidden className="spark not-italic" style={{ ['--x' as string]: `${Math.cos(i * 0.628) * 120}px`, ['--y' as string]: `${Math.sin(i * 0.628) * 90}px`, ['--d' as string]: `${0.25 + (i % 3) * 0.08}s`, color: i % 2 ? '#D4A5A5' : '#F2D98D' }}>{c}</i>
              ))}
            {isNew && (
              <span className="stamp absolute right-2 top-2 flex rotate-6 items-center gap-1 rounded border-2 border-burgundy bg-cream px-1.5 py-0.5 font-display text-xs font-bold text-burgundy">
                <Sparkles size={12} aria-hidden /> NEW
              </span>
            )}
          </div>
          {item.image ? (
            <h2 className="sr-only">
              {item.name}. {item.message}
            </h2>
          ) : (
            <>
              <h2 className="mt-4 text-center font-display text-[26px] font-bold leading-tight text-charcoal">{item.name}</h2>
              <p className="mt-2 text-center font-serif text-[19px] font-medium italic leading-snug text-charcoal">“{item.message}”</p>
              <p className="mt-3 text-center font-serif text-[14px] leading-snug text-charcoal/80">{item.description}</p>
            </>
          )}
        </div>
        {extra}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button className="btn" onClick={onFav} aria-pressed={fav}>
            <Heart key={String(fav)} size={16} aria-hidden fill={fav ? '#914F4F' : 'none'} className={fav ? 'pop' : ''} /> {fav ? 'Favourited' : 'Favourite'}
          </button>
          {GAMES[item.id] && (
            <button className="btn" onClick={() => setPlaying(true)}>
              <Gamepad2 size={16} aria-hidden /> Play with it
            </button>
          )}
          <button className="btn" onClick={save}>
            <Download size={16} aria-hidden /> Save image
          </button>
          <button className="btn btn-primary" onClick={onClose} data-autofocus>
            {closeLabel}
          </button>
        </div>
        <p role="status" className="mt-2 min-h-[1.25rem] text-center font-serif text-sm text-charcoal/80">
          {status}
        </p>
      </motion.article>
    </Modal>
    <AnimatePresence>{playing && <MiniGame id={item.id} onClose={() => setPlaying(false)} />}</AnimatePresence>
    </>
  )
}
