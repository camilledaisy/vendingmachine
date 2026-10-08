import { useState } from 'react'
import { motion } from 'motion/react'
import { Modal } from './Modal'

const KRAFT = '#C9A56B'
const INK = '#403B36'

// F06 hands over a wrapped parcel; the visitor pulls the string to find out what is inside.
export function ParcelUnwrap({ reduced, onOpen }: { reduced: boolean; onOpen: () => void }) {
  const [opening, setOpening] = useState(false)
  const open = () => {
    if (opening) return
    setOpening(true)
    setTimeout(onOpen, reduced ? 150 : 1500)
  }
  const t = (d: number) => ({ duration: reduced ? 0.01 : d, ease: 'easeInOut' as const })
  const half = (x: number, w: number) => (
    <>
      <rect x={x} y="30" width={w} height="80" fill={KRAFT} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d={`M${x + 8} 48 H${x + w - 8} M${x + 8} 92 H${x + w - 8}`} stroke={INK} strokeWidth="1.2" opacity=".25" />
    </>
  )
  return (
    <Modal title="A mystery parcel" onClose={open} bare className="max-w-[340px]">
      <div className="paper rounded-2xl border-[3px] border-charcoal p-5 text-center shadow-[0_12px_0_rgba(64,59,54,.35)]">
        <p className="font-display text-lg font-bold text-burgundy">One parcel. Contents unknown.</p>
        <p className="font-serif text-[14px] text-charcoal/80">Even to me. Mostly.</p>
        <motion.svg viewBox="0 0 120 120" className="mx-auto mt-2 w-[220px]" aria-hidden animate={opening && !reduced ? { rotate: [0, -3, 3, -2, 0] } : {}} transition={{ duration: 0.5 }}>
          <circle cx="60" cy="70" r="24" fill="#F2D98D" opacity={opening ? 0.9 : 0} />
          <text x="60" y="80" textAnchor="middle" fontSize="28" fontWeight="700" fill={INK} fontFamily="Pixelify Sans,monospace" opacity={opening ? 1 : 0}>?</text>
          <motion.g animate={opening ? { x: -34, rotate: -8, opacity: 0 } : {}} transition={{ ...t(0.6), delay: reduced ? 0 : 0.6 }} style={{ transformOrigin: '30px 70px' }}>{half(14, 46)}</motion.g>
          <motion.g animate={opening ? { x: 34, rotate: 8, opacity: 0 } : {}} transition={{ ...t(0.6), delay: reduced ? 0 : 0.6 }} style={{ transformOrigin: '90px 70px' }}>{half(60, 46)}</motion.g>
          <motion.g animate={opening ? { y: -26, opacity: 0, rotate: 10 } : {}} transition={t(0.6)} style={{ transformOrigin: '60px 70px' }}>
            <path d="M60 30 V110 M14 70 H106" stroke="#914F4F" strokeWidth="4" />
            <path d="M60 30 Q40 6 32 18 Q34 32 60 30 Q86 32 88 18 Q80 6 60 30Z" fill="#D4A5A5" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          </motion.g>
        </motion.svg>
        <button className="btn btn-primary mt-2 !flex w-fit mx-auto" onClick={open} disabled={opening} data-autofocus>
          {opening ? 'Unwrapping…' : 'Pull the string'}
        </button>
      </div>
    </Modal>
  )
}
