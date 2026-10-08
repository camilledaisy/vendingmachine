import { useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'

const stack: object[] = []

export function Modal({ title, onClose, children, className = '', bare = false }: { title: string; onClose: () => void; children: ReactNode; className?: string; bare?: boolean }) {
  const panel = useRef<HTMLDivElement>(null)
  const close = useRef(onClose)
  close.current = onClose

  useEffect(() => {
    const me = {}
    stack.push(me)
    const prev = document.activeElement as HTMLElement | null
    const el = panel.current!
    ;(el.querySelector<HTMLElement>('[data-autofocus]') ?? el).focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== me) return
      if (e.key === 'Escape') close.current()
      if (e.key === 'Tab') {
        const f = [...el.querySelectorAll<HTMLElement>('button,a[href],input,[tabindex]:not([tabindex="-1"])')].filter((x) => !(x as HTMLButtonElement).disabled)
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && (document.activeElement === first || document.activeElement === el)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      stack.splice(stack.indexOf(me), 1)
      if (!stack.length) document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-charcoal/70 p-3 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className={`relative my-auto w-full outline-none ${bare ? '' : 'paper rounded-2xl border-[3px] border-charcoal p-5 shadow-[0_10px_0_rgba(64,59,54,.35)]'} ${className}`}
      >
        {!bare && (
          <button onClick={onClose} aria-label="Close" className="btn-icon absolute right-3 top-3">
            <X size={18} aria-hidden />
          </button>
        )}
        {children}
      </motion.div>
    </motion.div>
  )
}
