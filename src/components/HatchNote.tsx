import { Modal } from './Modal'
import { HATCH_NOTE } from '../data/text'

export function HatchNote({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="A note from the secret compartment" onClose={onClose} className="max-w-[400px]">
      <div className="rotate-[-1deg] rounded-sm bg-butter/70 p-5 font-hand text-[25px] font-bold leading-[1.15] text-charcoal shadow-inner">
        {HATCH_NOTE.map((l) => (
          <p key={l} className="mb-2 last:mb-0">
            {l}
          </p>
        ))}
      </div>
      <button className="btn btn-primary !flex w-fit mx-auto mt-4" onClick={onClose} data-autofocus>
        Close the drawer
      </button>
    </Modal>
  )
}
