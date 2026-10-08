import { motion } from 'motion/react'
import { ObjectArt } from './ObjectArt'

export interface Pt {
  x: number
  y: number
}

// The little object dropping from its compartment into the tray slot.
export function DispensingAnimation({ art, from, to, onLand }: { art: string; from: Pt; to: Pt; onLand: () => void }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-30"
      style={{ width: 56, height: 56 }}
      initial={{ x: from.x - 28, y: from.y - 28, rotate: 0 }}
      animate={{ y: [from.y - 28, from.y - 34, to.y - 28], rotate: [0, -6, 14], opacity: [1, 1, 1, 0], x: [from.x - 28, from.x - 28, to.x - 28] }}
      transition={{ duration: 1.05, times: [0, 0.18, 1], ease: ['easeOut', 'easeIn'], opacity: { times: [0, 0.2, 0.9, 1], duration: 1.05 } }}
      onAnimationComplete={onLand}
    >
      <ObjectArt id={art} size={56} />
    </motion.div>
  )
}
