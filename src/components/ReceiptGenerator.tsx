import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { byId, catOf } from '../data/items'
import { receiptSvg, saveImage, svgUrl } from '../lib/image'
import { Modal } from './Modal'

export function ReceiptGenerator({ visit, onClose }: { visit: string[]; onClose: () => void }) {
  const [status, setStatus] = useState('')
  const receipt = useMemo(
    () =>
      receiptSvg(
        visit.map((id) => ({ name: byId(id)!.name, inv: byId(id)!.inv, code: catOf(byId(id)!.cat).code })),
        new Date(),
      ),
    [visit],
  )
  const save = async () => {
    setStatus('Printing…')
    try {
      await saveImage(receipt, 'guest-receipt-emotional-vending-machine.png')
      setStatus('Receipt saved. Keep it somewhere dry.')
    } catch {
      setStatus('The printer jammed. The machine apologises.')
    }
  }
  return (
    <Modal title="Guest receipt" onClose={onClose} className="max-w-[420px]">
      <h2 className="pr-10 font-display text-2xl font-bold text-burgundy">Guest Receipt</h2>
      {visit.length === 0 ? (
        <p className="mt-3 font-serif text-[16px] text-charcoal">Nothing to itemise yet. You have not taken anything from the machine this visit. This is allowed. Come back when you are ready.</p>
      ) : (
        <>
          <img src={svgUrl(receipt.svg)} alt={receipt.alt} width={receipt.w} height={receipt.h} className="receipt mx-auto mt-3 block max-h-[60vh] w-[300px] max-w-full object-contain object-top" />
          <button className="btn !flex w-fit mx-auto mt-4" onClick={save}>
            <Download size={16} aria-hidden /> Save receipt image
          </button>
          <p role="status" className="mt-2 min-h-[1.25rem] text-center font-serif text-sm text-charcoal/80">
            {status}
          </p>
        </>
      )}
      <button className="btn btn-primary !flex w-fit mx-auto mt-3" onClick={onClose} data-autofocus>
        Close
      </button>
    </Modal>
  )
}
