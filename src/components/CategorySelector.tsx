import { CATEGORIES, type CatId } from '../data/items'
import { ObjectArt } from './ObjectArt'

interface Props {
  selected: CatId | null
  taken: CatId | null // compartment that just dropped something
  awake: boolean
  locked: boolean
  onSelect: (id: CatId) => void
  setRef: (id: CatId, el: HTMLButtonElement | null) => void
}

// The lit window of the machine; each compartment is one option.
export function CategorySelector({ selected, taken, awake, locked, onSelect, setRef }: Props) {
  return (
    <div role="group" aria-label="What do you need today? Choose a compartment" className={`window relative grid flex-1 grid-cols-2 gap-[3px] rounded-lg border-[3px] border-charcoal bg-charcoal md:grid-cols-3 ${awake ? 'window-on' : ''}`}>
      {CATEGORIES.map((c) => {
        const on = selected === c.id
        return (
          <button
            key={c.id}
            ref={(el) => setRef(c.id, el)}
            onClick={() => onSelect(c.id)}
            aria-pressed={on}
            aria-disabled={locked}
            className={`cell group relative flex min-h-[118px] flex-col items-center justify-between px-1.5 pb-1.5 pt-6 ${on ? 'cell-on' : ''}`}
          >
            <span className="absolute left-1.5 top-1.5 rounded bg-charcoal px-1.5 font-display text-[11px] leading-[17px] text-butter">{c.code}</span>
            <span className={`transition-transform duration-300 ${taken === c.id ? 'opacity-0' : 'group-hover:-translate-y-0.5 group-hover:rotate-[-3deg]'}`}>
              <ObjectArt id={c.art} size={58} />
            </span>
            <span className="mt-1 block w-full rounded-[3px] bg-cream/90 px-1 py-[3px] text-center font-serif text-[11.5px] font-medium leading-[1.2] text-charcoal">{c.label}</span>
          </button>
        )
      })}
      <div className="glare pointer-events-none absolute inset-0 rounded-md" aria-hidden />
    </div>
  )
}
