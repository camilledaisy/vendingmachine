import { Modal } from './Modal'
import { MAINTENANCE_LOG } from '../data/text'

export function MaintenanceLog({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Maintenance log" onClose={onClose} className="max-w-[520px]">
      <h2 className="pr-10 font-display text-2xl font-bold text-burgundy">MAINTENANCE LOG</h2>
      <p className="font-lcd text-lg text-charcoal/80">Unit: FEELINGS &amp; CO. · Technician: on call, mostly</p>
      <ul className="mt-3 max-h-[60vh] overflow-y-auto border-t-2 border-dashed border-charcoal/40 pr-1">
        {MAINTENANCE_LOG.map((e, i) => (
          <li key={e.date} style={{ ['--d' as string]: `${i * 60}ms` }} className="rise border-b border-charcoal/20 py-2.5 font-serif text-[15px] leading-snug text-charcoal">
            <span className="font-display text-sm font-bold text-burgundy">{e.date}: </span>
            {e.note}
          </li>
        ))}
      </ul>
      <button className="btn btn-primary !flex w-fit mx-auto mt-4" onClick={onClose} data-autofocus>
        Close the panel
      </button>
    </Modal>
  )
}
