import { useState } from 'react'
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react'
import { ITEMS, byId } from '../data/items'
import { ObjectArt } from './ObjectArt'
import { Modal } from './Modal'
import { CollectibleCard } from './CollectibleCard'

const PER_ROW = 4

interface Props {
  owned: Record<string, number>
  order: string[]
  favs: string[]
  onMove: (from: number, to: number) => void
  onToggleFav: (id: string) => void
  onClose: () => void
}

export function CollectionShelf({ owned, order, favs, onMove, onToggleFav, onClose }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [drag, setDrag] = useState<number | null>(null)
  const [over, setOver] = useState<number | null>(null)
  const slots = Math.max(8, Math.ceil((order.length + 1) / PER_ROW) * PER_ROW)
  const rows = Array.from({ length: slots / PER_ROW }, (_, r) => Array.from({ length: PER_ROW }, (_, c) => r * PER_ROW + c))
  const open = openId ? byId(openId) : null
  const idx = openId ? order.indexOf(openId) : -1

  return (
    <>
      <Modal title="My Little Shelf" onClose={onClose} className="max-w-[560px]">
        <h2 className="pr-10 font-display text-3xl font-bold text-burgundy">My Little Shelf</h2>
        <p className="font-serif text-[15px] text-charcoal/85" aria-live="polite">
          <strong>{order.length}</strong> of {ITEMS.length} objects discovered. No rush. Nothing here expires.
        </p>

        <div className="shelf-unit mt-4 rounded-xl border-[3px] border-charcoal p-3">
          {order.length === 0 && (
            <p className="mb-3 rounded-lg bg-cream/90 p-3 text-center font-serif text-[15px] text-charcoal">
              The shelf is empty. This is not a criticism. Anything you collect from the machine will be kept here.
            </p>
          )}
          {rows.map((row, r) => (
            <div key={r} className="mb-1 last:mb-0">
              <div className="flex min-h-[84px] items-end justify-around gap-1 pb-0.5">
                {row.map((i) => {
                  const id = order[i]
                  return id ? (
                    <button
                      key={id}
                      draggable
                      onDragStart={() => setDrag(i)}
                      onDragOver={(e) => (e.preventDefault(), setOver(i))}
                      onDragEnd={() => (setDrag(null), setOver(null))}
                      onDrop={() => (drag !== null && onMove(drag, i), setDrag(null), setOver(null))}
                      onClick={() => setOpenId(id)}
                      aria-label={`${byId(id)!.name}${favs.includes(id) ? ', favourite' : ''}${owned[id] > 1 ? `, received ${owned[id]} times` : ''}`}
                      className={`shelf-item relative flex h-[78px] w-[78px] items-end justify-center rounded-lg ${over === i && drag !== i ? 'bg-butter/60' : ''} ${drag === i ? 'opacity-40' : ''}`}
                    >
                      <ObjectArt id={id} size={70} />
                      {favs.includes(id) && <Heart size={15} aria-hidden fill="#914F4F" className="absolute right-0 top-0 text-burgundy" />}
                      {owned[id] > 1 && <span className="absolute bottom-0 right-0 rounded bg-charcoal px-1 font-display text-[10px] text-cream">×{owned[id]}</span>}
                    </button>
                  ) : (
                    <span
                      key={`e${i}`}
                      aria-hidden
                      onDragOver={(e) => (e.preventDefault(), setOver(i))}
                      onDrop={() => (drag !== null && onMove(drag, order.length - 1), setDrag(null), setOver(null))}
                      className="h-[78px] w-[78px] rounded-lg border-2 border-dashed border-charcoal/15"
                    />
                  )
                })}
              </div>
              <div className="plank h-3 rounded-sm border-2 border-charcoal" aria-hidden />
            </div>
          ))}
        </div>
        {order.length > 1 && <p className="mt-3 text-center font-serif text-[13px] text-charcoal/75">Drag to rearrange, or open an object and use the arrows.</p>}
      </Modal>

      {open && (
        <CollectibleCard
          item={open}
          fav={favs.includes(open.id)}
          onFav={() => onToggleFav(open.id)}
          onClose={() => setOpenId(null)}
          closeLabel="Back to the shelf"
          extra={
            <div className="mt-3 flex justify-center gap-2">
              <button className="btn" disabled={idx <= 0} onClick={() => onMove(idx, idx - 1)}>
                <ArrowLeft size={16} aria-hidden /> Move left
              </button>
              <button className="btn" disabled={idx >= order.length - 1} onClick={() => onMove(idx, idx + 1)}>
                Move right <ArrowRight size={16} aria-hidden />
              </button>
            </div>
          }
        />
      )}
    </>
  )
}
