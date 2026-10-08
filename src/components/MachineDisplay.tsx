import { useEffect, useState } from 'react'

function useTypewriter(text: string, instant: boolean) {
  const [n, setN] = useState(instant ? text.length : 0)
  useEffect(() => {
    if (instant) return setN(text.length)
    setN(0)
    const id = setInterval(() => setN((k) => (k >= text.length ? (clearInterval(id), k) : k + 1)), 18)
    return () => clearInterval(id)
  }, [text, instant])
  return text.slice(0, n)
}

export function MachineDisplay({ lines, error, asleep, onWake, instant }: { lines: readonly [string, string?]; error: boolean; asleep: boolean; onWake: () => void; instant: boolean }) {
  const l1 = useTypewriter(lines[0], instant)
  const l2 = useTypewriter(lines[1] ?? '', instant)
  const body = (
    <>
      <span className="sr-only">
        {lines[0]} {lines[1]}
      </span>
      <span aria-hidden className={`block text-[25px] leading-[1.05] ${error ? 'text-rose' : 'text-butter'}`}>
        {l1}
        <span className="cursor" />
      </span>
      <span aria-hidden className="mt-1 block text-[20px] leading-[1.05] text-sage">
        {l2}
      </span>
    </>
  )
  const cls = `lcd font-lcd relative block min-h-[90px] w-full rounded-lg border-[3px] border-charcoal px-4 py-3 text-left ${error ? 'lcd-error' : ''} ${asleep ? 'lcd-asleep' : ''}`
  return asleep ? (
    <button onClick={onWake} className={`${cls} cursor-pointer`} aria-label="Wake the machine. Touch to begin.">
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  )
}
